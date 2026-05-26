const {Model}=require('sequelize');
const sequelize=reqquire('../database');

class PostTag extends Model{}

PostTag.init({},{
    sequelize,
    modelName:'PostTag',
    tableName:'postTags',
    timestamps:false
});

module.exports=PostTag