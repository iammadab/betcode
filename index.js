require("dotenv").config()
const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const { connectToDb } = require("./runners/database_runner")

connectToDb()

const toPage = require("./lib/toPage") 
const postController = require("./controllers/post")
const tipsterController = require("./controllers/tipster")
const tipMiddleware = require("./middlewares/tips")
const metaMiddleware = require("./middlewares/meta")

const app = express()

app.use(bodyParser.json())

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "uploads")))

// routes
const apiRouter = require("./routes")

app.get(
	"/", 
	toPage(postController.fetchAll, "tips"),
	toPage(tipsterController.fetchAll, "tipsters"),
	tipMiddleware.normalizeTips,
  metaMiddleware.allTips,
	(req, res) => {
		res.render("index", { ...req.pageData, banner: "Nice" })
	}
)


app.get(
	"/tipster/:value", 
	toPage(postController.fetchBy("tipster"), "tips", "params"),
	toPage(tipsterController.fetchAll, "tipsters"),
	tipMiddleware.normalizeTips,
  metaMiddleware.filteredTips,
	(req, res) => {
		res.render("index", { ...req.pageData, banner: "Nice", tipDate: "long" })
	}
)

app.get(
	"/tip/:postId", 
	toPage(postController.fetchOne, "tipData", "params"),
	tipMiddleware.normalizeTip,
  metaMiddleware.singleTip,
	(req, res) => res.render("tip", { ... req.pageData })
)

app.get(
  "/admin/post", 
  (req, res, next) => { req.pageData = {}; next() },
  metaMiddleware.defaultMeta,
  (req, res) => res.render("post", { ...req.pageData })
)

app.get(
  "/admin/tipster", 
  (req, res, next) => { req.pageData = {}; next() },
  metaMiddleware.defaultMeta,
  (req, res) => res.render("add", { ...req.pageData })
)

app.use("/api", apiRouter)

app.listen(3000, () => {
	console.log("Application listening at port 3000")
})
