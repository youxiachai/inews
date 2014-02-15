/**
 * Created by youxiachai on 14-2-13.
 */

var DBServices = require('../models/index'),
    debug = require('debug')('api: account');


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

   app.get('/api/v1/users/logout', function (req, res){
       req.session.user = {};

       res.send('ok');

   })



   app.get('/api/v1/users/:id', function (req, res){

       DBServices.User.getById(req.params, function (err, result){
           console.log(err)
           res.json({
               data : result
           })
       })
   })

};