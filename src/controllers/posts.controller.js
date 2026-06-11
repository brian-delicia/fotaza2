const {Op}=require('sequelize');
const {User,Post,Image,Tag,Rating,Follow,Collection}=require('../models');

const {postSchema}=require('../validations/post.schema');


exports.index= async (req,res)=>{
    try {
        const user=req.session.user || null
        
        const includeImage={
            model:Image,
            attributes:['id','license','watermark_text','mime_type','comments_open']
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
        return;
     }  catch (error) {
    console.error(error);

    res.render('posts/index', {
      posts: [],
      error: 'No se pudieron cargar las publicaciones'
    });
    return;
  }
};

exports.showNew =(req,res)=>{
    res.render('posts/new');
}

exports.create = async(req,res)=>{
    try {
        const{title,description,tags,image_base64,mime_type,license,watermark_text}=req.body;
        const result= postSchema.safeParse({ title,description,tags });
        if(!result.success){
            res.render('posts/new',{
                error:result.error.issues[0].message
            })
            return;
        }
        if(!image_base64||!mime_type||!license){
            res.render('posts/new',{
                error:'debe completar imagen, o licencia'
             })
            return;
        }

        const validData=result.data;
        const post= await Post.create({
            user_id:req.session.user.id,
            title:validData.title,
            description:validData.description
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

            if (!imageList[i] || !imageList[i].includes(',')) {
              continue;
            }
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
         const tagNames= validData.tags.split(',').map(tag=> tag.trim().toLowerCase()).filter(tag=>tag.length>0)
        for (const tagName of tagNames) {
            const[tag]=await Tag.findOrCreate({ //Buscar o crear
                where:{
                    name:tagName
                }
            });
            await post.addTag(tag);
            
        }
       
       
        return res.redirect(`/posts/${post.id}`)
        
   } catch (error) {
    console.error(error);

    res.render('posts/new', {
      error: 'No se pudo crear la publicacion'
    });
    return;
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
         if (!req.session.user) {
      post.Images = post.Images.filter(image => image.license === 'free');
    }

    let collections = [];

    if (req.session.user) {
      collections = await Collection.findAll({
        where: {
          user_id: req.session.user.id,
        },
      });
    }

    let errorMessage = null;

    if (req.query.error === "post_ya_guardado") {
      errorMessage = "Esta publicacion ya esta guardada en esa coleccion.";
    }
    let successMessage = null;

    if (req.query.success === "editado") {
      successMessage = "Publicacion editada con exito.";
    }
        res.render('posts/detail',{
            post,
            collections,
            errorMessage,
            successMessage

        });
        return;
    } catch (error) {
        console.error(error);

        res.render('posts/detail',{
            post:null,
            error:'no se pudo cargar la publicacion '
        });
        return;
        
    }
}

exports.showEdit = async (req,res)=>{     //muestra ediciones
    try {
        const post= await Post.findByPk(req.params.id,{
            include:[Tag,Image]
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
        const tagsText = post.Tags
          ? post.Tags.map((tag) => tag.name).join(", ")
          : "";

        let errorMessage = null;

        if (req.query.error === "datos_invalidos") {
          errorMessage =
            "Debe completar correctamente el titulo y las etiquetas.";
        }
        res.render('posts/edit',{
            post,
            tagsText,
            errorMessage
            
        })
        return;
        
    } catch (error) {
        console.error(error);
        res.redirect('/posts')
        return;
        
    }
}

exports.update= async (req,res)=>{
    try {
        const{title,description,tags}=req.body

        const result= postSchema.safeParse({title,description,tags });
        if (!result.success) {
          res.redirect(`/posts/${req.params.id}/edit?error=datos_invalidos`)
         return;
      }
       
        const validData=result.data;

        const post =await Post.findByPk(req.params.id,{
            include:[Image]
        });

        if(!post){
            res.redirect('/posts')
            return
        }
        if(post.user_id!==req.session.user.id){
            res.redirect(`/posts/${post.id}`);
            return
            
        }
        if(post.locked_by_report){
            res.redirect(`/posts/${post.id}`)
            return

        }
        await post.update({
            title:validData.title,
            description:validData.description
        })
        if(validData.tags){
            const tagNames= validData.tags.split(',').map(tag=>tag.trim().toLowerCase()).filter(tag=>tag.length > 0);
            //SEPARA LAS ETIQUETAS POR (,) RECORRE Y LE SACA LOS ESPACION Y LAS MAYUSCULAS Y FILTRA POR SI HAY ESAPCIOS EN BLACO
            const newTags=[]
            for (const tagName of tagNames) {
                const[tag]= await Tag.findOrCreate({
                    where:{
                        name:tagName
                    }
                })
                  newTags.push(tag);
            };
            await post.setTags(newTags);
        }

        
        for (const image of post.Images) {
          const newLicense = req.body[`license_${image.id}`];
          const newWatermark = req.body[`watermark_${image.id}`];

          await image.update({
            license: newLicense,
            watermark_text: newLicense === "copyright" ? newWatermark : null,
          });
        }
        
      return res.redirect(`/posts/${post.id}?success=editado`);

    } catch (error) {
        console.error(error)
        res.redirect('/posts');
        return;
        
    }
}

exports.deletePost = async (req,res)=>{
    try {
        const post= await Post.findByPk(req.params.id);
        if(!post){
            res.redirect('/posts')
            return

        }
        if(post.user_id !== req.session.user.id){
            res.redirect(`/posts/${post.id}`)
            return
        }
        if(post.locked_by_report){
            res.redirect(`/posts/${post.id}`)
            return
        }
        await post.update({
            status:'removed'
        })
        //NO  BORRA DIRECTAMENTE HACEMOS  BAJA LOGICA
        res.redirect('/posts');
        return


    } catch (error) {
        console.error(error);
        res.redirect('/posts')
        return;


        
    }
}

exports.followingFeed = async (req,res)=>{ //USUARIOS QUE SIGO
    try {
        const follows= await Follow.findAll({
            where:{
                follower_id:req.session.user.id
            }//BUSCA EN LA TABLA TODOS LOS SEGUIDORES QUE SIGUE EL USUARIO LOGUEADO
        })

        const followedIds=follows.map(follow=>follow.followed_id);
        //HACE UN ARREGLO DE TODOS LOS ID DE LAS PERSONAS SEGUIDAS
        
        const posts= await Post.findAll({
            where:{
                user_id:{
                    [Op.in]:followedIds
                },
                status:'active'
            },
            //BUSCA PUBLICACIONES DE LOS ID SEGUIDOS 
            include:[{
                model:User,
                attributes:['id','name']
            },{
                model:Image,
                attributes:['id','license','watermark_text','mime_type','comments_open']
            },
            {model:Tag}
        ],
        order:[['created_at','DESC']]
        });
        res.render('posts/following',{
            posts

        })
        return;


    } catch (error) {
        console.error(error);
        res.render('posts/following',
            {posts:[],
                error:'no se pudieron cargar publicaciones de usuarios seguidos'

            })
            return;
        
    }
}

