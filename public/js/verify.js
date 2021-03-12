let verificationStore = {
  changeNumberSection: document.querySelector(".verify-section .change-number-section"),
  enterOtpSection: document.querySelector(".verify-section .enter-otp-section"),
  changeNumberLink: document.querySelector(".verify-section .change-number-link"),
  completeRegistrationButton: document.querySelector(".verify-section .complete-registration-button"),
  otpInput: document.querySelector(".verify-section .otp-input"),
  allInputs: Array.from(document.querySelectorAll(".verify-section input"))
}

;(function attachEvents(){
  
  addEvent([verificationStore.changeNumberLink], "click", showChangeNumberSection)
  addEvent(verificationStore.allInputs, "input,focus", () => {
    [".verify-error", ".verify-success"].map(hideAlert)
  })

})()

function showChangeNumberSection(event){
  verificationStore.changeNumberSection.classList.remove("hide")
  verificationStore.enterOtpSection.classList.add("hide")
}

function showOtpSection(event){
  verificationStore.changeNumberSection.classList.add("hide")
  verificationStore.enterOtpSection.classList.remove("hide")
}
