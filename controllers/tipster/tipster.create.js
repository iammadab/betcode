const tipsterService = require("../../services/tipster.service")
const on = require("../../lib/on")
const { createValidator } = require("lazy-validator")

const createTipsterValidator 
	= createValidator("name.string.lowercase, image.string")

const createTipster = async (req, res) => {
	
	const validationResult = createTipsterValidator.parse(req.body)

	if(validationResult.error)
		return res.json({
			status: 400,
			code: "BAD_REQUEST_ERROR",
			errors: validationResult.errors
		})

	const [ createError, tipster ] = await on(tipsterService.createTipster(validationResult.data))

	if(createError)
		return res.json({
			status: 500,
			code: "COULD_NOT_CREATE_TIPSTER"
		})

	res.json({
		status: 200,
		code: "TIPSTER_CREATED",
		data: tipster
	})
}

module.exports = createTipster
