const store = {
  phone: "",
  code: "",

  sections: document.querySelectorAll(".section"),
  actionButtons: document.querySelectorAll(".action-button"),
  inputs: document.querySelectorAll("input"),
  stage: "identity", // Can be "identity", "otp" or "password"

  identityInput: document.querySelector(".input-identity"),
  otpInput: document.querySelector(".otp-input"),

  numberDisplay: document.querySelector(".number-display"),
  otpTimer: document.querySelector(".otp-timer"),
  resendButton: document.querySelector(".resend-otp")
}

;(function attachEvents(){
  addEvent(store.actionButtons, "click", selectAction)
  addEvent(store.inputs, "focus, change, input", () => {
    hideAlert(".alert-danger")
  })
  addEvent([store.resendButton], "click", resendOtp)
})()

function selectAction(event){

  event.preventDefault()
  
  const actionMap = {
    "identity": generateOtp,
    "otp": verifyOtp,
    "password": changePassword
  }

  const action = actionMap[store.stage]
  if(action)
    action()

}


function generateOtp(){

  const identifier = store.phone = store.identityInput.value

  if(!identifier)
    return showAlert(".alert-danger", "Please complete the form below")

  api("/otp/forgot", { identifier })
    .then(handleOtpCreation)

  function handleOtpCreation(response){

    if(response.status == 200){
      store.numberDisplay.innerText = response.data.phone 
      show(document.querySelector(".forgot-otp"))
      store.stage = "otp"
      startTimer()
    }

    else if(response.code == "USER_NOT_FOUND")
      return showAlert(".alert-danger", "Account not found")

  }

}

function resendOtp(){

  api("/otp/forgot", { identifier: store.phone })
    .then(startTimer)

}


function verifyOtp(){

  const otp = store.code = store.otpInput.value 

  if(!otp)
    return showAlert(".alert-danger", "Please complete the form below")

  api("/otp/forgot/verify", { code: otp, identifier: store.phone })
    .then(handleVerifyOtp)

  function handleVerifyOtp(response){
    if(response.status == 200){
      show(document.querySelector(".forgot-password"))
      store.stage = "password"
    }

    else
      return showAlert(".alert-danger", "Invalid OTP")
  }

}

function changePassword(){
    
  const passwordInput = document.querySelector(".password1")
  const confirmPasswordInput = document.querySelector(".password2")

  const password = passwordInput.value
  const confirmPassword = confirmPasswordInput.value

  if(!password || !confirmPassword)
    return showAlert(".alert-danger", "Please complete the form below")

  if(password != confirmPassword)
    return showAlert(".alert-danger", "Passwords do not match")

  api("/user/password", { password, code: store.code, identifier: store.phone })
    .then(handleChangePassword)

  function handleChangePassword(response){
    if(response.status == 200){
      showAlert(".alert-success", "Password changed successfully")
      passwordInput.value = ""
      confirmPasswordInput.value = ""
      redirect("/home")
    }
  }
      
}

function hideAll(){
 store.sections.forEach(section => {
   section.classList.add("hide")
 })
}

function show(elem){
  hideAll()
  elem.classList.remove("hide")
}

function startTimer(){
  showOtpTimer()

  getCounter(30,
    (seconds) => {
      store.otpTimer.innerText = `in ${seconds} seconds`
    },
    () => {
      store.otpTimer.innerText = `in 30 seconds`
      showResendButton()
    }
  )
}

function showOtpTimer(){
  store.otpTimer.classList.remove("hide")
  store.resendButton.classList.add("hide")
}

function showResendButton(){
  store.otpTimer.classList.add("hide")
  store.resendButton.classList.remove("hide")
}

