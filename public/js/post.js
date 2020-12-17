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
			formdata: {},
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
			
			const all = [ "tipster", "description", "odds", "bookmakers", "image" ]
			all.forEach(val => {
				this[val] = ""
			})

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

			if(!complete)
				return console.log("Complete the form")

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

		}

	}

})
