/**
 * Created by youxiachai on 14-2-15.
 */

var DB = require('./schemas/index'),
    debug = require('debug')('services: article'),
    Async = require('async');

/**
 * 错误处理
 * @param err
 */
function handleError(err) {
    this.done(err);
}

function getDeleteList(params, done) {
    var queryParams = {}

    queryParams.where = {};
    queryParams.where.status = -1

    queryParams.page = params.page;

    getArticle(queryParams, done);
}

function getList(params, done) {
    var queryParams = {}

    queryParams.where = {};
    queryParams.where.status = {ne : -1}

    if(params.user_id){
        queryParams.where.user_id = params.user_id
    }

    queryParams.page = params.page;


    getArticle(queryParams, done);
}

/**
 *
 * @param params
 * @param done
 */
function getArticle(params, done) {
    var limit =  params.limit ? params.limit : 50;
    var offset =  params.page - 1 * limit;

    DB.Article.findAndCountAll({
        include : [{model : DB.User}],
        order : 'article.created_at DESC',
        limit : limit,
        where : params.where,
        offset : offset
    }).success(function (articleList){
        var page = parseInt(articleList.count / limit) + 1;
        var rows =  articleList.rows;
        Async.map(rows, function (item, callback){
            item.dataValues.user = item.user.dataValues;
            delete item.dataValues.user.password
            callback(null,  item.dataValues)
            }, done.bind({page : page, count : articleList.count}))
        })
        .error(handleError.bind({done : done}));
}

function getById (params, done) {

  DB.Article.find(
      {where : {id : params.id},
     include: [{model: DB.User}]
  }).success(function (article){
          article.dataValues.user = article.user.dataValues;
          delete  article.dataValues.user.password;
          done(null,  article.dataValues);
      })
      .error(handleError.bind({done : done}));
}

exports.getById = getById;
exports.getList = getList;

//getList({}, function (err, result){
////    console.log(err)
//   console.log(this)
////    console.log(result[0])
//})

//getDeleteList({}, function (err, result){
//   // console.log(err)
//  //  console.log(this.page)
//    console.log(result[0])
//})
