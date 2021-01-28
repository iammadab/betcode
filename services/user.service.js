const User = require("../models/user")

exports.createUser = async (data) => {

  try{

    const newUser = new User(data)
    return newUser.save()

  } catch(error){

    return { error: true, code: "ERROR_CREATING_USER" }

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
