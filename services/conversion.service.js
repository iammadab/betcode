const Conversion = require("../models/conversion")
const telegram = require("../lib/telegram")

exports.requestConversion = async ({ source, code, destination, subscriberId, tipId }) => {

  try{

    const conversion = new Conversion({
      source,
      code,
      destination
    })

    return await addSubscriber(conversion, { subscriberId, tipId })

  } catch(error){

    console.log(error)
    return { error: true, code: "FAILED_TO_REQUEST_CONVERSION" }

  }

}

async function addSubscriber(conversionRequest, { subscriberId, tipId }){
  
  try{

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

// Fetch all the conversion a particular user
// has made for a particular tip
exports.fetchUserTipConversions = async (userId, tipId) => {
  
  try {

    const conversions = await Conversion.find({
      tipId,
      subscribers: userId
    })

    return conversions

  } catch(error){

    console.log(error)
    return { error: true, code: "FAILED_TO_FETCH_USR_TIP_CONVERSIONS" }

  }

}

exports.sendStats = async () => {
    
  try{

    const noOfPendingConversions = await Conversion.where({ status: "pending" }).count()
    const pendingStat = `Pending Conversions: ${noOfPendingConversions}`

    const noOfLateConversions = await Conversion.where({ 
      status: "pending",
      endTime: { $lte: Date.now() }
    }).count()
    const lateStat = `Late Conversions: ${noOfLateConversions}`

    const stat = `${pendingStat}\n${lateStat}`

    telegram.send("developers", stat)

  } catch(error){

    console.log(error)
    return { error: true, code: "FAILED_TO_GET_CONVERSION_STAT" }

  }

}
