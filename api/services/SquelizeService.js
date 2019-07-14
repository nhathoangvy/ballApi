var request = require('request'),
    api = sails.config.db;

module.exports = {
    get : (collection, cb) => {
        request.get({
            url:api +  'read?collection=' + collection
        }, (err, res, body) => {
            if (err) {
                return cb(err)
            } else {
                body = JSON.parse(body);
                return cb(null, body)
            }
        })
    },
    write: (collection, data, cb) => {
        request.post({
            url:api +  'write',
            body:(JSON.stringify({collection: collection, data : data}))
        }, (err, res, body) => {
            if (err) {
                return cb(err)
            } else {
                body = JSON.parse(body);
                return cb(null, body)
            }
        })
    }
}