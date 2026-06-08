const {z}=require('zod');

const commentSchema=z.object({
    content:z.string().min(1,'el comentario no puede estar vacio')
});
module.exports={commentSchema};