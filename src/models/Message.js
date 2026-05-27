const {Model,DataTypes}=require('sequelize');

const sequelize=require('../database');

class Message extends Model{}

Message.init({
    content:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    read:{                        //SI  FUE VISTO O LEIDO 
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    sequelize,
    modelName:'Message',
    tableName:'messages',
    timestamps:true,
    createdAt:'created_at',
    paranoid:true
})

module.exports=Message

//SIRVE PARA MENSAJERIA PRIVADA ENTRE  AUTOR Y INTERESADO