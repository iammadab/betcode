const express = require("express")
const tipsterRouter = express.Router()

const tipsterController = require("../controllers/tipster")
const toApi = require("../lib/toApi")

tipsterRouter.post("/", tipsterController.createTipster)
tipsterRouter.get("/", toApi(tipsterController.fetchAll))

module.exports = tipsterRouter
