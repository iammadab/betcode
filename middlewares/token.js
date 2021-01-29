const { promisify } = require("util") 
const joi = require("joi")

const verify = promisify(require("jsonwebtoken").verify)
const userService = require("../services/user.service")

exports.validateToken = tokenName => (req, res, next) => {

    tokenName = tokenName || "token"

    const tokenValidator = joi.object({
      [tokenName]: joi.string().required()
    }).options({ abortEarly: false })

    let validationResult = tokenValidator.validate(req.body)

    if(validationResult.error)
        return res.status(400).json({ code: "BAD_REQUEST_BODY", errors: validationResult.error })

    let cookiePath = req.url.includes("admin") ? "/admin" : ""

    verifyToken()
      .then(attachUserInfo)
      .then(next)
      .catch(handleErrors)

    function verifyToken(token){
      return verify(req.body[tokenName], process.env.SECRET_KEY)
    }

    function attachUserInfo(decodedToken){
      let user = decodedToken
      req.body.user = user
    }

    function handleErrors(error){
      res.clearCookie(tokenName, { path: cookiePath })
      return res.redirect(`${cookiePath}/login`)
      if(error.name == "TokenExpiredError")
          res.status(403).json({ code: "TOKEN_EXPIRED" })
      else if(error.name == "JsonWebTokenError")
          res.status(403).json({ code: "TOKEN_INVALID" })
      else
          res.status(400).json({ code: "COULD_NOT_VALIDATE_TOKEN" })
    }

}
