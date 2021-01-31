const postService = require("../../services/post.service")
const commentService = require("../../services/comment.service")

const joi = require("joi")

const createCommentValidator = joi.object({
  comment: joi.string().trim().required(),
  post: joi.string().trim().required(),
  user: joi.object({
    _id: joi.object().required()
  }).required().unknown(true)
}).options({ abortEarly: false }).unknown(true)

const createComment = async (data) => {

  const validationResult = createCommentValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  data = validationResult.value



  // Validate that the post exists
  const post = await postService.fetchById(data.post)
  if(!post)
    return { status: 403, code: "POST_NOT_FOUND" }
  


  const comment = await commentService.createComment({
    post: data.post,
    user: data.user._id,
    comment: data.comment
  })

  if(!comment)
    return { status: 500, code: "INTERNAL_SERVER_ERROR" }

  return { status: 200, code: "COMMENT_CREATED", data: comment }

}

module.exports = createComment
