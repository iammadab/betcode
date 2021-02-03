const express = require("express")
const userRouter = express.Router()

const { bodyResponder } = require("../lib/adapter")
const tokenMiddleware = require("../middlewares/token")

const userController = require("../controllers/user")

userRouter.post("/", bodyResponder(userController.createUser))
userRouter.post("/login", bodyResponder(userController.loginUser))
userRouter.post(
  "/update", 
  tokenMiddleware.validateToken(),
  bodyResponder(userController.updateUser)
)

module.exports = userRouter
