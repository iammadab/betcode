const postService = require("../../services/post.service")
const tipsterService = require("../../services/tipster.service")
const on = require("../../lib/on")

const joi = require("joi")

const fetchByValidator = joi.object({
  value: joi.string().lowercase().required()
}).options({ abortEarly: false })

// Should not be called fetch by again
// The abstraction was too early
// Please refactor
const fetchBy = field => async (data) => {
	
	const validationResult = fetchByValidator.validate(data)
	if(validationResult.error)
		return {
			status: 400,
			code: "BAD_REQUEST_ERROR",
			errors: validationResult.error
		}

	const { value } = validationResult

	let tipster = {}
	if(field == "tipster")
		tipster = await tipsterService.fetchTipsterIdFromName(value)

	const [ fetchError, posts ] = 
		await on(postService.fetchBy(field, value, tipster._id))

	if(fetchError)
		return {
			status: 500,
			code: "COULD_NOT_FETCH_POST"
		}

	return {
		status: 200,
		code: "POST_FETCHED",
		data: posts
	}

}

module.exports = fetchBy
