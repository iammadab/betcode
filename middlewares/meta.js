const baseUrl = "https://bookmakr.ng"

const baseMeta = {
  title: "Bookmakr - Latest Tips",
  description: "Get the latest bet tips from top tipsters in Nigeria",
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
  
  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    image: baseUrl + tipster?.image,
    title: `Latest tips from ${tipster?.name}`,
    tipsterName: tipster?.name
  })

  next()
}

exports.singleTip = (req, res, next) => {
  const url = baseUrl + req.path
  const tip = req.pageData.tipData, tipId = String(tip._id)

  const shortTipId = tipId.substr(tipId.length - 6)

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    image: baseUrl + tip.image,
    title: `Tip #${shortTipId}`,
    description: tip.description
  })

  next()
}

exports.profile = (req, res, next) => {
  const url = baseUrl + req.path
  const user = req.pageData.user

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    image: user.picture,
    title: `${user.fullname} (@${user.username})`,
    description: user.bio
  })

  next()
}



exports.login = (req, res, next) => {
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    title: `Bookmakr - Login`,
  })

  next()
}

exports.register = (req, res, next) => {
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    title: `Bookmakr - Register`,
  })

  next()
}
