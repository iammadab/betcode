const path = require("path")
const url = require("url")

module.exports = async (req, res) => {
	
	const { originalname, size } = req.file 

	const uploadPath = req.file.path
	
	// Remove the base folder
	const dirs = uploadPath.split(path.sep)
	dirs.shift()

	const documentLink = "/" + dirs.join("/")

	const domain = "http://localhost:3000/"
	const absoluteLink = url.resolve(domain, documentLink)

	res.json({
		status: 200,
		code: "UPLOAD_SUCCESSFULL",
		link: documentLink,
		preview: absoluteLink,
		name: originalname,
		extension: path.extname(originalname).split(".")[1],
		size
	})

}
