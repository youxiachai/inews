/**
 * Created by youxiachai on 14-2-13.
 */
var marked = require('marked'),
    xss = require('xss'),
    debug = require('debug')('schemas : article');
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});
module.exports = function (sequelize, DataType) {
    return sequelize.define('article', {
        id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
        title : {type: DataType.STRING, comment:'标题', get : function () {
            return xss(this.getDataValue('title'))
        }, validate: {
            notNull : true
        }},
        link : {type: DataType.STRING},
        content : {type: DataType.TEXT, get : function (){
            return marked(this.getDataValue('content'))
        }, validate: {
            notNull : true
        }},
        point : {type : DataType.FLOAT,  defaultValue : 0},
        comments_count : {type: DataType.INTEGER,  defaultValue : 0},
        digg_count : {type: DataType.INTEGER,  defaultValue : 0},
        status : {type: DataType.INTEGER, defaultValue : 1},
        user_id : {type: DataType.INTEGER}
    },{
        timestamps : true,
        'createdAt' : 'created_at',
        'updatedAt': 'modified_at'
    });
}