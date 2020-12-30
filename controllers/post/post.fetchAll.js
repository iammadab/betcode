const postService = require("../../services/post.service")
const on = require("../../lib/on")

const fetchAll = async (req, res) => {
	
	const [ fetchError, posts ] = 
		await on(postService.fetchAll())

	if(fetchError)
		return {
			status: 500,
			code: "COULD_NOT_FETCH_POSTS"
		}

	return {
		status: 200,
		code: "POST_FETCHED",
		data: posts
	}

}

module.exports = fetchAll
