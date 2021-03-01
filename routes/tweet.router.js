const express = require("express")
const tweetRouter = express.Router()

const { paramResponder } = require("../lib/adapter")

const tweetController = require("../controllers/tweet")

tweetRouter.get(
  "/status/:status", 
  paramResponder(tweetController.fetchByStatus)
)

module.exports = tweetRouter
