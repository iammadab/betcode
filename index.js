require("dotenv").config()
const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const { connectToDb } = require("./runners/database_runner")

connectToDb()

const toPage = require("./lib/toPage") 
const postController = require("./controllers/post")
const tipsterController = require("./controllers/tipster")
const tipMiddleware = require("./middlewares/tips")
const metaMiddleware = require("./middlewares/meta")

const app = express()

app.use(cookieParser())
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
		res.render("index", { ...req.pageData })
	}
)


app.get(
	"/tipster/:value", 
	toPage(postController.fetchBy("tipster"), "tips", "params"),
	toPage(tipsterController.fetchAll, "tipsters"),
	tipMiddleware.normalizeTips,
  metaMiddleware.filteredTips,
	(req, res) => {
		res.render("index", { ...req.pageData })
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
  "/login", 
  (req, res, next) => { req.pageData = {}; next() },
  metaMiddleware.defaultMeta,
  (req, res) => res.render("login", { ...req.pageData })
)

app.get(
  "/register", 
  (req, res, next) => { req.pageData = {}; next() },
  metaMiddleware.defaultMeta,
  (req, res) => res.render("register", { ...req.pageData })
)

app.get(
  "/edit", 
  (req, res, next) => { req.pageData = {}; next() },
  metaMiddleware.defaultMeta,
  (req, res) => res.render("edit", { ...req.pageData })
)

app.get(
  "/profile", 
  (req, res, next) => { req.pageData = {}; next() },
  metaMiddleware.defaultMeta,
  (req, res) => res.render("profile", { ...req.pageData })
)

app.get(
  "/tipsters", 
  (req, res, next) => { req.pageData = {}; next() },
  metaMiddleware.defaultMeta,
  (req, res) => res.render("tipsters", { ...req.pageData })
)

app.get(
  "/admin/post", 
  (req, res, next) => { req.pageData = {}; next() },
  metaMiddleware.defaultMeta,
  (req, res) => res.render("post", { ...req.pageData })
)

/*app.get(
  "/admin/tipster", 
  (req, res, next) => { req.pageData = {}; next() },
  metaMiddleware.defaultMeta,
  (req, res) => res.render("add", { ...req.pageData })
)*/

app.use("/api", apiRouter)

const PORT = process.env.PORT || 3000 
app.listen(PORT, () => {
	console.log(`Application listening at port ${PORT}`)
})
