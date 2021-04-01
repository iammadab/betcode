const express = require("express")
const userRouter = express.Router()

const { bodyResponder, paramResponder } = require("../lib/adapter")
const tokenMiddleware = require("../middlewares/token")

const userController = require("../controllers/user")

userRouter.post("/", bodyResponder(userController.createUser))
userRouter.post("/login", bodyResponder(userController.loginUser))
userRouter.post(
  "/update", 
  tokenMiddleware.validateToken(),
  bodyResponder(userController.updateUser)
)
userRouter.get("/tipsters", bodyResponder(userController.verifiedTipsters))

userRouter.get("/exists/phone/:value", paramResponder(userController.uniqueUser("phone")))
userRouter.get("/exists/username/:value", paramResponder(userController.uniqueUser("username")))
userRouter.get("/exists/email/:value", paramResponder(userController.uniqueUser("email")))

userRouter.post(
  "/password", 
  bodyResponder(userController.changePassword)
)

module.exports = userRouter
