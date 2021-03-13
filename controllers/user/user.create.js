const { hash } = require("../../lib/crypt")
const userService = require("../../services/user.service")
const otpService = require("../../services/otp.service")
const loginUser = require("./user.login")

const joi = require("joi")

const createUserValidator = joi.object({
  fullname: joi.string().trim().lowercase().required(),
  username: joi.string().trim().lowercase().required(),
  email: joi.string().trim().email().lowercase().required(),
  phoneCode: joi.string().trim().required(),
  phone: joi.string().trim().regex(/^[0-9]+$/).required(),
  password: joi.string().trim().required(),
  otp: joi.number().required(),
  bio: joi.string().trim(),
  picture: joi.string().trim().empty("").default("/image/logo/user.png"),
  twitter: joi.string().trim(),
  twitterId: joi.string().trim(),
  telegram: joi.string().trim()
}).options({ abortEarly: false })

const createUser = async (data) => {
  
  const validationResult = createUserValidator.validate(data)
  
  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  const userDetails = validationResult.value


  // Make sure the user is unique 
  // With respect to the relevant metrics
  // Phone, Email and Username

  // Phone is unique
  const userWithPhone = await userService.findUserByPhone(userDetails)

  if(userWithPhone){
    if(userWithPhone.error) return userWithPhone
    return { 
      status: 403, 
      code: "USER_EXISTS", 
      data: "PHONE",
      message: "An account with that phone number already exists"
    }
  }

  // Email is unique
  const userWithEmail = await userService.findUserByEmail(userDetails)

  if(userWithEmail){
    if(userWithEmail.error) return userWithEmail
    return { 
      status: 403, 
      code: "USER_EXISTS", 
      data: "EMAIL",
      message: "An account with that email already exists" 
    }
  }

  // Username is unique
  const userWithUsername = await userService.findUserByUsername(userDetails)

  if(userWithUsername){
    if(userWithUsername.error) return userWithUsername
    return { 
      status: 403, 
      code: "USER_EXISTS", 
      data: "USERNAME",
      message: "An account with that username already exists" 
    }
  }


  // Verify otp then delete all otps sent to this user
  //
  if(userDetails.otp != process.env.DEFAULT_OTP){
    const otpObj = await otpService.findOtp({ phone: userDetails.phone, code: userDetails.otp })
    if(otpObj)
      await otpService.deleteOtpsFor({ phone: userDetails.phone })
    else
      return { status: 403, code: "INVALID_OTP" }
  }
    

  // Hash password
  const passwordHash = await hash(userDetails.password)

  // Create the user
  const user = await userService.createUser({ ...userDetails, password: passwordHash })
  console.log(user)

  if(!user || user.error)
    return { status: 500, code: "ERROR_CREATING_USER" }


  // Login the user
  let userLoginResult = await loginUser({ identifier: user.email, password: userDetails.password })
  if(userLoginResult.status != 200)
    userLoginResult = {}

  // Overide the status and code from login result
  // Keep token and cookie declarations
  return { ...userLoginResult, user, status: 200, code: "USER_CREATED" }

}

module.exports = createUser
