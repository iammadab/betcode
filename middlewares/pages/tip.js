const postService = require("../../services/post.service")
const commentService = require("../../services/comment.service")

const tip = async (req, res, next) => {
  
  const post = postService.normalizeTip(await postService.fetchById(req.params.postId))

  const comments = await commentService.getPostComments(req.params.postId)

  req.pageData = {
    tipData: post,
    comments
  }

  next()

}

module.exports = tip
