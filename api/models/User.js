var _ = require('fs'),
    uuid = require('uuid/v4'),
    async = require('run-waterfall'),
    _token = require('jsonwebtoken'),
    secret = sails.config.data.pass,
    path = require('path');

var hash ={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=hash._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},
    decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=hash._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r= 0; var c1=0; var c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
        
module.exports = {
    query: (params, done) => {
        async([
            (cb) => {
                SpreadSheetService.get(User.collection, (err, USERS) => {
                    if(err) return cb(err)
                    return cb(null, USERS)
                });
            },
            (USERS, cb) =>{
                var m = 0,
                info = [];
                while (m < USERS.length) {
                    delete USERS[m].password;
                    info.push(USERS[m]);
                    m++;
                }
                return cb(null, info)
            }
        ],(err, result)=>{return ( err ? done(err) : done(null, result) )})
    },

    find: (params, done) => {
        async([
            (cb) => {
                SpreadSheetService.get(User.collection, (err, USERS) => {
                    if(err) return cb(err)
                    return cb(null, USERS)
                });
            },
            (USERS, cb) =>{
                if(params.userId){
                    var m = 0,
                    info = [];
                    while (m < USERS.length) {
                        if (USERS[m].id == params.userId){
                            info.push(USERS[m]);
                        }
                        m++;
                    }

                    return ( info.length > 0 ? cb(null, info[0]) : cb(null, null))

                }
                if(params.name){
                    var info = [];
                    for(var m = 0; m < USERS.length; m++) {
                        if ( params.name == USERS[m].name){
                            if(hash.encode(params.password) == USERS[m].password ){
                                info.push(USERS[m]);
                            }
                        }
                    }
                    return ( info.length > 0 ? cb(null, info[0]) : cb(null, null))

                }else{
                    return cb(null,null)
                }
            }
        ],(err, result)=>{return ( err ? done(err) : done(null, result) )})
    },

    add: (params, done) => {
        if(isNaN(Number(params.scores))){
            return done({error:1008})
        }
        async([
            (cb) => {
                SpreadSheetService.get(User.collection, (err, USERS) => {
                    if(err) return cb(err)
                    return cb(null, USERS)
                });
            },
            (USERS, cb) => {
                _token.verify(params.auth, secret, (err, data) => {	
                    if(err){
                        return cb({error: 1, message:'[UserModelAdd] Invalid authoricate'});
                    }else{
                        var role = false;
                        for(var i = 0; i < USERS.length; i++){
                            if(USERS[i].name == data.name && USERS[i].role){
                                role = true;
                            }
                        }
                    }
                    if(role){
                        
                        if(params.role == 'admin'){
                            params.role = true
                        }else{
                            params.role = false
                        }

                        var item = {
                            id : uuid(),
                            name : params.name,
                            password : hash.encode(params.password),
                            role: params.role || false,
                            scores : Number(params.scores) || 0,
                            defaultscores: Number(params.scores) || 0,
                            createdAt : new Date(new Date().getTime() + 2520000),
                            updatedAt : new Date(new Date().getTime() + 2520000)
                        },
                            already = false ;
                        for(var j = 0; j < USERS.length; j++){
                            if(USERS[j].name == params.name){
                                already = true
                            }
                        }
                        
                        if(!already){
                            item.collection = User.collection
                            SpreadSheetService.add(item, (err, result) => {
                                if(!err) {
                                    params.content = data.name + ' created User : ' + item.name + ' with ' + (params.scores || 0); 
                                    Messages.cache(params, (err, result) => { 
                                        if (err) { sails.log.error(err) }else{ sails.log.info(result) }
                                    })
                                }
                                return ( err ? cb(err) : cb(null, result) )});
                        }else{
                            sails.log.error({error: 1004, message: '[UserModelAdd] Error username have been taken'});
                            return cb({error: 1004, message: '[UserModelAdd] Error username have been taken'})
                        }
                    }else{
                        return cb({error: 1, message:'[UserModelAdd] Invalid authoricate'});
                    }
                });
            }

        ],(err, result) => {return ( err ? done(err) : done(null, result) )});
    },

    change: (params, done) => {

        async([
            (cb) => {
                SpreadSheetService.get(User.collection, (err, USERS) => {
                    if(err) return cb(err)
                    return cb(null, USERS)
                });
            },
            (USERS, cb) => {
                _token.verify(params.auth, secret, (err, data) => {	
                    if(err) {
                        sails.log.error({error: 1000, message: '[UserModelChange] Error verify db'});
                        return cb({error: 1000, message: '[UserModelChange] Error verify db'})
                    }else if (data.password == hash.encode(params.password)) {
                        for(var j = 0; j < USERS.length; j++){
                            if(USERS[j].name == data.name){
                                item = {
                                    attr : 'id',
                                    action : 'update',
                                    compare: USERS[j].id,
                                    collection: User.collection,
                                    key : 'password',
                                    value : hash.encode(params.newPassword),
                                    updatedAt: new Date(new Date().getTime() + 2520000)
                                }

                                SpreadSheetService.edit(item, (err) => {if(err){sails.log.error(err)}});
                            }else {
                                sails.log.error({error: 1000, message: '[UserModelChange] Error verify db'});
                            }
                        }
                    }else{
                        return cb({error: 1002, message: '[UserModelChange] Invalid old password'})
                    }
                });
            }

        ],(err, result) => {return ( err ? done(err) : done(null, result) )});
    },

    getCache: (params, done) => {
        async([
            (cb) => {_token.verify(params.auth, secret, (err, data) => {return ( err ? cb({error: 1003, message: '[UserModelGetCache] Error get db'}) : cb(null,data))})}
        ], (err, result) =>{return ( err ? done(err) : done(null, result) )})
    },

    cache: (params, done) => {
        params = {
            id : params.id,
            name : params.name,
            password : params.password,
            role : params.role,
            scores : params.scores,
            createdAt: params.createdAt,
            updatedAt: params.updatedAt
        }
        async([
            (cb) => {
                SpreadSheetService.get(Token.collection, (err, TOKEN) => {
                    if(err) return cb(err)
                    return cb(null, TOKEN)
                });
            },
            (TOKEN, cb) => {
                var token = _token.sign(params, secret, {expiresIn: 86400}),
                    already = false;
                var item = {
                    id : params.id,
                    name : params.name,
                    scores : params.scores,
                    role: params.role,
                    token : token
                };
                key = {
                    id : params.id,
                    token : token,
                    createdAt : new Date(new Date().getTime() + 2520000),
                    updatedAt : new Date(new Date().getTime() + 2520000)
                }
                for(var j = 0; j < TOKEN.length; j++){
                    if(TOKEN[j].id == params.id){
                        key.attr = 'id'
                        key.compare = TOKEN[j].id
                        key.action = 'update'
                        key.collection = Token.collection
                        key.key = 'token'
                        key.value = key.token
                        key.update = key.updatedAt
                        SpreadSheetService.edit(key, (err, result) => {return ( err ? cb(err) : cb(null, item) )});
                        already = true;
                    }
                }
                if(!already || TOKEN.length < 1){
                    key.collection = Token.collection;
                    SpreadSheetService.add(key, (err, result) => {return ( err ? cb(err) : cb(null, item) )});
                };
                
            }

        ],(err, result) => {return ( err ? done(err) : done(null, result) )});
    },

    removeCache: (params, done) => {
        async([
            (cb) => {
                SpreadSheetService.get(Token.collection, (err, TOKEN) => {
                    if(err) return cb(err)
                    return cb(null, TOKEN)
                });
            },
            (TOKEN, cb) => {
                for(var i = 0; i < TOKEN.length; i++){
                    if(TOKEN[i].id == params.userId){
                        TOKEN[i].attr = 'id'
                        TOKEN[i].compare = TOKEN[i].id
                        TOKEN[i].collection = Token.collection
                        TOKEN[i].action = 'remove'
                        SpreadSheetService.edit(TOKEN[i], (err, result) => {return ( err ? cb(err) : cb(null, result) )});
                    }
                };
            }

        ],(err, result) => {return ( err ? done(err) : done(null, result) )});
    },

    update: (params, done) => {
        async([
            (cb) => {
                SpreadSheetService.get(User.collection, (err, USERS) => {
                    if(err) return cb(err)
                    return cb(null, USERS)
                });
            },
            (USERS, cb) => {
                for(var j = 0; j < USERS.length; j++){
                    if(USERS[j].id == params.userId){
                        item = {
                            attr : 'id',
                            compare : USERS[j].id,
                            collection : User.collection,
                            action : 'update',
                            key : 'scores',
                            value : params.scores,
                            updatedAt: new Date(new Date().getTime() + 2520000)
                        }
                        SpreadSheetService.edit(item, (err, result) => {return ( err ? cb(err) : cb(null, result) )});
                    }
                }
            }

        ],(err, result) => {return ( err ? done(err) : done(null, result) )});
    },
    collection: 'user'
}