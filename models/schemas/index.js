/**
 * Created by youxiachai on 14-2-13.
 */

var Sequelize = require('sequelize');

var option = {};
var DBAccess = {};


//process.env.NODE_ENV = 'production'
if(process.env.NODE_ENV === 'production') {
    //my sql 配置
//    option.user = 'root';
//    option.pass = null;
    DBAccess.user = 'root';
    DBAccess.pass =  null;
    option=   {
        host: '127.0.0.1',
        port:  3306,
        dialect: 'mysql',
        logging: true,
        omitNull: true,
        maxConcurrentQueries: 100,
        define: {
        timestamps: false,
            freezeTableName: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
    },
        pool: { maxConnections: 50, maxIdleTime: 300}
    }

} else {
  // sqlite3 配置
    option = {
        dialect: 'sqlite',
        storage: __dirname + '/inews.sqlite',
        define: {
            timestamps: false,
            freezeTableName: true
        }
    }
}

//如果是mysql 第一个为定义好的数据库名字.
var mysql = new Sequelize('inews-community',  DBAccess.user,  DBAccess.pass, option);

var User = mysql.import(__dirname + '/user');

var Article = mysql.import(__dirname + '/article');

var Comment = mysql.import(__dirname + '/comment');

var UserDigg = mysql.import(__dirname + '/user_digg');

var Notify = mysql.import(__dirname + '/notify');

User.hasMany(Article, {foreignKey : 'user_id'});

Article.belongsTo(User, {foreignKey:  'user_id'});

Comment.belongsTo(User, {foreignKey:  'user_id'});
Comment.belongsTo(Article, {foreignKey:  'article_id'})

Notify.belongsTo(User, {foreignKey:  'from_user_id'})
      .belongsTo(Article, {foreignKey:  'object_id'});

Article.hasMany(UserDigg, {foreignKey:  'article_id', as : 'user_digg'});
UserDigg
    .belongsTo(User, {foreignKey:  'user_id'})
    .belongsTo(Article, {foreignKey:  'article_id'});


mysql.sync().error(function (err){
    console.log(err);
})

exports.UserDigg = UserDigg;
exports.User = User;
exports.Article = Article;
exports.Comment = Comment;
exports.Notify = Notify;
exports.mysql = mysql;