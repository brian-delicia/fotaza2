const{User,Post,Image,Comment,Report}=require('../models');
const {commentSchema}=require('../validations/comment.schema');
const createNotification = require('../helpers/createNotification');


exports.create = async  (req,res)=>{
    try {
        const imageId=req.params.imageId;
        const userId= req.session.user.id;
        
        
        const result = commentSchema.safeParse(req.body);
        if(!result.success){
            res.redirect(`/images/${imageId}`)
            return;
        }
        const {content}=result.data;

        
    
        const image=await Image.findByPk(imageId,{
            include:[{
                model:Post
            }]
        })
        if(!image){
            res.redirect('/posts')
            return
        }
        if(!image.comments_open){
            res.redirect(`/images/${image.id}`)
            return;
        }
        const comment= await Comment.create({
            image_id:image.id,
            user_id:userId,
            content:content.trim()
        })
        if(image.Post.user_id !== userId){
            //helpers
        await createNotification(image.Post.user_id,userId,'comment','Comento tu imagen');
           
        }
        res.redirect(`/images/${image.id}`)
        return;

    } catch (error) {
        console.error(error)
        res.redirect('/posts')
        return;
        
    }
}
exports.reportedComments=async(req,res)=>{
    try {
        const userId=req.session.user.id;

        const reports= await Report.findAll({
            where:{
                target_type:'comment',
                status:'pending'
            },
            include:[{
                model:Comment,
                required:true,
                include:[
                    {model:Image,
                    required:true,
                    include:[{
                        model:Post,
                        required:true,
                        where:
                        {
                            user_id:userId
                        }
                    }]

                    },{
                        model:User,
                        attributes:['id','name']
                    }
                ]
            },{
                model:User,
                attributes:['id','name']
            }],
            order:[['created_at','DESC']]

        });
        res.render('comments/reported',{
            reports
        })
        return

    } catch (error) {
  console.error(error);

    return res.render('comments/reported', {
      reports: [],
      error: 'No se pudieron cargar los comentarios denunciados'
    });
  }
}
exports.deleteComment = async (req,res)=>{
    try {
        const commentId = req.params.commentId;
        const userId=req.session.user.id;
        
        const comment = await Comment.findByPk(commentId,{
            include:[{
                model:Image,
                include:[{
                    model:Post
                }]
            }]
        })
        if(!comment){
            res.redirect('/comments/reported')
            return;
        }
        if(comment.Image.Post.user_id!== userId){
            res.redirect('/comments/reported');
            return
        }
        await comment.update({
            active:false
        })
        await Report.update({
            status:'accepted'
        },{
            where:{
                comment_id:comment.id,
                target_type:'comment'
            }
        });

       return res.redirect('/comments/reported')

    } catch (error) {
        console.error(error);
        res.redirect('/comments/reported')
        return;
        
    }
}