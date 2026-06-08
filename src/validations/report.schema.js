const {z}= require('zod');

const reportSchema= z.object({
    reason:z.string().min(5,'debe ingresar una descripcion')
});

module.exports={reportSchema};