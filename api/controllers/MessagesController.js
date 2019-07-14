const errorMessage = sails.config.errorMessage ;

exports.get = (req, res) => {
    const params = req.allParams();
    params.auth = req.options.access_token || null;
    params.userId = req.options.userId || null;
    params.language = req.headers['accept-language'] || "vi";

    MessagesService.get(params, (err, result) => { return ( err ? res.badRequest({error: err.error, message: sails.__({phrase: errorMessage[err.error], locale: params.language})}) : res.ok(result))});
}

