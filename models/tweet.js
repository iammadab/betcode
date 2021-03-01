const mongoose = require("mongoose")

const tweetSchema = new mongoose.Schema({
  id: { type: String },
  link: { type: String },
  user: { type: String },
  text: { type: String },
  type: { 
    type: String, 
    default: "unclassified", 
    enum: [ "unclassified", "nottip", "tip", "post" ]
  },
  images: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Tweet", tweetSchema)
