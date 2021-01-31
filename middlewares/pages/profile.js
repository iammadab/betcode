const userService = require("../../services/user.service")
const postService = require("../../services/post.service")

const profile = async (req, res, next) => {

  const tips = await postService.fetchByTipsterId(req.body.user._id)

  req.pageData = {
    user: req.body.user,
    tips
  }
  
  next()

}

module.exports = profile
