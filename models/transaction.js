const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
  user: { type: "ObjectId", ref: "User", required: true },
  type: { 
    type: String, 
    required: true, 
    enum: [ "fund_wallet", "request_conversion", "refund" ]
  },
  status: {
    type: String,
    required: true,
    enum: [ "success", "pending", "failed" ]
  },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
})

const transactionModel = mongoose.model("Transaction", transactionSchema)

module.exports = transactionModel
