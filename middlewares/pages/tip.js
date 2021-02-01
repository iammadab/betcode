const postService = require("../../services/post.service")
const commentService = require("../../services/comment.service")

const tip = async (req, res, next) => {
  
  const post = postService.normalizeTip(await postService.fetchById(req.params.postId))

  const comments = commentService.normalizeComments(
    await commentService.getPostComments(req.params.postId)
  )

  req.pageData = Object.assign({}, req.pageData, {
    tipData: post,
    comments
  })

  next()

}

module.exports = tip
