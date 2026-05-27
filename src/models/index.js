const User = require('./User');
const Post = require('./Post');
const Image = require('./Image');
const Tag = require('./Tag');
const PostTag = require('./PostTag');
const Comment = require('./Comment');
const Rating = require('./Rating');
const Follow = require('./Follow');
const  Notification  = require('./Notification');
const Collection = require('./Collection');
const CollectionPost = require('./CollectionPost');
const CollectionImage = require('./CollectionImage');
const Report  =  require('./Report');
const Interest = require('./Interest');
const Message = require('./Message');



//un usuario puede tener muchos post y un post es de un usuario
User.hasMany(Post,{foreignKey:'user_id'});
Post.belongsTo(User,{foreignKey:'user_id'})

//un post puede tener muchas image y una image es de un post
Post.hasMany(Image,{foreignKey:'post_id'})
Image.belongsTo(Post,{foreignKey:'post_id'})

//un post puede tener muchos comentarios y un comentario es de un solo post
Post.hasMany(Comment,{foreignKey:'post_id'})
Comment.belongsTo(Post,{foreignKey:'post_id'})

//un User puede tener muchos comment y un comment puede ser de un User
User.hasMany(Comment,{foreignKey:'user_id'})
Comment.belongsTo(User,{foreignKey:'user_id'})

module.exports={
    User,
    Image,
    Post,
    Comment
}