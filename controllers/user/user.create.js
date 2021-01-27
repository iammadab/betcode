const { hash } = require("../../lib/crypt")
const userService = require("../../services/user.service")

const joi = require("joi")

const createUserValidator = joi.object({
  fullname: joi.string().trim().lowercase().required(),
  username: joi.string().trim().lowercase().required(),
  email: joi.string().trim().email().lowercase().required(),
  phoneCode: joi.string().trim().required(),
  phone: joi.string().trim().regex(/^[0-9]+$/).required(),
  password: joi.string().trim().required(),
  bio: joi.string().trim().required(),
  picture: joi.string().trim().uri().required(),
  twitter: joi.string().trim(),
  telegram: joi.string().trim()
}).options({ abortEarly: false })

const createUser = async (data) => {
  
  const validationResult = createUserValidator.validate(data)
  
  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: error }

  const userDetails = validationResult.value



  // Make sure the user is unique 
  // With respect to the relevant metrics
  // Phone, Email and Username

  // Phone is unique
  const userWithPhone = await userService.findUserByPhone(userDetails)

  if(userWithPhone){
    if(userWithPhone.error) return userWithPhone
    return { status: 403, code: "USER_EXISTS", data: "PHONE" }
  }

  // Email is unique
  const userWithEmail = await userService.findUserByEmail(userDetails)

  if(userWithEmail){
    if(userWithEmail.error) return userWithEmail
    return { status: 403, code: "USER_EXISTS", data: "EMAIL" }
  }

  // Username is unique
  const userWithUsername = await userService.findUserByUsername(userDetails)

  if(userWithUsername){
    if(userWithUsername.error) return userWithUsername
    return { status: 403, code: "USER_EXISTS", data: "USERNAME" }
  }


  

  // Hash password
  const passwordHash = await hash(userDetails.password)

  // Create the user
  const user = await userService.createUser({ ...userDetails, password: passwordHash })

  if(!user || user.error)
    return { status: 500, code: "ERROR_CREATING_USER" }


  // Login the user
  // Attach cookies

  return { status: 200, code: "USER_CREATED" }

}

module.exports = createUser
