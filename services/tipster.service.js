const Tipster = require("../models/tipster")

exports.createTipster = async ({ name, image }) => {

	try{
		
		const newTipster = new Tipster({
			name,
			image
		})

		return newTipster.save()

	} catch(error){

		throw error

	}
	
}

exports.fetchAll = async () => {

	return Tipster.find()

}

exports.fetchTipsterIdFromName = async (name) => {
	
	return Tipster.findOne({ name }) 
		
}
