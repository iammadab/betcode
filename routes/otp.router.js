const express = require("express")
const otpRouter = express.Router()

const tokenMiddleware = require("../middlewares/token")
const findUserMiddleware = require("../middlewares/findUser")

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
  bodyResponder(otpController.verifyOtp())
)

otpRouter.post(
  "/forgot",
  findUserMiddleware.findUser,
  bodyResponder(otpController.createOtp)
)

otpRouter.post(
  "/forgot/verify",
  findUserMiddleware.findUser,
  bodyResponder(otpController.verifyOtp("forgot"))
)

module.exports = otpRouter
