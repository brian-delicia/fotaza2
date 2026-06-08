const {User,Post,Image,Interest,Notification}= require('../models')

const createNotification=require('../helpers/createNotification');


exports.index= async (req,res)=>{
    try {
        const interests = await Interest.findAll({
            where:{
                user_id:req.session.user.id
            },
            include:[{
                model:Image,
                include:[{
                    model:Post,
                    include:[{
                        model:User,
                        attributes:['id','name','email']
                    }]
                }]
            }],
            order:[['created_at','DESC']]
        });

        res.render('interests/index',{
            interests
        })
        return;



    } catch (error) {
        console.error(error)
        res.render('interests/index',{
            interests: [],
            error:'no pudimos cargar tus intereses'
        })
        
    }
}

exports.create  =  async (req,res)=>{
    try {
        const imageId= req.params.imageId
        const userId=req.session.user.id

        const image = await Image.findByPk(imageId,{
            include:[{
                model:Post,
                include:[{User,
                attributes:['id','name','email']
                }]

            }]
        });
        if(!image){
            res.redirect('/posts')
            return;
        }
        const authorId= image.Post.user_id;
        if(authorId === userId){              //EVITA QUE ALGUIEN MARQUE INTERES EN SU PROPIA FOTO
            res.redirect(`/images/${image.id}`)
            return;
        }

        const [interest,created]= await Interest.findOrCreate({  //BUSCA UN INTERES SI NO LO ENCUENTRA LO CREA
            where:{
                user_id:userId,
                image_id:image.id
            },
            defaults:{
                user_id:userId,
                image_id:image.id,
                status:'open'
            }
        });
        if(created){
                //helpers 
        await createNotification(authorId,userId,'interest','marco que le interesa una de tus fotos ');
           
        }
            res.redirect(`/messages/interests/${interest.id}`)  // SI LE INTERESA ABRE DIRECTO UN CHAT

    } catch (error) {
        console.error(error)

         res.redirect('/posts')
        return;
    }

}
exports.close = async (req,res)=>{    //CIERRA  INTERES

    try {
        const interest = await Interest.findByPk(req.params.interestId,{
          include:[{
            model:Image,
            include:[{
                model:Post
            }]
          }]  
        });
        if(!interest){
            res.redirect('/interests')
            return;
        }

        const  userId= req.session.user.id
        const authorId = interest.Image.Post.user_id

        if(interest.user_id!==userId && authorId!==userId){  // si es participante del interés. PUEDE MPDIFICAR EL STATUS
            res.redirect('/interests')
            return;
        }
        await interest.update({
            status:'closed'
        });
        res.redirect('/interests')
        return;



    } catch (error) {
        console.error(error)
        res.redirect('/interests')
        return;
        
    }
}