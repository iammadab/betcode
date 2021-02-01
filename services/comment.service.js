const Comment = require("../models/comment")
const moment = require("moment")

exports.createComment = async (data) => {

  try{
    const newComment = new Comment(data)
    return newComment.save()
  } catch(error){
    throw error
  }

}

exports.getPostComments = async (postId) => {
  
  try{
    return Comment.find({ post: postId }).populate("user")
  } catch(error){
    throw error
  }

}

exports.normalizeComment = comment => {
  const commentObj = Object.assign({}, comment._doc)
  commentObj.date = moment(commentObj.createdAt).fromNow()
  return commentObj
}

exports.normalizeComments = comments => {
  return comments.map(exports.normalizeComment)
}
