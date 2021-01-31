const express = require("express")
const commentRouter = express.Router()

const { bodyResponder } = require("../lib/adapter")

const commentController = require("../controllers/comment")

commentRouter.post("/", bodyResponder(commentController.createComment))

module.exports =  commentRouter
