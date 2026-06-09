const {Post,Image,Comment,Report}=require('../models')

const{reportSchema}=require('../validations/report.schema');
const createNotification=require('../helpers/createNotification');


exports.reportImage = async (req,res)=>{
    try {
        const imageId= req.params.imageId;
        const userId = req.session.user.id;

       const result = reportSchema.safeParse(req.body);
        if (!result.success) {
         res.redirect(`/images/${imageId}?error=denuncia_invalida`)
         return;
      }
        const { reason, description } = result.data;

        const image = await Image.findByPk(imageId,{
            include:[{
                model:Post

            }]
        });
        if(!image){
            res.redirect('/posts')
            return;
        }
         if (image.Post.user_id === userId) {
            res.redirect(`/images/${image.id}?error=autor_denuncia`)
            return;
        }
       
        const existingReport= await Report.findOne({ //BUSCA SI EL USUARIO YA DENUNCIO LA MISMA IMAGEN
                                                     //PARA EVITAR REPEETIR LA DENUNCIA 
            where:{
                user_id:userId,
                image_id:image.id,
                target_type:'image'

            }

        });
         

        if (existingReport) {
          res.redirect(`/images/${image.id}?error=ya_denunciaste`)
          return;
         }
       
        
        await Report.create({
            user_id:userId,
            image_id:image.id,
            target_type:'image',
            reason,
            description,
            status:'pending'
        });
        await image.Post.update({
            locked_by_report:true

        });
        const reportCount=await Report.count({
            where:{
                image_id:image.id,
                target_type:'image',            //CUENTA CUATNOS USUARIOS DISTINTOS DENUNCIARON LA MISMA IMAGEN 
                status:'pending'
            },
            distinct:true,
            col:'user_id'
        });

        if(reportCount >3){
            await image.Post.update({
                status:'review'
            });
            //helpers
        await createNotification(image.Post.user_id,userId,'report','Una de tus publicaciones fue enviada a revicion')
         

        }
        res.redirect(`/images/${image.id}`)
        return;


    } catch (error) {
        console.error(error)
        res.redirect('/posts')
        return;
        
    }
}


exports.reportComments= async(req,res)=>{
    try {
        
const commentId= req.params.commentId;
const userId= req.session.user.id;

const result= reportSchema.safeParse(req.body)



if (!result.success) {
  const comment = await Comment.findByPk(commentId,{
    include: [
      {
        model: Image
      }
    ]
  });

  if (comment && comment.Image) {
    return res.redirect(`/images/${comment.Image.id}?error=denuncia_invalida`);
  }

  return res.redirect('/posts');
}
const {reason,description}=result.data;

const comment = await Comment.findByPk(commentId,{
    include:[{
        model:Image,
        include:[{
            model:Post
        }]
    }]

});
    if(!comment){
       
        res.redirect('/posts')
        return;
    }
    if(comment.user_id=== userId){
        res.redirect(`/images/${comment.Image.id}`)
        return;
    }
    const existingReport=await Report.findOne({
        where:{
            user_id:userId,
            comment_id:comment.id,
            target_type:'comment'
        }
    });
   if (existingReport) {
     res.redirect(`/images/${comment.Image.id}?error=ya_denunciaste_comentario`)
     return;
     }
     console.log('ANTES DE CREAR REPORT');
console.log('reason:', reason);
console.log('description:', description);
    await Report.create({
        user_id:userId,
        comment_id:comment.id,
        target_type:'comment',
        reason,
        description,
        status:'pending'

    });
    //helpers
    await createNotification(comment.Image.Post.user_id,userId,'report','un comentario fue denunciado')
   
    res.redirect(`/images/${comment.Image.id}`)
    return;

    } catch (error) {
        console.error(error);
        res.redirect('/posts')
        return;

        
    }
}