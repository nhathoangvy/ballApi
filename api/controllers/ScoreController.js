const errorMessage = sails.config.errorMessage ;

exports.pending = (req, res) => {
    const params = req.allParams();
    params.auth = req.options.access_token || null;
    params.userId = req.options.userId || null;
    params.language = req.headers['accept-language'] || "vi";

    ScoreService.pending(params, (err, result) => { return ( err ? res.badRequest({error: err.error, message: sails.__({phrase: errorMessage[err.error], locale: params.language})}) : res.ok(result))});
}

exports.approved = (req, res) => {
    const params = req.allParams();
    params.auth = req.options.access_token || null;
    params.userId = req.options.userId || null;
    params.language = req.headers['accept-language'] || "vi";

    ScoreService.approved(params, (err, result) => { return ( err ? res.badRequest({error: err.error, message: sails.__({phrase: errorMessage[err.error], locale: params.language})}) : res.ok(result))});
}

exports.withdraw = (req, res) => {
    const params = req.allParams();
    params.auth = req.options.access_token || null;
    params.userId = req.options.userId || null;
    params.language = req.headers['accept-language'] || "vi";

    ScoreService.withdraw(params, (err, result) => { return ( err ? res.badRequest({error: err.error, message: sails.__({phrase: errorMessage[err.error], locale: params.language})}) : res.ok(result))});
}

