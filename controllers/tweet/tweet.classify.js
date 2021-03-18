const tweetService = require("../../services/tweet.service")

const joi = require("joi")

const classifyValidator = joi.object({
  ids: joi.array().required()
})

const classify = type => async data => {

  const validationResult = classifyValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  data = validationResult.value

  const updateResult = await tweetService.updateTypeMany(data.ids, type)

  if(updateResult.error)
    return { status: 500, code: updateResult.code }

  // If the number of documents sent equals the number ..
  // of documents modified, then it can safely assummed..
  // that all the documents sent where updated
  // Else, some might not have been and the api consumer should...
  // be informed
  
  let updatedAll = false

  if(data.ids.length == updateResult.nModified)
    updatedAll = true

  return { status: 200, code: "CLASSIFIED_TWEETS", data: data.ids, updatedAll }

}

module.exports = classify
