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
				"twentytwobet": ""
			}

		}

	},

	created(){

		fetch("/api/user/tipsters")
			.then(res => res.json())
			.then(data => {
        console.log(data)
				this.tipsters = data.data
			})

	},

	computed: {

		tipsterList(){

			const list =  this.tipsters.map(tipster => ({
				id: tipster._id,
				name: tipster.username,
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
	fileInputs: Array.from(document.querySelectorAll("input[type=file]")),
	inputs: Array.from(document.querySelectorAll("textarea, input:not(#copyinput)")),
	copyButton: document.querySelector(".copy-button"),
 	linkInput: document.querySelector(".link-input")
}

;(function attachEvents(){
	store.submitButton.addEventListener("click", createPost)
	store.inputs.forEach(input => {
		input.addEventListener("input", () => {
			hideAlert("#success")
			hideAlert("#error")
			hideAlert("#linker")
		})
		input.addEventListener("focus", () => {
			hideAlert("#success")
			hideAlert("#error")
			hideAlert("#linker")
		})
	})
  store.copyButton.addEventListener("click", copy)
})()

function createPost(event){
	
	event.preventDefault()

	hideAlert("#error")
	hideAlert("#success")
	hideAlert("#linker")

	if(!app.tipster || !app.odds || !app.description || !store.fileInputs[0].value)
		return showAlert("#error", "Plase complete the form")

	let imageLinks = []

	// Upload the image
	const files = store.fileInputs.map(input => input.files)
  console.log(files)
	let formDatas = files.map(file => {
    if(!file[0]) return undefined
    const f = new FormData()
    f.append("file", file[0])
    return f
  })
  formDatas = formDatas.filter(data => data)
  console.log(formDatas)

  Promise.all(formDatas.map(formData => {
    return fetch("/api/upload", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(data => imageLinks.push(data.link))
  })).then(addPost).catch(() => {
    showAlert("#error", "Tip post unsuccessfull, please try again")
  })

	//Add post
	function addPost(){
    console.log(imageLinks)
		return fetch("/api/post", {
			method: "POST",
			headers: {
				'Content-Type': "application/json"
			},
			body: JSON.stringify({
				tipster: app.tipster,
				description: app.description,
				odds: app.odds,
				image: imageLinks[0],
        image2: imageLinks[1],
        image3: imageLinks[2],
        image4: imageLinks[3],
				bookmakers: app.bookmakers
			})
		})
		.then(res => res.json())
		.then(data => {
			if(data.status == 200){

				app.reset()
        const form = document.querySelector("form")
        form.reset()

				const postId = data.data._id
        const message = generateMessage(data.data)
        console.log(message)
				store.linkInput.value = message

				showAlert("#linker")
				return showAlert("#success", "Tip posted successfully")

			}
		})

	}
	
}

function generateMessage(post){
  const preference = [ "onexbet", "twentytwobet", "bet9ja", "betking", "sportybet" ]
  let bookmaker, code
  for(pref of preference){
    if(post.bookmakers[pref]){
      bookmaker = pref
      code = post.bookmakers[pref]
      break
    }
  }
  
  if(bookmaker == "onexbet")
    bookmaker = "1Xbet"
  else if(bookmaker == "twentytwobet")
    bookmaker = "22bet"

  const link = `https://bookmakr.ng/tip/${post._id}?d=t`

  return `${capitalizeFirst(bookmaker)} ${code}. Get Bet9ja, Betking, Sportybet & 22bet booking codes on ${link} or follow @thebookmakr to request for another code.`

}

function capitalizeFirst(word){
  word = String(word)
  const letters = word.split("")
  letters[0] = String(letters[0]).toUpperCase()
  return letters.join("")
}

function showAlert(id, value, type){
	const error = document.querySelector(id)
	if(value)
		error.innerText = value
	error.style.display = type || "block"
}

function hideAlert(id, value){
	const error = document.querySelector(id)
	error.style.display = "none"
}


function copy(event){

  event.preventDefault()

  const linkElement = event.target.previousElementSibling
  const link = linkElement.value
  const copyInput = document.querySelector("#copyinput")

  copyInput.value = link
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
  event.target.innerHTML = `Copied`
  setTimeout(() => {
    event.target.innerHTML = `Copy`
  }, 3000)

}
