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


exports.fetchAll = async () => {
	
	try{
		return Post.find({}).populate("tipster").sort({ createdAt: -1 })
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

exports.fetchById = id => {

	try{
		return Post.findOne({ _id: id }).populate("tipster")
	} catch(error){
		throw error
	}

}

exports.normalizeTips = tips => {
  return tips.map(exports.normalizeTip)
}

exports.normalizeTip = tip => {
  tip.tipDate = moment(tip.createdAt).fromNow()
  return tip
}
