/**
 * Created by youxiachai on 14-2-15.
 */

var DBServices = require('../models/index'),
    debug = require('debug')('api: article');

module.exports = function (app) {

    app.get('/api/v1/articles', function (req, res){
        DBServices.Article.getList(req.query, function (err, result){
            res.json({pageInfo : this , data : result});
        })
    })

}