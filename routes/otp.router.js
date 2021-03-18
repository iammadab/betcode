const express = require("express")
const otpRouter = express.Router()

const tokenMiddleware = require("../middlewares/token")

const { bodyResponder } = require("../lib/adapter")

const otpController = require("../controllers/otp")

otpRouter.post(
  "/", 
  tokenMiddleware.validateToken(),
  bodyResponder(otpController.createOtp)
)

otpRouter.post(
  "/verify", 
  tokenMiddleware.validateToken(),
  bodyResponder(otpController.verifyOtp)
)

module.exports = otpRouter
