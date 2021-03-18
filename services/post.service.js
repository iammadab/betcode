const Post = require("../models/post")
const tipsterService = require("../services/tipster.service")
const moment = require("moment")

exports.createPost = async (data) => {

	try{

		const newPost = new Post(data)

		return newPost.save()

	} catch(error){

    console.log(error)
    return { error: true, code: "ERROR_CREATING_POST" }

	}

}


exports.fetchAll = async ({ lastId, limit = 20, tipster, bookmaker, minOdds = 0, maxOdds }) => {
	
	try{

    // Build up the individual queries
    const paginationQuery = lastId ? { _id: { $lt: lastId } } : {}
    const tipsterQuery = tipster ? { tipster } : {}

    // Find posts that have a value for this bookmaker
    const bookmakerQuery = 
       bookmaker ?
        { [`bookmakers.${bookmaker}`] : { $in: [ /\S/ ] } } :
          {}

    // Systematically build the odds query
    // Made up of min and max or any one
    const minOddsQuery = minOdds ? { $gte: minOdds } : {}
    const maxOddsQuery = maxOdds ? { $lte: maxOdds } : {}
    const oddsQuery = minOdds || maxOdds ? { odds: { ...minOddsQuery, ...maxOddsQuery } } : {}
    

    // Combine the individal queries into on big query
    const query = {
      ...paginationQuery,
      ...tipsterQuery,
      ...bookmakerQuery,
      ...oddsQuery
    }
    console.log(query)

		const posts = await Post.find(query)
            .limit(limit)
            .populate("tipster")
            .sort({ createdAt: -1 })

    return exports.normalizeTips(posts)

	} catch(error){

    console.log(error)
    return { error: true, code: "ERROR_FETCHING_ALL_POSTS" }

	}

}

exports.fetchBy = async ( field, value, id ) => {

	try{
		return Post.find({ [field]: id }).populate("tipster").sort({ createdAt: -1 })
	} catch(error){
    console.log(error)
    return { error: true, code: "ERROR_FETCHING_POST_BY" }
	}

}

exports.fetchByTipsterId = async (id) => {
  
  try{
    return Post.find({ tipster: id }).populate("tipster").sort({ createdAt: -1 })
  } catch(error){
    console.log(error)
    return { error: true, code: "ERROR_FETCHING_BY_TIPSTER_ID" }
  }

}

// Handle casting errors
// Preferably at root
exports.fetchById = async id => {
	  return Post.findOne({ _id: id })
               .populate("tipster")
               .catch(err => { 
                 console.log(err)
                 return { error: true, code: "ERROR_FETCHING_BY_ID" }
               })
}

exports.normalizeTips = tips => {
  return tips.map(exports.normalizeTip)
}

const bookmakers = require("../lib/bookmakers")
exports.normalizeTip = tip => {
  const tipObj = Object.assign({}, tip._doc)
  tipObj.tipDate = moment(tipObj.createdAt).fromNow()
  for(bookmaker of Object.keys(tip.bookmakers)){
    if(tip.bookmakers[bookmaker]){
      tipObj.originalBookmaker = bookmakers[bookmaker.toLowerCase()]
      break
    }
  }
  return tipObj
}
