const conversionService = require("../../services/conversion.service")
const telegram = require("../../lib/telegram")

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

  if(conversionObj.status != "pending")
    return { status: 403, code: "CONVERSION_REQUEST_NOT_PENDING" }

  const allowedStatuses = [ "failed", "partial", "success" ]
  if(allowedStatuses.indexOf(data.status) == -1)
    return { status: 400, code: "INVALID_STATUS", data: allowedStatuses }

  // Expecting code for both success and partial
  if(data.status != "failed" && !data.code)
    return { status: 400, code: "EXPECTED_CODE_FOR_SUCCESS" }

  const resolvedConversionObj = await conversionService.resolveConversion(
    conversionObj,
    data.status,
    data.code
  )
  console.log(resolvedConversionObj)

  // Conversion has been resolved
  // Resolve for automatic subscribers  

  if(resolvedConversionObj.error)
    return { status: 500, code: "UNABLE_TO_RESOLVE_CONVERSION" }

  for(const subscriberId of resolvedConversionObj.subscribers){
    // Might consider batching these requests to take advantage
    // of the asychronous power of node
    // scared of running low on memory
    
    await conversionService.resolveSubscriber(subscriberId, resolvedConversionObj)

  }

  conversionService.sendStats()
  telegram.sendMessage(telegram.users.wisdom, `Status: ${resolvedConversionObj.status}`)

  return { status: 200, code: "RESOLVED_CONVERSION" }

}

module.exports = resolveConversion
