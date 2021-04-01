const userService = require("../services/user.service")

const joi = require("joi")

const findUserValidator = joi.object({
  identifier: joi.string().trim().lowercase().required()
}).options({ abortEarly : false }).unknown(true)

exports.findUser = async (req, res, next) => {

  const validationResult = findUserValidator.validate(req.body) 

  if(validationResult.error)
    return res.status(400).json({
      status: 400, 
      code: "BAD_REQUEST_ERROR", 
      errors: validationResult.error 
    })

  const { identifier } = validationResult.value

  const user = 
    await userService.findUserByEmail({ email: identifier }) ||
    await userService.findUserByUsername({ username: identifier })

  if(!user)
    return res.status(403).json({
      status: 403,
      code: "USER_NOT_FOUND" 
    })

  req.body = Object.assign({}, req.body, {
    user
  })

  next()

}
