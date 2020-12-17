const mongoose = require("mongoose")

const tipsterSchema = new mongoose.Schema({
	name: { type: String },
	image: { type: String }
})

const tipsterModel = mongoose.model("Tipster", tipsterSchema)

module.exports = tipsterModel
