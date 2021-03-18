const joi = require("joi")
const userService = require("../../services/user.service")

const searchFunctions = {
  phone: userService.findUserByPhone,
  email: userService.findUserByEmail,
  username: userService.findUserByUsername
}

const pipelines = {
  phone: joi.string().trim().regex(/^[0-9]+$/).required(),
  username: joi.string().trim().lowercase().required(),
  email: joi.string().trim().email().lowercase().required()
}

const buildValidator = (pipeline) => {

  if(!pipeline) return null

  return joi.object({
    value: pipeline
  })

}


const uniqueUser = property => async (data) => {
  
  const validator = buildValidator(pipelines[property])
  if(!validator)
    return { status: 403, code: "INVALID_PROPERTY" }

  const validationResult = validator.validate(data)
  if(validationResult.error)
    return { status: 400, code: "BAD_REQUEST_ERROR", errors: validationResult.error }

  const userDetails = { [property]: validationResult.value.value }
  const findUser = searchFunctions[property]

  if(property == "phone")
    userDetails.phoneCode = "+234"

  const user = await findUser(userDetails)

  if(!user)
    return { status: 200, code: "USER_UNIQUE" }

  return { status: 403, code: "USER_EXISTS" }

}

module.exports = uniqueUser
