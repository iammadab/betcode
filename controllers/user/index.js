const createUser = require("./user.create")
const loginUser = require("./user.login")
const updateUser = require("./user.update")
const verifiedTipsters = require("./user.verifiedTipsters")

module.exports = {
  createUser,
  loginUser,
  updateUser,
  verifiedTipsters
}
