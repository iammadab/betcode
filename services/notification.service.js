const Notification = require("../models/notification")
const moment = require("moment")

exports.createNotification = async ({ user, message, data }) => {
  
  try{

    const notificationObj = new Notification({
        user,
        message,
        data
    })
    return notificationObj.save()

  } catch(error){

    console.log(error)
    return { error: true, code: "FAILED_TO_CREATE_NOTIFICATION" }

  }

}
