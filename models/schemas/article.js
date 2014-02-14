/**
 * Created by youxiachai on 14-2-13.
 */

module.exports = function (sequelize, DataType) {
    return sequelize.define('article', {
        id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
        title : {type: DataType.STRING, comment:'标题'},
        link : {type: DataType.STRING},
        content : {type: DataType.TEXT},
        point : {type : DataType.FLOAT},
        comments_count : {type: DataType.INTEGER},
        digg_count : {type: DataType.INTEGER},
        status : {type: DataType.INTEGER},
        user_id : {type: DataType.INTEGER}
    },{
        timestamps : true,
        'createdAt' : 'created_at',
        'updatedAt': 'modified_at'
    });
}