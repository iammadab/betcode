const notificationService = require("../../services/notification.service")

const notification = async (req, res, next) => {

  let notifications = await notificationService.getUserNotifications(req.body.user._id)
  notifications = notificationService.normalizeNotifications(notifications)

  req.pageData = Object.assign({}, req.pageData, {
    notifications
  })

  next()

}

module.exports = notification
