require('dotenv').config();

const sequelize=require('../src/database');
require('../src/models');

async function initDatabase(){
    try{
     await sequelize.authenticate();
     console.log('conexion con la base de datos exitosa')

     await sequelize.sync({force:true});
     console.log('tablas creadas con exito');
     process.exit();
    }catch(error){
        console.log('problemas al cargar  tablas',error)
        process.exit(1)

    }
}

initDatabase();