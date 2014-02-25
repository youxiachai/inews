/**
 * Created by youxiachai on 14-2-15.
 */

var DBServices = require('../models/index'),
    debug = require('debug')('api: article');

module.exports = function (app) {

    app.get('/api/v1/articles', function (req, res){

        req.query.diggUserId = req.session.user ?  req.session.user.id : undefined;

        if(req.query.kw){
            DBServices.Article.getByKeyWords(req.query, function (err, result){
                res.json({pageInfo : this , data : result});
            })
        }else{
            DBServices.Article.getList(req.query, function (err, result){
                res.json({pageInfo : this , data : result});
            })
        }


    })

    app.get('/api/v1/articles/:id', function (req, res){

        req.params.diggUserId =   req.session.user ? req.session.user.id : undefined;
        req.params.isEdit = req.query.edit;
        DBServices.Article.getById(req.params, function (err, result){
            res.json({data : result});
        })
    })


    app.get('/api/v1/articles/:id/comments', function (req, res){

        DBServices.Article.getCommentsByArticle(req.params, function (err, result){
            res.json({data : result});
        })
    })

}