const joi = require("joi")

const requestConversionValidator = joi.object({
  source: joi.string().lowercase().trim().required(),
  code: joi.string().lowercase().trim().required(),
  destination: joi.string().lowercase().trim().required(),
  user: joi.object({
    _id: joi.object().required(),
    wallet: joi.number().required()
  }).required().unknown(true)
})

const requestConversion = async (data) => {
  
  const validationResult = requestConversionValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  console.log("Passed validation")
  
}

module.exports = requestConversion
