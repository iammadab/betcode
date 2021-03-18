const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  phoneCode: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  stage: { type: String, default: "unverified", enum: [ "unverified", "verified" ] },
  bio: { type: String },
  picture: { type: String },
  twitter: { type: String },
  twitterId: { type: String },
  telegram: { type: String },
  verifiedTipster: { type: Boolean, default: false },
  tips: { type: Number, default: 0 },
  wallet: { type: Number, default: 3000 }
})

const userModel = mongoose.model("User", userSchema)

module.exports = userModel
