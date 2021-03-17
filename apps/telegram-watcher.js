require("dotenv").config({ path: "../.env" })
const conversionService = require("../services/conversion.service")
const axios = require("axios")

const { connectToDb } = require("../runners/database_runner")
connectToDb().then(run)

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

async function run(){
  
  while(true){
    
    console.log("...")

    const update = await checkForUpdates(nextUpdateId)
    if(update.result.length >=1 )
      nextUpdateId = Number(update.result[update.result.length - 1].update_id) + 1

    handleMessages(update)

  }

}


async function handleMessages({ result }){
  for(message of result){
    await sendConversionRequest(message)
  }
}

async function sendConversionRequest(message){

  const messageText = message.message.text.toLowerCase()
  const chatId = message.message.chat.id

  let reply = ""

  if(messageText != "next")
    return replyChat(chatId, "I only understand next")

  else {

    const conversionLink = await conversionService.assignConversionRequest()

    if(!conversionLink)
      return replyChat(chatId, "No conversion requests at this time")

    if(conversionLink.error)
      return replyChat(chatId, "An error occured, contact support")

    return replyChat(chatId, conversionLink)

  }

}

async function replyChat(chatId, message){
  const replyUrl = `${baseUrl}/sendMessage?chat_id=${chatId}&text=${message}`
  axios(replyUrl)
    .then(() => {
      console.log(`200 - ${chatId}`)
    })
    .catch((error) => {
      console.log(error)
      console.log("Failed to reply user")
    })
}
