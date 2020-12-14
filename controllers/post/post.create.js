const { createValidator } = require("lazy-validator")

const createPostValidator 
	= createValidator("tipster.string, odds.number, image.string, bookmakers.array")

const createPost = async (req, res) => {

	const validationResult = createPostValidator.parse(req.body)
	if(validationResult.error)
		return res.json({
			status: 400,
			code: "BAD_REQUEST_ERROR",
			errors: validationResult.errors
		})

	const post = await postService.createPost(...validationResult.data)

	res.send("creating new post")

}

module.exports = createPost
