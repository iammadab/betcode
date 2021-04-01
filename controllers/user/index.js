const createUser = require("./user.create")
const loginUser = require("./user.login")
const updateUser = require("./user.update")
const verifiedTipsters = require("./user.verifiedTipsters")
const uniqueUser = require("./user.unique")
const changePassword = require("./user.changePassword")

module.exports = {
  createUser,
  loginUser,
  updateUser,
  verifiedTipsters,
  uniqueUser,
  changePassword
}
