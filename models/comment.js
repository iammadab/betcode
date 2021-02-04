const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
  post: { type: "ObjectId", ref: "Post" },
  user: { type: "ObjectId", ref: "User" },
  comment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
})

const commentModel = mongoose.model("Comment", commentSchema)

module.exports = commentModel
