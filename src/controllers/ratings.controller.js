const {Post,Image,Rating}=require('../models')
const {ratingSchema}=require('../validations/rating.schema')

const createNotification=require('../helpers/createNotification');


exports.rateImage= async (req,res)=>{  //VALORAR LA IMAGEN
    try {
        const imageId=req.params.imageId
        const userId=req.session.user.id
        const result = ratingSchema.safeParse(req.body);

        if(!result.success){
            res.redirect(`/images/${imageId}`)
            return;

        }
        const numericValue = result.data.value;

        const image= await Image.findByPk(imageId,{
            include:[{
                model:Post
            }]

        });
        if(!image){
            res.redirect('/posts')
            return
        }

      
        const existingRating= await Rating.findOne({ //BUSCA SI EL USUARIO YA HIZO UNA VALORACION
            where:{
                user_id:userId,
                image_id:image.id
            }
        })
           if (image.Post.user_id === userId) {
              res.redirect(`/images/${image.id}?error=autor_valora`)//si el autor valida su propia imagen
            return;
            }
            
       
         if (existingRating) {       
          res.redirect(`/images/${image.id}?error=ya_valoraste`)//por si ya vvaloraste la imagen 
          return;
               }
           await Rating.create({
                 user_id:userId,
                 image_id:image.id,
                 value:numericValue

        });

        //helpers
        await createNotification(image.Post.user_id,userId,'rating','valorizo una de tus imagenes');
     
        res.redirect(`/images/${image.id}`)
            return

    } catch (error) {
        console.error(error)
        res.redirect('/posts')
        return
        
    }
}