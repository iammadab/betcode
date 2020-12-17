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
	
		fetch("/api/tipster")
			.then(res => res.json())
			.then(data => {
				this.tipsters = data.data
			})

		fetch("/api/post")
			.then(res => res.json())
			.then(data => {
				this.tips = data.data
			})
	},

	computed: {

		tipsterList(){

			const list =  this.tipsters.map(tipster => ({
				name: tipster.name,
				link: `?filter=${spaceToHypen(tipster.name)}`
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
