const {Model,DataTypes}=require('sequelize');
const sequelize=require('../database');

class  CollectionImage extends Model{}
CollectionImage.init({},{
    sequelize,
    modelName:'CollectionImage',
    tableName:'collection_images',
    timestamps:false,
    indexes:[
        {
            unique:true,
            fields:['collection_id','image_id']
        }
    ]

})

module.exports=CollectionImage;