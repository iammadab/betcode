const postController = require("../../controllers/post")
const tipsterController = require("../../controllers/tipster")
const postService = require("../../services/post.service")

const home = async (req, res, next) => {
  
  const allPosts = postService.normalizeTips((await postController.fetchAll()).data)

  const allTipsters = (await tipsterController.fetchAll()).data

  req.pageData = {
    tips: allPosts,
    tipsters: allTipsters
  }

  next()

}

module.exports = home
