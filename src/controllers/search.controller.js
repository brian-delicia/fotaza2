const {Op}=require('sequelize')
const {User,Post,Image,Tag,Rating}=require('../models')

const calculateAverage =require('../helpers/calculateAverage');

exports.index = async (req,res )=>{
    try {
        const{q,tag,license,author,minRating}=req.query;
        
        const postWhere={ status:'active' };
        const imageWhere={};
         const userWhere={};               //objetos vacios para armar filtros
          const tagWhere={};

          if(q){
            postWhere[Op.or]=[{
                title:{
                    [Op.iLike]:`%${q}%`
                }
            },{
                description:{
                    [Op.iLike]:`%${q}%`
                }
            }];
          }
          if (!req.session.user) {
                imageWhere.license = 'free';
                } else if (license) {
                 imageWhere.license = license;
                }
          if(author){
            userWhere.name={
                [Op.iLike]:`%${author}%`
            }
          }
          if(tag){
            tagWhere.name={
                [Op.iLike]:`%${tag}%`

            }
          };
          const posts = await Post.findAll({    //trae publicaiones que cunplan los fitros 
            where:postWhere,
            include:[{
                model:User,
                where:Object.keys(userWhere).length > 0 ? userWhere: undefined,
                attributes:['id','name'],
                required:Object.keys(userWhere).length > 0 
            },
            {model:Image,
                where:Object.keys(imageWhere).length > 0 ? imageWhere: undefined,
                attributes:['id','license','mime_type','watermark_text'],
                required:Object.keys(imageWhere).length > 0,
                include:[{
                    model:Rating,
                    attributes:['value']
                }]

            },{
                model:Tag,
                where:Object.keys(tagWhere).length > 0 ? tagWhere : undefined,
                required:Object.keys(tagWhere).length > 0
            }
          ],
          order:[['created_at','DESC']]
        });
        let filteredPosts=posts;
        if(minRating){                                  //filtra por rating minnimos 
            const min = Number(minRating);
            if(!isNaN(min)){

            filteredPosts= posts.filter(post =>{
                const images = post.Images || [];

                const hasImageWithMinRating = images.some(image=>{
                const ratings = image.Ratings || [];

                const average = calculateAverage(ratings);

                    return average>=min ;
                })

                return hasImageWithMinRating;

            })
        }}
        return res.render('search/index',{
            posts:filteredPosts,
            filters:{ q, tag, license, author, minRating}
        });

    } catch (error) {
         console.error(error);

    res.render('search/index', {
      posts: [],
      filters: {},
      error: 'No se pudo realizar la busqueda'
        
    })
    return;
}
}