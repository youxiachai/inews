/**
 * Created by youxiachai on 14-2-15.
 */

var DBServices = require('../models/index'),
    debug = require('debug')('api: article');
function sendData(err, result){
    if (err) {
        return this.json(400, err);
    }

    this.json({
        data : result
    });
}

module.exports = function (app) {

    app.get('/api/v1/articles', function (req, res){

        req.query.diggUserId = req.session.user ?  req.session.user.id : undefined;

        if(req.query.kw){
            DBServices.Article.getByKeyWords(req.query,sendData.bind(res))
        }else{
            DBServices.Article.getList(req.query, sendData.bind(res))
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

        DBServices.Article.getCommentsByArticle(req.params,  sendData.bind(res))
    })

}