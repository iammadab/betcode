const store = {
  copyButton: document.querySelector(".copy-button"),
  covertId: conversionRequestId
}

;(function attachEvents(){
  addEvent([store.copyButton], "click", copy)
})()

function capitalizeFirst(word){
  word = String(word)
  const letters = word.split("")
  letters[0] = String(letters[0]).toUpperCase()
  return letters.join("")
}

function showAlertP(id, value, type){
	const error = document.querySelector(id)
	if(value)
		error.innerText = value
	error.style.display = type || "block"
}

function hideAlertP(id, value){
	const error = document.querySelector(id)
	error.style.display = "none"
}


function copy(event){

  event.preventDefault()

  const codeElement = document.querySelector(".code-input")
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

  //Change text to copied
  event.target.innerHTML = `Copied`
  setTimeout(() => {
    event.target.innerHTML = `Copy`
  }, 3000)

}
