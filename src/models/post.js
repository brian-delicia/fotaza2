const{Model,DataTypes}=require('sequelize');
const sequelize=require('../database');

class Post extends Model {}
 Post.init({
    title:{
    type:DataTypes.STRING(100),
    allowNull:false
},
    description:{
    type:DataTypes.TEXT,
    allowNull:true,
    
},
    comments_open:{                   //SIRVE PARA DESABILITAR LOS COMENTARIOS
        type:DataTypes.BOOLEAN,
        defaultValue:true
        },

    status:{
        type:DataTypes.STRING(100),
        defaultValue:'active' /*active → activa
                                review → en revisión por validador
                                removed → dada de baja*/
    },
    locked_by_report:{               //INDICA SI UNA PUBLICACION FUE BLOQQUEADA/CERRADAA POR DENUNCIAS(REPORTS)
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
   
},{
    sequelize,
    modelName:'Post',
    tableName:'posts',
    timestamps:true,
    createdAt:'created_at',
    paranoid:true

 });

 module.exports= Post;