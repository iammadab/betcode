Vue.config.devtools = true

const app = new Vue({
	
	el: "#app",

	data: () => {

		return {
			
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
			this.tipster = ""
			this.description = ""
			this.odds = ""
			Object.keys(this.bookmakers).forEach(key => {
				this.bookmakers[key] = ""
			})
		}

	}

})

const store = {
	submitButton: document.querySelector("#submit"),
	fileInput: document.querySelector("input[type=file]"),
	inputs: Array.from(document.querySelectorAll("input, textarea"))
}

;(function attachEvents(){
	store.submitButton.addEventListener("click", createPost)
	store.inputs.forEach(input => {
		input.addEventListener("input", () => {
			hideAlert("#success")
			hideAlert("#error")
		})
		input.addEventListener("focus", () => {
			hideAlert("#success")
			hideAlert("#error")
		})
	})
})()

function createPost(event){
	
	event.preventDefault()

	hideAlert("#error")
	hideAlert("#success")

	if(!app.tipster || !app.odds || !app.description || !store.fileInput.value)
		return showAlert("#error", "Plase complete the form")

	let imageLink

	// Upload the image
	const files = store.fileInput.files
	const formData = new FormData()
	formData.append("file", files[0])

	fetch("/api/upload", {
		method: "POST",
		body: formData
	})
	.then(res => res.json())
	.then(data => imageLink = data.link)
	.then(addPost)
	.catch(() => {
		showAlert("#error", "Tip post unsucessfully, please try again")
	})

	//Add post
	function addPost(){
		return fetch("/api/post", {
			method: "POST",
			headers: {
				'Content-Type': "application/json"
			},
			body: JSON.stringify({
				tipster: app.tipster,
				description: app.description,
				odds: app.odds,
				image: imageLink,
				bookmakers: app.bookmakers
			})
		})
		.then(res => res.json())
		.then(data => {
			if(data.status == 200){
				app.reset()
				store.fileInput.value = ""
				return showAlert("#success", "Tip posted successfully")
			}
		})

	}
	
}

function showAlert(id, value){
	const error = document.querySelector(id)
	error.innerText = value
	error.style.display = "block"
}

function hideAlert(id, value){
	const error = document.querySelector(id)
	error.style.display = "none"
}
