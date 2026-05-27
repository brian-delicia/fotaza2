const{Model,DataTipes}=require('sequelize');
const sequelize=require('../database');

class Report extends Model{}

Report.init({
    target_type:{                          //DENUNCIA  IMAGE O COMMENT
        type:DataTipes.STRING(100),
        allowNull:false
    },
    reason:{
        type:DataTipes.STRING(100),
        allowNull:false

    },
    description:{
        type:DataTipes.TEXT,
        allowNull:false
    },
    status:{                             /* pending → pendiente
                                            dismissed → desestimada
                                            accepted → aceptada*/
        type:DataTipes.STRING(100),      
        defaultValue:'pending'
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