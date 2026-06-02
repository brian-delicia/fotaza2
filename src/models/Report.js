const{Model,DataTypes}=require('sequelize');
const sequelize=require('../database');

class Report extends Model{}

Report.init({
    target_type:{                          //DENUNCIA  IMAGE O COMMENT
        type:DataTypes.STRING(100),
        allowNull:false,
        validate:{
            isIn:[['image','comment']]
        }
    },
    reason:{
        type:DataTypes.STRING(100),
        allowNull:false

    },
    description:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    status:{                             
        type:DataTypes.STRING(100),      
        defaultValue:'pending',
        validate:{
            isIn:[['pending','dismissed','accepted']] /*pending → pendiente
                                                        dismissed → desestimada
                                                        accepted → aceptada*/
        }
    }
},{
    sequelize,
    modelName:'Report',
    tableName:'reports',
    timestamps:true,
    createdAt:'created_at',
    paranoid:true
})

module.exports=Report

//SIRVE PARA DENUNCIAS DE IMAGENES Y COMENTARIOS 