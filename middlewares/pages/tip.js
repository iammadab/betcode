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

  // Want to order the bookmakers
  // Original first, then paid
  const original = [], paid = Object.keys(bookmakers)

  const bookmakerVerbose = {}
  Object.keys(bookmakers).forEach(bookmaker => {
    bookmakerVerbose[bookmaker] = {
      display: `${bookmakers[bookmaker]} (10 Naira)`,
      type: "paid"
    }
  })

  Object.keys(post.bookmakers).forEach(bookmaker => {
    const normalized = String(bookmaker).toLowerCase()
    original.push(normalized)
    bookmakerVerbose[normalized].display = bookmakers[normalized]
    bookmakerVerbose[normalized].type = "original"
    bookmakerVerbose[normalized].code = post.bookmakers[bookmaker]
  })

  const bookmakerOrder = Array.from(new Set(original.concat(paid)))

  const comments = commentService.normalizeComments(
    await commentService.getPostComments(req.params.postId)
  )

  req.pageData = Object.assign({}, req.pageData, {
    tipData: post,
    comments,
    bookmakers: bookmakerVerbose,
    bookmakerOrder
  })

  next()

}

module.exports = tip
