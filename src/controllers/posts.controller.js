const {Op, where}=require('sequelize');
const {User,Post,Image,Tag,Rating,Follow}=require('../models')

exports.index= async (req,res)=>{
    try {
        const user=req.session.user || null
        const includeImage={
            model:Image,
            attributes:['id','license','watermark_text','mime_type']
        };
        if(!user){
            includeImage.where={
                license:'free'
            };
        }
        const posts= await Post.findAll({
            where:{
                status:'active'
            },
            include:[
                {
                model:User,
                attributes:['id','name']

            },
            includeImage,
            {
                model:Tag
            }
        ],
        order:[['created_at','DESC']]

        });
        res.render('posts/index',{
            posts
        })
     }  catch (error) {
    console.error(error);

    res.render('posts/index', {
      posts: [],
      error: 'No se pudieron cargar las publicaciones'
    });
  }
};

exports.showNew =(req,res)=>{
    res.render('posts/new');
}

exports.create = async(req,res)=>{
    try {
        const{title,description,tags,image_base64,mime_type,license,watermark_text}=req.body;
        if(!title||!tags||!image_base64||!mime_type||!license){
            res.render('posts/new',{
                error:'debe completar titulo,etiquetas,imagen,licencia'
             })
            return;
        }
        const post= await Post.create({
            user_id:req.session.user.id,
            title,
            description
        })
        const imageList= Array.isArray(image_base64) ? image_base64 :[image_base64]
        /*Si image_base64 ya es un arreglo
         usarlo tal como está
         Si NO es un arreglo
         convertirlo en un arreglo*/
         const mimeList = Array.isArray(mime_type)? mime_type:[mime_type];
         const licenseList=Array.isArray(license) ? license:[license];
         const watermarkList = Array.isArray(watermark_text)? watermark_text:[watermark_text]
         
         for (let i = 0; i < imageList.length; i++) {
            const base64Data= imageList[i].split(',')[1];
            const imageBuffer = Buffer.from(base64Data,'base64'); /* Buffer convierte: texto base64  en:bytes reales de la imagen*/

            await Image.create({

                post_id:post.id,
                image_data: imageBuffer,
                mime_type: mimeList[i],
                license:licenseList[i],
                watermark_text:watermarkList[i] || null
            })
         };
         const tagNames= tags.split(',').map(tag=> tag.trim().toLowerCase()).filter(tag=>tag.length>0)
        for (const tagName of tagNames) {
            const[tag]=await Tag.findOrCreate({ //Buscar o crear
                where:{
                    name:tagName
                }
            });
            await post.addTag(tag);
            
        }
        res.redirects(`/posts/${post.id}`)
          
       

    } catch (error) {
    console.error(error);

    res.render('posts/new', {
      error: 'No se pudo crear la publicacion'
    });
  }
};
exports.detail = async (req,res)=>{
    try {
        const post=await Post.findOne({
            where:{
                id:req.params.id,
                status:'active'
            },
            include:[{
                model:User,
                attributes:['id','name']
            },
        {model:Image,
            attributes:['id','license','watermark_text','mime_type','comments_open'],
            include:[{
                model:Rating,
                attributes:['value']

            }]
        },{model:Tag}
    ]
        });
        if(!post){
            res.render('posts/detail',{
                post:null,
                error:'publicacion no encontrada'})
            return
        }
        res.render('posts/detail',{
            post

        });
    } catch (error) {
        console.error(error);

        res.render('posts/detail',{
            post:null,
            error:'no se pudo cargar la publicacion '
        });
        
    }
}

exports.showEdit = async (req,res)=>{     //EDITA POST PUBLICACION PERO PRIMERO HACE VERIFICACIONES
    try {
        const post= await Post.findByPk(req.params.id,{
            include:[Tag]
        });
        if(!post){
            res.redirect('/posts')
            return;
        }
        if(post.user_id!==req.session.user.id){
            res.redirect(`/posts/${post.id}`)
            return;
        }
        if(post.locked_by_report){
            res.redirect(`/posts/${post.id}`)
            return;
        }
        res.render('posts/edit',{
            post
        })
        
    } catch (error) {
        console.error(error);
        res.redirect('/posts')
        
    }
}