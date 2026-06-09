const bcrypt=require('bcrypt');
const {User}=require('../models')
const {registerSchema,loginSchema}=require('../validations/auth.schema')

exports.showRegister = (req,res)=>{
    res.render('auth/register');
};

exports.register = async (req,res)=>{
    try{
        const result=registerSchema.safeParse(req.body);
        if(!result.success){
            res.render('auth/register',{
                error:result.error.issues[0].message
            })
            return;
        }
        const {name,email,password}=result.data;
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
        res.redirect('/login?registered=true');
        return;
    }catch(error){
        console.error(error);
        res.render('auth/register',{
            error:'No se pudo registrar el usuario '
        })
            return;
    }

};
exports.showLogin = (req,res)=>{
    res.render('auth/login', {
        success: req.query.registered
            ? 'Usuario registrado correctamente. Ya puede iniciar sesión.'
            : null
    })

}
exports.login= async (req,res)=>{
    try{
        const result = loginSchema.safeParse(req.body);

        if(!result.success){
            res.render('auth/login',{
                error:result.error.issues[0].message
            })
            return;
        }
        const{email,password}=result.data;
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
                error:'Contraseña incorrecta'
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
            error:'No se pudo iniciar sesion'
        })
        return;

    }
}
exports.logout = (req,res)=>{
    req.session.destroy(()=>{      //el destroy elimina la sesion la cierra
        res.redirect('/login');
    });
};