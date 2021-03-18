require("dotenv").config()
const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const { connectToDb } = require("./runners/database_runner")

connectToDb()

const postController = require("./controllers/post")
const tipsterController = require("./controllers/tipster")
const tipMiddleware = require("./middlewares/tips")
const metaMiddleware = require("./middlewares/meta")
const cookieMiddleware = require("./middlewares/cookie")
const tokenMiddleware = require("./middlewares/token")
const pageMiddleware = require("./middlewares/pages")
const stageRouter = require("./middlewares/stageRouter")

const app = express()

app.use(morgan("tiny"))
app.use(cookieParser())
app.use(bodyParser.json())

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "uploads")))

// routes
const apiRouter = require("./routes")

app.get(
	"/", 
  cookieMiddleware.maybeCookie("/home"),
  tokenMiddleware.validateToken(),
  stageRouter(),
  pageMiddleware.home,
  metaMiddleware.allTips,
	(req, res) => {
		res.render("index", { ...req.pageData })
	}
)

app.get(
  "/home", 
  cookieMiddleware.cookieNotFound("/login"),
  tokenMiddleware.validateToken(),
  stageRouter(),
  pageMiddleware.home,
  metaMiddleware.home,
  (req, res) => {
    //console.log(req.pageData)
    console.log("Page starting")
    res.render("home", { ...req.pageData })
  }
)



app.get(
  "/convert", 
  cookieMiddleware.maybeCookie(),
  tokenMiddleware.validateToken(),
  stageRouter(),
  pageMiddleware.home,
  metaMiddleware.convert,
  (req, res) => {
    res.render("convert", { ...req.pageData })
  }
)

app.get(
  "/alert", 
  cookieMiddleware.cookieNotFound("/login"),
  tokenMiddleware.validateToken(),
  stageRouter(),
  pageMiddleware.notification,
  metaMiddleware.alert,
  (req, res) => {
    res.render("alert", { ...req.pageData })
  }
)

app.get(
  "/code", 
  cookieMiddleware.maybeCookie(),
  tokenMiddleware.validateToken(),
  stageRouter(),
  pageMiddleware.home,
  metaMiddleware.allTips,
  (req, res) => {
    res.render("code", { ...req.pageData })
  }
)


app.get(
  "/topup", 
  cookieMiddleware.maybeCookie(),
  tokenMiddleware.validateToken(),
  stageRouter(),
  pageMiddleware.home,
  metaMiddleware.topup,
  (req, res) => {
    res.render("topup", { ...req.pageData })
  }
)

app.get(
	"/tip/:postId", 
  cookieMiddleware.maybeCookie(),
  tokenMiddleware.validateToken(),
  stageRouter(),
  pageMiddleware.tip,
  metaMiddleware.singleTip,
	(req, res) => res.render("tip", { ... req.pageData })
)


app.get(
  "/login", 
  cookieMiddleware.cookieFound("/home"),
  metaMiddleware.login,
  (req, res) => res.render("login", { ...req.pageData })
)

app.get(
  "/forgot", 
  cookieMiddleware.cookieFound("/home"),
  metaMiddleware.forgot,
  (req, res) => res.render("forgot", { ...req.pageData })
)

app.get(
  "/verify", 
  cookieMiddleware.cookieNotFound("/login"),
  tokenMiddleware.validateToken(),
  stageRouter("unverified"),
  pageMiddleware.verifyNumber,
  metaMiddleware.verify,
  (req, res) => res.render("verify", { ...req.pageData })
)

app.get(
  "/register", 
  cookieMiddleware.cookieFound("/"),
  metaMiddleware.register,
  (req, res) => res.render("register", { ...req.pageData })
)

app.get(
  "/edit", 
  cookieMiddleware.cookieNotFound("/login"),
  tokenMiddleware.validateToken(),
  stageRouter(),
  metaMiddleware.edit,
  (req, res) => res.render("edit", { ...req.pageData })
)

app.get(
  "/welcome", 
  cookieMiddleware.cookieNotFound("/login"),
  tokenMiddleware.validateToken(),
  metaMiddleware.welcome,
  (req, res) => res.render("welcome", { ...req.pageData })
)

app.get(
  "/profile/:username", 
  cookieMiddleware.maybeCookie(),
  tokenMiddleware.validateToken(),
  stageRouter(),
  pageMiddleware.profile,
  metaMiddleware.profile,
  (req, res) => res.render("profile", { ...req.pageData })
)

app.get(
  "/tipsters", 
  cookieMiddleware.maybeCookie(),
  tokenMiddleware.validateToken(),
  stageRouter(),
  pageMiddleware.tipsters,
  metaMiddleware.tipsters,
  (req, res) => res.render("tipsters", { ...req.pageData })
)

app.get(
  "/admin/post", 
  (req, res, next) => { req.pageData = {}; next() },
  metaMiddleware.defaultMeta,
  (req, res) => res.render("post", { ...req.pageData })
)

app.get(
  "/admin/tweet", 
  (req, res, next) => { req.pageData = {}; next() },
  metaMiddleware.defaultMeta,
  (req, res) => res.render("tweet", { ...req.pageData })
)

app.get(
  "/admin/convert/:conversionId",
  (req, res, next) => { req.pageData = {}; next() },
  pageMiddleware.convert,
  metaMiddleware.defaultMeta,
  (req, res) => res.render("post", { ...req.pageData })
)


app.use("/api", apiRouter)

const PORT = process.env.PORT || 3000 
app.listen(PORT, () => {
	console.log(`Application listening at port ${PORT}`)
})
