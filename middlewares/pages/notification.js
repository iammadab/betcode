const notificationService = require("../../services/notification.service")

const notification = async (req, res, next) => {

  let notifications = await notificationService.getUserNotifications(req.body.user._id)
  notifications = notificationService.normalizeNotifications(notifications)
  console.log(notifications)

  req.pageData = Object.assign({}, req.pageData, {

  })

  next()

}

module.exports = notification
