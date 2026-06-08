1. Clonar repositorio
https://github.com/brian-delicia/fotaza2.git
2. Instalar dependencias
    npm install

3. Configurar .env

4. Inicializar base
npm run db:init(crea las tablas modelos)
npm run db:seed(crea los modelos de usuarios)
    Ejemplo:

Usuario:
demo@email.com

Contraseña:
123456
Validador:
validador@email.com

Contraseña:
123456
5. Ejecutar proyecto
npm start

------------------------DESCRIPCION--------------------------------------

La aplicacion permite que los usuarios compartan imagenes, interactuen con publicaciones
sigan a otros usuarios,creen colecciones personales y se comuniquen mediante mensajeria


------------------Tecnologías utilizadas-------------------------------------------------
Node.js
Express
PostgreSQL
Sequelize ORM
Pug
Bootstrap 5
Express Session
BCrypt
Zod
Dotenv

------------------------------------FUNCIONALIDADES PRINCIPALES-------------------------------
AUTENTICACION
registro de usuarios, inicio de sesion, cierre de sesion , roles de usuario y validador

PUBLICACIONES
crear publicaccion,agregar imagenes ,licencias con copyright y sin copyright,marca de agua personalizada

COMENTARIOS
comentar imagen,cerrar comentarios ,denunciar comentario

VALORACIONES
valorar imagen del 1 al 5,mostrar promedio de valoraciones, mostrar cantidad dde valoracciones

DENUNCIAS
denunciar imagenes,denunciar comentarios,sistema de revicion para validadores

SEGUIMIENTO DE USUARIOS
seguir usuario,dejar de eguir usuarios,ver seguidores,ver usuarios seguidos 

NOTIFICACIONES
comentarios,valoraciones,intereses,nuevos seguidores

COLECCIONES
crear coleccioness,guardar publicaciones ,guardar imagenes,eliminar elementos de una colecccion

INTERESES
boton me interesa y comunicaccion entre comprador y autor 

MENSAJERIA
comversacion asociadas a intereses ,mensajeria privada entre usuario 

BUSCADOR
 por texto, por autor, por etiqueta, por licencia,,por valoracion minima


 ----------------Almacenamiento de imagenes-----------------------------------------
 las imagenes se almacenan direcctamente en Postgre utilizando Tipo BYTEA,onvercion de base64 desde el navegador,comverccion a buffer en el servidor


