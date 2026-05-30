const express=require('express');
const session=require('express-session');
const path=require('path');
require('dotenv').config();

require('./models');

const app=express();

app.set('view engine','pug');                     //le dice  a expressvamos a usar pug
app.set('views',path.join(__dirname,'views'));    //busca las vistas en views

app.use(express.urlencoded({  // configura el express para leer formularios
    extended:true,
    limit:'10mb'
}));

app.use(express.static(path.join(__dirname,'public')));// le  dice a a express que la carpeta public contendra archivos staticos

app.use(session({                       //permite mantener los usuariosloguedos
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,     //producion cambiar a true
        maxAge:24*62*62*1000 //24hs
    }
}))

app.use((req,res,next) =>{
    res.locals.user= req.session.user || null;
    next();
})

app.get('/',(req,res)=>{
    res.redirect('/posts');
})

const PORT=process.env.port ||3000;

app.listen(PORT,()=>{
    console.log(`servidor funcionando  en el puerto: ${PORT}`)
})