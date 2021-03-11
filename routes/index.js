const express = require("express")
const router = express.Router()

const { bodyResponder, queryResponder } = require("../lib/adapter")
const toApi = require("../lib/toApi")

const postController = require("../controllers/post")
const tipsterController = require("../controllers/tipster")

const userRouter = require("./user.router")
const postRouter = require("./post.router")
const commentRouter = require("./comment.router")
const tipsterRouter = require("./tipster.router")
const tweetRouter = require("./tweet.router")
const otpRouter = require("./otp.router")

// Setup upload functionality
const createUploader = require("../lib/createUploader")
const upload = createUploader({ folder: "uploads" })
const handleUpload = require("../lib/handleUpload")

router.use("/user", userRouter)
router.use("/comment", commentRouter)
router.use("/post", postRouter)
router.use("/tipster", tipsterRouter)
router.use("/tweet", tweetRouter)
router.use("/otp", otpRouter)

router.post("/upload", upload.single("file"), handleUpload)  

module.exports = router
