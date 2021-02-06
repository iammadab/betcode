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


exports.fetchAll = async (lastId, limit = 20) => {
	
	try{

    const query = lastId ? { _id: { $lt: lastId } } : {}
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

	try{
	  return Post.findOne({ _id: id }).populate("tipster")
	} catch(error){
    console.log(error)
    return { error: true, code: "ERROR_FETCHING_BY_ID" }
	}

}

exports.normalizeTips = tips => {
  return tips.map(exports.normalizeTip)
}

exports.normalizeTip = tip => {
  const tipObj = Object.assign({}, tip._doc)
  tipObj.tipDate = moment(tipObj.createdAt).fromNow()
  return tipObj
}
