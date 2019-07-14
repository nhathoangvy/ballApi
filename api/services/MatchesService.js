var async = require('run-waterfall'),
    request = require('postman-request'),
    api = sails.config.data;
    
exports.asyncLoop = async (array) => {
    var matches = [];
    await Promise.all(array.map(async (item) => {
        var arrItem = await exports.reqMatches(item.league);
        for(var i = 0; i < arrItem.length; i++) {
            matches.push(arrItem[i]);
        }
    }));
    return matches
};

exports.arrange = (arr) => {
    return arr.sort((m,k) => { 
        return new Date(m.date + ' ' + m.time) - new Date(k.date + ' ' + k.time)})
}

exports.reqMatches = (league) => {
    return new Promise((resolve, reject) => {
        var matches = [];
        request.get({
            url:api.domain + api.prefix.matches + 'key=' + api.key + '&secret=' + api.secret + '&league=' + league ,
        }, (err, res, body) => {
            if (err) {
                reject(err)
            } else {
                body = JSON.parse(body);
                for(var item = 0; item < body.data.fixtures.length; item++) {
                    matches.push(body.data.fixtures[item]);
                }
                resolve(matches);
            }
        })
    });
}

exports.reqScores = (params, cb) => {
    var result = [];
        request.get({
            url:api.domain + api.prefix.scores + 'key=' + api.key + '&secret=' + api.secret + '&league=' + params.leagueid ,
        }, (err, res, body) => {
            if (err) {
                return cb(err)
            } else {
                for(var item = 0; item < body.data.match.length; item++) {
                    if(body.data.match[item].id == params.matchid) {
                        result.push(body.data.match[item]);
                    }
                }
                item = {
                    matchid : params.matchid,
                    result : result[0].score
                }
                return cb(null, item);
            }
        })
}

exports.get = (params, done) => {

    // var contain = (ele, array) => {
    //     var verify = false;
    //     for(var k = 0; k < array.length; k++) {
    //         if(ele == array[k]) {
    //             verify = true
    //         }
    //     }
    //     return verify
    // };
    // MATCHES = SpreadSheetService.MATCHES();
    // async([
    //     (cb) => {
    //         exports.asyncLoop(MATCHES.matches)
    //         .then((data) => {
    //             return cb(null, data)
    //         })
    //         .catch((err) => {
    //             return cb(err);
    //         });
    //     },

    //     (matches, cb) => {
    //         if(matches) {
    //             for(var i = 0; i < matches.length; i++){
                        
    //                 var location = matches[i].location.split(','),
    //                     location = location[location.length-1].replace(' ','');
    //                 matches[i].status = 'waiting';

    //                 for(var j = 0; j < MATCHES.GMT.length; j++) {
    //                     if(contain(location, MATCHES.GMT[j].location) == true) {
    //                         var currentTime = matches[i].time.split(':'),
    //                             m = 0;
                                
    //                         while(m < currentTime.length) {
    //                             if(m==0){
    //                                 matches[i].time = Number(currentTime[0]) + MATCHES.GMT[j].gmt,
    //                                 currentDate = matches[i].date.split('-'),
    //                                 days = Number(currentDate[currentDate.length-1]) + 1,
    //                                 months = Number(currentDate[currentDate.length-2]),
    //                                 years = Number(currentDate[0]);
    //                                 if(matches[i].time >= 24) {
    //                                     matches[i].time = matches[i].time - 24;
    //                                     for(var z = 0; z < MATCHES.MONTHS.length; z++){
    //                                         if(contain(months,MATCHES.MONTHS[z].month) == true){
    //                                             if(days > MATCHES.MONTHS[z].days){
    //                                                 months = months + 1,
    //                                                 days = '01';
    //                                                 if(months > 12) {
    //                                                     years = years + 1
    //                                                 }
    //                                             }
    //                                         }
    //                                     }
    //                                     if(months < 10) {
    //                                         months = "0" + months
    //                                     }
    //                                     matches[i].date = years + '-' + months + '-' + days
    //                                 }
    //                             }else{
    //                                 matches[i].time += ':' + currentTime[m]
    //                             }
    //                             m++
    //                         }
    //                     }
    //                 }
    //             }
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
            async([
                (cb) => {
                    for( var match = 0 ; match < MATCHES.length; match++) {
                        MATCHES[match].picker = [];
                        for( var score = 0 ; score < SCORE.length; score++) {
                            if(MATCHES[match].id == SCORE[score].match) {
                                for ( var user = 0 ; user < USERS.length; user++ ) {
                                    if(SCORE[score].userId == USERS[user].id) {
                                        SCORE[score].username = USERS[user].name;
                                        MATCHES[match].picker.push(SCORE[score]);
                                    }
                                }
                            }
                        }
                    }
                    return cb(null, MATCHES)
                },
                (MATCHES, cb) => {
                    return done(null, exports.arrange(MATCHES));
                }
            ])
            //Matches.cache(exports.arrange(MATCHES), (err, res) => {return ( err ? done(err) : done(null, exports.arrange(MATCHES)) )})
        }
    ])
    //         }else {
    //             return cb(null,null)
    //         }
    //     }

    // ],(err, result) => {return ( err ? done(err) : done(null, result) )})
}


exports.updateScores = (params, done) => {
    SpreadSheetService.get(Matches.collection, (err, MATCHES) => {
        if(err) return done(err)
        async([
            (cb) => {
                now = Math.ceil(new Date((new Date()).getTime()).getTime() / (1000 * 60))
                status = false;
                for(var m = 0; m < MATCHES.length ; m++) {
                    var date = Math.ceil(new Date (new Date (MATCHES[m].date + ' ' + MATCHES[m].time)).getTime() / (1000*60)),
                        expired = date - now;
                    if(expired <= 0 && expired > -119) {
                        MATCHES[m].value = 'Playing'
                        MATCHES[m].attr = 'id'
                        MATCHES[m].compare = MATCHES[m].id
                        MATCHES[m].action = 'update'
                        MATCHES[m].collection = Matches.collection
                        MATCHES[m].updatedAt = new Date(new Date().getTime() + 2520000)
                        MATCHES[m].key = 'status'
                        SpreadSheetService.edit(MATCHES[m], (err) => {if(err){sails.log.error(err)}});
                    }else if (expired < -120) {
                        MATCHES[m].value = 'Done'
                        MATCHES[m].attr = 'id'
                        MATCHES[m].compare = MATCHES[m].id
                        MATCHES[m].action = 'update'
                        MATCHES[m].collection = Matches.collection
                        MATCHES[m].key = 'status'
                        MATCHES[m].updatedAt = new Date(new Date().getTime() + 2520000)
                        SpreadSheetService.edit(MATCHES[m], (err) => {if(err){sails.log.error(err)}});
                    }
                }
                return cb(null ,{resultCode :0, message : 'Success'})
            }
        ], (err, result)=> {
            return done (null, result)
        })
    });
}

exports.playing = (params, done) => {
    async([
        (cb) => {
            SpreadSheetService.get(Matches.collection, (err, MATCHES) => {
                if(err) return cb(err)
                SpreadSheetService.get(Score.collection, (err, SCORE) => {
                    if(err) return cb(err)
                    return cb(null, MATCHES, SCORE)
                })
            })
        },
        (MATCHES, SCORE, cb) => {
            async([
                (cb1) => {
                    now = Math.ceil(new Date((new Date(new Date().getTime() + 2520000)).getTime() + 25200000).getTime() / (1000 * 60));
                    data = exports.arrange(MATCHES);
                    recent = [];
                    for(var i = 0; i < data.length; i++) {
                        date = Math.ceil(new Date (data[i].date + ' ' + data[i].time).getTime() / (1000*60))
                        if(date > now && recent.length < 2) {
                            data[i].picker = [];
                            for( var score = 0 ; score < SCORE.length; score++) {
                                if(SCORE[score].userId == params.userId && SCORE[score].match == data[i].id) {
                                    data[i].picker.push(SCORE[score]);;
                                }
                            }
                            recent.push(data[i]);
                        }
                    }
                    return cb1(null, recent)
                },
                (recent, cb1) => {
                    if(recent.length > 0) return done(null, recent)
                    else return done(null, {error:5})
                }
            ])
        }
    ])
}