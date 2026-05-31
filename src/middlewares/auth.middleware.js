function requireLogin(req,res,next){
    if(!req.session.user){
        res.redirect('/login');               //REQUIERE EL LOGUEO SI NO ESTA REEDIRIJE AL LOGIN
        return                                 //  SI SI ESTA DA DATOS DEL USUARIO  
    }
    next()

}
module.exports = requireLogin;