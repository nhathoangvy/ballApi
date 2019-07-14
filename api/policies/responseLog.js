const uuidv4 = require('uuid/v4');

module.exports = (req, res, next) => {
  const start = new Date(),
        status_200 = res.ok,
        status_400 = res.badRequest;
  req.options.reqId = uuidv4();

  res.ok = (data, options) => {
    const duration = new Date() - start ;
    sails.log.info("[RESPONSE - " + req.options.reqId + "] " + req.url + 
    '\n## BODY - ' + JSON.stringify(data) + ' :: ' + duration + 'ms') ;
    status_200(data, options);
  }

  res.badRequest = (data, options) => {
    const duration = new Date() - start ;
    sails.log.info("[RESPONSE - " + req.options.reqId + "] " + req.url + 
    '\n## BODY - ' + JSON.stringify(data) + ' :: ' + duration + 'ms') ;
    status_400(data, options) ;

  sails.log.info("[REQUEST - " + req.options.reqId + "] " + req.path +
            '\n## HEADER - ' + JSON.stringify(req.headers) +
            '\n## BODY - ' + JSON.stringify(req.allParams()))
  }
  
  return next()
}