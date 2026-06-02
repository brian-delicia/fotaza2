const{Model,DataTypes}=require('sequelize');
const sequelize=require('../database');

class Tag extends Model  {}

Tag.init({                             //ETIQUETAS
    name:{
        type:DataTypes.STRING(100),
        allowNull:false,
        unique:true
    }
},{
    sequelize,
    modelName:'Tag',
    tableName:'tags',
    timestamps:false
});

module.exports=Tag
