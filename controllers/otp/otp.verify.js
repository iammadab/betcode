const otpService = require("../../services/otp.service")

const joi = require("joi")

const verifyOtpValidator = joi.object({
  code: joi.number().required(),
  user: joi.object({
    phone: joi.string().required()
  }).required().unknown(true)
}).options({ abortEarly:  false }).unknown(true)

const verifyOtp = async (data) => {
  
  const validationResult = verifyOtpValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  const { user, code } = validationResult.value

  const otpObj = await otpService.findOtp({ phone: user.phone, code })

  if(!otpObj)
      return { status: 403, code: "OTP_VERIFICATION_FAILED" }

  return { status: 200, code: "OTP_VERIFIED" }

}

module.exports = verifyOtp
