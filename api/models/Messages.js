var uuid = require('uuid/v4'),
    async = require('run-waterfall');

module.exports = {
    query: (params, done) => {
        async([
            (cb) => {
                SpreadSheetService.get(User.collection, (err, USERS) => {
                    if(err) return cb(err)
                    USERS.map((user) => {
                        return ((user.id == params.userId && user.role == true) ? cb() : null)
                    })
                });
            },
            (cb) => {
                SpreadSheetService.get(Messages.collection, (err, MESSAGES) => {
                    if(err) return cb(err)
                    return cb(null, MESSAGES)
                });
            }
        ],(err, result)=>{return ( err ? done(err) : done(null, result) )})
    },
    find: (params, done) => {
        async([
            (cb) => {
                SpreadSheetService.get(Messages.collection, (err, MESSAGES) => {
                    if(err) return cb(err)
                    MSGUSER = [];
                    MESSAGES.map((msg) => {
                        if(msg.userId == params.userId){
                            MSGUSER.push(msg)
                        }
                    })
                    return cb(null, MSGUSER)
                });
            }
        ],(err, result)=>{return ( err ? done(err) : done(null, result) )})
    },
    cache: (params, done) => {
        async([
            (cb) => {
                var message = {
                    id : uuid(),
                    userId : params.userId,
                    contents : params.content,
                    createdAt : new Date(new Date().getTime() + 2520000)
                }
                message.collection = Messages.collection;
                SpreadSheetService.add(message, (err, result) => {return ( err ? cb(err) : cb(null, result) )});
            }
        ],(err, result)=>{return ( err ? done(err) : done(null, result) )})
    },
    collection: 'messages'
}