function copy(event){
  const textButton = createButton(".copy-text", "Copy", "Copied")
  const codeElement = document.querySelector(".code-display")
  const code = codeElement.value
  const copyInput = document.querySelector("#copyinput")

  copyInput.value = code
  copyInput.select()
  copyInput.setSelectionRange(0, 99999)

  document.execCommand("copy")

  //Remove selection
  if (window.getSelection) {
    if (window.getSelection().empty) {  // Chrome
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {  // Firefox
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {  // IE?
    document.selection.empty();
  }

  // Track the events
  mixpanel.track("Copy", { 
    code: code,
    url: window.location.href, 
    bookmakr: codeElement.dataset.bookmaker,
    tipster: codeElement.dataset.tipster,
    type: store.bookmakerDetails ? store.bookmakerDetails.type : "unknown"
  })

  //Change text to copied
  textButton()
  setTimeout(() => {
    textButton("normal")
  }, 3000)

}

;(function(){
  const distributions = { t: "twitter" }

  const urlParams = new URLSearchParams(window.location.search)
  const distribution = urlParams.get("d")

  if(distribution && distributions[distribution])
    mixpanel.track("Distribution", {
      platform: distributions[distribution],
      url: window.location.href
    })
})()

let store = {
  codeDisplay: document.querySelector(".code-display"),
  commentButton: document.querySelector(".comment-button"),
  commentBox: document.querySelector(".comment-box"),
  alertBox: document.querySelector(".alert"),
  copySection: document.querySelector(".bookmaker-copier"),
  copyButton: document.querySelector(".copy-button"),
  proceedButton: document.querySelector(".proceed-button"),
  bookmaker: "",
  bookmakerDetails: undefined,
  originalBookmaker: originalBookmaker,
  originalBookmakerValue: originalBookmakerValue,
  tipId: tipId
}

;(function attachEvents(){
  appendRedirects()
  addEvent([store.commentButton], "click", comment)
  addEvent([store.copyButton], "click", copy)
  addEvent([store.proceedButton], "click", makeConversionRequest)
})()

;(function(){

  const bookmakerSelect = document.querySelector(".bookmaker-select")

  const functionMap = {
    "original": showOriginal,
    "paid": showPaid,
    "requested": showRequested
  }

  function loadBookmaker(event){
    const bookmaker = store.bookmaker = bookmakerSelect.value
    const codeDetails = store.bookmakerDetails = bookmakerData[bookmaker]
  
    const fn = functionMap[codeDetails.type]
    if(!fn)
      return

    fn(codeDetails)
  }

  bookmakerSelect.onchange = loadBookmaker

  loadBookmaker()

})()

function showOriginal(codeDetails){

  hideAll()

  if(getToken()){
    store.codeDisplay.value = codeDetails.code
    showSection("copy")
  }

  else
    showAlertPro("info", generateMessage("login"))

}

function showPaid(){

  hideAll()

  // If the user is logged in
  if(getToken()){
    showAlertPro("info", generateMessage("about-to-pay"))
    showSection("proceed")
  }

  else
    showAlertPro("info", generateMessage("login"))


}

function showRequested(codeDetails){
  
  console.log(codeDetails)
  hideAll()
  
  if(codeDetails.data.status == "pending"){
    const message = `Converting to ${capitalize(codeDetails.display)} <span class='conversion-timer'></span>`
    showAlertPro("success", message)
    
    const secondsLeft = secondsBetween(Date.now(), codeDetails.data.endTime)
    console.log("Seconds left", secondsLeft)

    const timer = document.querySelector(".conversion-timer")
    console.log(timer)

    if(secondsLeft <= 0)
      return timer.innerText = "in 0 mins : 0 sec"

    getCounter(secondsLeft, 
      (seconds) => {
        timer.innerText = seconds 
      },
      () => {
        console.log("The timer is done")
      },
      (seconds, minutes) => {
        return ` in ${minutes} min : ${seconds} sec`
      }
    )

  }

  else if(codeDetails.data.status == "success"){
    showOriginal({ code: codeDetails.data.code })
  }

  else if(codeDetails.data.status == "partial"){
    showOriginal({ code: codeDetails.data.code })
    showAlertPro("info", generateMessage("partial-code"))
  }

  else if(codeDetails.data.status == "failed"){
    hideAll()
    showAlertPro("danger", `Failed, No option is available on ${store.bookmaker}`)
  }

}


function comment(event){
  event.preventDefault() 

  const postText = createButton(".post-text", "Post", "Posting...")
  postText()

  const token = getToken()
  const comment = store.commentBox.value
  const postId = store.commentButton.dataset.post

  api("/comment/", {
    token,
    comment,
    post: postId
  }).then(handleSuccess).catch(handleError)

  function handleSuccess(data){
    if(data.status == 200)
      return reload()
    postText("normal")
  }

  function handleError(err){
    postText("normal")
    console.log(err)
  }
 
}

function appendRedirects(){

  const loginRedirect = document.querySelector(".login-redirect")
  const signupRedirect = document.querySelector(".signup-redirect")

  const currentUrl = window.location.href.split("/")
  currentUrl.shift()
  currentUrl.shift()
  currentUrl.shift()

  const relativeUrl = "/" + currentUrl.join("/")
  const redirectUrl = relativeUrl.split("#")[0]

 if(loginRedirect)
  loginRedirect.setAttribute("href", `/login?from=${redirectUrl}`)

 if(signupRedirect)
  signupRedirect.setAttribute("href", `/register?from=${redirectUrl}`)

}

function showAlertPro(type, message){
  const types = {
    "success": "alert-success",
    "danger": "alert-danger",
    "info": "alert-info"
  }
  
  const classIdentifier = types[type]
  if(!classIdentifier)
    return

  store.alertBox.className = `alert ${classIdentifier}`
  store.alertBox.innerHTML = message
}

function hideAll(){
  store.alertBox.classList.add("hide")
  store.copySection.classList.add("hide")
  store.proceedButton.classList.add("hide")
}

function showSection(type){
  const typeElementMap = {
    copy: store.copySection,
    proceed: store.proceedButton
  }

  const element = typeElementMap[type]
  if(!element)
    return

  element.classList.remove("hide")
}

function generateMessage(type){

  const url = window.location.pathname + window.location.search
  console.log(url)

  const messageMap = {
    "about-to-pay": "10 naira will be deducted from your wallet",
    "insufficient-funds": "Sorry, your balance is insufficient. Top up <a href='/topup'>here</a>",
    "partial-code": `Partial! Some options are unavailable on ${store.bookmaker}`,
    "login":  "To get booking code, <a href='/login'>Login</a> or <a href='/register'>Sign up</a>"
  }

  if(messageMap[type])
    return messageMap[type]

  return ""

}

function makeConversionRequest(){
  const source = store.originalBookmakerValue
  const code = bookmakerData[source].code
  const destination = store.bookmaker

  api("/conversion/", { source, code, destination, tipId: store.tipId, token: getToken() })
    .then(handleResponse)

  function handleResponse(response){
    if(response.status == 200)
      return reload()
   
    if(response.code == "INSUFFICIENT_FUNDS")
      return showAlertPro("danger", generateMessage("insufficient-funds"))
  }

}

function secondsBetween(b, a){
  const dateA = new Date(a), dateB = new Date(b)
  const diff = dateA.getTime() - dateB.getTime()
  return Math.floor(diff / 1000)
}
