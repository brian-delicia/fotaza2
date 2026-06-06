const{User,Post,Image,Follow}=require('../models');

exports.detail= async (req,res)=>{         //DETALLES DEL PERFIL 
    try {
        const userId=req.params.userId;

        const profileUser = await User.findOne({
            where:{
                id:userId,
                active:true
            },
            attributes:['id','name','email','created_at']
        });

        if(!profileUser){
            res.redirect('/posts')
            return;
        }

        const followersCount = await Follow.count({    //CUENTA LA CANTIDAD DE SEGUIDORES
            where:{
                followed_id:profileUser.id
            }
        });
        const followingCount = await Follow.count({   //CUENTA CUANTOS USUARIOS SIGUE EL PERFIL
            where:{
                follower_id:profileUser.id
            }
        });

        let isFollowing = false;
        if(req.session.user){
            const follow = await Follow.findOne({
                where:{
                    follower_id:req.session.user.id,
                    followed_id: profileUser.id
                }
            });
            isFollowing=!!follow;              //COMBIERTE EL RESULTADO EN BOOLEANO

        }
        const posts = await Post.findAll({
            where:{
                user_id:profileUser.id,
                status:'active'
            },
            include:[{
                model: Image,
                attributes:['id','license','mime_type','watermark_text']
            }],
            order:[['created_at','DESC']]
        });
        if(!req.session.user){  //FILTRA LAS IMAGENES, SI NO ESTA LOGUEADO SOLO VE LAS FREE
            posts.forEach(post=>{
                post.Images= post.Images.filter(image=>image.license === 'free');
            });
        }
        res.render('profile/detail',{
            profileUser,
            followersCount,
            followingCount,
            isFollowing,
            posts
        })
        return;

    } catch (error) {
        console.error(error)
        res.redirect('/posts')
        return;
        
    }
}

exports.followers = async (req,res)=>{    //MUESTRA QUIENES SIGUEN AL USUARIO

    try {
        const userId = req.params.userId;
        const profileUser= await User.findByPk(userId,{
            attributes:['id','name']
        });

        if(!profileUser){
            res.redirect('/posts')
            return;
        }
        const followers= await Follow.findAll({
            where:{
                followed_id:userId
            },
            include:[{
                model:User,
                as:'followerUser',
                attributes:['id','name','email']
            }]
        });
        res.render('profile/followers',{
            profileUser,
            followers
        })
        return;


    } catch (error) {
        console.error(error)
        res.redirect('/posts')
        return;
        
    }
}

exports.following = async (req,res)=>{  //MUESTRA A QUIEN SIGUE EL USUARIO 
    try {
        const userId= req.params.userId
        const profileUser= await User.findByPk(userId,{
            attributes:['id','name']
        });
        if(!profileUser){
            res.redirect('/posts')
            return;
        }
        const following = await Follow.findAll({
            where:{
                follower_id:userId
            },
            include:[{
                model:User,
                as:'followedUser',
                attributes:['id','name','email']
            }]
        });
        res.render('profile/following',{
            profileUser,
            following
        })
        return;


    } catch (error) {
        console.error(error);
        res.redirect('/posts')
        return;        
    }

}