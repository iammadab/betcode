const userService = require("../../services/user.service")

const joi = require("joi")
  
const updateUserValidator = joi.object({
  fullname: joi.string().trim().lowercase().required(),
  username: joi.string().trim().lowercase().required(),
  email: joi.string().trim().email().lowercase().required(),
  phone: joi.string().trim().required(),
  bio: joi.string().trim().required(),
  picture: joi.string().trim(),
  twitter: joi.string().trim(),
  telegram: joi.string().trim()
}).options({ abortEarly: false }).unknown(true)

const updateUser = async (data) => {

  const validationResult = updateUserValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  const updateDetails = validationResult.value

  // Make sure no other than maybe the user has this phone no
  const userWithPhone = await userService.findUserByPhone({ 
    phoneCode: data.user.phoneCode,
    phone: updateDetails.phone
  })

  if(userWithPhone){
    if(userWithPhone.error) return userWithPhone
    if(String(userWithPhone._id) != String(data.user._id))
      return {
        status: 403,
        code: "USER_EXISTS",
        data: "PHONE",
        message: "An account with that phone number already exists" 
      }
  }

  
  // Make sure the email is unique
  const userWithEmail = await userService.findUserByEmail(updateDetails)

  if(userWithEmail){
    if(userWithEmail.error) return userWithEmail
    if(String(userWithEmail._id) != String(data.user._id))
      return {
        status: 403,
        code: "USER_EXISTS",
        data: "EMAIL",
        message: "An account with that email already exists"
      }
  }


  // Make sure the username is unique
  const userWithUsername = await userService.findUserByUsername(updateDetails)

  if(userWithUsername){
    if(userWithUsername.error) return userWithUsername
    if(String(userWithUsername._id) != String(data.user._id))
      return {
        status: 403,
        code: "USER_EXISTS",
        data: "USERNAME",
        message: "An account with that username already exists" 
      }
  }


  const updatedUser = await userService.updateUser(
    { _id: data.user._id },
    updateDetails
  )

  if(!updatedUser)
    return { status: 500, code: "ERROR_UPDATING_USER" }

  if(updatedUser.error)
    return { status: 5000, code: "ERROR_CREATING_USER" }

  return { status: 200, code: "USER_UPDATED" }

}

module.exports = updateUser
