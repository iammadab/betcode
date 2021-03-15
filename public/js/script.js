/*
  Contents
  --------
  attachLogout
  showView
  showError
  showAlert
  hideError
  hideAlert
  hasKeys
  extractForm
  addEvent
  api
  redirect
  reload
  getCounter
  setValue
  getToken
  deleteCookie
  createButton
  addComma
  addCommaDecimal
  getFormInputs
  clearNode
*/

;(function attachLogout(){
  let logoutButtons = Array.from(document.querySelectorAll(".logout"))
  if(logoutButtons.length == 0) return
  addEvent(logoutButtons, "click", logout)
  
  function logout(event){
    console.log("I was clicked")
    event.preventDefault()
    let tokenName = window.location.href.includes("admin") ? "atoken" : "token"
    let cookieData = {
      "atoken": { path: "/admin", redirect: "/admin/login" },
      "token": { path: "/", redirect: "/login" }
    }
    // console.log(tokenName)
    deleteCookie(tokenName, cookieData[tokenName])
    reload()
    //redirect(cookieData[tokenName].redirect)
  }
})()

function showView(viewName){
  let viewToShow = document.querySelector(`#${viewName}`)
  if(!viewToShow) return
  let visibleViews = Array.from(document.querySelectorAll(".view.show"))
  visibleViews.forEach(view => view.classList.remove("show"))
  viewToShow.classList.add("show")
}

function showError(errorName, errorMessage){
  errorName = errorName.split("").filter(a => a != ".").join("")
  let errorBox = document.querySelector(`.${errorName}`)

  if(errorBox){
    errorBox.style.display = "flex" 
    errorBox.innerText = errorMessage
  }

}

let showAlert = showError

function hideError(errorName){
  errorName = errorName.split("").filter(a => a != ".").join("")
  let errorBox = document.querySelector(`.${errorName}`)
  if(errorBox)
    errorBox.style.display = "none"
}

let hideAlert = hideError

function hasKeys(obj, expectedKey){
  let objKeys = Object.keys(obj)
  return expectedKey.filter(function(key){
    return objKeys.indexOf(key) > -1 ? false : true
  })
}

function extractForm(formId){
  let selectString = `${formId} input, ${formId} textarea, ${formId} select`
  let inputs = Array.from(document.querySelectorAll(selectString)), formData = {}
  inputs.forEach(function(input){
    if(input.name && input.value)
      formData[input.name] = input.value
  })
  return formData
}

function addEvent(elements, eventString, cb){
  let events = eventString.split(",").map(evt => evt.trim())
  elements.forEach(element => {
    events.forEach(event => {
      if(!element) console.log("Can't find", element)
      else element.addEventListener(event, event => {
        cb(event, element)
      })
    })
  })
}

function api(resourcePath, data){
  let url = `/api/${resourcePath}`
  if(!data) return fetch(url).then(response => response.json())
  return fetch(url, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(response => response.json())
}

function redirect(url){
  window.location.href = url
}

function reload(){
  if(location)
    location.reload()
  else
    window.location.href = window.location.href
}

function getCounter(seconds, cb, endcb, displayCb){

  let counter = setInterval(callCb, 1000)
  displayCb = displayCb ? displayCb : toTimeString

  function callCb(){

    seconds -= 1
    const secondsValue = seconds % 60, minutesValue = (seconds - secondsValue) / 60
    cb(displayCb(secondsValue, minutesValue))

    if(seconds <= 0){
      clearInterval(counter)
      endcb()
    }

  }

  function toTimeString(seconds, minutes){
    let secondsValue = seconds % 60, minutesValue = (seconds - secondsValue) / 60
    return `${padZero(secondsValue)}`

    function padZero(val){
      return (("" + val).length == 1) ? "0" + val : val
    }
  }

}

function setValue(elements, value, condition){
  let prop = condition ? condition : "innerText"
  elements.forEach(element => {
    let domElement = document.querySelector(element)
    if(domElement)
      domElement[prop] = value
  })
}

function getToken(search){
  let param = search ? search : "token", token
  let cookieParts = document.cookie.split(";")
  cookieParts.forEach(cookie => {
    if(cookie.trim().indexOf(param) == 0)
      token = cookie.split("=")[1]
  })
  return token
}

function deleteCookie(cookieName, cookieData){
  const pathString = cookieData ? `path=${cookieData.path};` : ""
  const cookieString = `${cookieName}=;${pathString}expires=Thu, 01 Jan 1970 00:00:00 UTC;`
  document.cookie = cookieString
}

function createButton(element, normal, active){
  return function(state){
    let elementObj = document.querySelector(element)
    elementObj.innerText = state == "normal" ? normal : active
  }
}

function addComma(number){
  return String(number).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function addCommaDecimal(number){
  let [main, fraction] = String(number).split(".")
  main = addComma(main)
  return `${main}${fraction ? "." : "" }${fraction ? fraction : ""}`
}

function getFormInputs(formTag = ""){
  return Array.from(
    document.querySelectorAll(`${formTag} input, ${formTag} textarea`)
  )
}

function clearNode(elem){
  if(!elem) return
  while(elem.firstChild){
    elem.firstChild.remove()
  }
}
