const{Model,DataTypes}=require('sequelize');
const sequelize= require('../database')


class User extends Model {}

User.init({
    name:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    email:{
        type:DataTypes.STRING(100),
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING(200),
        allowNull:false,
      

    },
    role:{
        type:DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'user',
        validate:{
            isIn:[['user','validator']]
        }
    },
    active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    removed_posts_count:{               //CANTIDAD DE PULICACIONES ELIMINADAS/BAJADAS
        type:DataTypes.INTEGER,
        defaultValue:0

    }
},{
    sequelize,
    modelName:'User',
    tableName:'users',
    timestamps:true,
    createdAt:'created_at',
    paranoid:true


});
module.exports=User