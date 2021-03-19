const Transaction = require("../../models/transaction")

const joi = require("joi")

const cancelFundWalletValidator = joi.object({
  transactionId: joi.string().required(),
  user: joi.object({
    _id: joi.object().required()
  }).required().unknown(true)
}).options({ abortEarly: false }).unknown(true)

const cancelFundWallet = async (data) => {

  const validationResult = cancelFundWalletValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  data = validationResult.value

  const transactionObj = await Transaction.findOne({
    _id: data.transactionId,
    user: data.user._id
  })

  if(!transactionObj)
    return { status: 403, code: "TRANSACTION_NOT_FOUND" }

  if(transactionObj.status != "pending")
    return { status: 403, code: "TRANSACTION_NOT_PENDING" }

  transactionObj.status = "cancelled" 
  await transactionObj.save()

  return { status: 200, code: "TRANSACTION_CANCELLED" }

}

module.exports = cancelFundWallet
