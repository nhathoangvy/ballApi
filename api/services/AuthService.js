var async = require('run-waterfall');

exports.arrange = (arr) => {
    return arr.sort((m,k) => { 
            return k.win - m.win
        })
}

exports.login = (params, done) => {
    return (!params.auth ?
        async([ 
            (cb) => {
                User.find(params, (err, result) => { 
                    return ( (err || !result ) ? cb({error: 1002, message: '[AuthService.info] Not found'}) :  cb(null, result))
                });
            }, 
            (data, cb) => {
            
                return (data ?
                    User.cache(data, (err, result) => {
                        return ( err ? cb({error: 1002, message: '[AuthService.cache] Error undefined'}) : cb(null, result) ) 
                    })
                :
                    cb({error: 1002, message: '[AuthService.cache] Error undefined'})
                )
            }
        ] ,(err, result) => {return ( err ? done(err) : done(null, result) )})
    :
        User.getCache(params, (err, result) => {
            return ( (err) ? done({error: 1002, message: '[AuthService.cache] Error undefined'}) : done(null, result))
        })
    )
}

exports.info = (params, done) => {
    async([
        (cb) => {
            User.find(params, (err, result) => {
                return ( (err || !result ) ? cb({error: 1002, message: '[AuthService.info] Error undefined'}) : cb(null, result) )
            });
        }
    ],(err,result) => {return ( err ? done(err) : done(null, result) )})
}

exports.logout = (params, done) => {
    async([
        (cb) => {
            return ( (params.auth && params.userId) ? User.removeCache(params, (err, result) => {return ( err ? cb(err) : cb(null, result) )}) : cb({error: 1000, message: '[AuthService.logout] Error undefined'}) )
        }
    ],(err, result) => {return ( err ? done(err) : done(null, result) )});
}

exports.register = (params, done) => {
    if(!params.name || !params.password) return done({error:1005})
    if(params.name.length > 12) return done({error:1102})
    async([
        (cb) => {
            return (params.auth ? User.add(params, (err, result) => {return ( err ? cb(err) : cb(null, result) )}) : cb({error: 1000, message: '[AuthService.register] Error authoricate'}))
        }
    ],(err, result) => {return ( err ? done(err) : done(null, result) )});
}

exports.changePass = (params, done) => {
    async([
        (cb) => {
            return ( !(params.password || params.newPassword) ? cb({error: 1002, message: '[AuthService.changePass] Error lack params'})
            : ( params.auth ?  User.change(params, (err, result) => {return ( err ? cb(err) : cb(null, result) )}) : cb({error: 1000, message: '[AuthService.changePass] Error authoricate'})))
        }
    ],(err, result) => {return ( err ? done(err) : done(null, result) )});
}

exports.list = (params, done) => {
    async([
        (cb) => {
            SpreadSheetService.get(User.collection, (err, USERS) => {
                if(err) return cb(err)
                USERS.map((user) => {
                    return ((user.id == params.userId && user.role == true) ? cb(null, USERS) : null)
                })
            });
        }
    ],(err, result) => {return ( err ? done(err) : done(null, result) )})
}

exports.rank = (params, done) => {
    async([
        (cb) => {
            SpreadSheetService.get(User.collection, (err, USERS) => {
                if(err) return done(err)
                list = []
                USERS.map((user) => {
                    if(user.role == false) {
                        user.win = user.scores - user.defaultscores
                        user.date = new Date(new Date().getTime() + 2520000)
                        delete user.id
                        delete user.password
                        delete user.createdAt
                        delete user.updatedAt
                        delete user.scores
                        delete user.defaultScores
                        list.push(user)    
                    }
                })
                return done(null, exports.arrange(list))
            });
        }
    ])
}