const Comment = require("../models/comment")

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
