const userService = require("../../services/user.service")
const postService = require("../../services/post.service")

const profile = async (req, res, next) => {

  const user = await userService.findUserById({ id: req.params.profileId })
  const tips = await postService.fetchByTipsterId(req.params.profileId)

  req.pageData = Object.assign({}, {
    user,
    tips
  })
  
  next()

}

module.exports = profile
