const userModel = require("../models/user")
const fs = require("fs")

;(async function run(){
    
  const list = ["fullname,phone,bio"]

  const users = await userModel.find().sort({ wallet: 1 })

  users.forEach(user => {
    if(user.verifiedTipster) return
    const userString = `${trim(user.fullname)},${trim(user.phone)},${trim(user.wallet)}`
    list.push(userString)
  })

  const doc = list.join("\n")

  fs.writeFile("./users2.csv", doc, (err, data) => {
    if(err)
      return console.log(err)

    console.log(data)
    console.log("Written list")
  })

})

function trim(string){
  return String(string).replace(/,/g, "").replace(/\n/g, "")
}
