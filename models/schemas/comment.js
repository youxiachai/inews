/**
 * Created by youxiachai on 14-2-13.
 */

var marked = require('marked'),
    debug = require('debug')('schemas : comment');
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
    return sequelize.define('comment', {
        id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
        text : {type: DataType.TEXT, get : function () {
            debug('get ->' + this.getDataValue('text'));
            return marked(this.getDataValue('text'))
        }},
        user_id : {type: DataType.INTEGER},
        article_id : {type: DataType.INTEGER},
        comment_id : {type: DataType.INTEGER, defaultValue : 0}
    },{
        timestamps : true,
        'createdAt' : 'created_at',
        'updatedAt': 'modified_at'
    });
}