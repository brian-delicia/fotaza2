const {Model,DataTypes}=require('sequelize');
const sequelize=require('../database');


class Collection extends Model{}

Collection.init({
    name:{
        type:DataTypes.STRING(100),
        allowNull:false
    }
},{
    sequelize,
    modelName:'Collection',
    tableName:'collections',
    timestamps:true,
    createdAt:'created_at',
   paranoid:true
    
})
module.exports=Collection