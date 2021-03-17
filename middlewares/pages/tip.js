const postService = require("../../services/post.service")
const commentService = require("../../services/comment.service")
const conversionService = require("../../services/conversion.service")
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
  const original = [], paid = Object.keys(bookmakers), requested = []

  const bookmakerVerbose = {}
  Object.keys(bookmakers).forEach(bookmaker => {
    bookmakerVerbose[bookmaker] = {
      display: `${bookmakers[bookmaker]} (10 Naira)`,
      type: "paid"
    }
  })

  Object.keys(post.bookmakers).forEach(bookmaker => {
    const normalized = String(bookmaker).toLowerCase()

    const code = post.bookmakers[bookmaker]
    if(!code)
      return

    original.push(normalized)

    bookmakerVerbose[normalized].display = bookmakers[normalized]
    bookmakerVerbose[normalized].type = "original"
    bookmakerVerbose[normalized].code = post.bookmakers[bookmaker]

  })

  // Grab all the conversions for this post that the user is a subscriber to
  const conversions = await conversionService.fetchUserTipConversions(
    req.body.user._id,
    post._id
  )

  conversions.forEach(conversion => {
    const bookmaker = conversion.destination
    requested.push(bookmaker)

    bookmakerVerbose[bookmaker].display = `${bookmakers[bookmaker]}`
    bookmakerVerbose[bookmaker].type = "requested" 
    bookmakerVerbose[bookmaker].data = {
      //status: conversion.status,
      status: "partial",
      code: conversion.destinationCode,
      startTime: conversion.startTime,
      endTime: conversion.endTime
    }
  })


  const bookmakerOrder = Array.from(new Set(requested.concat(original.concat(paid))))

  const comments = commentService.normalizeComments(
    await commentService.getPostComments(req.params.postId)
  )

  req.pageData = Object.assign({}, req.pageData, {
    tipData: post,
    comments,
    bookmakers: bookmakerVerbose,
    bookmakerOrder,
    bookmakerMap: bookmakers
  })

  next()

}

module.exports = tip
