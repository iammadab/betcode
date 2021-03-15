const express = require("express")
const conversionRouter = express.Router()

const tokenMiddleware = require("../middlewares/token")

const { bodyResponder } = require("../lib/adapter")

const conversionController = require("../controllers/conversion")

conversionRouter.post(
  "/",
  tokenMiddleware.validateToken(),
  bodyResponder(conversionController.requestConversion)
)

module.exports = conversionRouter
