const store = {
  copyButton: document.querySelector(".copy-button"),
  convertId: conversionRequestId,
  conversionStatusElement: document.querySelector(".conversion-status"),
  conversionCodeElement: document.querySelector(".conversion-code"),
  resolveConversionButton: document.querySelector(".resolve-conversion"),
  inputs: Array.from(document.querySelectorAll("input, select"))
}

;(function attachEvents(){
  addEvent(store.inputs, "change, input, focus", () => {
    hideAlert(".alert-error")
  })
  addEvent([store.copyButton], "click", copy)
  addEvent([store.resolveConversionButton], "click", resolveConversion)
  addEvent([store.conversionStatusElement], "change", () => {
    const value = store.conversionStatusElement.value
    if(value == "failed")
      store.conversionCodeElement.classList.add("hide")
    else
      store.conversionCodeElement.classList.remove("hide")
  })
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

function resolveConversion(event){
  event.preventDefault()
  const data = {
    status: store.conversionStatusElement.value,
    code: store.conversionCodeElement.value,
    conversionId: store.convertId
  }

  if(!data.status)
    return showAlert(".alert-error", "Please complete the form")

  if(data.status != "failed" && !data.code)
    return showAlert(".alert-error", "Please complete the form")

  if(data.status == "failed")
    delete data.code

  api("/conversion/resolve", data)
    .then(console.log)
}
