/**
 * Created by youxiachai on 14-2-15.
 */

var DB = require('./schemas/index'),
    DBServices = require('./index'),
    debug = require('debug')('services: article'),
    Async = require('async'),
    crypto = require('crypto');

function makeGravatarURL(email){
    return 'http://www.gravatar.com/avatar/' + crypto.createHash('md5').update(email).digest('hex');
}



function getDeleteList(params, done) {
    var queryParams = {}

    queryParams.where = {};
    queryParams.where.status = -1

    queryParams.page = params.page;

    getArticle(queryParams, done);
}

/**
 *
 * @param params
 * @param done
 */
function getList(params, done) {
    var queryParams = {}

    queryParams.where = {};
    queryParams.where.status = 1;

    if(params.user_id){
        queryParams.where.user_id = params.user_id
    }

    queryParams.page = params.page;

    queryParams.diggUserId = params.diggUserId;


    getArticle(queryParams, done);
}

/**
 *
 * @param params
 * @param done
 */
function getArticle(params, done) {
    var limit =  params.limit ? params.limit : 50;
    var offset =  (params.page - 1) * limit;


    DB.Article.findAndCountAll({
        include : [{model : DB.User, attributes : ['name', 'created_at', 'email']}],
        order : 'article.created_at DESC',
        limit : limit,
        where : params.where,
        offset : offset
    }).success(function (articleList){
        var page = parseInt(articleList.count / limit) + 1;
        var rows =  articleList.rows;
        Async.map(rows, function (item, callback){
            item.dataValues.user = item.user.dataValues;
            item.dataValues.user.gravatar = makeGravatarURL(item.user.email);
            // 检查是否已经推荐过, 暂时这样,后边想一个更好的策略
            if(params.diggUserId){
                DB.UserDigg.count({
                    where : {article_id : item.id, user_id: params.diggUserId}
                }).success(function (c){
                        item.dataValues.isDigg = c;
                        callback(null,  item.dataValues)
                    })
                    .error(callback)
            } else {
                callback(null,  item.dataValues)
            }



            }, done.bind({page : page, count : articleList.count}))
        })
        .error(done);
}

//getArticle({
//    user_id : 1,
//    where : {status : 1}
//}, function (err, result){
//    console.log(err);
//    console.log(result)
//})

function getById (params, done) {

  DB.Article.find(
      {where : {id : params.id},
     include: [{model: DB.User, attributes: ['name', 'email']}]
  }).success(function (article){
          article.dataValues.user = article.user.dataValues;
          article.dataValues.user.gravatar = makeGravatarURL(article.user.email);
          done(null,  article.dataValues);
      })
      .error(done);
}

function getCommentsByArticle(params, done) {
    var queryParams = {}

    queryParams.where = {};
    queryParams.where.article_id = params.id;

    queryParams.page = params.page;
    queryParams.limit = params.limit;

    DBServices.Comment.getComments(queryParams, done);
}

function getByKeyWords(params, done) {

    var queryParams = {}

    queryParams.where = ["title like ? OR content like ?", '%'+ params.kw + '%','%'+ params.kw + '%']

    queryParams.page = params.page;
    queryParams.limit = params.limit;

    getArticle(queryParams, done);
}

//getByKeyWords({
//    kw : 'test'
//}, function (err, result){
//    console.log(err)
//    console.log(result);
//})

/**
 * 更新推荐数
 * @param params {digg object, increment boolean}
 * @param done
 */
function updateDiggCount(params, done) {

    DB.Article.find({
        where: {id :params.digg.article_id },
        attributes:['digg_count', 'id']
    }).success(function (artcile){
            if(params.increment){
                artcile.increment('digg_count', {by : 1})
                    .success(function (inArticle){
                        inArticle.digg_count = inArticle.digg_count + 1;
                        done(null, inArticle.dataValues)
                    })
                    .error(done)
            }else{
                params.digg.destroy()
                    .success(function (){
                        artcile.decrement('digg_count', {by : 1})
                            .success(function (deArticle){
                                deArticle.digg_count = deArticle.digg_count - 1;
                                done(null, deArticle.dataValues)
                            })
                            .error(done)
                    })
                    .error(done)
            }
        })
        .error(done);

}

exports.updateDiggCount = updateDiggCount;
exports.getById = getById;
exports.getList = getList;
exports.getCommentsByArticle = getCommentsByArticle;
exports.getArticle = getArticle;
exports.getByKeyWords = getByKeyWords;


//getCommentsByArticle({id : 2}, function (err, result){
//    console.log(err);
//    console.log(result);
//})

//getList({}, function (err, result){
////    console.log(err)
//   console.log(this)
//    console.log(result[0])
//})

//getDeleteList({}, function (err, result){
//   // console.log(err)
//  //  console.log(this.page)
//    console.log(result[0])
//})
