const otpService = require("../../services/otp.service")
const telegram = require("../../lib/telegram")

const joi = require("joi")

const createOtpValidator = joi.object({
  phone: joi.number().required()
})

const createOtp = async (data) => {
  
  const validationResult = createOtpValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  const code = generateCode()

  telegram.send("developers", `OTP: ${code}`)

  const { phone } = validationResult.value
  const otpObj = await otpService.createOtp({ phone, code })

  return { status: 200, code: "OTP_CREATED" }

}

module.exports = createOtp

function generateCode(){
  return (Math.floor((Math.random() * 90000)) + 10000)
}
