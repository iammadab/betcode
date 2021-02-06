const postService = require("../../services/post.service")
const commentService = require("../../services/comment.service")

const tip = async (req, res, next) => {
  
  let post = await postService.fetchById(req.params.postId)
  if(!post)
    return res.redirect("/")

  if(post.error){
    console.log(error)
    return res.redirect("/")
  }

  post = postService.normalizeTip(post)

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
