const tipsterService = require("../services/tipster.service")
const userService = require("../services/user.service")
const userController = require("../controllers/user")

const userModel = require("../models/user")
const postModel = require("../models/post")

// Get all tipsters
// Use their details to create user accounts, and verify them
// Update all the posts of the tipster to reflect a change in their id

;(async function run(){ 

  const allTipsters = await tipsterService.fetchAll()
  console.log(allTipsters)

  allTipsters.forEach(async (tipster) => {
  
    // Create a user and retrieve id
    // Update all the user posts to reflect the new id
    // Update the user post count

    const userData = {
      fullname: tipster.name,
      username: tipster.name,
      email: `${tipster.name}@bookmakr.ng`,
      phoneCode: "+234",
      phone: `${Math.floor(Math.random() * 21312432423)}`,
      password: "password",
      bio: "Fake bio",
      picture: tipster.image
    }

    const creationResult = await userController.createUser(userData)

    console.log(creationResult)

    const { user } = creationResult

    const userId = user._id
    console.log("User id", userId)

    const updatedPosts = await postModel.updateMany({ tipster: tipster._id }, {
      tipster: userId
    })

    console.log("Updated", updatedPosts)

    const { n } = updatedPosts
    console.log("No updated", n)


    user.tips = n
    user.verifiedTipster = true
    user.save().then(user => {
      console.log("Saved used", user)
    })

  })

})
