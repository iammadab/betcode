const otpService = require("../../services/otp.service")

const joi = require("joi")

const verifyOtpValidator = joi.object({
  phone: joi.number().required(),
  code: joi.number().required()
})

const verifyOtp = async (data) => {
  
  const validationResult = verifyOtpValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  const { phone, code } = validationResult.value

  const otpObj = await otpService.findOtp({ phone, code })

  if(!otpObj)
      return { status: 403, code: "OTP_VERIFICATION_FAILED" }

  return { status: 200, code: "OTP_VERIFIED" }

}

module.exports = verifyOtp
