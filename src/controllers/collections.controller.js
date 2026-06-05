const {Collection,Post,Image,User}=require('../models')

exports.index = async (req,res)=>{
    try {
        const collections = await Collection.findAll({
            where:{
                user_id:req.session.user.id
            },
            order:[['created_at','DESC']]
        });
        res.render('collections/index',{
            collections
           
        })
        return;

    } catch (error) {
        console.error(error)
        res.render('collections/index',
            {
                collections:[],
                 error:'no se pudieron cargar las colecciones'
            })
        return;

        
    }
}
exports.shownew = (req,res)=>{
    res.render('collections/new')
    return;
}

exports.create = async (req,res)=>{
    try {
        const {name}= req.body;
        
        if(!name){
            res.render('collections/new',{
                error:'Debe ingresar un nombre'
            })
            return;
        }

        await Collection.create({
            user_id:req.session.user.id,
            name: name.trim()
        })
        res.redirect('/collections')
        return;

    } catch (error) {
        console.error(error)
        res.render('collections/new',{
            error:'no se pudo crear la coleccion'
        })
        
    }
}
exports.detail = async (req,res)=>{
    try {
        const collection=  await Collection.findOne({
        where:{
            id:req.params.id,
            user_id:req.session.user.id
        } ,
        include:[{
            model:Post,
            where:{
                status:'active'
            },
            required:false,      // Si no tiene publicaciones que se muestre igual            
            include:[{
                model:User,
                attributes:['id','name']
            },{
                model:Image,
                attributes:['id','license','mime_type','watermark_text']
            }]

        },
    {
        model:Image,
        attributes:['id','license','mime_type','watermark_text'],
        include:[{
            model:Post,
            include:[{
                model:User,
                  attributes:['id','name']

            }]
           
        }]
    }]
        });
        if(!collection){
            res.redirect('/collections')
            return;
        }
        res.render('collections/detail',{
            collection
        })
        return;


    } catch (error) {
        console.error(error)
        res.redirect('/collections')
        return;
        
    }
}

exports.update = async (req,res)=>{ // EDITA SOLO EL NOMBRE DE LA COLECCION
    try {
        const {name}= req.body;

        const collection= await  Collection.findOne({
            where:{
                id:req.params.id,
                user_id:req.session.user.id
            }
        });
        if(!collection){
            res.redirect('/collections')
            return;
        }
        if(!name){
            res.redirect(`/collections/${collection.id}`)
            return;
        }
        await collection.update({
            name:name.trim()
        });

        res.redirect(`/collections/${collection.id}`)
        return;
        

    } catch (error) {
        console.error(error)
        res.redirect('/collections')
        return;
        
    }
}

exports.deleteCollection = async (req,res)=>{
    try {
        const collection= await Collection.findOne({
            where:{
                id:req.params.id,
                user_id:req.session.user.id
            }
        });
        if(!collection){
            res.redirect('/collections')
            return;
        }
        await collection.destroy();

        res.redirect('/collections')
        return;


    } catch (error) {
        console.error(error);
        res.redirect('/collections')
        return;
    }
} 
exports.addPost = async (req,res)=>{     //AGREGA PUBLICACION A A COLECCION 
    try {
        const collection= await Collection.findOne({
            where:{
                id:req.params.collectionId,
                user_id: req.session.user.id
            }
        });

        const post = await Post.findByPk(req.params.postId);

        if(!collection || !post || post.status!=='active'){
            res.redirect('/posts')
            return;
        }

        await collection.addPost(post)  //MODIFICA LA TABLA INTERMEDIA 

        res.redirect(`/collections/${collection.id}`)
        return;



    } catch (error) {
        console.error(error)
        res.redirect('/collections')
        return;
        
    }
}

exports.addImage= async(req,res)=>{
    try {
        const collection= await Collection.findOne({
            where:{
                id:req.params.collectionId,
                user_id:req.session.user.id
            }
        });
        const image = await Image.findByPk(req.params.imageId);

        if(!collection || !image){
            res.redirect('/posts')
            return;
        }

        await collection.addImage(image);//MODIFICA TABLA INTERMEDIA

        res.redirect(`/collections/${collection.id}`)
        return;

    } catch (error) {
        console.error(error);
        res.redirect('/collections')
        return;
        
    }
}
exports.removePost = async (req,res)=>{    //QUITAR PUBLICACION DE LA COLECCION
try {
    const collection = await Collection.findOne({
        where:{
            id:req.params.collectionId,
            user_id:req.session.user.id

        }
    });

    const post = await Post.findByPk(req.params.postId);

    if(!collection|| !post ){

        res.redirect('/collections')
        return;
    }

    await collection.removePost(post);  //ELIMINA LA RELACION 
     
    res.redirect(`/collections/${collection.id}`)
    return;

} catch (error) {
    console.error(error)
    res.redirect('/collections')
    return;
    
}

}

exports.removeImage = async (req,res)=>{  
    try {
      const collection = await Collection.findOne({
        where:{
            id:req.params.collectionId,
            user_id:req.session.user.id
        }
      });

      const image = await Image.findByPk(req.params.imageId);

      if(!image|| !collection){
        res.redirect('/collections')
        return
      }

      await collection.removeImage(image);

      res.redirect(`/collections/${collection.id}`)
      return;


    } catch (error) {
        console.error(error)
        res.redirect('/collections')
        return;
        
    }
}