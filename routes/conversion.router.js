const express = require("express")
const conversionRouter = express.Router()

const { bodyResponder } = require("../lib/adapter")

const conversionController = require("../controllers/conversion")

conversionRouter.post(
  "/",
  bodyResponder(conversionController.requestConversion)
)

module.exports = conversionRouter
