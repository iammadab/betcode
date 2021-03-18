const postController = require("../../controllers/post")
const userController = require("../../controllers/user")
const postService = require("../../services/post.service")
const bookmakers = require("../../lib/bookmakers")

const home = async (req, res, next) => {
  
  const allPosts = (await postController.fetchAll({})).data
  const allTipsters = (await userController.verifiedTipsters()).data

  req.pageData = Object.assign({}, req.pageData, {
    tips: allPosts,
    tipsters: allTipsters,
    bookmakers
  })

  next()

}

module.exports = home
