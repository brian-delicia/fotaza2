const{Model,DataTypes}=require('sequelize')
const sequelize=require('../database')

class Comment extends Model {}
 
Comment.init({
    content:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }

},{
    sequelize,
    modelName:'Comment',
    tableName:'comments',
    timestamps:true,
    createdAt:'created_at',
    paranoid:true
});
module.exports=Comment;