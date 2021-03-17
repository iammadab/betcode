const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
  type: { type: String, default: "conversion" },
  user: { type: "ObjectId", ref: "User", required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  data: { type: Object, default: {} } // Notification type specific data
})

const notificationModel = mongoose.model("Notification", notificationSchema)

module.exports = notificationModel
