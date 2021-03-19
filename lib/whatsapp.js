const axios = require("axios")

function sendMessage({ phone, message }){
  
  const data = {
    to: phone,
    from: "Bookmakr",
    sms: message,
    type: "plain",
    channel: "whatsapp",
    api_key: process.env.SMS_KEY
  }

  const requestOptions = {
    headers: { "Content-Type": "application/json", "Accept": "application/json" }
  }

  return axios.post("https://termii.com/api/sms/send", data, requestOptions)

}

module.exports = sendMessage
