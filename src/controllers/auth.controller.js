const bcrypt=require('bcrypt');
const {User}=require('../models')

exports.showRegister = (req,res)=>{
    res.render('auth/register');
};

exports.register = async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        const existingUser = await User.findOne({
            where:{email}
        })
        if(existingUser){
            res.render('auth/register',{
                error:'El email ya esta registrado'
            })
            return;
        }

        const hashedPassword= await bcrypt.hash(password,10);
        await User.create({
            name,
            email,
            password:hashedPassword,
            role: 'user'
        })
        res.redirect('/login');
        return;
    }catch(error){
        console.error(error);
        res.render('auth/register',{
            error:'no se pudo registrar el usuario '
        })
            return;
    }

};
exports.showLogin = (req,res)=>{
    res.render('auth/login');

}
exports.login= async (req,res)=>{
    try{
        const{email,password}=req.body;
        const user= await User.findOne({
            where:{
                email,
                active:true
            }
        })
        if(!user){
            res.render('auth/login',{
                error:'Usuario no encontrado'
            })
            return;
        }
        const passwordOk = await bcrypt.compare(password,user.password);
        if(!passwordOk){
            res.render('auth/login',{
                error:'contraseña incorrecta'
            })
            return;
        }
        req.session.user={
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role
        };
        res.redirect('/posts');
        return;
    }catch(error){
        console.error(error);
        res.render('auth/login',{
            error:'no se pudo iniciar sesion'
        })
        return;

    }
}
exports.logout = (req,res)=>{
    req.session.destroy(()=>{      //el destroy elimina la sesion la cierra
        res.redirect('/login');
    });
};