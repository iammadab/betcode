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
	(req, res) => {
		res.render("index", { ...req.pageData, banner: "Nice" })
	}
)


app.get(
	"/tipster/:value", 
	toPage(postController.fetchBy("tipster"), "tips", "params"),
	toPage(tipsterController.fetchAll, "tipsters"),
	tipMiddleware.normalizeTips,
	(req, res) => {
		res.render("index", { ...req.pageData, banner: "Nice", tipDate: "long" })
	}
)

app.get(
	"/tip/:postId", 
	toPage(postController.fetchOne, "tipData", "params"),
	tipMiddleware.normalizeTip,
	(req, res) => res.render("tip", { ... req.pageData })
)

app.get("/admin/post", (req, res) => res.render("post"))
app.get("/admin/tipster", (req, res) => res.render("add"))

app.use("/api", apiRouter)

app.listen(3000, () => {
	console.log("Application listening at port 3000")
})
