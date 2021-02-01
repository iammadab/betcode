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
    tipster: codeElement.dataset.tipster
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
  commentBox: document.querySelector(".comment-box")
}

;(function attachEvents(){
  addEvent([store.commentButton], "click", comment)
})()

;(function(){
  const bookmakerSelect = document.querySelector("select")
  bookmakerSelect.onchange = function(event){
    const option = document.querySelector(`option[value="${event.target.value}"]`)   
    store.codeDisplay.value = option.dataset.code
  }

  const copyButton = document.querySelector(".copy-button")
  copyButton.onclick = copy
})()


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
