const { hash } = require("../../lib/crypt")

const joi = require("joi")

const createUserValidator = joi.object({
  fullname: joi.string().trim().lowercase().required(),
  username: joi.string().trim().lowercase().required(),
  email: joi.string().trim().email().lowercase().required(),
  phoneCode: joi.string().trim().required(),
  phone: joi.string().trim().regex(/^[0-9]+$/),
  password: joi.string().trim().required(),
  bio: joi.string().trim().required(),
  picture: joi.string().trim().uri().required(),
  twitter: joi.string().trim(),
  telegram: joi.string().trim()
}).options({ abortEarly: false })

const createUser = async (data) => {
  
  const { error, value } = createUserValidator.validate(data)
  
  if(error)
    return { status: 400, code: "BAD_REQUEST_ERROR" }

  // Phone is unique
  // Email is unique
  // Username is unique
  // Hash password
  // Create the user
  // Login the user
  // Potentially attach cookies
  // Respond

  return "Nice"

}

module.exports = createUser
