const tweetService = require("../../services/tweet.service")

const joi = require("joi")

const fetchByStatusValidator = joi.object({
  status: joi.string().trim().required()
})

const fetchByStatus = async data => {

  const validationResult = fetchByStatusValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  data = validationResult.value

  const tweets = await tweetService.fetchByStatus(data.status)
  if(tweets.error)
    return { status: 500, code: tweets.code }

  return { status: 200, code: "FETCHED_TWEETS", data: tweets }

}

module.exports = fetchByStatus
