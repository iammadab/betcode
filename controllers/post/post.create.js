const postService = require("../../services/post.service")
const on = require("../../lib/on")
const { createValidator } = require("lazy-validator")

const createPostValidator 
	= createValidator("tipster.string.lowercase, odds.number, image.string, bookmakers.array")

const createPost = async (req, res) => {

	const validationResult = createPostValidator.parse(req.body)

	if(validationResult.error)
		return res.json({
			status: 400,
			code: "BAD_REQUEST_ERROR",
			errors: validationResult.errors
		})

	const [ createError, post ] = await on(postService.createPost(validationResult.data))

	if(createError)
		return res.json({
			status: 500,
			code: "COULD_NOT_CREATE_POST"
		})

	res.json({
		status: 200,
		code: "POST_CREATED",
		data: post
	})

}

module.exports = createPost
