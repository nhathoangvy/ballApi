var keyrows = sails.config.connections.keyrows,
    creds = sails.config.connections.drive,
    async = require('run-waterfall'),
    GoogleSpreadsheet = require('google-spreadsheet');


exports.get = (collection, done) => {
    var sheet = new GoogleSpreadsheet(keyrows[collection]);
    sheet.useServiceAccountAuth(creds, function (err) {

        sheet.getRows(1, function (err, rows) {
            return ( 
                err ? done(err) 
                :
                async([
                    (cb) => {
                        result = [];
                        for(var i = 0; i < rows.length; i++) {
                            delete rows[i]._xml;
                            delete rows[i]['app:edited'];
                            delete rows[i]._links;
                            delete rows[i].save;
                            delete rows[i].del;
                            if(rows[i].role == 'TRUE'){
                                rows[i].role = true
                            }else{
                                rows[i].role = false
                            }
                            if(rows[i].userid){
                                rows[i].userId = rows[i].userid
                            }
                            result.push(rows[i]);
                        }
                        return done(null, result)
                    }
                ])
            )
        })
    })
}
exports.add = (params, done) => {
    var sheet = new GoogleSpreadsheet(keyrows[params.collection]);
    delete params.collection
    sheet.useServiceAccountAuth(creds, (err) => {
        params._id = params.id
        sheet.addRow(1, params, (err) => {
            return ( err ? done(err) : done(null, {resultCode:0, message:'Success'}))
        })
    })
}
exports.edit = (params, done) => {
    var sheet = new GoogleSpreadsheet(keyrows[params.collection]);
    delete params.collection;
    sheet.useServiceAccountAuth(creds, function (err) {

        sheet.getRows(1, function (err, rows) {
            return ( 
                err ? done(err) 
                :
                async([
                    (cb) => {
                        result = [];
                        for(var i = 0; i < rows.length; i++) {
                            params.save = rows[i].save
                            params.del = rows[i].del
                            if(rows[i][params.attr] == params.compare && params.action == 'remove') {
                                rows[i].del()
                            }
                            if(rows[i][params.attr] == params.compare && params.action == 'update') {
                                rows[i][params.key] = params.value;
                                if(params.key2) rows[i][params.key2] = params.value2
                                if(params.key3) rows[i][params.key3] = params.value3
                                rows[i].updatedAt = params.updatedAt;
                                rows[i].save()
                            }
                        }
                        return done(null, {resultCode:0, message:'Success'})
                    }
                ])
            )
        })
    })
}
