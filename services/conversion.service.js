const Conversion = require("../models/conversion")
const notificationService = require("../services/notification.service")
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

exports.assignConversionRequest = async () => {
  
  try {

    const conversionRequest = await Conversion.findOne({ status: "pending", assigned: false })
    if(!conversionRequest)
      return null

    const conversionLink = `https://bookmakr.ng/admin/convert/${conversionRequest._id}`

    conversionRequest.assigned = true
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
    conversionObj.resolvedAt = Date.now()

    if(status != "failed")
      conversionObj.destinationCode = code

    // Should save here
    return conversionObj.save()

  } catch(error){

    console.log(error)
    return { error: true, code: "FAILED_TO_RESOLVE_CONVERSION" }

  }

}

exports.resolveSubscriber = async ( subscriberId, conversionObj ) => {

  const { code, source, destination } = conversionObj
  
  const link = `https://bookmakr.ng/tip/${conversionObj.tipId}`
  console.log(link)

  const notificationObj = await notificationService.createNotification({
    user: subscriberId,
    message: `Convert ${code} from ${source} to ${destination}`,
    data: {
      status: conversionObj.status
    }
  })
  console.log(notificationObj)

  // What if these fails??
  telegram.send("developers", link)  

}
