const Tweet = require("../models/tweet")

exports.fetchByStatus = async (status) => {

  try{

    const tweets = await Tweet.find({ type: status })
    return tweets

  } catch(error){

    console.log(error)
    return { error: true, code: "ERROR_FETCHING_TWEETS" }

  }

}
