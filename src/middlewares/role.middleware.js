function requireRole(role){
    return function(req,res,next){
    if(!req.session.user){
     res.redirect('/login');
     return
    }
    if(req.session.user.role!== role){
        res.redirect('/posts')
    }
    next()
}
}
module.exports={requireRole};

/*Recibí un rol.
Si no hay usuario:
    mandar a login.
Si el usuario tiene otro rol:
    mandar a /posts.
Si el rol coincide:
    permitir continuar.*/