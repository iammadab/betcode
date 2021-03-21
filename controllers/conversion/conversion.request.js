const walletService = require("../../services/wallet.service")
const { charge } = require("../../lib/data")
const conversionService = require("../../services/conversion.service")

const joi = require("joi")

const requestConversionValidator = joi.object({
  source: joi.string().lowercase().trim().required(),
  code: joi.string().lowercase().trim().required(),
  destination: joi.string().lowercase().trim().required(),
  tipId: joi.string().trim().required(),
  token: joi.string().required(),
  user: joi.object({
    _id: joi.object().required(),
    wallet: joi.number().required()
  }).required().unknown(true)
}).options({ abortEarly: false })

const requestConversion = async (data) => {
  
  const validationResult = requestConversionValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  data = validationResult.value

  // Make sure the user has enough money in their wallet
  // to perform this request
  // Ideally, the cost of request should come from a single source
  const WALLET_AMOUNT = 20

  if(data.user.wallet < WALLET_AMOUNT)
    return { status: 403, code: "INSUFFICIENT_FUNDS" }

  const walletChargeResult = await walletService.chargeForConversion(data.user._id, WALLET_AMOUNT)
  if(walletChargeResult.error)
    return {
      status: walletChargeResult.status ? walletChargeResult.status : 403,
      code: walletChargeResult.code
    }

  const requestConversionResult = await conversionService.requestConversion({
    source: data.source,
    code: data.code,
    destination: data.destination,
    subscriberId: data.user._id,
    tipId: data.tipId,
    chargeAmount: WALLET_AMOUNT
  })
  console.log(requestConversionResult)
  if(requestConversionResult.error)
    return { status: 403, code: requestConversionResult.code }

  // Send the new stat to all the converters
  conversionService.sendStats()

  return { status: 200, code: "CONVERSION_REQUEST" }
  
}

module.exports = requestConversion
