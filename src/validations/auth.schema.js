const {z}=require('zod');

const registerSchema= z.object({
    name:z.string().min(2,'el nomre debe tener minimo dos caracteres'),
    email:z.string().email('debe ingresar un email valido'),
    password:z.string().min(5,'la contraseña debe tener al menos 5 caracteres')
});
const loginSchema= z.object({
    email:z.string().email('debe ingresar un email valido'),
    password:z.string().min(1,'debe ingresar una contraseña')

});
module.exports={registerSchema,loginSchema};