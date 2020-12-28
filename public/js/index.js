Vue.config.devtools = true

;(function(){
	addMeta("og:title", "Big title")
	addMeta("og:description", "Mad description")
})()

const app = new Vue({

	el: "#app",

	data: () => {

		return {
			
			tipsters: [],

			tips: [],

			tipster: ""

		}

	},

	created(){

		const filter = new URLSearchParams(window.location.search).get("tipster") || "" 

		this.tipster = filter ? hypenToSpace(filter) : "all"

		document.title = this.tipster != "all" ? "Latest Tips from " + this.tipster : "Latest Tips"
		addMeta("title", document.title, "name")
		addMeta("description", "Bookmakr de", "name")
		addMeta("og:type", "website")
		addMeta("og:url", "https://www.bookmakr.ng")
		addMeta("og:title", document.title)
		addMeta("og:description", "Bookmakr")
		addMeta("og:image", "https://bookmakr.ng/image/logo/logo.png")

		fetch("/api/tipster")
			.then(res => res.json())
			.then(data => {
				this.tipsters = data.data
			})

		fetch(filter ? `api/post/filter/${hypenToSpace(filter)}` : "/api/post")
			.then(res => res.json())
			.then(data => {
				this.tips = data.data
			})
	},

	computed: {

		tipsterList(){

			const list =  this.tipsters.map(tipster => ({
				name: tipster.name,
				//link: `?filter=${tipster._id}`
				link: `?tipster=${spaceToHypen(tipster.name)}`
			}))

			list.unshift({
				name: "all",
				link: "/"
			})

			return list

		},

		banner(){

			return this.tipster == "all" ? "" : `from ${this.tipster}`	

		}


	},

	methods: {

		isActive(name){
			return name == this.tipster
		}

	}


})

function spaceToHypen(string){
	return String(string).replace(/ /g, "-")
}

function hypenToSpace(string){
	return String(string).replace(/-/g, " ")
}
