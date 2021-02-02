const tipsterService = require("../services/tipster.service")
const userService = require("../services/user.service")


// Get all tipsters
// Use their details to create user accounts, and verify them
// Update all the posts of the tipster to reflect a change in their id

;(async function run(){ 

  const allTipsters = await tipsterService.fetchAll()
  console.log(allTipsters)

})()
