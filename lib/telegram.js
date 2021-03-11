const axios = require("axios")

const baseUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}` 

function sendMessage(chatId, message){

  const sendUrl = `${baseUrl}/sendMessage?chat_id=${chatId}&text=${message}`
  console.log(sendUrl)

  return axios.get(sendUrl).then(console.log).catch(console.log)
   
}

module.exports = { sendMessage }
