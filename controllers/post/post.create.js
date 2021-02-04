const postService = require("../../services/post.service")
const userService = require("../../services/user.service")
const on = require("../../lib/on")
const { createValidator } = require("lazy-validator")

const createPostValidator 
	= createValidator("tipster.string.lowercase, description.string, odds.number, image.string, bookmakers.object")

const createPost = async (req, res) => {

	const validationResult = createPostValidator.parse(req.body)

	if(validationResult.error)
		return res.json({
			status: 400,
			code: "BAD_REQUEST_ERROR",
			errors: validationResult.errors
		})

  const safe = validationResult.data

  const user = await userService.findUserById({ id: safe.tipster })
  if(!user)
    return res.json({
      status: 403,
      code: "USER_NOT_FOUND"
    })

  if(req.body.image2)
    safe.image2 = req.body.image2

  if(req.body.image3)
    safe.image3 = req.body.image3

  if(req.body.image4)
    safe.image4 = req.body.image4

	const [ createError, post ] = await on(postService.createPost(safe))

	if(createError)
		return res.json({
			status: 500,
			code: "COULD_NOT_CREATE_POST"
		})

  user.tips += 1
  user.save()

	res.json({
		status: 200,
		code: "POST_CREATED",
		data: post
	})

}

module.exports = createPost
