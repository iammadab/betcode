let verificationStore = {
  changeNumberSection: document.querySelector(".verify-section .change-number-section"),
  enterOtpSection: document.querySelector(".verify-section .enter-otp-section"),
  changeNumberLink: document.querySelector(".verify-section .change-number-link"),
  completeRegistrationButton: document.querySelector(".verify-section .complete-registration-button"),
  otpInput: document.querySelector(".verify-section .otp-input"),
  allInputs: Array.from(document.querySelectorAll(".verify-section input")),
  resendOtpButton: document.querySelector(".resend-otp"),
  otpTimer: document.querySelector(".otp-timer"),
  changeNumberInput: document.querySelector(".change-number-input"),
  changeNumberButton: document.querySelector(".change-number-button")
}

;(function attachEvents(){
  
  // On page load, an otp is sent immediately so the timer should be started
  startTimer()

  addEvent([verificationStore.changeNumberLink], "click", showChangeNumberSection)
  addEvent(verificationStore.allInputs, "input,focus", () => {
    [".verify-error", ".verify-success", ".change-number-error", ".change-number-success"].map(hideAlert)
  })
  addEvent([verificationStore.completeRegistrationButton], "click", verifyOtp)
  addEvent([verificationStore.resendOtpButton], "click", resendOtp)
  addEvent([verificationStore.changeNumberButton], "click", changeNumber)

})()

const verifyButton = createButton(".verify-text", "Verify", "Verifying...")

function verifyOtp(event){

  event.preventDefault()

  verifyButton()

  const code = verificationStore.otpInput.value

  api("/otp/verify", { token: getToken(), code })
    .then(handleResponse)

  function handleResponse(response){

    verifyButton("normal")

    if(response.status == 200){
      return redirect("/welcome")
    }
    else{
      console.log(response)
      showAlert(".verify-error", "Invalid Otp")
    }

  }

}

function resendOtp(){

  api("/otp/", { token: getToken() })
    .then(startTimer)

}

const changeButton = createButton(".change-number-text", "Change Number", "Updating...")

function changeNumber(){

  changeButton()

  const number = verificationStore.changeNumberInput.value

  api("/user/update", { token: getToken(), phone: number })
    .then(handleResponse)

  function handleResponse(response){

    changeButton("normal")

    if(response.status == 200)
      return redirect("/verify")

    else if(response.code == "USER_EXISTS")
      return showAlert(".change-number-error", "An account with this phone number already exists")

  }
}

function showChangeNumberSection(event){
  verificationStore.changeNumberSection.classList.remove("hide")
  verificationStore.enterOtpSection.classList.add("hide")
}

function showOtpSection(event){
  verificationStore.changeNumberSection.classList.add("hide")
  verificationStore.enterOtpSection.classList.remove("hide")
}

function showResendButton(){
  showAndHide(verificationStore.resendOtpButton, verificationStore.otpTimer)
}

function showOtpTimer(){
  showAndHide(verificationStore.otpTimer, verificationStore.resendOtpButton)
}

function showAndHide(toShow, toHide){
  toShow.classList.remove("hide")
  toHide.classList.add("hide")
}

function startTimer(){
  showOtpTimer()

  getCounter(30, 
    (seconds) => {
      verificationStore.otpTimer.innerText = `in ${seconds} seconds`
    },
    () => {
      verificationStore.otpTimer.innerText = `in 30 seconds`
      showResendButton()
    }
  )
}
