var uuid = require('uuid/v4'),
    async = require('run-waterfall'),
    _token = require('jsonwebtoken'),
    secret = sails.config.data.pass;

module.exports = {
    query: (params, done) => {
        SpreadSheetService.get(Score.collection, (err, SCORE) => {
            if(err) return cb(err)
            return ( params.userId ?
                async([
                    (cb) =>{ 
                        var m = 0, info = [];
                        while (m < SCORE.length) { if (SCORE[m].userId == params.userId){info.push(SCORE[m])} m++}
                        return cb(null, info)
                    }
                ],(err, result)=>{return ( err ? done(err) : done(null, result) )})
                : done(null, null)
            )
        });
    },

    add: (params, done) => {
        if(Number(params.scores)%50 != 0 || Number(params.scores) < 50) return done({error:1009})
        async([
            (cb) => {
                SpreadSheetService.get(User.collection, (err, USERS) => {
                    if(err) return cb(err)
                    SpreadSheetService.get(Matches.collection, (err, MATCHES) => {
                        if(err) return cb(err)
                        SpreadSheetService.get(Score.collection, (err, SCORE) => {
                            if(err) return cb(err)
                            return cb(null, USERS, MATCHES, SCORE)
                        });
                    });
                });
            },
            (USERS, MATCHES, SCORE, cb) => {
                if(params.auth) {
                    var already = false,
                        closed = false;
                    for(var l = 0; l < SCORE.length; l++) {
                        if (SCORE[l].match == params.match_id && SCORE[l].userId == params.userId) {
                            already = true;
                            if(SCORE[l].status != 'Pending'){
                                closed = true;
                            }
                        }
                    }
                    return (!already ?

                        async([
                            (cb1) => {
                                User.find(params, (err, res) => {
                                    scores = params.scores;
                                    params.scores = res.scores - params.scores;
                                    return ( err ? cb1(err) : 
                                        ( (params.scores >= 0) ? User.update(params, (err, response) => 
                                            { return ( err ? cb1(err) : cb1() )}) :  cb1({error : 1007, message: '[PickService.add] Not enough score'})) )
                                })
                            },
                            (cb1) => {
                                var bid = {
                                    id : uuid(),
                                    userId : params.userId,
                                    scores : Number(scores),
                                    leagues : params.leagues,
                                    home_name : params.home_name,
                                    away_name : params.away_name,
                                    catch : params.catch || params.home_name,
                                    result : params.result || null,
                                    rule : params.rule || null,
                                    match : params.match_id,
                                    notes : params.notes || null,
                                    status : 'pending',
                                    createdAt : new Date(new Date().getTime() + 2520000),
                                    updatedAt : new Date(new Date().getTime() + 2520000)
                                }
                                bid.collection = Score.collection
                                SpreadSheetService.add(bid, (err, result) => {
                                    if(!err) {
                                        User.find(params, (err, usr) => {
                                            params.content = usr.name + 'pick ' + (params.catch || params.home_name) + ' for this match ' + params.home_name + ' vs ' + params.away_name + "(" + params.match_id + ")" + ' with ' + scores; 
                                            Messages.cache(params, (err, result) => { 
                                                if (err) { sails.log.error(err) }else{ sails.log.info(result) }
                                            });
                                        })
                                    }
                                    return ( err ? cb1(err) : cb1(null, result) )});
                            }
                        ],(err, result) => { return ( err ? cb(err) : cb(null, result) ) })
                        
                    :
                        async([
                            (cb) => {
                                // if(!closed) {
                                for(var i = 0; i < SCORE.length; i++) {
                                   
                                    if(SCORE[i].userId == params.userId){
                                        var item =  SCORE[i],
                                            index = i;
                                        User.find(params, (err, res) => {
                                            var prevScores = params.scores;
                                            params.scores = (Number(res.scores) + Number(item.scores)) - Number(prevScores);
                                            return ( err ? done(err) : 
                                                ( (params.scores >= 0) ? User.update(params, (err, response) => 
                                                    { return ( err ? done(err) : 
                                                        async([
                                                            (cb1) => {
                                                                SCORE[index].key2 = 'catch'
                                                                SCORE[index].value2 = params.catch
                                                                SCORE[index].key3 = 'notes'
                                                                SCORE[index].value3 = params.notes
                                                                SCORE[index].value = prevScores
                                                                SCORE[index].attr = 'id'
                                                                SCORE[index].action = 'update'
                                                                SCORE[index].compare = SCORE[index].id
                                                                SCORE[index].collection = Score.collection
                                                                SCORE[index].key = 'scores'
                                                                SCORE[index].updatedAt = new Date(new Date().getTime() + 2520000)
                                                                SpreadSheetService.edit(SCORE[index], (err, result) => {
                                                                    if(!err) {
                                                                        User.find(params, (err, usr) => {
                                                                            params.content = usr.name + ' change pick this match ' + params.home_name + ' vs ' + params.away_name + "(" + params.match_id + ")" + ' from ' + res.scores + ' to ' + prevScores; 
                                                                            Messages.cache(params, (err, result) => { 
                                                                                if (err) { sails.log.error(err) }else{ sails.log.info(result) }
                                                                            });
                                                                        })
                                                                    }
                                                                    return ( err ? done(err) : done(null, result) )});
                                                            }
                                                        ])
                                                    )}) :  done({error : 1007, message: '[PickService.add] Not enough score'})) )
                                        })
                                    }
                                }
                                // }else {
                                //     return done({error: 1100})
                                // }
                            }
                        ])
                    )
                }else{
                    return cb({error: 1, message:'[ScoreModelAdd] Invalid authoricate'});
                }
            }

        ],(err, result) => {return ( err ? done(err) : done(null, result) )});
    },

    update: (params, done) => {
        SpreadSheetService.get(Score.collection, (err, SCORE) => {
            if(err) return done(err)
            async([
                (cb) => {
                    PickService.rule(params, (err) => {return ( err ? cb(err) : cb() )})
                },
                (cb) => {
                    SpreadSheetService.get(Score.collection, (err, SCORE) => {
                        if(err) return cb(err)
                        return cb(null, SCORE)
                    })
                },
                (SCORE, cb) => {
                    for(var i = 0; i < SCORE.length; i++) {
                        if(params.userId == SCORE[i].userId && params.matchid == SCORE[i].matchid) {
                            SCORE[i].value = params.catch || SCORE[i].home_name;
                            SCORE[i].updatedAt = new Date(new Date().getTime() + 2520000);
                            SCORE[i].attr = 'userId'
                            SCORE[i].compare = SCORE[i].userId
                            SCORE[i].collection = Score.collection
                            SCORE[i].action = 'update'
                            SCORE[i].key = 'catch'
                            SpreadSheetService.edit(SCORE[i], (err, result) => {return ( err ? cb(err) : cb(null, result) )});
                        }
                    }
                }
            ],(err, result) => {return ( err ? done(err) : done(null, result) )})
        })
    },
    collection: 'score'
}