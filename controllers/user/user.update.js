const userService = require("../../services/user.service")

const joi = require("joi")
  
const updateUserValidator = joi.object({
  token: joi.string(),
  user: joi.object({}).unknown(true),
  fullname: joi.string().trim().lowercase(),
  username: joi.string().trim().lowercase(),
  email: joi.string().trim().email().lowercase(),
  phone: joi.string().trim(),
  bio: joi.string().trim(),
  picture: joi.string().trim(),
  twitter: joi.string().trim(),
  telegram: joi.string().trim()
}).options({ abortEarly: false })

// Not secure, seeing a possible breach that allows a user to update 
// their wallet balance
const updateUser = async (data) => {

  const validationResult = updateUserValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  const updateDetails = validationResult.value

  if(updateDetails.phone){
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
  }

  
  if(updateDetails.email){
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
  }


  if(updateDetails.username){
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
  }

  console.log(updateDetails)
  if(updateDetails.token)
    delete updateDetails.token
  console.log(updateDetails)


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
