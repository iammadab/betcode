const userService = require("../../services/user.service")

const tipsters = async (req, res, next) => {

  const allTipsters = await userService.fetchAllVerifiedTipsters()

  req.pageData = Object.assign({}, req.pageData, {
    tipsters: allTipsters
  })

  next()

}

module.exports = tipsters
