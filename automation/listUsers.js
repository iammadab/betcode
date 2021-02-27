const userModel = require("../models/user")
const fs = require("fs")

;(async function run(){
    
  const list = ["fullname,phone,bio"]

  const users = await userModel.find()

  users.forEach(user => {
    if(user.verifiedTipster) return
    const userString = `${user.fullname},${user.phone},${user.bio}`
    list.push(userString)
  })

  const doc = list.join("\n")

  fs.writeFile("./users.csv", doc, (err, data) => {
    if(err)
      return console.log(err)

    console.log(data)
    console.log("Written list")
  })

})
