const userService = require("../../services/user.service")

const verifiedTipsters = async (data) => {
  
  const tipsters = await userService.fetchAllVerifiedTipsters()

  if(!tipsters.error)
    return { status: 200, data: tipsters }

  return { status: 500, code: "ERROR_FETCHING_TIPSTERS" }

}

module.exports = verifiedTipsters
