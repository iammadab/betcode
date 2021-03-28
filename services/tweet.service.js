const Tweet = require("../models/tweet")
const moment = require("moment")

exports.fetchByStatus = async (status) => {

  try{

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const tweets = await Tweet.find({ type: status, createdAt: { $gte: today }  })
    return exports.normalizeTweets(tweets)

  } catch(error){

    console.log(error)
    return { error: true, code: "ERROR_FETCHING_TWEETS" }

  }

}


exports.updateTypeMany = async (ids, type) => {
  
  // Construct an or query to allow for matching multiple ids
  const query =  [ ...ids.map(id => ({ _id: id })) ]

  try{

    // Hate the fact that I don't get a list of the updated documents
    // How does one know what updates where successful, and which to try again
    const updateResult = await Tweet.updateMany({ $or: query }, { type })
    return updateResult

  } catch(error){

    console.log(error)
    return { error: true, code: "ERROR_UPDATING_TYPE" }

  }

}

exports.normalizeTweets = tweets => {
  return tweets.map(exports.normalizeTweet)
}

exports.normalizeTweet = tweet => {
  const tweetObj = Object.assign({}, tweet._doc)
  tweetObj.date = moment(tweetObj.createdAt).fromNow()
  return tweetObj
}
