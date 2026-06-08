const {z}=require('zod');

const postSchema=z.object({
    title:z.string().min(3,'el titulo debe tener al menos 3 caracteres'),
    description:z.string().optional(),
    tags:z.string().min(1,'debe ingresar al menos una etiqueta')
});
module.exports= {postSchema};