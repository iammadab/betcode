const app = new Vue({
	
	el: "#app",

	methods: {

		copy(event){
		
			const codeElement = event.target.previousElementSibling
			const code = codeElement.innerText
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
			event.target.innerHTML = `<i class="far fa-clone"></i> Copied`
			setTimeout(() => {
				event.target.innerHTML = `<i class="far fa-clone"></i> Copy`
			}, 3000)

		}

	}

})

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
