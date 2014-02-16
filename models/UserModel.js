/**
 * Created by youxiachai on 14-2-14.
 */

var DB = require('./schemas/index'),
    DBServices = require('./index'),
    debug = require('debug')('services: user'),
    Async = require('async'),
    xss = require('xss'),
    crypto = require('crypto');

function makePassword(password){
    return crypto.createHash('sha1').update(password + '$' + 'd#!AVFed').digest('hex');
}

function handleError(err) {
    this.done(err);
}

/**
 *
 * @param params
 * @param done
 */
function postSignUp (params, done) {
    debug(JSON.stringify(params))
    var oneUser = DB.User.build();

    oneUser.name = xss(params.name);
    oneUser.password = makePassword(params.password);
    oneUser.email =  xss(params.email);
    oneUser.bio =  xss(params.bio);

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

/**
 * 获取用户推荐文章列表
 * @param params
 * @param done
 */
function getDiggs(params, done) {

    var limit =  params.limit ? params.limit : 50;
    var offset =  (params.page - 1) * limit;

    DB.UserDigg.findAndCountAll({
        include: [
            {model : DB.Article,
             include: [ {model : DB.User, attributes: ['name']}]}
        ],
        limit : limit,
        order : 'article.created_at DESC',
        where : {user_id : params.id},
        offset : offset})
        .success(function (diggs){
            var page = parseInt(diggs.count / limit) + 1;
            var rows =  diggs.rows;
            Async.map(rows, function (item, callback){
                item.dataValues.article =  item.article.dataValues;
                item.dataValues.article.user =  item.article.user.dataValues;
                callback(null,  item.dataValues.article)
            },  done.bind({page : page, count : diggs.count}))
        })
        .error(handleError.bind({done : done}));

}

/**
 * 获取用户发表的文章
 * @param params
 * @param done
 */
function getPosts(params, done) {

    var queryParams = {}

    queryParams.where = {};
    queryParams.where.user_id = params.id;

    queryParams.page = params.page;
    queryParams.limit = params.limit;


  DBServices.Article.getArticle(queryParams, done)


}

//getPosts({
//    user_id : 1
//}, function (err, result){
//    console.log(err)
//    console.log(result);
//})

/**
 * 获取用户的评论内容
 * @param params {id, page, limit}
 * @param done
 */
function getComments(params, done) {
    var queryParams = {}

    queryParams.where = {};
    queryParams.where.user_id = params.id;

    queryParams.page = params.page;
    queryParams.limit = params.limit;

    DBServices.Comment.getComments(queryParams , done);
}


/**
 * 获取用户的通知
 * @param params
 * @param done
 */
function getNotify(params, done) {

    var queryParams = {}

    queryParams.where = {};
    queryParams.where.user_id = params.id;
    queryParams.where.status = params.status;

    queryParams.page = params.page;
    queryParams.limit = params.limit;

    DBServices.Notify.getList(queryParams, done)
}

//getNotify({
//    id : 1,
//    status : 1
//}, function (err, result){
//    console.log(err);
//    console.log(result[0])
//})

//getComments({id : 1} , function (err, result){
//    console.log(err)
//    console.log(result[0])
//})


//getDigg({id : 1}, function (err, result){
//    console.log(err)
//    console.log(this)
//    console.log(result[0])
//})

//getDigg(null, null);

exports.getDiggs = getDiggs;
exports.getById = getById;
exports.postSignUp = postSignUp;
exports.postSignIn = postSignIn;
exports.getPosts = getPosts;
exports.getNotify = getNotify;
exports.getComments = getComments;