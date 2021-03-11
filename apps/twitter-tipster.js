require("dotenv").config({ path: "../.env" })
const userController = require("../controllers/user")

const { connectToDb } = require("../runners/database_runner")
connectToDb().then(run)

const twit = require("twit")
const T = new twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
})

function run(){

  T.get("/users/lookup", { screen_name: "lifeofadunni" }, async (error, data, response) => {
    if(error){
      console.log(error)
      return
    }

    data = data[0]

    const userData = {
      fullname: data.screen_name,
      username: data.screen_name,
      email: `${data.screen_name}@bookmakr.ng`,
      phoneCode: "+234",
      phone: String(Math.ceil(Math.random() * 10000000000)),
      password: "password",
      bio: data.description,
      picture: data.profile_image_url_https,
      twitterId: data.id_str
    }

    const userCreateResponse = await userController.createUser(userData)
    if(userCreateResponse.status != 200)
      return console.log("Failed to create user")

    const user = userCreateResponse.user
    console.log(user)
    user.verifiedTipster = true
    await user.save()

    console.log(`${data.screen_name} account created`)

   })


}
