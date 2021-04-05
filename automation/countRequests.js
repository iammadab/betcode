const Conversion = require("../models/conversion")

const users = {
  "mobolaji": 615579512,
  "josh": 504376396,
  "ima": 909584941,
  "uche": 1369172349
}

const history = {
  "mobolaji":  {
    "success": [16],
    "partial": [0],
    "failed": [14]
  },
  "josh":  {
    "success": [30],
    "partial": [0],
    "failed": [2]
  },
  "ima":  {
    "success": [5],
    "partial": [12],
    "failed": [7]
  },
  "uche":  {
    "success": [7],
    "partial": [23],
    "failed": [11]
  }
}
 

const converters = [ "mobolaji", "josh", "ima", "uche" ]

converters.forEach(async converter => {
  
  const success = await count(converter, "success")
  const partial = await count(converter, "partial")
  const failed = await count(converter, "failed")

  console.log(`
    ${converter}
    ------------

    Success: ${success}
    Partial: ${partial}
    Failed: ${failed}

    `)

})

async function count(converter, status){
  const id = String(users[converter])
  const value = await Conversion.find({ assignedTo: id, status }).count()
  const previousCount = sum(history[converter][status])
  return value - previousCount
}

function sum(array){
  return array.reduce((val, acc) => val + acc, 0)
}
