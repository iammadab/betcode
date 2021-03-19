const conversionService = require("../../services/conversion.service")

const convert = async (req, res, next) => {
    
  const conversionRequest = await conversionService.fetchConversionById({
    _id: req.params.conversionId 
  })

  if(!conversionRequest)
    res.redirect("/")

  if(conversionRequest.error)
      res.redirect("/")

  req.pageData = Object.assign({}, req.pageData, {
    conversion: conversionRequest
  })

  next()

}

module.exports = convert
