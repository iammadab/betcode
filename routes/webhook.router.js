const express = require("express")
const webhookRouter = express.Router()

const Transaction = require("../models/transaction")
const walletService = require("../services/wallet.service")

webhookRouter.post("/paystack", async (req, res) => {

  console.log(req.body)

  if(!req.body.event)
    return console.log("Invalid paystack request body")

  if(req.body.event == "charge.success"){
    // Get the transaction data
    // Fetch the transaction
    // Pass the transaction to the wallet executor
    
    const data = req.body.data

    if(!data)
      return console.log("Invalid paystack request data")

    // 6054a6af6391303af5b1ecad
    const transactionId = data.reference
    console.log("Trasaction Id", transactionId)

    if(!transactionId)
      return console.log("Paystack transaction id not found")
  
    let transaction

    try{

      transaction = await Transaction.findOne({
        _id: transactionId
      })
      console.log(transaction)

    } catch(err){
      
      return console.log("Failed to find transaction")

    }

    if(!transaction)
      return

    // Check if the transaction is pending
    // If it is pending, change the status to success
    if(transaction.status == "pending"){
      transaction.status = "pre-execute"
      transaction = await transaction.save()
    }

    else{
      return console.log("Transaction is not pending")
    }

    // Execute the transaction
    const transactionExecutionResult = await walletService.executeTransaction(transaction)
    console.log(transactionExecutionResult)

    if(transactionExecutionResult.error)
      return console.log(transactionExecutionResult.code)
    else
      res.status(200).send("ok")
     
  }

})

module.exports = webhookRouter
