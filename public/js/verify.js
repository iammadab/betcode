let verificationStore = {
  changeNumberSection: document.querySelector(".verify-section .change-number-section"),
  enterOtpSection: document.querySelector(".verify-section .enter-otp-section"),
  changeNumberLink: document.querySelector(".verify-section .change-number-link")
}

;(function attachEvents(){
  
  addEvent([verificationStore.changeNumberLink], "click", showChangeNumberSection)

})()

function showChangeNumberSection(event){
  verificationStore.changeNumberSection.classList.remove("hide")
  verificationStore.enterOtpSection.classList.add("hide")
}

function showOtpSection(event){
  verificationStore.changeNumberSection.classList.add("hide")
  verificationStore.enterOtpSection.classList.remove("hide")
}
