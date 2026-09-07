const Sequelize = require ('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',

    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});
module.exports=sequelize;
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);

sequelize.authenticate()
    .then(() => {
        console.log(' Conexión a PostgreSQL exitosa');
    })
    .catch((error) => {
        console.error(' Error de conexión:', error.message);
    });