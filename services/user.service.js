const User = require("../models/user")

exports.createUser = async (data) => {

  try{

    const newUser = new User(data)
    return newUser.save()

  } catch(error){

    throw error

  }

}
