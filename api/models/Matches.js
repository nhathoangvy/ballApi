var async = require('run-waterfall');

module.exports = {
    query : (params, done) => {
        SpreadSheetService.get(Matches.collection, (err, MATCHES) => {
            if(err) return done(err)
            return done(null, MATCHES)
        })
    },
    cache : (params, done) => {
        async([
            (cb) => {
                SpreadSheetService.get(Matches.collection, (err, MATCHES) => {
                    if(err) return done(err)
                    return cb(null, MATCHES)
                })
            }
        ], (err, result) => { return ( err ? done(err) : done(null, result) ) })
    },
    update: (params, done) => {
        async([
            (cb) => {
                SpreadSheetService.get(Matches.collection, (err, MATCHES) => {
                    if(err) return done(err)
                    return cb(null, MATCHES)
                })
            },
            (MATCHES, cb) => {
                for(var m = 0; j < MATCHES.length; m++){
                    if(MATCHES[m].id == params.matchid){
                        MATCHES[m].value = params.result;
                        MATCHES[m].attr = 'id'
                        MATCHES[m].compare = MATCHES[m].id
                        MATCHES[m].action = 'update'
                        MATCHES[m].collection = Matches.collection
                        MATCHES[m].key = 'scores'
                        MATCHES[m].updatedAt = new Date(new Date().getTime() + 2520000)
                        
                        SpreadSheetService.edit(MATCHES[m], (err, result) => {return ( err ? cb(err) : cb(null, result) )});
                    }else {
                        sails.log.error({error: 1000, message: '[MatchesModelUpdate] Error verify db'});
                    }
                }
            }

        ],(err, result) => { return ( err ? done(err) : done(null, result) ) });
    },
    collection: 'matches'
}