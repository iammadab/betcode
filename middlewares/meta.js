const baseUrl = "https://bookmakr.ng"

const baseMeta = {
  title: "Bookmakr",
  description: "Get games from the top tipsters in Nigeria converted to any bookmaker of your choice.",
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
  console.log("meta start")
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url
  })

  console.log("meta eject")
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


exports.home = (req, res, next) => {
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    title: `Home`
  })

  next()
}


exports.convert = (req, res, next) => {
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    title: `Convert`
  })

  next()
}


exports.alert = (req, res, next) => {
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    title: `Alert`
  })

  next()
}


exports.topup = (req, res, next) => {
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    title: `Topup`
  })

  next()
}



exports.edit = (req, res, next) => {
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    title: `Settings`
  })

  next()
}


exports.login = (req, res, next) => {
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    title: `Login`
  })

  next()
}

exports.register = (req, res, next) => {
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    title: `Register`
  })

  next()
}


exports.forgot = (req, res, next) => {
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    title: `Forgot`
  })

  next()
}


exports.verify = (req, res, next) => {
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    title: `Verify`
  })

  next()
}

exports.tipsters = (req, res, next) => {
  const url = baseUrl + req.path

  req.pageData.meta = Object.assign({}, baseMeta, {
    url,
    title: "Tipsters"
  })

  next()
}
