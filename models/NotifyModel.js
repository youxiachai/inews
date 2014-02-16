/**
 * Created by youxiachai on 14-2-16.
 */

var DB = require('./schemas/index'),
    debug = require('debug')('services: notify'),
    Async = require('async');

/**
 * 错误处理
 * @param err
 */
function handleError(err) {
    this.done(err);
}

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
            var page = parseInt(commentList.count / limit) + 1;
            var rows =  commentList.rows;
            Async.map(rows, function (item, callback){
                if(item.user){
                    item.dataValues.user = item.user.dataValues;
                }
                if(item.article){
                    item.dataValues.article = item.article.dataValues;
                }
                callback(null,  item.dataValues)
            }, done.bind({page : page, count : commentList.count}))
        })
        .error(handleError.bind({done : done}));
}

exports.getList = getList;