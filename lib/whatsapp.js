const axios = require("axios")

function sendMessage({ phone, message }){
  
  phone = normalizePhone(phone)

  if(phone.error)
    return console.log("Phone error")

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
              .then(response => {
                  if(response.data.code == "ok")
                    return console.log("Whatsapp message sent")
                  else
                    return console.log(response)
              })

}

module.exports = sendMessage

function normalizePhone(phone){

  phone = Number(phone)

  if(isNaN(phone))
    return { error: true }

  return "234" + phone

}
