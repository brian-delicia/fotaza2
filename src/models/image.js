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
        allowNull:false,
        validate:{
            isIn:[['free','copyright']]
        }

    },
    watermark_text:{
        type:DataTypes.STRING(100),
        allowNull:true
    },
    comments_open: {
  type: DataTypes.BOOLEAN,
  defaultValue: true
}
},{
    sequelize,
    modelName:'Image',
    tableName:'images',
    timestamps:true,
    createdAt: 'created_at',
    paranoid:true
});

module.exports=Image;