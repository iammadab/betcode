const express = require("express")
const otpRouter = express.Router()

const { bodyResponder } = require("../lib/adapter")

const otpController = require("../controllers/otp")

otpRouter.post("/", bodyResponder(otpController.createOtp))
otpRouter.post("/verify", bodyResponder(otpController.verifyOtp))

module.exports = otpRouter
