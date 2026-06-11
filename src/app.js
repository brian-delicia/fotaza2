const express=require('express');
const session=require('express-session');
const path=require('path');    //MANEJA RUTAS DE CARPETAS
require('dotenv').config();    // LEER .env
//tablas usuarios y colleciones demo
const sequelize = require('./database');
//const seedRender = require('../database/seedRender');

require('./models');
const {Notification,Message}=require('./models')
const authRoutes = require('./routes/auth.routes');
const postsRoutes = require('./routes/posts.routes');
const imagesRoutes = require('./routes/images.routes');
const commentsRoutes = require('./routes/comments.routes');
const ratingsRoutes = require('./routes/ratings.routes');
const reportsRoutes = require('./routes/reports.routes');
const validatorRoutes = require('./routes/validator.routes');
const followsRoutes = require('./routes/follows.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const collectionsRoutes = require('./routes/collections.routes');
const interestsRoutes = require('./routes/interests.routes');
const messagesRoutes = require('./routes/messages.routes');
const profileRoutes = require('./routes/profile.routes');
const searchRoutes = require('./routes/search.routes');

const {notFound, serverError}=require('./middlewares/error.middleware')


const app=express();

app.set('view engine','pug');                     //le dice  a expressvamos a usar pug
app.set('views',path.join(__dirname,'views'));    //busca las vistas en views

app.use(express.urlencoded({  // configura el express para leer formularios
    extended:true,
    limit:'10mb'
}));

app.use(express.static(path.join(__dirname,'public')));// le  dice a a express que la carpeta public contendra archivos staticos

app.set('trust proxy', 1);
app.use(session({                       //permite mantener los usuarios loguedos
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:true,     //producion cambiar a true
        maxAge:24*60*60*1000 //24hs
    }
}))

app.use(async (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.unreadNotificationsCount = 0;
    res.locals.unreadMessagesCount = 0;

    if (req.session.user) {
    res.locals.unreadNotificationsCount = await Notification.count({
      where: {
        user_id: req.session.user.id,
        read: false
      }
    });

    res.locals.unreadMessagesCount = await Message.count({
      where: {
        receiver_id: req.session.user.id,
        read: false
      }
    });
  }

  next();
});


app.get('/', (req, res) => {
  res.redirect('/posts');
});

app.use('/', authRoutes);
app.use('/posts', postsRoutes);
app.use('/images', imagesRoutes);
app.use('/comments', commentsRoutes);
app.use('/ratings', ratingsRoutes);
app.use('/reports', reportsRoutes);
app.use('/validator', validatorRoutes);
app.use('/follows', followsRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/collections', collectionsRoutes);
app.use('/interests', interestsRoutes);
app.use('/messages', messagesRoutes);
app.use('/profile', profileRoutes);
app.use('/search', searchRoutes);





app.use(notFound);
app.use(serverError);



const PORT = process.env.PORT ;

sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Base sincronizada correctamente');

  

    app.listen(PORT, () => {
      console.log(`servidor funcionando en el puerto: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al iniciar servidor:', error);
  });