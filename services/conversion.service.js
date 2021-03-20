const Conversion = require("../models/conversion")
const notificationService = require("../services/notification.service")
const userService = require("../services/user.service")
const walletService = require("../services/wallet.service")
const whatsapp = require("../lib/whatsapp")
const telegram = require("../lib/telegram")

exports.fetchConversionById = async (conversionId) => {
  
  try {

    const conversionObj = await Conversion.findOne({ _id: conversionId })
    return conversionObj

  } catch(error){

    console.log(error)
    return { error: true, code: "FAILED_TO_FETCH_CONVERSION" }

  }

}

exports.requestConversion = async ({ source, code, destination, subscriberId, tipId, chargeAmount }) => {

  try{

    let conversion

    // Check if someone has already requested for this
    // exact conversion
    conversion = await Conversion.findOne({
      source,
      code,
      destination,
      tipId
    })
    if(conversion){
      console.log("Found", conversion)
    }

    // If no one has requested for it, just create a new 
    // conversion request
    if(!conversion){

      conversion = new Conversion({
        source,
        code,
        destination,
        tipId,
        chargeAmount
      })
       
    }

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

    // If the conversion is no longer pending
    // Then the result of the conversion request has already been fuffiled
    // Hence just forward the result to this subscriber
    if(conversionRequest.status != "pending")
      await exports.resolveSubscriber(subscriberId, conversionRequest)

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

    const noOfPendingConversions = await Conversion.where({ status: "pending" }).countDocuments()
    const pendingStat = `Pending Conversions: ${noOfPendingConversions}`
    
    const noOfAssignedConversions = await Conversion.where({ 
      status: "pending",
      assigned: true
    }).countDocuments()
    const assignedStat = `Assigned from pending: ${noOfAssignedConversions}`

    const noOfLateConversions = await Conversion.where({ 
      status: "pending",
      endTime: { $lte: Date.now() }
    }).countDocuments()
    const lateStat = `Late Conversions: ${noOfLateConversions}`

    const stat = `${pendingStat}\n${assignedStat}\n${lateStat}`

    telegram.send("developers", stat)

  } catch(error){

    console.log(error)
    return { error: true, code: "FAILED_TO_GET_CONVERSION_STAT" }

  }

}

exports.assignConversionRequest = async (chatId) => {
  
  try {

    const conversionRequest = await Conversion.findOne({ status: "pending", assigned: false })
    if(!conversionRequest)
      return null

    const conversionLink = `${process.env.BASE_URL}/admin/convert/${conversionRequest._id}`

    conversionRequest.assigned = true
    conversionRequest.assignedTo = chatId
    await conversionRequest.save()

    await exports.sendStats()

    return conversionLink

  } catch(error){

    console.log(error)
    return { error: true, code: "FAILED_TO_ASSIGN_CONVERSION" }
    
  }

} 

exports.resolveConversion = async ( conversionObj, status, code ) => {

  try {

    conversionObj.status = status
    conversionObj.resolvedAt = new Date()

    if(status != "failed")
      conversionObj.destinationCode = code

    // Should save here
    return conversionObj.save()

  } catch(error){

    console.log(error)
    return { error: true, code: "FAILED_TO_RESOLVE_CONVERSION" }

  }

}

const bookmakers = require("../lib/bookmakers")
exports.resolveSubscriber = async ( subscriberId, conversionObj ) => {

  const { code, source, destination } = conversionObj

  const userObj = await userService.findUserById({ id: subscriberId })

  if(!userObj)
    return

  if(userObj.error)
    return
  
  const link = `${process.env.BASE_URL}/tip/${conversionObj.tipId}`

  const notificationObj = await notificationService.createNotification({
    user: subscriberId,
    message: `Convert ${code} from ${capitalize(bookmakers[source])} to ${capitalize(bookmakers[destination])}`,
    data: {
      status: conversionObj.status,
      type: "automatic",
      tipId: conversionObj.tipId
    }
  })

  whatsapp.sendMessage({
    phone: userObj.phone,
    message: link
  })

  // If the conversion failed,
  // refund; the user
  // Think we should also track the conversion amount in the conversion obj
  if(conversionObj.status == "failed")
    await walletService.refundTransaction(subscriberId, conversionObj.chargeAmount)

}

function capitalize(word){
  return String(word).charAt(0).toUpperCase() + String(word).slice(1)
}
