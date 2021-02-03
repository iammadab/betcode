const store = {
  loginButton: document.querySelector(".login-button"),
  loginFormTag: ".login-form",
  registerLink: document.querySelector(".register-link")
}

;(function attachEvents(){
  appendRegister()
  addEvent([store.loginButton], "click", loginUser)
  addEvent(
    getFormInputs(store.loginFormTag),
    "input,focus",
    () => hideAlert(".login-error")
  )
})()

function appendRegister(){
 
  // Check if there is a redirect link in the login url
  // If there is, append the same link to the register button
  const params = new URLSearchParams(window.location.search)
  const redirectUrl = params.get("from")

  if(!redirectUrl) return
  
  if(!store.registerLink) return

  store.registerLink.setAttribute("href", "/register?from=" + redirectUrl)

}

const loginText = createButton(".login-text", "Login", "Logging in..")

function loginUser(event){

  event.preventDefault()
  loginText()
  
  const loginDetails = extractForm(store.loginFormTag)
  const missingDetails = hasKeys(
    loginDetails,
    [ "username", "password" ]
  )

  if(missingDetails.length > 0){
    loginText("normal")
    return showAlert(".login-error", `Sorry, you didn't enter your ${missingDetails[0]}`)
  }

  api("/user/login", loginDetails)
    .then(handleLogin)
    .catch(handleError)

  function handleLogin(data){

    if(data.status == 200){
      let toRedirect = "/", params = new URLSearchParams(window.location.search)
      toRedirect = params.get("from") ? params.get("from") : toRedirect
      return redirect(toRedirect)
    }

    loginText("normal")

    if(data.code == "USER_NOT_FOUND")
      return showAlert(".login-error", `Invalid username and password combination`)

    if(data.code == "INVALID_PASSWORD")
      return showAlert(".login-error", "Invalid username and password combination")

  }
  
  function handleError(){
    loginText("normal")
    return showAlert(".login-error", "Something went wrong, please try again later or contact support")
  } 
}
