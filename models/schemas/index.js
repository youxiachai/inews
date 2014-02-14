/**
 * Created by youxiachai on 14-2-13.
 */

var Sequelize = require('sequelize');

var mysqlConfig = {};
mysqlConfig.user = 'root';
mysqlConfig.pass = null;
mysqlConfig.host = '127.0.0.1';
mysqlConfig.port = '3306'
mysqlConfig.logging = true;

var mysql = new Sequelize('inews-community',  mysqlConfig.user,  mysqlConfig.pass, {
    host: mysqlConfig.host,
    port:  mysqlConfig.port,
    dialect: 'mysql',
    logging: mysqlConfig.logging,
    omitNull: true,
    maxConcurrentQueries: 100,
    define: {
        timestamps: false,
        freezeTableName: true,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    },
    pool: { maxConnections: 50, maxIdleTime: 300}
});

var User = mysql.import(__dirname + '/user');

var Article = mysql.import(__dirname + '/article');

User.hasMany(Article, {foreignKey : 'user_id'});

Article.belongsTo(User, {foreignKey:  'user_id'});

exports.User = User;
exports.Article = Article;