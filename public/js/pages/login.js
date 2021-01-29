const store = {
  loginButton: document.querySelector(".login-button"),
  loginFormTag: ".login-form"
}

;(function attachEvents(){
  addEvent([store.loginButton], "click", loginUser)
  addEvent(
    getFormInputs(store.loginFormTag),
    "input,focus",
    () => hideAlert(".login-error")
  )
})()

const loginText = createButton(".login-text", "Login Account", "Logging in..")

function loginUser(event){

  event.preventDefault()
  loginText()
  
  const loginDetails = extractForm(store.loginFormTag)
  const missingDetails = hasKeys(
    loginDetails,
    [ "identifier", "password" ]
  )

  if(missingDetails.length > 0){
    loginText("normal")
    return showAlert(".login-error", `Sorry, you didn't enter your ${missingDetails[0]}`)
  }

  api("/user/login", loginDetails)
    .then(handleLogin)
    .catch(handleError)

  function handleLogin(data){

    if(data.status == 200)
      return redirect("/")

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
