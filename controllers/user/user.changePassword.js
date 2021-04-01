const { hash } = require("../../lib/crypt")
const userService = require("../../services/user.service")
const otpService = require("../../services/otp.service")
const loginUser = require("./user.login")

const joi = require("joi")

const changePasswordValidator = joi.object({
  password: joi.string().trim().required(),
  identifier: joi.string().trim().lowercase().required(),
  code: joi.number().required()
})

const changePassword = async (data) => {
  
  const validationResult = changePasswordValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  const { code, identifier, password } = validationResult.value 

  const user = 
    await userService.findUserByEmail({ email: identifier }) ||
    await userService.findUserByUsername({ username: identifier })

  if(!user)
    return { status: 403, code: "USER_NOT_FOUND" }

  const otpObj = await otpService.findOtp({ phone: user.phone, code })

  if(!otpObj)
    return { status: 403, code: "OTP_VERIFICATION_FAILED" }

  const passwordHash = await hash(password)

  user.password = passwordHash
  await user.save()

  otpService.deleteOtpsFor({ phone: user.phone })

  let userLoginResult = await loginUser({ identifier: user.email, password })
  if(userLoginResult.status != 200)
    userLoginResult = {}

  return { ...userLoginResult, status: 200, code: "PASSWORD_UPDATED" }

}

module.exports = changePassword
