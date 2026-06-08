const {z}= require('zod');

const collectionSchema= z.object({
    name:z.string().min(2,'el nombre debe tener al menos dos caracteres')
});

module.exports={collectionSchema}