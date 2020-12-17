const express = require("express")
const router = express.Router()

const postController = require("../controllers/post")
const tipsterController = require("../controllers/tipster")

const createUploader = require("../lib/createUploader")
const handleUpload = require("../lib/handleUpload")

const { createValidator } = require("lazy-validator")

router.post("/post", postController.createPost)
router.get("/post", postController.fetchAll)
router.get("/post/:postId", postController.fetchOne)
router.get("/post/filter/:value", postController.fetchBy("tipster"))

router.post("/tipster", tipsterController.createTipster)
router.get("/tipster", tipsterController.fetchAll)

const upload = createUploader({ folder: "uploads" })
router.post("/upload", upload.single("file"), handleUpload)  

module.exports = router
