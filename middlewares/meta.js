const baseUrl = "https://bookmakr.ng"

const baseMeta = {
  title: "Bookmakr - Latest Bet Tips From Top Tipsters In Nigeria",
  description: "Get the latest bet tips from top tipsters in Nigeria and the booking codes for Bet9ja, Betking, Sportybet, 1Xbet, 22bet, Nairabet and more!",
  image: ""
}

exports.defaultMeta = (req, res, next) => {
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url
  })

  next()
}

exports.allTips = (req, res, next) => {
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url
  })

  next()
}

exports.filteredTips = (req, res, next) => {
  const url = baseUrl + req.path
  const tipster = req?.pageData?.tips?.data[0]?.tipster
  console.log(tipster)
  
  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    image: baseUrl + tipster?.image,
    title: `Latest tips from ${tipster?.name}` 
  })

  next()
}

exports.singleTip = (req, res, next) => {
  const url = baseUrl + req.path
  const tip = req.pageData.tipData.data, tipId = String(tip._id)

  const shortTipId = tipId.substr(tipId.length - 6)

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    image: baseUrl + req.pageData.tipData.data.image,
    title: `Tip #${shortTipId}`,
    description: req.pageData.tipData.data.description
  })

  next()
}
