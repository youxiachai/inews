/**
 * Created by youxiachai on 14-2-16.
 */
var DB = require('./schemas/index'),
    debug = require('debug')('services: comment'),
    Async = require('async');


/**
 * 错误处理
 * @param err
 */
function handleError(err) {
    this.done(err);
}

function getComments (params, done) {

    var limit =  params.limit ? params.limit : 50;
    var offset =  params.page - 1 * limit;

    var include = [];

    if(params.where.article_id){
       include.push({model : DB.User, attributes : ['name']});
    }

    if(params.where.user_id){
        include.push({model : DB.Article, attributes : ['title', 'created_at']});
    }

    DB.Comment.findAndCountAll({
        include : include,
        order : 'comment.created_at DESC',
        limit : limit,
        where : params.where,
        offset : offset
    }).success(function (commentList){
            var page = parseInt(commentList.count / limit) + 1;
            var rows =  commentList.rows;
            Async.map(rows, function (item, callback){
                item.dataValues.text = item.text;
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



//getComments({
//     where :{ user_id : 1}
//}, function (err, result){
//    console.log(result[0])
//})

exports.getComments = getComments;