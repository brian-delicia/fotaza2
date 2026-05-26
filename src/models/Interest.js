const {Model,DataTypes}=require('sequelize');
const  sequelize=require('../database');

class Interest extends Model{}

Interest.init({
    status:{
        type:DataTypes.STRING(100),
        defaultValue:'open'
    }
},{
    sequelize,
    modelName:'Interest',
    tableName:'interests',
    timestamps:true,
    createdAt:'created_at',
    paranoid:true,
    indexes:[
        {
            unique:true,
            fields:['user_id','image_id']
        }
    ]
})

module.exports=Interest

//SIRVE  PARA EL BOTON ME INTERESA