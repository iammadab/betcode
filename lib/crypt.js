const crypto = require("crypto")

function hash(text){
    return new Promise((resolve, reject) => {
          crypto.pbkdf2(text, process.env.HASH_SALT, 100000, 64, "sha512", (err, derivedKey) => {
                  if(err)
                      reject(err)
                  else
                      resolve(derivedKey.toString("hex"))
                })
        })
}

function compare(text, hashValue){
    return new Promise((resolve, reject) => {
          hash(text)
            .then(compareHash)

          function compareHash(textHash){
                  if(textHash == hashValue)
                      resolve(true)
                  else
                      resolve(false)
                }
        })
}


module.exports = Object.freeze({
    hash: hash,
    compare: compare
})
