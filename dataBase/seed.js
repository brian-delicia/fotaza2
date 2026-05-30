require('dotenv').config();

const bcript=require('bcrypt');
const sequelize=require('../src/database');
const {User}=require('../src/models');

async function seedDatabase(){
    try{
        await sequelize.authenticate();
        const password= await bcript.hash('123456',10)

        await User.findOrCreate({
            where:{email:'demo@email.com'},
            defaults:{
                name:'Usuario demo',
                email:'demo@email.com',
                password,
                role:'user'
            }
        })
        await User.findOrCreate({
            where:{email:'validador@email.com'},
            defaults:{
                name:'validador demo',
                email:'validador@email.com',
                password,
                role:'validator'


            }
        });
        console.log('datos cargados correctamente')
        process.exit();

    }catch(error){
        console.error('error al cargar los datos',error);
        process.exit(1);

    }
}

seedDatabase();