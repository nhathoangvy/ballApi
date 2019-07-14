var async = require('run-waterfall');

module.exports = {
    pending: (params, done) => {
        async([
            (cb) => {
                SpreadSheetService.get(User.collection, (err, USERS) => {
                    if(err) return cb(err)
                    USERS.map((user) => {
                        return ((user.id == params.userId && user.role == true) ? cb(null, USERS) : null)
                    })
                });
            },
            (USERS, cb) => {
                SpreadSheetService.get(Score.collection, (err, SCORE) => {
                    if(err) return cb(err)
                    data = [];
                    for(var p = 0 ; p < SCORE.length; p++) {
                        for ( var user = 0 ; user < USERS.length; user++ ) {
                            if(SCORE[p].userId == USERS[user].id) {
                                SCORE[p].username = USERS[user].name;
                                data.push(SCORE[p])
                            }
                        }
                    }
                    return done(null, data);
                });
            }
        ])
    },
    approved: (params, done) => {
        async([
            (cb) => {
                SpreadSheetService.get(User.collection, (err, USERS) => {
                    if(err) return cb(err)
                    USERS.map((user) => {
                        return ((user.id == params.userId && user.role == true) ? cb(null, USERS) : null)
                    })
                });
            },
            (USERS, cb) => {
                SpreadSheetService.get(Score.collection, (err, SCORE) => {
                    if(err) return done(err)
                    for(var p = 0 ; p < SCORE.length; p++) {
                        if(SCORE[p].userId == params.userID && SCORE[p].match == params.matchid) {
                            //SCORE = Object.assign([], SCORE, {[p]: SCORE[p]});
                            SCORE[p].attr = 'id';
                            SCORE[p].compare = SCORE[p].id;
                            SCORE[p].action = 'update';
                            SCORE[p].collection = Score.collection;
                            SCORE[p].updatedAt = new Date(new Date().getTime() + 2520000);
                            SCORE[p].key = 'status';
                            SCORE[p].value = 'approved';
                            SpreadSheetService.edit(SCORE[p], (err, result) => {return ( err ? done(err) : done(null, result) )});
                        }
                    }
                    
                })
            }
        ])
    },
    withdraw : (params, done) => {
        if(isNaN(Number(params.scores))){return done({error:1008})}
        if(Number(params.scores)%50 != 0 || Number(params.scores) < 50) return done({error:1009})
        if(params.auth) {
            async([
                (cb) => {
                    User.query(params , (err, result) => {
                        if(err) return cb(err)
                        return cb(null, result)
                    })
                },
                (USERS, cb) => {
                    USERS.map((user) => {
                        if(user.id == params.userId && Number(user.scores) >= Number(params.scores)) {
                            user.value = user.scores - params.scores
                            user.key = 'scores'
                            user.collection = User.collection
                            user.compare = user.id
                            user.attr = 'id'
                            user.updatedAt =  new Date(new Date().getTime() + 2520000)
                            user.action = 'update'
                            SpreadSheetService.edit(user, (err, result) => { 
                                if(!err) {
                                    params.content = user.name + ' withdraw ' + params.scores + ' left ' + user.value; 
                                    Messages.cache(params, (err, result) => { 
                                        if (err) { sails.log.error(err) }else{ sails.log.info(result) }
                                    });
                                }
                                return (err ? done(err) : done(null, result)) 
                            })
                        }else {
                            return done({error : 1101})
                        }
                    })
                }
            ])
        }
    }
}