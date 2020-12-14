const postService = require("../../services/post.service")
const on = require("../../lib/on")

const fetchAll = async (req, res) => {
	
	const [ fetchError, posts ] = 
		await on(postService.fetchAll())

	if(fetchError)
		return res.json({
			status: 500,
			code: "COULD_NOT_FETCH_POSTS"
		})

	res.json({
		status: 200,
		code: "POSTS_FETCHED",
		data: posts
	})

}

module.exports = fetchAll
