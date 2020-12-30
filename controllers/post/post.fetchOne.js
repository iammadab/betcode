const postService = require("../../services/post.service")
const on = require("../../lib/on")
const { createValidator } = require("lazy-validator")

const fetchValidator = createValidator("postId.string")

const fetchOne = async (req, res) => {
	
	const validationResult = fetchValidator.parse(req.body)
	if(validationResult.error) 
		return {
			status: 400,
			code: "BAD_REQUEST_ERROR",
			errors: validationResult.errors 
		}

	const { postId } = validationResult.data

	const [ fetchError, post ] =
		await on(postService.fetchById(postId))

	if(fetchError)
		return {
			status: 500,
			code: "COULD_NOT_FETCH_POST"
		}

	return {
		status: 200,
		code: "POST_FETCHED",
		data: post
	}

}

module.exports = fetchOne
