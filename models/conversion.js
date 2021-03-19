const mongoose = require("mongoose")

const MINUTES = 30

const conversionSchema = new mongoose.Schema({
  source: { type: String, required: true },
  code: { type: String, required: true },
  destination: { type: String, required: true },
  destinationCode: { type: String, default: "" },
  subscribers: { type: Array, default: [] },
  manualSubscribers: { type: Array, default: [] },
  tipId: { type: "ObjectId", ref: "Post" },
  status: { 
    type: String, 
    default: "pending",
    enum: [ "pending", "success", "partial", "failed" ]
  },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: () => { return Date.now() + MINUTES * 60000 } },
  resolvedAt: { type: Date }, 
  assignedTo: { type: String },
  assigned: { type: Boolean, default: false }
})

const conversionModel = mongoose.model("Conversion", conversionSchema)

module.exports = conversionModel
