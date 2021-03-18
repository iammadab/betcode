const stageRouter = requiredStage => (req, res, next) => {
  
  const user = req.body.user

  // If there is not user and the page is one that can both
  // accept logged in and not logged in users, then let them pass
  if(!user && req.pageData.dynamicPage)
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
