/**
 * Created by youxiachai on 14-2-15.
 */

var DB = require('./schemas/index'),
    DBServices = require('./index'),
    debug = require('debug')('services: article'),
    Async = require('async'),
    crypto = require('crypto');

function makeGravatarURL(email) {
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

    if (params.user_id) {
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
    var limit = params.limit ? params.limit : 50;
    var offset = (params.page - 1) * limit;


    DB.Article.findAndCountAll({
        include: [
            {model: DB.User, attributes: ['name', 'created_at', 'email']}
        ],
        order: 'article.created_at DESC',
        limit: limit,
        where: params.where,
        offset: offset
    }).success(function (articleList) {
            var page = parseInt(offset / limit) + 1;
            var totalPage = parseInt(articleList.count / limit) + 1;
            var rows = articleList.rows;
            Async.map(rows, function (item, callback) {
                item.dataValues.user = item.user.dataValues;
                item.dataValues.user.gravatar = makeGravatarURL(item.user.email);
                // 检查是否已经推荐过, 暂时这样,后边想一个更好的策略
                if (params.diggUserId) {
                    // 判断文章是否是当前用户
                    if (item.dataValues.user_id === params.diggUserId) {
                        item.dataValues.isOwner = true;
                    }

                    DB.UserDigg.count({
                        where: {article_id: item.id, user_id: params.diggUserId}
                    }).success(function (c) {
                            item.dataValues.isDigg = c;
                            callback(null, item.dataValues)
                        })
                        .error(callback)
                } else {
                    callback(null, item.dataValues)
                }


            }, function (err, result) {
                if (err) {
                    return done(err)
                }

                done(null, {
                    pageInfo: {page: page ? page : 1,
                        totalPage: totalPage},
                    list: result
                });

            })
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

function getById(params, done) {

    DB.Article.find(
        {where: {id: params.id},
            include: [
                {model: DB.User, attributes: ['name', 'email']}
            ]
        }).success(function (article) {
            article.dataValues.user = article.user.dataValues;
            article.dataValues.user.gravatar = makeGravatarURL(article.user.email);

            if (!params.isEdit) {
                article.dataValues.content = article.content;
            }

            if (params.diggUserId) {
                // 判断文章是否是当前用户
                if (article.dataValues.user_id === params.diggUserId) {
                    article.dataValues.isOwner = true;
                }

                DB.UserDigg.count({
                    where: {article_id: article.id, user_id: params.diggUserId}
                }).success(function (c) {
                        article.dataValues.isDigg = c;
                        done(null, article.dataValues)
                    })
                    .error(done)
            } else {
                done(null, article.dataValues);
            }

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

    queryParams.where = ["title like ? OR content like ?", '%' + params.kw + '%', '%' + params.kw + '%']

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
        where: {id: params.digg.article_id },
        attributes: ['digg_count', 'id']
    }).success(function (artcile) {
            if (params.increment) {
                artcile.increment('digg_count', {by: 1})
                    .success(function (inArticle) {
                        inArticle.digg_count = inArticle.digg_count + 1;
                        done(null, inArticle.dataValues)
                    })
                    .error(done)
            } else {
                params.digg.destroy()
                    .success(function () {
                        artcile.decrement('digg_count', {by: 1})
                            .success(function (deArticle) {
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


function updateDiggCountPromise(params, done) {

    DB.Article.find({
        where: {id: params.digg.article_id },
        attributes: ['digg_count', 'id']
    }).then(function (artcile) {

            if (params.increment) {
                return artcile.increment('digg_count', {by: 1})
                    .then(function (inArtcile) {
                        return inArtcile;
                    });
            } else {
                return params
                    .digg
                    .destroy()
                    .then(function () {
                        return artcile.decrement('digg_count', {by: 1})
                            .then(function (deArticle) {
                                return deArticle;
                            })
                    })

            }

        })
        .then(function (currentArtiscle) {
            done(null, currentArtiscle.dataValues);
        })
        .catch(done);

}

/**
 *
 * @param params id, user_id
 * @param done
 */
function delArticle(params, done) {

    DB.Article.find({
        where: {id: params.id, user_id: params.user_id}
    }).success(function (article) {

            if (article) {
                // 标为 -1 删除文章
                article.updateAttributes({
                    status: -1
                }, ['modified_at', 'status']).done(done)
            } else {
                done('没有该文章');
            }
        })
        .error(done)

}


/**
 *
 * @param params id, user_id, content or link
 * @param done
 */
function putArticle(params, done) {

    DB.Article
        .find({
            include: [
                {model: DB.User, attributes: ['name', 'email']}
            ],
            attributes : ['content' , 'title', 'link', 'id'],
            where: {id: params.id, user_id: params.user_id}})
        .then(function (article) {
            if (!article) {
                throw new Error('没有文章 id ' + params.id)
            }

            // 改内容 和 title
            var updateParams = {};
            //省事第一....
            Object.keys(article.dataValues).forEach(function (item){
                if(item === 'id' || item === 'user'){
                    return;
                }
                if(params[item] && article.dataValues[item] !== params[item]){
                    updateParams[item] = params[item];
                }
            })


            var updateArray = Object.keys(updateParams);

            if (updateArray.length > 0) {
                return article
                    .updateAttributes(updateParams, updateArray);
            } else {
                throw new Error('文章 id ' + params.id + '不需要更新');
            }


        })
        .then(function (article){
            article.dataValues.isOwner = true;
            done(null, article.dataValues);;
        })
        .catch(done);

}


putArticle({
    id : 2,
    user_id : 1,
    content : 'put hello wcorld' ,
    title : 'put title' ,
    link : 'put link'
}, function (err, reuslt){
    console.log(err)
    console.log(JSON.stringify(reuslt))
})

exports.updateDiggCount = updateDiggCount;
exports.getById = getById;
exports.getList = getList;
exports.getCommentsByArticle = getCommentsByArticle;
exports.getArticle = getArticle;
exports.getByKeyWords = getByKeyWords;
exports.delArticle = delArticle;
exports.putArticle = putArticle;


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
