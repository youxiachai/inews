/**
 * Created by youxiachai on 14-2-16.
 */
var DB = require('./schemas/index'),
    debug = require('debug')('services: comment'),
    crypto = require('crypto'),
    Async = require('async');

function makeGravatarURL(email){
    return 'http://www.gravatar.com/avatar/' + crypto.createHash('md5').update(email).digest('hex');
}


function getComments (params, done) {

    var limit =  params.limit ? params.limit : 50;
    var offset =  (params.page - 1) * limit;

    var include = [];

    if(params.where.article_id){
       include.push({model : DB.User, attributes : ['name','email']});
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
            var page = parseInt(offset / limit) + 1  ;
            var totalPage =  parseInt(commentList.count / limit) + 1;
            var rows =  commentList.rows;
            Async.map(rows, function (item, callback){
                item.dataValues.text = item.text;
                if(item.user){
                    item.dataValues.user = item.user.dataValues;
                    item.dataValues.user.gravatar = makeGravatarURL(item.user.email);
                }
                if(item.article){
                    item.dataValues.article = item.article.dataValues;
                }
                callback(null,  item.dataValues)
            }, function (err, result){
//                done.bind({page : page, count : commentList.count})

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
 *
 * @param params
 * @param done
 */
function postComment(params, done) {

    DB.Article.find({
        where : {id : params.article_id}
    }).done(function (err, article){
            if(err || !article){
                return done(err ? err : 'article not exist')
            }

            DB.Comment.create(params)
                .success(function (comment){
                    DB.Notify.create({
                        message: comment.dataValues.text,
                        from_user_id: comment.user_id,
                        user_id: article.user_id,
                        object_type: 'Article',
                        object_id: article.id
                    }).done(function (err) {
                            //TODO 是否进行邮件提醒
                            debug(JSON.stringify(err));
                        })

                    done(null, 'ok');
                })
                .error(done)
       })
}

//postComment({
//   text : 'ok',
//    user_id: 1,
//    article_id : 1
//}, function (err, result){
//    console.log(err)
//    console.log(result)
//})


//getComments({
//     where :{ user_id : 1}
//}, function (err, result){
//    console.log(result[0])
//})

exports.getComments = getComments;
exports.postComment = postComment;