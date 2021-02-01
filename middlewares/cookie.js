// If the desired cookie is found,
// redirect the user to a specified page
exports.cookieFound = (redirectUrl, param) => {
  return (req, res, next) => {

    req.pageData = {}

    const prop = param ? param : "token"

    if(req.cookies && req.cookies[prop])
      res.redirect(redirectUrl)

    else{
      req.pageData.loggedIn = false
      next()
    }

  }
}


// If the desired cookie is not found
// redirect the user to the specified page
exports.cookieNotFound = (redirectUrl, param) => {
  return (req, res, next) => {

    req.pageData =  {}
      
    const prop = param ? param : "token"

    if(!req.cookies || !req.cookies[prop])
      res.redirect(redirectUrl)

    else{
      req.body[prop] = req.cookies[prop]
      req.pageData.loggedIn = true
      next()
    }

  }
}


// For pages where you can either be
// logged in or not, use this to 
// determine state
exports.maybeCookie = () => {
  return (req, res, next) => {

    req.pageData = {}

    const prop = "token"

    // Set the type of the page
    // This means the page allows both logged in users and
    // users not logged in
    req.pageData.dynamicPage = true

    if(req.cookies && req.cookies[prop]){
      // Cookie is found, so the user is potentially logged in
      // Attach the cookie to the req body and
      req.body[prop] = req.cookies[prop]
      req.pageData.loggedIn = true
    }

    else
      req.pageData.loggedIn = false

    next()
   
  }
}
