Vue.config.devtools = true

const app = new Vue({
	
	el: "#app",

	data: () => {

		return {

			tip: {  tipster: {}, bookmakers: {} }

		}

	},

	computed: {
	
		shortid(){
			const id = String(this.tip._id)
			return id.substr(id.length - 6)
		}

	},

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

		}

	},

	created(){
	
		const tipId = new URLSearchParams(window.location.search).get("id")

		fetch(`/api/post/${tipId}`)
			.then(res => res.json())
			.then(data => {
				this.tip = data.data
			})

	}

})
