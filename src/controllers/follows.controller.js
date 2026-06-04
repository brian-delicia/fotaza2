const {User,Follow,Notification}=require('../models')

exports.follow = async (req,res)=>{
    try {
        const followerId=req.session.user.id;
        const followedId=Number(req.params.userId);

        if(followerId=== followedId){
            res.redirect(`/profile/${followedId}`)
            return;
        }
        const userToFollow= await User.findByPk(followedId) //BUSCA SI EXISTE EL USUARIO Q QUERES SEGUIR

        if(!userToFollow || !userToFollow.active){
            res.redirect('/posts')
            return;
        }
        const existingFollow= await Follow.findOne({   //VERIFICA SI YA SE ESTAN SIGUIENDO 
            where:{
                follower_id:followerId,
                followed_id:followedId
            }
        });
        if(existingFollow){
            res.redirect(`/profile/${followedId}`)
        }
          
        await Follow.create({
                follower_id: followerId,
                followed_id: followedId
             });

        await Notification.create({
            user_id:followedId,
            actor_id:followerId,
            type:'follow',
            message:'alguien comenzo a seguirte'
        })
        res.redirect(`/profile/${followedId}`)
        return;



    } catch (error) {
        console.error(error)
        res.redirect('/posts')
        return;
        
    }
}

exports.unfollow = async (req,res)=>{ // DEJAR DE SEGUIR A OTRO USUARIO 
    try {
        const followerId= req.session.user.id;
        const followedId = Number(req.params.userId);

        await Follow.destroy({
            where:{
                follower_id:followerId,
                followed_id:followedId

            }
        });
        res.redirect(`/profile/${followedId}`)
        return;

        
    } catch (error) {
        console.error(error)
        res.redirect('/posts')
        
    }
}