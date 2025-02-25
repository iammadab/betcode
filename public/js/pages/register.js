const store = {
  userDetails: {},
  registerButton: document.querySelector(".register-button"),
  registerFormTag: ".register-form",
  imageInput: document.querySelector("input[type=file]"),
  loginLinks: Array.from(document.querySelectorAll(".login-element"))
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

  if(!store.loginLinks || store.loginLinks.length == 0) return

  store.loginLinks.forEach(link => {
    link.setAttribute("href", "/login?from=" + redirectUrl)
  })

}


const registerText = createButton(".register-text", "Register", "Registering...")

async function registerUser(event){
  
  event.preventDefault()
  registerText()

  const userDetails = store.userDetails = extractForm(store.registerFormTag)
  const missingKeys = hasKeys(
    userDetails,
    ["fullname", "username", "email", "phone", "password"]
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

  // Make sure the username contains no space
  if(!validUsername(userDetails.username)){
    registerText("normal")
    return showAlert(".register-error", `Sorry, spaces are not allowed in usernames`)
  }
  
  register()

}

function register(){

  api("/user", { ...store.userDetails, phoneCode: "+234" })
    .then(handleRegistration)


  function handleRegistration(data){

    if(data.status == 200){
      let toRedirect = "/home", params = new URLSearchParams(window.location.search)
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

function validUsername(username){
  const trimmedUsername = String(username).trim()
  if(trimmedUsername.indexOf(" ") > -1 )
    return false
  return true
}


/*async function sendOtp(){

  api("/otp", { phone: store.userDetails.phone })

  showOtpTimer()

  getCounter(5, 
     (seconds) => {
        verificationStore.otpTimer.innerText = `in ${seconds} seconds`
     },
     () => {
       verificationStore.otpTimer.innerText = `in 30 seconds`
       showResendButton()
     }
  )

}*/

