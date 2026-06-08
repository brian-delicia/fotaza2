const {Notification}=require('../models');

module.exports = async function createNotification(userId,actorId,type,message){
    await Notification.create({
        user_id:userId,
        actor_id:actorId,
        type,
        message,
        date:new Date()
    })
    return;
}