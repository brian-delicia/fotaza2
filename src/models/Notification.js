const{Model,DataTypes}=require('sequelize');
const sequelize=require('../database');

class Notification extends Model{}

Notification.init({
    type:{
        type:DataTypes.STRING(100),
        allowNull:false
    }, 
    message:{
        type:DataTypes.TEXT,
        allowNull:false

    },
    read:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
     date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
},{
    sequelize,
    modelName:'Notification',
    tableName:'notifications',
    timestamps:false,
    paranoid:true
});

module.exports=Notification;