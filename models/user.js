const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  phoneCode: { type: String, required: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  bio: { type: String, required: true },
  picture: { type: String, required: true },
  twitter: { type: String },
  telegram: { type: String }
})

const userModel = mongoose.model("User", userSchema)

module.exports = userModel
