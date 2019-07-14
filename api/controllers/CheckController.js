const errorMessage = sails.config.errorMessage ;

exports.ok = (req, res) => {
    return res.ok({resultCode:0});
}