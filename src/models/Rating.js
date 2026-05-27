const{Model,DataTypes}=require('sequelize');
const sequelize=require('../database')

class Rating extends Model{}
Rating.init({
    value:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            min:1,
            max:5
        }
    }
},{
    sequelize,
    modelName:'Rating',
    tableName:'ratings',
    timestamps:true,
    createdAt:'created_at',
    
    indexes:[
        {unique:true,
            fields:['user_id','image_id']
        }
    ]

})

module.exports=Rating