const {Post,Image,Rating,Notification}=require('../models')
exports.rateImage= async (req,res)=>{  //VALORAR LA IMAGEN
    try {
        const imageId=req.params.imageId
        const userId=req.session.user.id
        const {value}=req.body;
        if(!value){
            res.redirect(`/images/${imageId}`)
            return;
        }
        const numericValue= Number(value);

        if(numericValue<1||numericValue>5){     //VALIDA PUNTUACION 
            res.redirect(`/images/${imageId}`)
            return;
        }
        const image= await Image.findByPk(imageId,{
            include:[{
                model:Post
            }]

        });
        if(!image){
            res.redirect('/posts')
            return
        }
        if(image.Post.user_id=== userId){
            res.redirect(`/images/${image.id}`);
            return;

        }
        const existingRating= await Rating.findOne({ //BUSCA SI EL USUARIO YA HIZO UNA VALORACION
            where:{
                user_id:userId,
                image_id:image.id
            }
        })
        if(existingRating){
            res.redirect(`/images/${image.id}`)
            return;
        }
        await Rating.create({
            user_id:userId,
            image_id:image.id,
            value:numericValue

        });
        await Notification.create({
            user_id:image.Post.user_id,
            actor_id: userId,
            type:'rating',
            message:'alguien valorizo una de tus imagenes'

        });
        res.redirect(`/images/${image.id}`)
            return

    } catch (error) {
        console.error(error)
        res.redirect('/posts')
        return
        
    }
}