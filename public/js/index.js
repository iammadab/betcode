Vue.config.devtools = true

const app = new Vue({

	el: "#app",

	data: () => {

		return {
			
			tipsters: [],

			tips: []

		}

	},

	created(){

		const filter = new URLSearchParams(window.location.search).get("filter") || "" 

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
				link: `?filter=${tipster._id}`
			}))

			list.unshift({
				name: "all",
				link: "/"
			})

			return list

		}

	}


})

function spaceToHypen(string){
	return String(string).replace(/ /g, "-")
}

function hypenToSpace(string){
	return String(string).replace(/-/g, " ")
}
