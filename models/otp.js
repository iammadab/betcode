const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
  phone: { type: Number, required: true },
  code: { type: Number, required: true }
})

const otpModel = mongoose.model("Otp", otpSchema)

module.exports = otpModel
