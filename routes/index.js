const express = require("express")
const router = express.Router()

const postController = require("../controllers/post")
const tipsterController = require("../controllers/tipster")

const createUploader = require("../lib/createUploader")
const handleUpload = require("../lib/handleUpload")
const toApi = require("../lib/toApi")

const { createValidator } = require("lazy-validator")

router.post("/post", postController.createPost)

router.get("/post", toApi(postController.fetchAll))

router.get(
	"/post/:postId", 
	toApi(postController.fetchOne, "params")
)

router.get(
	"/post/filter/:value", 
	toApi(postController.fetchBy("tipster"), "params")
)

router.post("/tipster", tipsterController.createTipster)

router.get("/tipster", toApi(tipsterController.fetchAll))

const upload = createUploader({ folder: "uploads" })
router.post("/upload", upload.single("file"), handleUpload)  

const postModel = require("../models/post")
router.get("/blame/:tipId", async (req, res) => {
	const { tipId } = req.params
	const post = await postModel.findOne({ _id: tipId }).populate("tipster")
	if(!post){
		console.log(tipId)
		res.json({ error: true })
		return
	}
	res.json({ tipster: post.tipster })
})

module.exports = router
