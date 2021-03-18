const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
	tipster: { type: "ObjectId", ref: "User" },
  tweet: { type: "ObjectId" },
	description: { type: String },
	odds: { type: Number },
	image: { type: String },
  image2: { type: String },
  image3: { type: String },
  image4: { type: String },
	bookmakers: { type: Object, default: {} },
  comments: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now }
})

const postModel = mongoose.model("Post", postSchema)

module.exports = postModel
