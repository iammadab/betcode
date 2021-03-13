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
  console.log(phone, code)
  
  try {

    return await Otp.findOne({ phone, code })

  } catch(error){

    return { error: true, code: "FAILED_TO_FETCH_OTP" }

  }

}

exports.deleteOtpsFor = async ({ phone }) => {
  
  try {

    return await Otp.deleteMany({ phone })

  } catch(error){

    return { error: true, code: "FAILED_TO_DELETE_OTPS" }

  }

}
