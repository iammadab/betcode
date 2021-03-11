const axios = require("axios")

const baseUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}` 

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

module.exports = { sendMessage }
