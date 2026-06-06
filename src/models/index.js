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

//publicaciones pueden teneer muchas etiquetas y una etiqueta mucha publiciones 
Post.belongsToMany(Tag,{through:PostTag,foreignKey:'post_id'})
Tag.belongsToMany(Post,{through:PostTag,foreignKey:'tag_id'})

//imagen puede tener muchos comentarios y mucho comntarios a la misma imagen 
Image.hasMany(Comment,{foreignKey:'image_id'})
Comment.belongsTo(Image,{foreignKey:'image_id'})

//un User puede tener muchos comment y muchos comment puede ser de un User
User.hasMany(Comment,{foreignKey:'user_id'})
Comment.belongsTo(User,{foreignKey:'user_id'})

//una imagen puede tener muchas valoraciones y mucha valoraciones pueden pertencer a una imagn  
Image.hasMany(Rating,{foreignKey:'image_id'})
Rating.belongsTo(Image,{foreignKey:'image_id'})

//usuario puede tener muchas valoraciones y muchas valoraciones puden ser de  un usuario 
User.hasMany(Rating,{foreignKey:'user_id'})
Rating.belongsTo(User,{foreignKey:'user_id'})

//un usuario puedetener muchos seguidores 
User.belongsToMany(User,{
    through:Follow,
    as:'following',
    foreignKey:'follower_id',
    otherKey:'followed_id'
});
User.belongsToMany(User,{
    through:Follow,
    as:'followers',
    foreignKey:'followed_id',
    otherKey:'follower_id'

})
Follow.belongsTo(User, {
  foreignKey: 'follower_id',
  as: 'followerUser'
});

Follow.belongsTo(User, {
  foreignKey: 'followed_id',
  as: 'followedUser'
});

// Notificaciones
User.hasMany(Notification, {foreignKey: 'user_id'});

Notification.belongsTo(User, {foreignKey: 'user_id'});

Notification.belongsTo(User, {foreignKey: 'actor_id',
     as: 'actor'});

// Colecciones del usuario
User.hasMany(Collection, { foreignKey: 'user_id'});

Collection.belongsTo(User, {foreignKey: 'user_id'});

// Colecciones - Publicaciones
Collection.belongsToMany(Post, {through: CollectionPost,foreignKey: 'collection_id'});

Post.belongsToMany(Collection, {through: CollectionPost,foreignKey: 'post_id'});

// Colecciones - Imagenes
Collection.belongsToMany(Image, {through: CollectionImage,foreignKey: 'collection_id'});

Image.belongsToMany(Collection, {through: CollectionImage,foreignKey: 'image_id'});

// Denuncias de imagenes
User.hasMany(Report, {foreignKey: 'user_id'});

Report.belongsTo(User, {foreignKey: 'user_id'});

Image.hasMany(Report, { foreignKey: 'image_id'});

Report.belongsTo(Image, { foreignKey: 'image_id'});

// Denuncias de comentarios
Comment.hasMany(Report, { foreignKey: 'comment_id'});

Report.belongsTo(Comment, {foreignKey: 'comment_id'});

// Me interesa
User.hasMany(Interest, { foreignKey: 'user_id'});

Interest.belongsTo(User, {foreignKey: 'user_id'});

Image.hasMany(Interest, {foreignKey: 'image_id'});

Interest.belongsTo(Image, { foreignKey: 'image_id'});

// Mensajes privados
Interest.hasMany(Message, {foreignKey: 'interest_id'});

Message.belongsTo(Interest, { foreignKey: 'interest_id'});

User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages'});

Message.belongsTo(User, {foreignKey: 'sender_id', as: 'sender'});

User.hasMany(Message, {foreignKey: 'receiver_id',as: 'receivedMessages'});

Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver'});




module.exports = {
  User,
  Post,
  Image,
  Tag,
  PostTag,
  Comment,
  Rating,
  Follow,
  Notification,
  Collection,
  CollectionPost,
  CollectionImage,
  Report,
  Interest,
  Message
};