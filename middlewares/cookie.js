// If the desired cookie is found,
// redirect the user to a specified page
exports.cookieFound = (redirectUrl, param) => {
  return (req, res, next) => {

    const prop = param ? param : "token"

    if(req.cookies && req.cookies[prop])
      res.redirect(redirectUrl)

    else
      next()

  }
}


// If the desired cookie is not found
// redirect the user to the specified page
exports.cookieNotFound = (redirectUrl, param) => {
  return (req, res, next) => {
      
    const prop = param ? param : "token"

    if(!req.cookies || !req.cookies[prop])
      res.redirect(redirectUrl)

    else{
      req.body[prop] = req.cookies[prop]
      next()
    }

  }
}
