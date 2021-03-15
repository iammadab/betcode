const User = require("../models/user")

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

    await userObj.save()

  } catch(error){

    console.log(error)
    return { error: true, code: "INTERNAL_SERVER_ERROR" }

  }

}
