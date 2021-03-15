const Conversion = require("../models/conversion")

exports.requestConversion = async ({ source, code, destination, subscriberId, tipId }) => {

  try{

    const conversion = new Conversion({
      source,
      code,
      destination
    })

    console.log(conversion)

    return await addSubscriber(conversion, { subscriberId, tipId })

  } catch(error){

    console.log(error)
    return { error: true, code: "FAILED_TO_REQUEST_CONVERSION" }

  }

}

async function addSubscriber(conversionRequest, { subscriberId, tipId }){
  
  try{

    console.log("Add subscriber")
    console.log(conversionRequest)

    // Check that the user is not already a subscriber
    if(conversionRequest.subscribers.indexOf(subscriberId) > -1)
      return { error: true, code: "ALREADY_SUBSCRIBED" }

    conversionRequest.subscribers.push(subscriberId)

    // If it is the first subscriber, the conversion request will
    // not have a tip id attached yet, so we add that here
    if(!conversionRequest.tipId)
      conversionRequest.tipId = tipId

    return await conversionRequest.save()

  } catch(error){

    console.log(error)
    return { error: true, code: "FAILED_TO_ADD_SUBSCRIBER" }

  }

}
