const tipsterService = require("../../services/tipster.service")
const on = require("../../lib/on")

const fetchAll = async (req, res) => {
	
	const [ fetchError, tipsters ] = await on(tipsterService.fetchAll())

	if(fetchError)
		return res.json({
			status: 500,
			code: "COULD_NOT_FETCH_TIPSTERS"
		})

	return res.json({
		status: 200,
		code: "FETCHED_TIPSTERS",
		data: tipsters
	})

}

module.exports = fetchAll
