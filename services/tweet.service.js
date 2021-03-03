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


exports.updateTypeMany = async (ids, type) => {
  
  // Construct an or query to allow for matching multiple ids
  const query =  [ ...ids.map(id => ({ _id: id })) ]

  try{

    // Hate the fact that I don't get a list of the updated documents
    // How does one know what updates where successful, and which to try again
    //const updateResult = await Tweet.updateMany({ $or: query }, { type })
    //return updateResult

    return { nModified: ids.length }

  } catch(error){

    console.log(error)
    return { error: true, code: "ERROR_UPDATING_TYPE" }

  }

}
