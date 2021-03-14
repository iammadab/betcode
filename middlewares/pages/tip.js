const postService = require("../../services/post.service")
const commentService = require("../../services/comment.service")
const bookmakers = require("../../lib/bookmakers")

const tip = async (req, res, next) => {
  
  let post = await postService.fetchById(req.params.postId)
  if(!post)
    return res.redirect("/")

  if(post.error){
    console.log(post.error)
    return res.redirect("/")
  }

  post = postService.normalizeTip(post)

  console.log(post)

  const comments = commentService.normalizeComments(
    await commentService.getPostComments(req.params.postId)
  )

  req.pageData = Object.assign({}, req.pageData, {
    tipData: post,
    comments,
    bookmakers
  })

  next()

}

module.exports = tip
