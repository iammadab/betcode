const { compare } = require("../../lib/crypt")
const jwt = require("jsonwebtoken")
const userService = require("../../services/user.service")

const joi = require("joi")

const loginUserValidator = joi.object({
  identifier: joi.string().trim().lowercase().required(),
  password: joi.string().trim().required()
}).options({ abortEarly: false })


const loginUser = async (data) => {

  const validationResult = loginUserValidator.validate(data)

  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  const loginDetails = validationResult.value

  
  // Find the user either by
  // Username or Email
  const user = 
    await userService.findUserByEmail({ email: loginDetails.identifier }) ||
    await userService.findUserByUsername({ username: loginDetails.identifier })

  if(!user)
    return { status: 403, code: "USER_NOT_FOUND" }


  // Make sure it is the same password
  const samePassword = await compare(loginDetails.password, user.password)
  if(!samePassword)
    return { status: 403, code: "INVALID_PASSWORD" }


  // Sign a token for the user
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "30d" })

  return { status: 200, code: "USER_LOGGED_IN", token }

}

module.exports = loginUser
