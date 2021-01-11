;(function(){
  const currentUrl = window.location.href.split("/")
  if(currentUrl.includes("tipster")){

    const tipsterName = currentUrl.pop()
    const currentActive = document.querySelector(".active")
    currentActive.classList.remove("active")

    const newActive = document.querySelector(`a[data-tipster=${tipsterName}]`)
    if(!newActive) return

    newActive.classList.add("active")
    
    // Track filtering
    mixpanel.track("filter", {
      tipster: tipsterName
    })

  }
})()
