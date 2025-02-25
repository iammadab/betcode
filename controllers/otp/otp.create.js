const otpService = require("../../services/otp.service")
const whatsapp = require("../../lib/whatsapp")

const joi = require("joi")

const createOtpValidator = joi.object({
  user: joi.object({
    phone: joi.string().required()
  }).required().unknown(true)
}).unknown(true)

const createOtp = async (data) => {
  
  const validationResult = createOtpValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  const code = generateCode()

  const { user } = validationResult.value

  whatsapp.sendMessage({
    phone: user.phone,
    message: `Your Bookmakr OTP is: ${code}`
  })

  const otpObj = await otpService.createOtp({ phone: user.phone, code })

  return { status: 200, code: "OTP_CREATED", data: { phone: numberToAsterik(user.phone) } }

}

module.exports = createOtp

function generateCode(){
  return (Math.floor((Math.random() * 90000)) + 10000)
}

function numberToAsterik(number){
  const numberString = String(number)
  return numberString.slice(0, 4) + numberString.slice(2).replace(/.(?=...)/g, "*")
}
