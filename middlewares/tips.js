const moment = require("moment")

exports.normalizeTips = (req, res, next) => {
	
	if(!req.pageData.tips)
		next()

	req.pageData.tips.data.forEach(tip => {
		tip.tipDate = moment(tip.createdAt).fromNow()
	})

	next()

}

exports.normalizeTip = (req, res, next) => {

  if(!req.pageData.tipData)
    next()

  const tip = req.pageData.tipData.data

  tip.tipDate = moment(tip.createdAt).fromNow()

  next()

}
