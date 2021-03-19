const stageRouter = requiredStage => (req, res, next) => {
  
  const user = req.body.user

  // If the user is not logged in, just proceed to the next page
  // As if the page only wanted logged in users, it would have user a 
  // cookieNotFound filter, hence the user will never get here
  if(!user)
    return next()

  // If the page requires access control and the user has them, proceed
  if(user.stage == requiredStage)
    return next()

  // If the your access doesn't match the access of the page you visited
  // First check if there is a page, a user at that stage should be at
  // If one is found take them to that page
  const stagePage = mapStageToPage(user.stage)
  if(stagePage)
    return res.redirect(stagePage)

  // If the stage is not particular about being on any page
  // Check if the page itself is particular about the user being at a stage
  // If the page doesn't care about what stage the user is then proceed
  if(!requiredStage)
    return next()

  // If the page cares about the stage of the user
  // and the user is at the wrong stage,
  // just take the user to the home page
  return res.redirect("/home")

}

module.exports = stageRouter

function mapStageToPage(stage){

  const map = {
    "unverified": "/verify"
  }

  return map[stage]

}
