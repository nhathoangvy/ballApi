const errorMessage = sails.config.errorMessage ;

exports.login = (req, res) => {
    const params = req.allParams();
    params.auth = req.options.access_token || null;
    params.userId = req.options.userId || null;
    params.language = req.headers['accept-language'] || "vi";

    AuthService.login(params, (err, result) => {return ( err ? res.badRequest({error: err.error, message: sails.__({phrase: errorMessage[err.error], locale: params.language})}) : res.ok(result))});
} 

exports.logout = (req, res) => {
    const params = req.allParams();
    params.auth = req.options.access_token || null;
    params.userId = req.options.userId || null;
    params.language = req.headers['accept-language'] || "vi";

    AuthService.logout(params, (err, result) => {return ( err ? res.badRequest({error: err.error, message: sails.__({phrase: errorMessage[err.error], locale: params.language})}) : res.ok(result))});

}

exports.register = (req, res) => {
    const params = req.allParams();
    params.auth = req.options.access_token || null;
    params.language = req.headers['accept-language'] || "vi";

    AuthService.register(params, (err, result) => {return ( err ? res.badRequest({error: err.error, message: sails.__({phrase: errorMessage[err.error], locale: params.language})}) : res.ok(result))});
}

exports.change = (req, res) => {
    const params = req.allParams();
    params.auth = req.options.access_token || null;
    params.language = req.headers['accept-language'] || "vi";

    User.change(params, (err, result) => {return ( err ? res.badRequest({error: err.error, message: sails.__({phrase: errorMessage[err.error], locale: params.language})}) : res.ok(result))});
}

exports.info = (req, res) => {
    const params = req.allParams();
    params.auth = req.options.access_token || null;
    params.userId = req.options.userId || null;
    params.language = req.headers['accept-language'] || "vi";

    AuthService.info(params, (err, result) => {return ( err ? res.badRequest({error: err.error, message: sails.__({phrase: errorMessage[err.error], locale: params.language})}) : res.ok(result))});
}

exports.list = (req, res) => {
    const params = req.allParams();
    params.auth = req.options.access_token || null;
    params.userId = req.options.userId || null;
    params.language = req.headers['accept-language'] || "vi";

    AuthService.list(params, (err, result) => {return ( err ? res.badRequest({error: err.error, message: sails.__({phrase: errorMessage[err.error], locale: params.language})}) : res.ok(result))});
}

exports.rank = (req, res) => {
    const params = req.allParams();
    params.auth = req.options.access_token || null;
    params.userId = req.options.userId || null;
    params.language = req.headers['accept-language'] || "vi";

    AuthService.rank(params, (err, result) => {return ( err ? res.badRequest({error: err.error, message: sails.__({phrase: errorMessage[err.error], locale: params.language})}) : res.ok(result))});
}
