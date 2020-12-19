Vue.config.devtools = true

const app = new Vue({
	
	el: "#app",

	data: () => {

		return {
			
			formstate: "neutral", // neutral, error, success
			tipsters: [],			
			tipster: "",
			description: "",
			image: "",
			odds: "",
			errormessage: "",
			bookmakers: {
				bet9ja: "",
				betking: "",
				sportybet: "",
				"onexbet": "",
				"twentytwobet": "",
				nairabet: ""
			}

		}

	},

	watch: {
	
		tipster(){
			this.reset()
		},

		description(){
			this.reset()
		},

		image(){
			this.reset()
		},

		odds(){
			this.reset()
		}
		
	},

	created(){

		fetch("/api/tipster")
			.then(res => res.json())
			.then(data => {
				this.tipsters = data.data
			})

	},

	computed: {

		tipsterList(){

			const list =  this.tipsters.map(tipster => ({
				id: tipster._id,
				name: tipster.name,
			}))

			return list

		}

	},

	methods: {

		reset(){
		
			if(this.formstate == "neutral") return 
			if(this.formstate == "error") return this.formstate = "neutral"

			const all = [ "tipster", "description", "odds", "bookmakers", "image" ]
			all.forEach(val => {
				this[val] = ""
			})
			this.formstate = "neutral"

		},

		handleimage(event){
			const files = event.target.files
			const formData = new FormData()
			formData.append("file", files[0])

			fetch("/api/upload", {
				method: "POST",
				body: formData
			})
			.then(res => res.json())
			.then(data => {
				this.image = data.preview  
			})
		},

		post(event){
			
			event.preventDefault()

			// Do authentication
			const all = [ "tipster", "description", "odds", "bookmakers", "image" ]
			let complete = true
			for(let i = 0; i < all.length; i++){
				if(!this[all[i]]){
					complete = false
					break
				}
			}

			if(!complete){
				this.errormessage = "Please complete the form"
				this.formstate = "error"
				return
			}

			fetch("/api/post", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					tipster: this.tipster,
					description: this.description,
					odds: this.odds,
					image: this.image,
					bookmakers: this.bookmakers
				})
			})
			.then(res => res.json())
			.then(() => {
				this.formstate = "success"
			})
			.catch(err => {
				this.errormessage = "Tip posted unsucessfully, try again later"
				this.formstate = "error"
			})

		}

	}

})
