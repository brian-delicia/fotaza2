const {Notification,User}=require('../models')
 
exports.index = async (req,res)=>{     //busca todas las notificaciones del usuario
    try {
        const notifications = await Notification.findAll({   
            where:{
                user_id:req.session.user.id
            },
            include:[{
                model:User,
                as:'actor',
                attributes:['id','name']
            }],
            order:[['date','DESC']]
        });
        res.render('notifications/index',{
            notifications
        })
        return;

    } catch (error) {
        console.error(error);
       return res.render('notifications/index',{
            notifications:[],
            error:'No se pudieron cargar las notificaciones '
        })
        
        
    }
};
exports.markAsRead = async (req,res)=>{  //MARCAR COMO LEIDA
    try {
        const notification = await Notification.findOne({
            where:{
                id:req.params.id,
                user_id:req.session.user.id
            }
        });
        if(!notification){
            res.redirect('/notifications')
            return;

        }
        await notification.update({
            read:true
        });
        res.redirect('/notifications')
        return;

    } catch (error) {
        console.error(error)
        res.redirect('/notifications')
        return;
        
    }
}


exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      {
        read: true
      },
      {
        where: {
          user_id: req.session.user.id,
          read: false
        }
      }
    );

    return res.redirect('/notifications');

  } catch (error) {
    console.error(error);
    return res.redirect('/notifications');
  }
};