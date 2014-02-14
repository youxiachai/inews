/**
 * Created by youxiachai on 14-2-13.
 */

module.exports = function (sequelize, DataType) {
    return sequelize.define('comment', {
        id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
        text : {type: DataType.TEXT},
        user_id : {type: DataType.INTEGER},
        article_id : {type: DataType.INTEGER},
        comment_id : {type: DataType.INTEGER}
    },{
        timestamps : true,
        'createdAt' : 'created_at',
        'updatedAt': 'modified_at'
    });
}