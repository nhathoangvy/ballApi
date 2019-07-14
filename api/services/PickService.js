var async = require('run-waterfall');

module.exports = {
    pick : (params, done) => {
        async([
            (cb) => { module.exports.rule(params, (err) => { return ( err ? cb(err) : cb() )})},
            (cb) => { Score.add(params, (err, result) => { return ( err ? cb(err) : cb(null, result) )})}
        ],(err, result) => {return ( err ? done(err) : done(null, result) )})
    },
    
    rule : (params, cb) => {
        now = Math.ceil(new Date((new Date(new Date().getTime() + 2520000)).getTime() + 25200000).getTime() / (1000 * 60));
        SpreadSheetService.get(Matches.collection, (err, MATCHES) => {
            if(err) return cb(err)
            for(var m = 0; m < MATCHES.length ; m++) {
                if(MATCHES[m].id == params.match_id) {
                    var date = Math.ceil(new Date (MATCHES[m].date + ' ' + MATCHES[m].time).getTime() / (1000*60)),
                        expired = date - now;
                    if(expired >= 30) {
                        return cb()
                    }else {
                        return cb({error : 1006, message: '[PickService.add] Expired to catch this match'});
                    }
                }
            }
        });
    },

    score : (params, done) => {
        if(isNaN(Number(params.scores))){
            return done({error:1008})
        }
        if(Number(params.scores)%50 != 0 || Number(params.scores) < 50) return done({error:1009})
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
                for(var j = 0; j < USERS.length; j++){
                    if(USERS[j].id == params.userID){
                        item = {
                            attr : 'id',
                            compare : USERS[j].id,
                            action: 'update',
                            collection : User.collection,
                            key : 'scores',
                            updatedAt : new Date(new Date().getTime() + 2520000),
                            value : Number(USERS[j].scores) + Number(params.scores) || USERS[j].scores,
                            key2 : 'defaultscores',
                            value2: Number(USERS[j].scores) + Number(params.scores) || USERS[j].scores
                        }

                        SpreadSheetService.edit(item, (err, result) => {
                            if(!err) {
                                User.find(params, (err, usr) => {
                                    User.find({userId : params.userID}, (err, u) => {
                                        params.content = usr.name + ' sent to ' + u.name + ' with ' + params.scores;
                                        params.userId = u.id
                                        Messages.cache(params, (err, result) => {
                                            if(err){
                                                sails.log.error(err)
                                            }else{
                                                sails.log.info(result)
                                            }
                                        });
                                    });
                                });
                            }
                            return ( err ? done(err) : done(null, result) )
                        });
                    }
                }
            }
        ])
    },
    result: (params, done) => {
        async([
            (cb) => {
                return ( (params.userId == '2beb68f2-ce61-4867-b2d6-80ccaed032d1') ? cb() : done({error:1000}))
            },
            (cb) => {
                SpreadSheetService.get(Matches.collection, (err, MATCHES) => {
                    if(err) return cb(err)
                    MATCHES.map((match) => {
                        return ((match.id == params.match_id) ? cb(null, match) : null)
                    })
                })
            },
            (match, cb) => {
                match.userId = params.userId
                match.match_id = match.id
                match.homePoints = params.home_points
                match.awayPoints = params.away_points
                PickService.calc(match, (err, result) => {
                    return (err ? done(err) : done(null, result))
                })
            }
        ])
    },
    calc : (params, done) => {
        async([
            (cb) => {
                SpreadSheetService.get(Score.collection, (err, SCORE) => {
                    if(err) return cb(err)
                    SpreadSheetService.get(User.collection, (err, USERS) => {
                        if(err) return cb(err)
                        return cb(null, SCORE, USERS)
                    });
                });
            },
            (SCORE, USERS, cb) => {
                for(var i = 0; i<SCORE.length; i++) {
                    if(SCORE[i].match == params.match_id && SCORE[i].status == 'pending') {
                        if(params.homePoints > params.awayPoints) {
                            if(SCORE[i].catch == SCORE[i].home_name) {
                                SCORE[i].result = 'won'
                                for(var u = 0; u < USERS.length; u++) {
                                    if(USERS[u].id == SCORE[i].userId) {
                                        USERS[u].value = Math.ceil(USERS[u].scores + (Number(SCORE[i].scores)*Number(params.rule.split(':')[0])))
                                        USERS[u].key = 'scores'
                                        USERS[u].attr = 'id'
                                        USERS[u].compare = USERS[u].id
                                        USERS[u].collection = User.collection
                                        USERS[u].updatedAt = new Date(new Date().getTime() + 2520000)
                                        USERS[u].action = 'update'
                                        SpreadSheetService.edit(USERS[u], (err, result) => {
                                            if(err) sails.log.error(err)
                                            params.userId = USERS[u].id
                                            User.find(params, (err, usr) => {
                                                params.content = usr.name + 'won by pick' + SCORE[i].catch + ' for this match ' + SCORE[i].homename + ' vs ' + SCORE[i].awayname + "(" + params.match_id + ")" + ' is ' + (Number(SCORE[i].scores)*Number(params.rule.split(':')[0])); 
                                                Messages.cache(params, (err, result) => { 
                                                    if (err) { sails.log.error(err) }else{ sails.log.info(result) }
                                                });
                                            })
                                        })
                                    }
                                }
                            }else {
                                SCORE[i].result = 'lose'
                            }
                        }else if (params.homePoints < params.awayPoints) {
                            if(SCORE[i].catch == SCORE[i].awayname) {
                                SCORE[i].result = 'won'
                                for(var u = 0; u < USERS.length; u++) {
                                    if(USERS[u].id == SCORE[i].userId) {
                                        USERS[u].value = Math.ceil(USERS[u].scores + (Number(SCORE[i].scores)*Number(params.rule.split(':')[2])))
                                        USERS[u].key = 'scores'
                                        USERS[u].attr = 'id'
                                        USERS[u].compare = USERS[u].id
                                        USERS[u].collection = User.collection
                                        USERS[u].updatedAt = new Date(new Date().getTime() + 2520000)
                                        USERS[u].action = 'update'
                                        SpreadSheetService.edit(USERS[u], (err, result) => {
                                            if(err) sails.log.error(err)
                                            params.userId = USERS[u].id
                                            User.find(params, (err, usr) => {
                                                params.content = usr.name + 'won by pick' + SCORE[i].catch + ' for this match ' + SCORE[i].homename + ' vs ' + SCORE[i].awayname + "(" + params.match_id + ")" + ' is ' + (Number(SCORE[i].scores)*Number(params.rule.split(':')[2])); 
                                                Messages.cache(params, (err, result) => { 
                                                    if (err) { sails.log.error(err) }else{ sails.log.info(result) }
                                                });
                                            })
                                        })
                                    }
                                }
                            }else {
                                SCORE[i].result = 'lose'
                            }
                        }else {
                            if(SCORE[i].catch != SCORE[i].awayname && SCORE[i].catch != SCORE[i].homename) {
                                SCORE[i].result = 'won'
                                for(var u = 0; u < USERS.length; u++) {
                                    if(USERS[u].id == SCORE[i].userId) {
                                        USERS[u].value = Math.ceil(USERS[u].scores + (Number(SCORE[i].scores)*Number(params.rule.split(':')[1])))
                                        USERS[u].key = 'scores'
                                        USERS[u].attr = 'id'
                                        USERS[u].compare = USERS[u].id
                                        USERS[u].collection = User.collection
                                        USERS[u].updatedAt = new Date(new Date().getTime() + 2520000)
                                        USERS[u].action = 'update'
                                        SpreadSheetService.edit(USERS[u], (err, result) => {
                                            if(err) sails.log.error(err)
                                            params.userId = USERS[u].id
                                            User.find(params, (err, usr) => {
                                                params.content = usr.name + 'won by picked ' + SCORE[i].catch + ' for this match ' + SCORE[i].homename + ' vs ' + SCORE[i].awayname + "(" + params.match_id + ")" + ' is ' + (Number(SCORE[i].scores)*Number(params.rule.split(':')[1])); 
                                                Messages.cache(params, (err, result) => { 
                                                    if (err) { sails.log.error(err) }else{ sails.log.info(result) }
                                                });
                                            })
                                        })
                                    }
                                }
                            }
                        }
                        SCORE[i].value = SCORE[i].result
                        SCORE[i].key = 'result'
                        SCORE[i].value2 = 'done'
                        SCORE[i].key2 = 'status'
                        SCORE[i].attr = 'id'
                        SCORE[i].compare = SCORE[i].id
                        SCORE[i].collection = Score.collection
                        SCORE[i].updatedAt = new Date(new Date().getTime() + 2520000)
                        SCORE[i].action = 'update'
                        SpreadSheetService.edit(SCORE[i], (err, result) => {if(err) sails.log.error(err)})
                    }else {
                        sails.log.error('This match have already done or no one pick this match')
                    }
                }
                return done(null, {resultCode:0 , message:'Success'})
            }
        ])
    }
}