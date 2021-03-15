const walletService = require("../../services/wallet.service")

const joi = require("joi")

const requestConversionValidator = joi.object({
  source: joi.string().lowercase().trim().required(),
  code: joi.string().lowercase().trim().required(),
  destination: joi.string().lowercase().trim().required(),
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

  // Make sure the user has enough money in their wallet
  // to perform this request
  // Ideally, the cost of request should come from a single source
  const WALLET_AMOUNT = 10

  if(data.user.wallet < WALLET_AMOUNT)
    return { status: 403, code: "INSUFFICIENT_FUNDS" }

  const walletDeductionResult = await walletService.deductAmount(data.user._id, WALLET_AMOUNT)
  console.log(walletDeductionResult)
  if(walletDeductionResult.error)
    return {
      status: walletDeductionResult.status ? walletDeductionResult.status : 403,
      code: walletDeductionResult.code
    }

  
}

module.exports = requestConversion
