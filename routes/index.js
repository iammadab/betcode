const express = require("express")
const router = express.Router()

const { bodyResponder, queryResponder } = require("../lib/adapter")

const postController = require("../controllers/post")
const tipsterController = require("../controllers/tipster")
const userController = require("../controllers/user")

const userRouter = require("./user.router")
const commentRouter = require("./comment.router")
console.log(userRouter, commentRouter)

const createUploader = require("../lib/createUploader")
const handleUpload = require("../lib/handleUpload")
const toApi = require("../lib/toApi")

router.use("/user", userRouter)
router.use("/comment", commentRouter)

router.post("/post", postController.createPost)

router.get("/post", queryResponder(postController.fetchAll))

router.get(
	"/post/:postId", 
	toApi(postController.fetchOne, "params")
)

router.get(
	"/post/filter/:value", 
	postController.fetchBy("tipster")
)

router.post("/tipster", tipsterController.createTipster)

router.get("/tipster", toApi(tipsterController.fetchAll))

const upload = createUploader({ folder: "uploads" })
router.post("/upload", upload.single("file"), handleUpload)  

module.exports = router
