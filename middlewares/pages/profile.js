const userService = require("../../services/user.service")
const postService = require("../../services/post.service")

const profile = async (req, res, next) => {

  const user = await userService.findUserByUsername({ username: req.params.username })
  const tips = postService.normalizeTips(
    await postService.fetchByTipsterId(req.params.profileId)
  )

  // If no user redirect to home
  if(!user)
    return res.redirect("/")

  let sameUser = false
  if(req.pageData.loggedIn)
    if(req.body.user.id == req.params.profileId)
      sameUser = true
    
  req.pageData = Object.assign({}, req.pageData, {
    user,
    tips,
    sameUser
  })
  
  next()

}

module.exports = profile
