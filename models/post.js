const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
	tipster: { type: "ObjectId", ref: "Tipster" },
	description: { type: String },
	odds: { type: Number },
	image: { type: String },
	bookmakers: { type: Object, default: {} },
	createdAt: { type: Date, default: Date.now }
})

const postModel = mongoose.model("Post", postSchema)

module.exports = postModel
