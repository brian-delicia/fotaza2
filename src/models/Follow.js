

const {Model}=require('sequelize')
const sequelize = require("../database");

class Follow extends  Model{}
Follow.init({},{
    sequelize,
    modelName:'Follow',
    tableName:'follows',
    timestamps:true,
    createdAt:'created_at',
    
    indexes:[{
        unique:true,
        fields:['follower_id','followed_id']
    }]
})

module.exports=Follow;