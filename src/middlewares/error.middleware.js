function notFound(req,res){
    
    res.status(404).render('/errors/404');
    return
}
function  serverError(error,req,res,next){
    console.error("error interno en el servidor",error);
    res.status(500).render('errors/500')
    return

}

module.exports={
    notFound,serverError
};