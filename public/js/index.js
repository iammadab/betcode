Vue.config.devtools = true

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
		addMeta("title", document.title)
		addMeta("description", "Bookmakr")
		addMeta("og:type", "website")
		addMeta("og:url", "https://www.bookmakr.ng")
		addMeta("og:title", document.title)
		addMeta("og:description", "Bookmakr")

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
