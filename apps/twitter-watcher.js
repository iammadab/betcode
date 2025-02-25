require("dotenv").config({ path: "../.env" })
const tweetModel = require("../models/tweet")
const userService = require("../services/user.service")

const { connectToDb } = require("../runners/database_runner")
connectToDb()

const TOKEN = process.env.TWITTER_TOKEN 

async function fetchTipsters(){
  const users = await userService.fetchAllTwitterTipsters()
  const tipsters = {}
  users.forEach(user => {
    tipsters[user.username] = user.twitterId 
  })
  return tipsters
}

/*
const tipsters = {
  "lifeofadunni": "908990890143776773", 
  "betaffairs": "1159026774174552064", 
  "ekitipikin": "1035513929164832768", 
  "woozzaabets": "1013726542814433280", 
  "Mrbankstips": "1921427474", 
  "donsoj52": "413117943", 
  "oracletips_": "1042408768905076736", 
  "pbtips_": "1036000695533690880", 
  "minutespunt": "1028204588820819968", 
  "cindy_blog": "854278320762105861", 
  "pink_girrll": "1006762230", 
  "ada_daddyya": "2844702561", 
  "thelocktips": "909049288273092614", 
  "LouieDi13": "1196377835746795520", 
  "prettyabike01": "1196189010047242242", 
  "_spiriituaL": "1247456265674067969"
}*/

;(async function(){

  const tipsters = await fetchTipsters()

  const ids = Object.values(tipsters).join(",")
  const tags = Object.keys(tipsters).map(v => v.toLowerCase())
  console.log(ids)
  console.log(tags)
  console.log(tags.length)

  // Twitter bot
  const twit = require("twit")
  const T = new twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
  })

  const stream = T.stream("statuses/filter", { follow: `${ids}` })

  let last

  stream.on("tweet", async tweet => {

   if(tweet.text.indexOf("RT") == 0)
    return

   console.log(tweet.user.screen_name)
   if(!tags.includes(tweet.user.screen_name.toLowerCase())){
     console.log("Wrong user")
     return
   }

   console.log("Post")

   console.log(tweet)

   let scope

    if(tweet.extended_tweet){
      scope = tweet.extended_tweet
      if(scope.extended_entities)
        scope = scope.extended_entities
      else
        scope = scope.entities
    }

    else if(tweet.extended_entities){
      scope = tweet.extended_entities
    }

    else{
      scope = tweet.entities
    }

    scope = scope || {}

    console.log("Scope", scope)

   let images = []
   if(Array.isArray(scope.media)){
     images = scope.media.map(media => {
      if(media.type != "photo") return null
      return media.media_url_https
     }).filter(a => a)
   }

   const tweetObj = new tweetModel({
     id: tweet.id,
     link: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
     text: tweet.text,
     user: tweet.user.screen_name,
     images
   })
   console.log(tweetObj)

   tweetObj.save().then(() => { console.log("Done post") })

  })

  stream.on("error", console.log)

})()
