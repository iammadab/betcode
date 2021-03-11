const Otp = require("../models/otp")

exports.createOtp = async (data) => {

  try {

    const newOtp = new Otp(data)
    return newOtp.save()

  } catch(error){

    return { error: true, code: "FAILED_TO_CREATE_OTP" }

  }

}

exports.findOtp = async ({ phone, code }) => {
  
  try {

    const otpObj = await Otp.findOne({ phone, code })
    return otpObj

  } catch(error){

    return { error: true, code: "FAILED_TO_FETCH_OTP" }

  }

}
