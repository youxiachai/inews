/**
 * Created by youxiachai on 14-2-13.
 */

var DBServices = require('../models/index'),
    debug = require('debug')('api: account');

function sendData(err, result){
    if (err) {
        return this.json(400, err);
    }

    this.json({
        data : result
    });
}


module.exports = function (app) {

   app.post('/api/v1/signup' , function (req, res){

     DBServices.User.postSignUp(req.body,  function (err, result){
         if (err || !result) {
             return res.json(400, '用户已经存在')
         }
         req.session.user = {id : result.id}

         res.json({
             data : result
         })
     })

   })

   app.post('/api/v1/signin', function (req, res){

       DBServices.User.postSignIn(req.body, function (err, result){
           if (err || !result) {
               return res.json(400, err ? err : '用户名或者密码错误')
           }
           console.log(req.session);
           req.session.user = {id : result.id}

           res.json({
               data : result
           })

       })


   })

    //用户接口需要seesion 认证
   app.all('/api/v1/users/*', function (req, res, next) {
       if (req.session.user && req.session.user.id) {
           req.query.id =  req.session.user.id;
           return next();
       }
       res.send(401, 'should login');
   })

   app.get('/api/v1/users/logout', function (req, res){
       req.session.user = {};

       res.send('ok');

   })

    app.get('/api/v1/users/diggs', function (req, res){
        debug(JSON.stringify(req.query));
        DBServices.User.getDiggs(req.query, sendData.bind(res));
    })

    app.get('/api/v1/users/posts', function (req, res){
        DBServices.User.getPosts(req.query, sendData.bind(res));
    })

    app.get('/api/v1/users/comments', function (req, res){
        DBServices.User.getComments(req.query, sendData.bind(res));
    })

    app.get('/api/v1/users/notifications', function (req, res){

        DBServices.User.getNotify(req.query, sendData.bind(res));
    })

    app.post('/api/v1/users/notifications', function (req, res){

        DBServices.User.postRead({
            user_id : req.session.user.id
        }, sendData.bind(res))
    })

    app.post('/api/v1/users/articles', function (req, res){
        req.body.user_id = req.session.user.id;
        DBServices.User.postArticle(req.body, sendData.bind(res));
    })

    app.post('/api/v1/users/comments', function (req, res){
        req.body.user_id = req.session.user.id;

        DBServices.Comment.postComment(req.body,  sendData.bind(res))

    })


    app.post('/api/v1/users/notifications/:id', function (req, res){
        req.params.user_id = req.session.user.id;
        DBServices.User.postRead(req.params, sendData.bind(res))
    })

    app.post('/api/v1/users/diggs/:article_id', function (req, res){

        req.params.user_id = req.session.user.id;

        DBServices.User.postDigg(req.params, sendData.bind(res));
    })

    app.get('/api/v1/public/users', function (req, res){

        DBServices.User.getList(req.query, sendData.bind(res));
    })


    app.get('/api/v1/public/users/:id', function (req, res){

       DBServices.User.getById(req.params, function (err, result){
           console.log(err)
           res.json({
               data : result
           })
       })
   })

};