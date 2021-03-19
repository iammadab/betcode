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

exports.getUserNotifications = async (userId) => {

  try {
  
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 })
    return notifications


  } catch(error){

    console.log(error)
    return { error: true, code: "FAILED_TO_GET_USER_NOTIFICATIONS" }

  }

}

exports.normalizeNotifications = notifications => {
  return notifications.map(exports.normalizeNotification)
}

exports.normalizeNotification = notification => {
  const notificationObj = Object.assign({}, notification._doc)
  notificationObj.date = moment(notificationObj.createdAt).fromNow()
  return notificationObj
}
