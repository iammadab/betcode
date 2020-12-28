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

			//Change text to copied
			event.target.innerHTML = `<i class="far fa-clone"></i> Copied`
			setTimeout(() => {
				event.target.innerHTML = `<i class="far fa-clone"></i> Copy`
			}, 3000)

		}

	},

	created(){
	
		const tipId = new URLSearchParams(window.location.search).get("id")

		fetch(`/api/post/${tipId}`)
			.then(res => res.json())
			.then(data => {
				this.tip = data.data
				addMeta("image", this.tip.image)
				addMeta("og:image", this.tip.image)
			})

		const id = String(tipId)
		const title = `Tip #${id.substr(id.length - 6)}`

		document.title = title
		addMeta("title", title, "name")
		addMeta("description", "Latest mehn", "name")
		addMeta("og:title", title)
		addMeta("og:description", "Latest mehn")
		addMeta("og:url", "bookmakr.com")

	}

})
