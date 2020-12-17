Vue.config.devtools = true

const app = new Vue({
	
	el: "#app",

	data: () => {

		return {

			tip: {  tipster: {} }

		}

	},

	created(){
	
		const tipId = new URLSearchParams(window.location.search).get("id")

		console.log(tipId)

		fetch(`/api/post/${tipId}`)
			.then(res => res.json())
			.then(data => {
				this.tip = data.data
			})

	}

})
