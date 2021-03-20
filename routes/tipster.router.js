const express = require("express")
const tipsterRouter = express.Router()
const makeTwitterTipster = require("../apps/twitter-tipster")

const tipsterController = require("../controllers/tipster")
const toApi = require("../lib/toApi")

tipsterRouter.post("/", tipsterController.createTipster)
tipsterRouter.get("/", toApi(tipsterController.fetchAll))

tipsterRouter.post("/twitter", (req, res) => {

  if(!req.body.username)
    return res.status(400).json({
      code: "BAD_REQUEST_ERROR",
      message: "Twitter user name needed" 
    })

  const username = req.body.username

  makeTwitterTipster(
    username, 
    () => {
      res.status(200).json({
        status: 200,
        code: "TIPSTER_CREATED"
      })
    },
    () => {
      res.status(500).json({
        status: 500,
        code: "FAILED_TO_CREATE_TIPSTER"
      })
    }
  )

})

module.exports = tipsterRouter
