const userService = require("../../services/user.service")

const profile = async (req, res, next) => {

  const user = await userService.findUserById(req.body.user)

  // If the user is not found
  // delete the user cookie and 
  // redirect them to login

  req.pageData = {
    user
  }
  
  next()

}

module.exports = profile
