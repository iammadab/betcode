const Post = require("../models/post")

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
		return Post.find({}).populate("tipster")
	} catch(error){
		throw error
	}

}

exports.fetchBy = async ( field, value ) => {

	try{
		return Post.find({ [field]: value })
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
