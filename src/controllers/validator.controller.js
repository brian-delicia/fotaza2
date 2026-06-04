const {User,Post,Image,Report}=require('../models')

exports.worklist = async (req,res)=>{   //LISTA DE TRABAJO ----PUBLICACIONES DENUNCIADAS
    try {
        const posts=await Post.findAll({
            where:{
                status:'review'
            },
            include:[{
                model:User,
                attributes:['id','name','email','removed_posts_count']
            },{
                model:Image,
                attributes:['id','license','mime_type'],
                include:[{
                   model:Report,
                   where:{
                    target_type:'image',
                    status:'pending'
                   },
                   required:false,
                   include:[{
                    model:User,
                    attributes:['id','name','email']

                   }]

                }]

            }],
            order:[['created_at','DESC']]
        });
        res.render('validator/reports',{
            posts
        })


    } catch (error) {
        console.error(error)
        res.render('validator/reports',{
            posts:[],
            error:'no se pudo cargar la lista de revision'
        })        
    }
}

exports.postDetail= async(req,res)=>{
    try {
        const post= await Post.findByPk(req.params.postId,{
            include:[{
                model:User,
                attributes:['id','name','email','removed_posts_count']
            },{
                model:Image,
                attributes:['id','license','mime_type','watermark_text'],
                include:[{
                    model:Report,
                    where:{
                        target_type:'image',
                        status:'pending'
                    },
                    required:false,
                    include:[{
                        model:User,
                        attributes:['id','name','email']
                    }]

                }]
            }]
        });
        if(!post){
            res.redirect('/validator/reports')
            return;
        }
        res.render('validator/post-detail',{
           post 
        });
        return;


    } catch (error) {
        console.error(error)
        res.redirect('/validator/reports')
        
    }
}
exports.removePost= async(req,res)=>{
    try {
        const post= await Post.findByPk(req.params.postId,{
            include:[{
                model:User
            },{
                model:Image
            }
        ]
        });
        if(!post){
            res.redirect('/validator/reports')
            return;

        }
        await post.update({
            status:'removed'
        });
        await Report.update({
            status:'accepted'
        },
    {
        where:{
            target_type:'image',
            image_id:post.Images.map(image=>image.id),
            status:'pending'
        }
    });
    const author = post.User;

    const newCount=author.removed_posts_count + 1;

    await author.update({
        removed_posts_count:newCount,
        active:newCount>=3 ? false : author.active

    })
    res.redirect('/validator/reports')
    return;



    } catch (error) {
        console.error(error);
        res.redirect('/validator/reports')
        return;
        
    }
}


exports.dismissReports= async (req,res)=>{  //rechace/desestime las denuncias de una publicación.
    try {
        const post= await Post.findByPk(req.params.postId,{
            include:[{
                model:Image
            }]
        });
        if(!post){
            res.redirect('/validator/reports')
            return;
        }
        const imageIds= post.Images.map(image=>image.id);
        await Report.update({
            status:'dismissed'

        },{
            where:{
                target_type:'image',
                image_id:imageIds,
                status:'pending'
            }
        });
        await post.update({
            status:'active',
            locked_by_report:false

        })
        res.redirect('/validator/reports');
        return;


    } catch (error) {
          console.error(error);

      res.redirect('/validator/reports')
      return;
        
    }
}

