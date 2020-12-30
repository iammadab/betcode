const toApi = (controller, data) => async (req, res) => {

	if(data)
		req.body = Object.assign({}, req.body, req[data])

	res.json(await controller(req, res))

}

module.exports = toApi
