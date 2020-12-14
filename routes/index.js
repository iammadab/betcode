const express = require("express")
const router = express.Router()

const postController = require("../controllers/post")

const { createValidator } = require("lazy-validator")

// Four routes
// 1. Create a new post
// 2. Fetch all the posts
// 3. Fetch all the posts with name filter
// 4. Fetch a single post

// Create a new post
router.post("/post", postController.createPost)
router.get("/post", postController.fetchAll)

module.exports = router
