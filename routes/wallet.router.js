const express = require("express")
const walletRouter = express.Router()

const tokenMiddleware = require("../middlewares/token")

const { bodyResponder } = require("../lib/adapter")

const walletController = require("../controllers/wallet")

walletRouter.post(
  "/fund",
  tokenMiddleware.validateToken(),
  bodyResponder(walletController.fundWallet)
)

walletRouter.post(
  "/cancel",
  tokenMiddleware.validateToken(),
  bodyResponder(walletController.cancelFundWallet)
)

module.exports = walletRouter
