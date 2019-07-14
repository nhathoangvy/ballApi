const errorMessage = sails.config.errorMessage ;

exports.pick = (req, res) => {
    const params = req.allParams();
    params.auth = req.options.access_token || null;
    params.userId = req.options.userId || null;
    params.language = req.headers['accept-language'] || "vi";

    PickService.pick(params, (err, result) => { return ( err ? res.badRequest({error: err.error, message: sails.__({phrase: errorMessage[err.error], locale: params.language})}) : res.ok(result))});
}

exports.score = (req, res) => {
    const params = req.allParams();
    params.auth = req.options.access_token || null;
    params.userId = req.options.userId || null;
    params.language = req.headers['accept-language'] || "vi";

    PickService.score(params, (err, result) => { return ( err ? res.badRequest({error: err.error, message: sails.__({phrase: errorMessage[err.error], locale: params.language})}) : res.ok(result))});
}

exports.result = (req, res) => {
    const params = req.allParams();
    params.auth = req.options.access_token || null;
    params.userId = req.options.userId || null;
    params.language = req.headers['accept-language'] || "vi";

    PickService.result(params, (err, result) => { return ( err ? res.badRequest({error: err.error, message: sails.__({phrase: errorMessage[err.error], locale: params.language})}) : res.ok(result))});
}
