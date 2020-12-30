const app = new Vue({
	
	el: "#app",

	methods: {

		copy(event){
		
			const code = event.target.previousElementSibling.innerText
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
			event.target.innerHTML = `<i class="far fa-clone"></i> Copied`
			setTimeout(() => {
				event.target.innerHTML = `<i class="far fa-clone"></i> Copy`
			}, 3000)

		}

	}

})
