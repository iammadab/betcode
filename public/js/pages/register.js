const store = {
  registerButton: document.querySelector(".register-button"),
  registerFormTag: ".register-form",
  imageInput: document.querySelector("input[type=file]"),
  loginLink: document.querySelector(".login-link")
}

;(function attachEvents(){
  appendLogin()
  addEvent([store.registerButton], "click", registerUser)
  addEvent(
    getFormInputs(store.registerFormTag),
    "input,focus",
    () => hideAlert(".register-error")
  )
})()

function appendLogin(){
  
  const params = new URLSearchParams(window.location.search)
  const redirectUrl = params.get("from")

  if(!redirectUrl) return

  if(!store.loginLink) return

  store.loginLink.setAttribute("href", "/login?from=" + redirectUrl)

}


const registerText = createButton(".register-text", "Register", "Registering...")

async function registerUser(event){
  
  event.preventDefault()
  registerText()

  const userDetails = extractForm(store.registerFormTag)
  const missingKeys = hasKeys(
    userDetails,
    ["fullname", "username", "email", "phone", "password", "bio"]
  )

  if(missingKeys.length > 0){
    registerText("normal")
    return showAlert(".register-error", `Sorry, you didn't enter your ${missingKeys[0]}`)
  }
  
  // Make sure the user put in a valid email
  if(!validEmail(userDetails.email)){
    registerText("normal")
    return showAlert(".register-error", `Sorry, you entered an invalid email address`)
  }

  // Upload the image if it exists
  let profileLink = ""

  const file = store.imageInput.files

  if(file[0]){
    const formData = new FormData()
    formData.append("file", file[0])
  
    const uploadData = 
      await fetch("/api/upload", { method: "POST", body: formData })
              .then(res => res.json())

    console.log(uploadData)
    if(uploadData.status == 200)
      profileLink = uploadData.link
  }


  api("/user", { ...userDetails, phoneCode: "+234", picture: profileLink })
    .then(handleRegistration)


  function handleRegistration(data){

    if(data.status == 200){
      let toRedirect = "/", params = new URLSearchParams(window.location.search)
      toRedirect = params.get("from") ? params.get("from") : toRedirect
      return redirect(toRedirect)
    }

    registerText("normal")

    if(data.code == "USER_EXISTS" && data.message)
      return showAlert(".register-error", data.message)

    // If we get to this point, something is definitely wrong
    // Ideally we should be pinged when this happens
    else
      return showAlert(".register-error", "Something went wrong, try again later or contact support")

  }
      
}

function validEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}
