const postService = require("../../services/post.service")
const on = require("../../lib/on")
const { createValidator } = require("lazy-validator")

const fetchByValidator = createValidator("value.string.lowercase")

const fetchBy = field => async (req, res) => {
	
	const validationResult = fetchByValidator.parse(req.params)
	if(validationResult.error)
		return res.json({
			status: 400,
			code: "BAD_REQUEST_ERROR",
			errors: validationResult.errors 
		})

	const { value } = validationResult.data

	const [ fetchError, posts ] = 
		await on(postService.fetchBy(field, value))

	if(fetchError)
		return res.json({
			status: 500,
			code: "COULD_NOT_FETCH_POST"
		})

	res.json({
		status: 200,
		code: "POST_FETCHED",
		data: posts
	})

}

module.exports = fetchBy
