const otpController = require("../../controllers/otp")

const verifyNumber = async (req, res, next) => {
  
  const user = req.body.user

  otpController.createOtp({ user })

  req.pageData = Object.assign({}, req.pageData, {
    user
  })

  next()

}

module.exports = verifyNumber
