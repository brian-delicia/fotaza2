const {Model}=require('sequelize');
const sequelize=require('../database');

class PostTag extends Model{}

PostTag.init({},{
    sequelize,
    modelName:'PostTag',
    tableName:'post_tags',
    timestamps:false
});

module.exports=PostTag