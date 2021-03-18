const express = require("express")
const postRouter = express.Router()

const { queryResponder } = require("../lib/adapter")
const toApi = require("../lib/toApi")

const postController = require("../controllers/post")

postRouter.post("/", postController.createPost)
postRouter.get("/", queryResponder(postController.fetchAll))
postRouter.get("/post/:postId", toApi(postController.fetchOne, "params"))
postRouter.get("/post/filter/:value", postController.fetchBy("tipster"))

module.exports = postRouter
