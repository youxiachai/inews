/**
 * Created by youxiachai on 14-2-14.
 */
module.exports = function (sequelize, DataType) {
    return sequelize.define('user_digg', {
        id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
        user_id : {type :  DataType.INTEGER, unique : true},
        article_id : {type :  DataType.INTEGER, unique: true}
    },{
        timestamps : true,
        'createdAt' : 'created_at',
        'updatedAt': 'modified_at'
    });
}