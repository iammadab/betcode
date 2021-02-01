const { promisify } = require("util") 
const joi = require("joi")

const verify = promisify(require("jsonwebtoken").verify)
const userService = require("../services/user.service")

exports.validateToken = tokenName => (req, res, next) => {

    tokenName = tokenName || "token"

    const tokenValidator = joi.object({
      [tokenName]: joi.string().required()
    }).options({ abortEarly: false }).unknown(true)

    let validationResult = tokenValidator.validate(req.body)

    if(validationResult.error){
      if(req.pageData.dynamicPage)
        return handleErrors({})
      else
        return res.status(400).json({ code: "BAD_REQUEST_BODY", errors: validationResult.error })
    }

    let cookiePath = req.url.includes("admin") ? "/admin" : ""

    verifyToken()
      .then(attachUserInfo)
      .then(next)
      .catch(handleErrors)

    function verifyToken(token){
      return verify(req.body[tokenName], process.env.SECRET_KEY)
    }

    async function attachUserInfo(decodedToken){
      let user = await userService.findUserById(decodedToken)
      if(!user)
        return handleErrors({})

      req.body.user = user
      if(req.pageData)
        req.pageData.user = user
    }

    function handleErrors(error){
      
      // If you get here, it means you are not logged in properly
      // Some pages are dynamic in which
      // they don't care if the user is logged in or not
      // for these kinds of pages, we just want to update
      // the logged in status and continue on

      if(req.pageData.dynamicPage){
        req.pageData.loggedIn = false
        return next()
      }

      // For other kinds of pages,
      // actually log the user out
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
