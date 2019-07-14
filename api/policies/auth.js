var jwt    = require('jsonwebtoken'),
    path = require('path'),
    fs = require('fs'),
    secret = sails.config.data.pass,
    errorMessage = sails.config.errorMessage ;

module.exports = (req, res, next) => {
    var access_token = req.headers.authorization,
        active = false,
        language = req.headers['accept-language'] || "vi";

        if(typeof access_token == 'undefined'){
            return next();
        }else {
            SpreadSheetService.get(Token.collection, (err, TOKEN) => {
                if (err) return res.badRequest({error: 1, message:'Invalid authoricate, expired token'});

                for(var i = 0; i < TOKEN.length; i++){
                    if(TOKEN[i].token == access_token){
                        active = true
                    }
                }

                if(active){
                    jwt.verify(access_token, secret, (err, data) => {			
                        if (err) {
                            return res.badRequest({error: 1, message:'Invalid authoricate, expired token'});
                        } else {
                            req.options.access_token = access_token;
                            req.options.userId = data.id;
                        }
                        return next();
                    });
                }else{
                    return res.badRequest({error: 1, message:'Invalid authoricate, expired token'});
                }
            });
    }
}