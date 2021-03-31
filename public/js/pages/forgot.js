const store = {
  sections: document.querySelectorAll(".section"),
  actionButtons: document.querySelectorAll(".action-button"),
  inputs: document.querySelectorAll("input"),
  stage: "identity", // Can be "identity", "otp" or "password"

  identityInput: document.querySelector(".input-identity"),
  numberDisplay: document.querySelector(".number-display"),
  otpTimer: document.querySelector(".otp-timer"),
  resendButton: document.querySelector(".resend-otp")
}

;(function attachEvents(){
  addEvent(store.actionButtons, "click", selectAction)
  addEvent(store.inputs, "focus, change", () => {
    hideAlert(".alert-danger")
  })
  addEvent([store.resendButton], "click", resendOtp)
})()

function selectAction(event){

  event.preventDefault()
  
  const actionMap = {
    "identity": generateOtp
  }

  const action = actionMap[store.stage]
  if(action)
    action()

}


function generateOtp(){

  const identifier = store.identityInput.value

  if(!identifier)
    return showAlert(".alert-danger", "Please complete the form below")

  api("/otp/forgot", { identifier })
    .then(handleOtpCreation)

  function handleOtpCreation(response){

    if(response.status == 200){
      store.numberDisplay.innerText = response.data.phone 
      show(document.querySelector(".forgot-otp"))
      startTimer()
    }

    else if(response.code == "USER_NOT_FOUND")
      return showAlert(".alert-danger", "Account not found")

  }

}

function resendOtp(){

  const identifier = store.identityInput.value

  api("/otp/forgot", { identifier })
    .then(startTimer)

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

