const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

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
app.get("/post", (req, res) => res.render("post"))

app.use("/api", apiRouter)

mongoose.connect("mongodb://localhost/bookmakr", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => { console.log("Connected to db") })
	.catch(err => {
		console.log(err)
		console.log("Error connecting to db")
	})

app.listen(3000, () => {
	console.log("Application listening at port 3000")
})
