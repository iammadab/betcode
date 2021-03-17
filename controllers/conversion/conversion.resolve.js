const conversionService = require("../../services/conversion.service")

const joi = require("joi")

const resolveConversionValidator = joi.object({
  conversionId: joi.string().trim().required(),
  status: joi.string().lowercase().trim().required(),
  code: joi.string().lowercase().trim()
}).options({ abortEarly: false })

const resolveConversion = async (data) => {
  
  const validationResult = resolveConversionValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  data = validationResult.value

  const conversionObj = await conversionService.fetchConversionById(data.conversionId)
  if(conversionObj.error)
    return { status: 404, code: "CONVERSION_REQUEST_NOT_FOUND" }

}

module.exports = resolveConversion
