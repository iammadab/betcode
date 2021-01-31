const Comment = require("./models/comment")

exports.createCommennt = async (data) => {

  try{
    const newComment = new Comment(data)
    return newComment.save()
  } catch(error){
    throw error
  }

}
