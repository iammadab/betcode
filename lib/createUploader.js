const multer = require("multer")
const path = require("path")

const createUploader = ({ folder }) => {

	// validate that the file passed is an image
	// this could potentially be used to upload any file
	
	// figure out how to handle errors

	const multerStorage = multer.diskStorage({

		destination: (req, file, cb) => {

			cb(null, folder)

		},

		filename: (req, file, cb) => {
			
			// The filename is generated based on the asset name
			// and the current timestamp
			// the filepath ends up in req.file.path

			const extension = path.extname(file.originalname)
			const timestamp = ((new Date()).toISOString()).replace(/:/g, ".")

			const filename = `${timestamp}${extension}`

			cb(null, filename)

		}

	})

	const uploader = multer({
		
		storage: multerStorage

	})

	return uploader

}

module.exports = createUploader
