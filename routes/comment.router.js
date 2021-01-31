const express = require("express")
const commentRouter = express.Router()

const tokenMiddleware = require("../middlewares/token")

const { bodyResponder } = require("../lib/adapter")

const commentController = require("../controllers/comment")

commentRouter.post(
  "/", 
  tokenMiddleware.validateToken(),
  bodyResponder(commentController.createComment)
)

module.exports =  commentRouter
