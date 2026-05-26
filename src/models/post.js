const{Model,DataTypes}=require('sequelize');
const sequelize=require('../database');

class Post extends Model {}
 Post.init({
    title:{
    type:DataTypes.STRING(100),
    allowNull:false
},
    description:{
    type:DataTypes.TEXT,
    allowNull:true,
    
},
    comments_open:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
        },

    status:{
        type:DataTypes.STRING(100),
        defaultValue:'active'
    },
    locked_by_report:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
   
},{
    sequelize,
    modelName:'Post',
    tableName:'posts',
    timestamps:true,
    createdAt:'created_at',
    paranoid:true

 });

 module.exports= Post;