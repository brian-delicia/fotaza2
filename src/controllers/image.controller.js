const {User,Post,Image,Comment,Rating }=require('../models');

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

          //helpers   
        const ratings= image.Ratings || [];
        const average =calculateAverage(ratings);

       

      
        res.render('images/detail',{
            image,
            comments:image.Comments || [],
            ratingAverage,
            ratingCount:ratings.length
            
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
        res.redirect('posts')
        return
    }
}