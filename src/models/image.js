const {Model,DataTypes}=require('sequelize');
const sequelize=require('../database')

class Image extends Model{}
Image.init({
    image_data:{
        type:DataTypes.BLOB('long'),
        allowNull:false
    },
    mime_type:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    license:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    watermak_text:{
        type:DataTypes.STRING(100),
        allowNull:true
    }
},{
    sequelize,
    modelName:'Image',
    tableName:'images',
    timestamps:true,
    createdAt: 'created_at'
});

module.exports=Image;