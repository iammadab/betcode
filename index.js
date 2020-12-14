const express = require("express")
const mongoose = require("mongoose")

const app = express()

app.set("view engine", "ejs")

// routes
app.get("/", (req, res) => {
	res.render("index")
})

mongoose.connect("mongodb://localhost/bookmakr", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => { console.log("Connected to db") })
	.catch(err => {
		console.log(err)
		console.log("Error connecting to db")
	})


app.listen(3000, () => {
	console.log("Application listening at port 3000")
})
