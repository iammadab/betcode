/*
  Contents
  --------
  toggleNav
  attachLogout
  setDefaultOption
  preprocess
  scrollTop
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
*/

;(function toggleNav(){
    let topBarToggler = document.querySelector(".kt-header-mobile__toolbar-topbar-toggler")
    let landingToggle = document.querySelector(".landing-toggle")
    let userBar = document.querySelector(".user-dropdown")
    let landingDropdown = document.querySelector(".landing-dropdown")

    if(topBarToggler)
        topBarToggler.onclick = function(event){
            userBar.classList.toggle("show")
            userBar.classList.toggle("show-menu")
        }

    if(landingToggle)
        landingToggle.onclick = function(event){
            landingDropdown.classList.toggle("show")
            landingDropdown.classList.toggle("show-menu-landing")
        }
})()

;(function attachLogout(){
  let logoutButtons = Array.from(document.querySelectorAll(".logout"))
  if(logoutButtons.length == 0) return
  addEvent(logoutButtons, "click", logout)
  
  function logout(event){
    event.preventDefault()
    let tokenName = window.location.href.includes("admin") ? "atoken" : "token"
    let cookieData = {
      "atoken": { path: "/admin", redirect: "/admin/login" },
      "token": { path: "/", redirect: "/login" }
    }
    // console.log(tokenName)
    deleteCookie(tokenName)
    redirect(cookieData[tokenName].redirect)
  }
})()

;(function setDefaultOption(){
  let elementsWithDefaults = Array.from(document.querySelectorAll("[data-defaultValue]"))
  elementsWithDefaults.forEach(element => {
    element.value = element.dataset["defaultvalue"]
  })
})()

;(function preprocess(){
  let toProcess = Array.from(document.querySelectorAll("[data-format]"))
  toProcess.forEach(element => {
    if(element.dataset.format == "comma")
      element.innerText = addCommaDecimal(element.innerText)
  })
})()

;(function scrollTop(){
  const elements = {
    chatIcon: document.querySelector(".kt-scrolltop")
  }

  ;(function attachEvents(){
    window.addEventListener("scroll", () => {
      let scrollTop = getScrollTop()
      if(scrollTop > 150)
        document.body.classList.add("kt-scrolltop--on")
      else
        document.body.classList.remove("kt-scrolltop--on")
    })
  })()

  function getScrollTop(){
    var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
    return scrollTop
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
  let errorBox = document.querySelector(`.${errorName}`),
    errorText = document.querySelector(`.${errorName} .alert-text`)

  if(errorBox)
    errorBox.style.display = "flex" 

  if(errorText)
    errorText.innerText = errorMessage
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
      else element.addEventListener(event, cb)
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
  redirect(window.location.href)
}

function getCounter(seconds, cb, endcb){
  let counter = setInterval(callCb, 1000)
  function callCb(){
    seconds -= 1
    cb(toTimeString(seconds))
    if(seconds <= 0){
      clearInterval(counter)
      endcb()
    }
  }

  function toTimeString(seconds){
    let secondsValue = seconds % 60, minutesValue = (seconds - secondsValue) / 60
    return `${padZero(minutesValue)} : ${padZero(secondsValue)}`

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

function deleteCookie(cookieName){
  document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;"
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
