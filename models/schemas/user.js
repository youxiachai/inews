/**
 * Created by youxiachai on 14-2-14.
 */
module.exports = function (sequelize, DataType) {
    return sequelize.define('user', {
        id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
        name : {type: DataType.STRING, comment:'用户名'},
        password: {type : DataType.STRING, comment:'密码'},
        email : {type : DataType.STRING, defaultValue : ''},
        bio : {type : DataType.TEXT, defaultValue : ''},
        posts_count : {type : DataType.INTEGER,  defaultValue : 0} ,
        digged_count : {type : DataType.INTEGER, defaultValue : 0}  ,
        status : {type :  DataType.INTEGER, defaultValue : 1},
        create_passport_id : {type :  DataType.INTEGER}
    },{
        timestamps : true,
        'createdAt' : 'created_at',
        'updatedAt': 'modified_at'
    });
}