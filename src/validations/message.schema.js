const {z}=require('zod');

const messageSchema=z.object({
    content:z.string().trim().min(1,'el mensaje no puede estar vacio')
});

module.exports = {messageSchema};