const {Model}=require('sequelize');
const sequelize=require('../database');

class CollectionPost extends Model{}
CollectionPost.init({},{
    sequelize,
    modelName:'CollectionPost',
    tableName:'collection_posts',
    timestamps:false,
    indexes:[{
        unique:true,
        fields:['collection_id','post_id']
    }]
})
module.exports=CollectionPost

//EVITA GUARDAR LA MISMA PUBLICACION DOS VECES EN EL MISMO POST