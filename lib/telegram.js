const axios = require("axios")

const baseUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}` 

const users = {
  "wisdom": 1020453478,
  "akin": 661486066,
  "mobolaji": 615579512,
  "josh": 504376396
}

const developers = [ "wisdom", "akin"]
const converters = [ "mobolaji", "josh" ]

const groups = {
  developers,
  converters,
  devcon: [ ...developers, ...converters ]
}

function send(group, message){

  const groupMembers = groups[group]
  if(!groupMembers)
    return

  const groupChatIds = groupMembers.map(member => users[member])

  groupChatIds.forEach(id => {
    sendMessage(id, message)
  })

}

function sendMessage(chatId, message){

  const sendUrl = `${baseUrl}/sendMessage?chat_id=${chatId}&text=${message}`

  return axios.get(sendUrl)
          .then(data => {
            if(data.status == 200)
              return console.log("Telegram message sent")
            else
              return console.log("Telegram message not sent", data)
          }).catch(console.log)
   
}

module.exports = { send }
