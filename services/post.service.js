const Post = require("../models/post")

exports.createPost = async ({ tipster, odds, image, bookmakers }) => {

	try{

		const newPost = new Post({
			tipster,
			odds,
			image,
			bookmakers
		})

		return newPost.save()

	} catch(error){
		throw error
	}

}


exports.fetchAll = async () => {
	
	try{
		return Post.find({})
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
		return Post.find({ _id: id })
	} catch(error){
		throw error
	}

}
