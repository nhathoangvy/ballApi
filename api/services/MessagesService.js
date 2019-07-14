var async = require('run-waterfall');

exports.get = (params, done) => {
    async([
        (cb) => {
            SpreadSheetService.get(User.collection, (err, USERS) => {
                if(err) return cb(err);
                var author = [];
                USERS.map((user) => {
                    if(user.id == params.userId && user.role == true) {
                        author.push(user);
                    }
                });
                if(author.length > 0) {
                    Messages.query(params, (err, result) => {return ( err ? done(err) : done(null, result) )})
                }else {
                    Messages.find(params, (err, result) => {return ( err ? done(err) : done(null, result) )})
                }
            });
        }
    ])
}