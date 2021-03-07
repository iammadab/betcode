const postService = require("../../services/post.service")
const on = require("../../lib/on")

const joi = require("joi")

const fetchAllValidator = joi.object({
  lastId: joi.string().trim(),
  limit: joi.number(),
  tipster: joi.string().trim(),
  bookmaker: joi.string().trim().lowercase(),
  minOdds: joi.number(),
  maxOdds: joi.number()
}).options({ abortEarly: false })

const fetchAll = async (data) => {

  const validationResult = fetchAllValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  const filter = validationResult.value
	
	const [ fetchError, posts ] = 
		await on(postService.fetchAll(filter))

	if(fetchError)
		return {
			status: 500,
			code: "COULD_NOT_FETCH_POSTS"
		}

	return {
		status: 200,
		code: "POST_FETCHED",
		data: posts
	}

}

module.exports = fetchAll
