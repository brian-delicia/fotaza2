const bcrypt = require('bcrypt');
const { User, Collection } = require('../src/models');

async function seedRender() {
  const password = await bcrypt.hash('123456', 10);

  const users = [
    { name: 'brian delicia', email: 'brian@email.com' },
    { name: 'aldana perez', email: 'aldana@email.com' },
    { name: 'steven flores', email: 'steven@email.com' },
    { name: 'sabrina villegas', email: 'sabrina@email.com' },
    { name: 'sandra andrada', email: 'sandra@email.com' }
  ];

  const createdUsers = [];

  for (const user of users) {
    const [newUser] = await User.findOrCreate({
      where: { email: user.email },
      defaults: {
        name: user.name,
        email: user.email,
        password,
        role: 'user'
      }
    });

    createdUsers.push(newUser);
  }

  await User.findOrCreate({
    where: { email: 'validador@email.com' },
    defaults: {
      name: 'validador demo',
      email: 'validador@email.com',
      password,
      role: 'validator'
    }
  });

  for (const user of createdUsers) {
    await Collection.findOrCreate({
      where: {
        name: 'Favoritos',
        user_id: user.id
      },
      defaults: {
        name: 'Favoritos',
        user_id: user.id
      }
    });
  }

  console.log('Usuarios demo cargados');
}

module.exports = seedRender;