/**
 * Created by youxiachai on 14-2-14.
 */

var DB = require('./schemas/index'),
    debug = require('debug')('services: user')
    crypto = require('crypto');

//crypto.createHash('sha1').update('123456' + '$' + 'sdF!#$FDA').digest('hex')

function makePassword(password){
    return crypto.createHash('sha1').update(password + '$' + 'd#!AVFed').digest('hex');
}

/**
 *
 * @param params
 * @param done
 */
function postSignUp (params, done) {
    debug(JSON.stringify(params))
    var oneUser = DB.User.build();

    oneUser.name = params.name;
    oneUser.password = makePassword(params.password);
    oneUser.email = params.email;
    oneUser.bio = params.bio;

    oneUser.save()
        .done(done)


}

/**
 *
 * @param params
 * @param done
 */
function postSignIn (params, done) {

    DB.User.find({
        where : DB.mysql.and({password : makePassword(params.password)},
        DB.mysql.or({name : params.name}, {email : params.name}))
    }).done(done)

}
//postSignIn({name : 'youxiachai' , password : '1234567'}, function (err, reuslt){
//      console.log(err)
//
//      console.log(reuslt)
//})


function getById (params, done) {

    DB.User.find({
        where : {id : params.id},
        attributes : ['id', 'name', 'posts_count', 'digged_count' ,'bio', 'created_at']})
        .done(done)

}

/**
 *
 * @param params
 * @param done
 */
function getUserArticle (params, done) {
    DB.User.findAll({
        include : [{model: DB.Article}] ,
        where : {id : params.id}
    }).done(function (err, result){
            console.log(err)
            console.log(result)
        })
}

function getDigg(params, done) {

    DB.UserDigg.findAll({include: [{model: DB.User},{model : DB.Article}]})
        .done(function (err, result){
            console.log(err)
            console.log(result)
        })

}

//getDigg(null, null);

exports.getById = getById;
exports.postSignUp = postSignUp;
exports.postSignIn = postSignIn;