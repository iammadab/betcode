const store = {
  editButton: document.querySelector(".edit-button"),
  editFormTag: ".edit-form",
  imageInput: document.querySelector("input[type=file]")
}

;(function attachEvents(){
  addEvent([store.editButton], "click", editUser)
  addEvent(
    getFormInputs(store.editFormTag),
    "input,focus",
    () => hideAlert(".edit-error")
  )
})()

const editText = createButton(".edit-text", "Edit", "Updating...")

async function editUser(event){
  
  event.preventDefault()
  editText()

  const updateDetails = extractForm(store.editFormTag)
  const missingKeys = hasKeys(
    updateDetails,
    [ "fullname", "username", "email", "phone", "bio" ]
  )

  if(missingKeys.length > 0){
    editText("normal")
    return showAlert(".edit-error", `Sorry, you didn't enter your ${missingKeys[0]}`)
  }

  if(!validEmail(updateDetails.email)){
    editText("normal")
    return showAlert(".edit-error", `Sorry, you entered an invalid email address`)
  }

  let profileLink = ""

  const file = store.imageInput.files

  if(file[0]){
    const formData = new FormData()
    formData.append("file", file[0])

    const uploadData = 
      await fetch("/api/upload", { method: "POST", body: formData })
              .then(res => res.json())

    if(uploadData.status == 200)
      profileLink = uploadData.link
  }

  const apiData = { ...updateDetails, token: getToken() }
  
  if(profileLink)
    apiData.picture = profileLink

  api("/user/update", apiData)
    .then(handleUpdate)

  function handleUpdate(data){
    
    if(data.status == 200){
      showAlert(".edit-success", "Profile updated successfully")
      return reload()
    }

    editText("normal")

    if(data.code == "USER_EXISTS" && data.message)
      return showAlert(".edit-error", data.message)

    else
      return showAlert(".edit-error", "Something went wrong, try again later or contact support")

  }
}

function validEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}
