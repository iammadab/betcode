// Only allows access to a page if a user is at a particular stage

const stageRouter = requiredStage => (req, res, next) => {
  
  const user = req.body.user

  // If the page doeesn't require any access control, proceed
  if(!requiredStage)
    return next()
  
  // If the page requires access control and the user has them, proceed
  if(user.stage == requiredStage)
    return next()

  // For pages that require access control,
  // and the user has invalid access
  // find the appropriate page for the user,
  // then redirect them or redirect them to home
  const stagePage = mapStageToPage(user.stage)
  res.redirect(stagePage ? stagePage : "/home")

}

module.exports = stageRouter

function mapStageToPage(stage){

  const map = {
    "unverified": "/verify"
  }

  return map[stage]

}
