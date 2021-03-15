const Conversion = require("../models/conversion")

exports.requestConversion = async ({ source, code, destination }) => {

  try{

    const conversion = new Conversion({
      source,
      code,
      destination
    })

    console.log(conversion)

    return await conversion.save()

  } catch(error){

    console.log(error)
    return { error: true, code: "FAILED_TO_REQUEST_CONVERSION" }

  }

})
