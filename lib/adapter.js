function createResponder(type){
	return function responder(fn){
		return async function(req, res){
			let response
			if(type == "req")
				response = await fn(req)
			else
				response = await fn(req[type])
			return sendResponse(res, response)
		}

		function sendResponse(res, responseData){
			if(!responseData) 
				return res.status(500).json({ code: "NO_RESPONSE", message: "Got no response from the server" })
			if(!responseData.status)
				responseData.status = 500
			if(responseData.cookie){
				let [cookieName, path] = responseData.cookie[0].split(".")
				path = path ? `/${path}` : "/"
				res.cookie(cookieName, responseData[cookieName], { path })
			}
			return res.status(responseData.status).json(responseData)
		}
	}
}

module.exports = {
	bodyResponder: createResponder("body"),
	paramResponder: createResponder("params"),
  queryResponder: createResponder("query"),
	reqResponder: createResponder("req")
}
