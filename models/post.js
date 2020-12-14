const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
	tipster: { type: String },
	odds: { type: Number },
	image: { type: String },
	bookmakers: [{ name: String, code: String }],
	createdAt: { type: Date, default: Date.now }
})

const postModel = mongoose.model("Post", postSchema)

module.exports = postModel
