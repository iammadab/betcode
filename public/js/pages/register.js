const store = {
  registerButton: document.querySelector(".register-button"),
  registerFormTag: ".register-form"
}

;(function attachEvents(){
  addEvent([store.registerButton], "click", registerUser)
})()


const registerText = createButton(".register-text", "Register Account", "Registering...")

function registerUser(event){
  
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

  api("/user", { ...userDetails, phoneCode: "+234" })
    .then(handleRegistration)


  function handleRegistration(data){

    if(data.code == "USER_EXISTS"){
     if(data.message)
      return showAlert(".register-error", data.message)
     return
    }


  }
      

}
