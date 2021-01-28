const express = require("express")
const userRouter = express.Router()

const { bodyResponder } = require("../lib/adapter")

const userController = require("../controllers/user")

userRouter.post("/", bodyResponder(userController.createUser))
userRouter.post("/login", bodyResponder(userController.loginUser))

module.exports = userRouter
