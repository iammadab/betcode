const postController = require("../../controllers/post")
const tipsterController = require("../../controllers/tipster")
const postService = require("../../services/post.service")

const home = async (req, res, next) => {
  
  const allPosts = (await postController.fetchAll({})).data

  req.pageData = Object.assign({}, req.pageData, {
    tips: allPosts,
  })

  next()

}

module.exports = home
