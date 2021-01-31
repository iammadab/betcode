const userService = require("../../services/user.service")
const postService = require("../../services/post.service")

const profile = async (req, res, next) => {

  const user = await userService.findUserById(req.body.user)

  // If the user is not found
  // delete the user cookie and 
  // redirect them to login

  const tips = await postService.fetchByTipsterId(req.body.user.id)

  req.pageData = {
    user,
    tips
  }
  
  next()

}

module.exports = profile
