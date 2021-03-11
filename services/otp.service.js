const Otp = require("../models/otp")

exprts.createOtp = async (data) => {

  try {

    const newOtp = new Otp(data)
    return newOtp.save()

  } catch(error){

    return { error: true, code: "FAILED_TO_CREATE_OTP" }

  }

}
