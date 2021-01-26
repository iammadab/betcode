const express = require("express")
const userRouter = express.Router()

const { bodyResponder } = require("../lib/adapter")

const userController = require("../controllers/user")
console.log(userController)

userRouter.post("/", bodyResponder(userController.createUser))

module.exports = userRouter
