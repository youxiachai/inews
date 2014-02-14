/**
 * Created by youxiachai on 14-2-13.
 */

var DBServices = require('../models/index'),
    debug = require('debug')('api: account');


module.exports = function (app) {

   app.post('/api/v1/signup' , function (req, res){

     DBServices.User.postSignUp(req.body,  function (err, result){
         if (err) {

             return res.json(err)
         }
         res.json(result);
     })

   })

   app.post('/api/v1/signin', function (req, res){

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