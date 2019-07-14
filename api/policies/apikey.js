const errorMessage = sails.config.errorMessage

module.exports = (req, res, next) => {
  const apiKey = req.headers['api-key'],
        language = req.headers['accept-language'] || "vi" ;

  if(!apiKey || apiKey != sails.config.connections.API_KEY) {
    return res.badRequest({error: 1000, message: sails.__({phrase: errorMessage[1000], locale: language})})
  }
  return next()
}