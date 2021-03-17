const notification = async (req, res, next) => {

  req.pageData = Object.assign({}, req.pageData, {

  })

  next()

}

module.exports = notification
