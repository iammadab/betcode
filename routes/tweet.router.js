const express = require("express")
const tweetRouter = express.Router()

const { paramResponder, bodyResponder } = require("../lib/adapter")

const tweetController = require("../controllers/tweet")

tweetRouter.get(
  "/status/:status", 
  paramResponder(tweetController.fetchByStatus)
)

tweetRouter.post(
  "/classify/nottip",
  bodyResponder(tweetController.classify("nottip"))
)

tweetRouter.post(
  "/classify/tip", 
  bodyResponder(tweetController.classify("tip"))
)

module.exports = tweetRouter
