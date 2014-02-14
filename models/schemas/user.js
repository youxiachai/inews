/**
 * Created by youxiachai on 14-2-14.
 */
module.exports = function (sequelize, DataType) {
    return sequelize.define('user', {
        id: {type: DataType.INTEGER, primaryKey: true, autoIncrement: true},
        name : {type: DataType.STRING, comment:'用户名'},
        password: {type : DataType.STRING, comment:'密码'},
        email : {type : DataType.STRING},
        bio : {type : DataType.TEXT},
        posts_count : {type : DataType.INTEGER} ,
        digged_count : {type : DataType.INTEGER}  ,
        status : {type :  DataType.INTEGER},
        create_passport_id : {type :  DataType.INTEGER}
    },{
        timestamps : true,
        'createdAt' : 'created_at',
        'updatedAt': 'modified_at'
    });
}