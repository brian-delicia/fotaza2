require('dotenv').config();

const bcript=require('bcrypt');
const sequelize=require('../src/database');
const {User,Collection}=require('../src/models');

async function seedDatabase(){
    try{
        await sequelize.authenticate();
        const password= await bcript.hash('123456',10)

        const [demoUser]=await User.findOrCreate({
            where:{email:'demo@email.com'},
            defaults:{
                name:'Usuario demo',
                email:'demo@email.com',
                password,
                role:'user'
            }
        })
         const [validatorUser]=await User.findOrCreate({
            where:{email:'validador@email.com'},
            defaults:{
                name:'validador demo',
                email:'validador@email.com',
                password,
                role:'validator'


            }
        });
         await Collection.findOrCreate({
      where: {
        name: 'Favoritos',
        user_id: demoUser.id
      },
      defaults: {
        name: 'Favoritos',
        user_id: demoUser.id
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