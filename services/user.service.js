const User = require("../models/user")

exports.createUser = async (data) => {

  try{

    const newUser = new User(data)
    return newUser.save()

  } catch(error){

    return { error: true, code: "ERROR_CREATING_USER" }

  }

}

exports.updateUser = async (identifier, updates) => {
  
  try {

    return User.updateOne(identifier, updates)
  
  } catch(error){

    return { error: true, code: "ERROR_UPDATING_USER" }

  }

}

exports.findUserById = async ({ id }) => {
  
  try {
  
    return User.findOne({ _id: id })
  
  } catch(error){

    return { error: true, code: "ERROR_FINDING_BY_ID" }

  }

}

exports.findUserByPhone = async ({ phoneCode, phone }) => {
  
  try {
  
    return User.findOne({ phoneCode, phone })
  
  } catch(error){

    return { error: true, code: "ERROR_FINDING_BY_PHONE" }

  }

}

exports.findUserByEmail = async ({ email }) => {
  
  try {

    return User.findOne({ email })

  } catch(error){

    return { error: true, code: "ERROR_FINDING_BY_EMAIL" }

  }

}

exports.findUserByUsername = async ({ username }) => {
  
  try {

    return User.findOne({ username })

  } catch(error){
    
    return { error: true, code: "ERROR_FINDING_BY_USERNAME" }

  }

}

exports.fetchAllVerifiedTipsters = async () => {
  
  try {
      
    return User.find({ verifiedTipster: true })

  } catch (error){

    return { error: true, code: "ERROR_FETCHING_VERIFIED_TIPSTERS" }

  }

}

exports.normalizeUsers = users => {
  return users.map(exports.normalizeUser)
}

exports.normalizeUser = user => {
 const userObj = Object.assign({}, user._doc)
 if(!userObj.picture)
  userObj.picture = "/image/logo/user.png"
 return userObj
}
