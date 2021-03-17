require("dotenv").config({ path: "../.env" })
const axios = require("axios")

const TOKEN = process.env.TELEGRAM_TOKEN

const baseUrl = `https://api.telegram.org/bot${TOKEN}`

// Use this to check if there are new messages
// for the bot
function checkForUpdates(lastId){
  let updateUrl = `${baseUrl}/getUpdates?timeout=100`
  
  // Only get messages after a certain message
  // Telegram remembers when you call it with an offset
  // So even if you don't pass an offset, it uses the 
  // last one it saw from you by default
  if(lastId)
    updateUrl += `&offset=${lastId}`
  
  return axios(updateUrl)
          .then(response => {
            if(response.data)
              return response.data
            else
              return console.log("Can't find data")
          })
          .catch(err => {
            console.log("Error, fetching telegram updates")
          })
}

let nextUpdateId = ""

;(async () => {
  
  while(true){
    
    console.log("...")

    const update = await checkForUpdates(nextUpdateId)
    if(update.result.length >=1 )
      nextUpdateId = Number(update.result[update.result.length - 1].update_id) + 1

    handleMessages(update)

  }

})()


async function handleMessages({ result }){
  for(message of result){
    await sendConversionRequest(message)
  }
}

async function sendConversionRequest(message){
  console.log("Sending conversion request")
}
