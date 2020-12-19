Vue.config.devtools = true

const app = new Vue({
	
	el: "#app",

	data: () => {

		return {

			tip: {  tipster: {}, bookmakers: {} }

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
