const walletService = require("../../services/wallet.service")

const joi = require("joi")

const fundWalletValidator = joi.object({
  amount: joi.number().required(),
  user: joi.object({
    _id: joi.object().required()
  }).required().unknown(true)
}).options({ abortEarly: false }).unknown(true)

const fundWallet = async (data) => {
    
  const validationResult = fundWalletValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  data = validationResult.value

  const walletFundResult = await walletService.createFundTransaction(data.user._id, data.amount)

  if(walletFundResult.error)
    return { status: 500, code: walletFundResult.code }

  return { status: 200, code: "WALLET_FUND_INITIATED" }

}


module.exports = fundWallet
