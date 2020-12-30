const toPage = (controller, output, data) => async (req, res, next) => {
	
	if(data)
		req.body = Object.assign({}, req.body, req[data])

	req.pageData = Object.assign({}, req.pageData)

	req.pageData[output] = await controller(req, res)	

	next()

}

module.exports = toPage
