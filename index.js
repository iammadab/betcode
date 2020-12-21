require("dotenv").config()
const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const { connectToDb } = require("./runners/database_runner")

connectToDb()

const app = express()

app.use(bodyParser.json())

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "uploads")))

// routes
const apiRouter = require("./routes")

app.get("/", (req, res) => {
	res.render("index")
})

app.get("/tip", (req, res) => res.render("tip"))

app.get("/admin/post", (req, res) => res.render("post"))
app.get("/admin/tipster", (req, res) => res.render("add"))

app.use("/api", apiRouter)

app.listen(3000, () => {
	console.log("Application listening at port 3000")
})
