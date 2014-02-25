/**
 * Created by youxiachai on 14-2-16.
 */

var DB = require('./schemas/index'),
    debug = require('debug')('services: notify'),
    Async = require('async');



/**
 *  status 0 unread 1, read
 *  type 1 : 为文章的回复
 *  type 2 : 为回复的回复
 * @param params
 * @param done
 */
function getList(params, done) {

    var limit =  params.limit ? params.limit : 50;
    var offset =  params.page - 1 * limit;


    DB.Notify.findAndCountAll({
        include : [
            {model : DB.Article, attributes : ['title', 'created_at']},
            {model : DB.User, attributes : ['name']}],
        order : 'notify.created_at DESC',
        attributes : ['message', 'id', 'created_at'],
        limit : limit,
        where : params.where,
        offset : offset
    }).success(function (commentList){
            var page = parseInt(offset / limit) + 1  ;
            var totalPage =  parseInt(commentList.count / limit) + 1;
            var rows =  commentList.rows;
            Async.map(rows, function (item, callback){
                if(item.user){
                    item.dataValues.user = item.user.dataValues;
                }
                if(item.article){
                    item.dataValues.article = item.article.dataValues;
                }
                callback(null,  item.dataValues)
            }, function (err, result){
                if(err) {
                    return done(err)
                }

                done(null, {
                    pageInfo : {page : page ? page : 1,
                        totalPage : totalPage},
                    list : result
                });
            })
        })
        .error(done);
}

/**
 * 设置消息已读
 * @param params
 * @param done
 */
function postMarkRead(params, done) {

    DB.Notify.update({status : 1},params.where)
        .done(done)
}

//postMarkRead({
//    where : {id : 1}
//}, function (err, affectRows){
//    console.log(err)
//    console.log(affectRows)
//})

exports.getList = getList;
exports.postMarkRead = postMarkRead;