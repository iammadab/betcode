const express = require("express")
const webhookRouter = express.Router()

webhookRouter.post("/paystack", (req, res) => {

  console.log(req.body)

})

module.exports = webhookRouter
