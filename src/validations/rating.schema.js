const {z}= require('zod');

const ratingSchema = z.object({
    value:z.coerce.number().min(1,'la valoracion minima es 1').max(5,'la valoracion maxima es 5')
});//EL COERCE CCOMBIERTE DE STRING A NUMBER

module.exports={ratingSchema};

