const postController = require("../../controllers/post")
const userController = require("../../controllers/user")
const postService = require("../../services/post.service")

const home = async (req, res, next) => {
  
  const allPosts = (await postController.fetchAll({})).data
  const allTipsters = (await userController.verifiedTipsters()).data

  req.pageData = Object.assign({}, req.pageData, {
    tips: allPosts,
    tipsters: allTipsters
  })

  next()

}

module.exports = home
