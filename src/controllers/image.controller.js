const {User,Post,Image,Comment,Rating,Collection }=require('../models');

const calculateAverage =require('../helpers/calculateAverage');

exports.showRaw = async (req,res)=>{    //mostrar original 
  try {
    
    const image= await Image.findByPk(req.params.imageId)
   
    if(!image){
        res.status(404).send('imagen no encontrada')
        return
     }
     res.set('content-type',image.mime_type); //LE DICE AL NAVEGADOR QUE TIPO DE IMAGEN RECIVE
     res.send(image.image_data);     //ENVIA LOS DATO BINARIOS DE LA IMAGEN
     return


  } catch (error) {
    console.error(error);
    res.status(500).send('eror del servidor al mostrar la imagen ')
    return;
    
  }
}

exports.detail = async (req,res)=>{
    try {
        const image= await Image.findByPk(req.params.imageId,{
            attributes:['id','license','watermark_text','mime_type','comments_open',
                'created_at'],
                include:[{
                    model:Post,
                    include:[{
                        model:User,
                        attributes:['id','name']
                    }]
                },{
                    model:Comment,
                    where:{active:true},
                    required:false,
                    include:[{
                        model:User,
                        attributes:['id','name']
                    }]
                },{
                    model:Rating,
                    attributes:['value']
                }
            ]
        });
        if(!image){
            res.render('errors/404');
            return
        }

        if (!req.session.user && image.license !== 'free') {
           res.redirect('/posts');
           return;
          }

          //helpers   
        const ratings= image.Ratings || [];
        const average =calculateAverage(ratings);

        let collections = [];

        if (req.session.user) {
          collections = await Collection.findAll({
            where: {
              user_id: req.session.user.id,
            },
          });
        }

        let errorMessage = null;

        if (req.query.error === "ya_valoraste") {
          errorMessage = "Ya valoraste esta imagen anteriormente.";
        }

        if (req.query.error === "ya_denunciaste") {
          errorMessage = "Ya denunciaste esta imagen anteriormente.";
        }

        if (req.query.error === "autor_valora") {
          errorMessage = "No podes valorar tu propia imagen.";
        }

        if (req.query.error === "autor_denuncia") {
          errorMessage = "No podes denunciar tu propia imagen.";
        }

        if (req.query.error === "autor_interes") {
          errorMessage = "No podes marcar interes en tu propia imagen.";
        }
        
        if (req.query.error === "ya_interesado") {
          errorMessage = "Ya marcaste interes en esta imagen.";
        }

        if (req.query.error === "autor_denuncia_comentario") {
          errorMessage = "No podes denunciar tu propio comentario.";
        }

        if (req.query.error === "ya_denunciaste_comentario") {
        errorMessage = "Ya denunciaste este comentario anteriormente.";
        }

        if (req.query.error === 'denuncia_invalida') {
        errorMessage = 'Debe completar correctamente el motivo y la descripcion de la denuncia.';
        }

        if (req.query.error === 'denuncia_invalida') {
        errorMessage = 'Debe ingresar un motivo y una descripcion mas completa para la denuncia.';}

        if (req.query.error === "copyright_guardar") {
         errorMessage = "No podes guardar una imagen con copyright sin permiso del autor.";
        }
        if (req.query.error === "imagen_ya_guardada") {
          errorMessage = "Esta imagen ya esta guardada en esa coleccion.";
        }

        let successMessage = null;

        if (req.query.success === 'imagen_denunciada') {
         successMessage = 'Imagen denunciada correctamente.';
           }


        res.render('images/detail',{
            image,
            comments:image.Comments || [],
            ratingAverage:average,
            ratingCount:ratings.length,
            errorMessage,
            successMessage,
            collections
            
        }
    );  return


    } catch (error) {
        console.error(error)
        res.render('errors/500');
        return    
    }
}
exports.closeComments = async (req,res)=>{
    try {
        const image= await Image.findByPk(req.params.imageId,{
            include:[{
                model:Post
            }]
        })
        if(!image){
            res.redirect('/posts')
            return
        }
        if(image.Post.user_id!==req.session.user.id){
            res.redirect(`/images/${image.id}`)
            return
        }

        await image.update({
            comments_open:false
        })
        res.redirect(`/images/${image.id}`)
        return;

    } catch (error) {
        console.error(error)
        res.redirect('/posts')
        return
    }
}