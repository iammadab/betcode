const otpController = require("../../controllers/otp")

const verifyNumber = async (req, res, next) => {
  
  const user = req.body.user

  otpController.createOtp({ user })

  req.pageData = Object.assign({}, req.pageData, {
    user,
    hiddenNumber: numberToAsterik(user.phone)
  })

  next()

}

module.exports = verifyNumber

function numberToAsterik(number){
  const numberString = String(number)
  return numberString.slice(0, 4) + numberString.slice(2).replace(/.(?=...)/g, "*")
}
