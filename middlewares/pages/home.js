const postController = require("../../controllers/post")
const tipsterController = require("../../controllers/tipster")
const postService = require("../../services/post.service")

const home = async (req, res, next) => {
  
  const allPosts = (await postController.fetchAll({})).data
  console.log("All post", allPosts)

  req.pageData = Object.assign({}, req.pageData, {
    tips: allPosts,
  })

  console.log(req.pageData)

  next()

}

module.exports = home
