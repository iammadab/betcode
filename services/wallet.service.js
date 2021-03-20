const User = require("../models/user")
const Transaction = require("../models/transaction")

exports.createFundTransaction = async (userId, amount) => {

  try{
    
    // Creating a pending transaction
    const transaction = new Transaction({
      user: userId,
      type: "fund_wallet",
      status: "pending",
      amount
    })

    console.log(transaction)

    return transaction.save()

  } catch(error){
  
    return { error: true, code: "PROBLEM_FUNDING_WALLET" }

  }

}

exports.fundWallet = async (userId, amount) => {
  
  try {

    amount = Number(amount)

    // Make sure the amount is a number
    if(isNaN(amount))
      return { error: true, code: "INVALID_AMOUNT" }

    // Make sure the amount is not negative
    if(amount <= 0)
      return { error: true, code: "AMOUNT_NOT_ALLOWED" }

    // Grab the user
    const userObj = await User.findOne({ _id: userId })
    if(!userObj)
      return { error: true, code: "USER_NOT_FOUND" }

    // Ideally, we should setup a transaction initiation
    userObj.wallet += amount

    return await userObj.save()

  } catch(error){

    console.log(error)
    return { error: true, code: "INTERNAL_SERVER_ERROR" }

  }

}

exports.deductAmount = async (userId, amount) => {
  
  try {
  
    amount = Number(amount)

    // Make sure the amount is a number
    if(isNaN(amount))
      return { error: true, code: "INVALID_AMOUNT" }

    // Make sure the amount is not negative
    if(amount <= 0)
      return { error: true, code: "AMOUNT_NOT_ALLOWED" }

    // Grab the user
    const userObj = await User.findOne({ _id: userId })
    if(!userObj)
      return { error: true, code: "USER_NOT_FOUND" }

    // Make the user has up to that amount
    if(userObj.wallet < amount)
      return { error: true, code: "INSUFFICIENT_FUNDS" }

    // Deduct the amount
    // Should create a transaction here
    userObj.wallet -= amount

    return await userObj.save()

  } catch(error){

    console.log(error)
    return { error: true, code: "INTERNAL_SERVER_ERROR" }

  }

}

exports.executeTransaction = async (transaction) => {
  
  if(transaction.status != "pre-execute")
    return { error: true, code: "TRANSACTION_NOT_PRE_EXECUTE" }

  if(!transaction.user)
    return { error: true, code: "NO_USER_ID" }

  const user = await User.findOne({ _id: transaction.user })

  if(!user)
    return { error: true, code: "USER_NOT_FOUND" }

  if(transaction.type == "fund_wallet" || transaction.type == "refund"){
    user.wallet += transaction.amount
    await user.save()
    
    transaction.status = "success"
    await transaction.save()

    return transaction
  }

  else
    return { error: true, code: "INVALID_TRANSACTION_TYPE" }

}
