const Post = require("../models/post")
const tipsterService = require("../services/tipster.service")
const moment = require("moment")

exports.createPost = async (data) => {

	try{

		const newPost = new Post(data)

		return newPost.save()

	} catch(error){
		throw error
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

		throw error

	}

}

exports.fetchBy = async ( field, value, id ) => {

	try{
		return Post.find({ [field]: id }).populate("tipster").sort({ createdAt: -1 })
	} catch(error){
		throw error
	}

}

exports.fetchByTipsterId = async (id) => {
  
  try{
    return Post.find({ tipster: id }).populate("tipster").sort({ createdAt: -1 })
  } catch(error){
    throw error
  }

}

// Handle casting errors
// Preferably at root
exports.fetchById = async id => {

	try{
	  const post = await Post.findOne({ _id: id }).populate("tipster")
    return exports.normalizeTip(post)
	} catch(error){
		throw error
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
