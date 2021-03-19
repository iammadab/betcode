const Transaction = require("../../models/transaction")

const joi = require("joi")

const getTransactionValidator = joi.object({
  transactionId: joi.string().required(),
  user: joi.object({
    _id: joi.object().required()
  }).required().unknown(true)
}).options({ abortEarly: false }).unknown(true)

const getTransaction = async (data) => {

  const validationResult = getTransactionValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  data = validationResult.value

  const transactionObj = await Transaction.findOne({
    _id: data.transactionId,
    user: data.user._id
  })

  if(!transactionObj)
    return { status: 403, code: "TRANSACTION_NOT_FOUND" }

  return { status: 200, code: "TRANSACTION_FOUND", data: transactionObj }

}

module.exports = getTransaction
