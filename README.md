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
brian@email.com
aldana@email.com
steven@email.com
sabrina@email.com
sandra@email.com

Contraseña: Para todos los usuarios la misma 
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
denunciar imagenes,denunciar comentarios,sistema de revision para validadores

SEGUIMIENTO DE USUARIOS
seguir usuario,dejar de seguir usuarios,ver seguidores,ver usuarios seguidos 

NOTIFICACIONES
comentarios,valoraciones,intereses,nuevos seguidores

COLECCIONES
crear colecciones,guardar publicaciones ,guardar imagenes,eliminar elementos de una colecccion

INTERESES
boton me interesa y comunicacion entre comprador y autor 

MENSAJERIA
conversacion asociadas a intereses ,mensajeria privada entre usuario 

BUSCADOR
 por texto, por autor, por etiqueta, por licencia,,por valoracion minima


 ----------------Almacenamiento de imagenes-----------------------------------------
 las imagenes se almacenan direcctamente en PostgreSQL utilizando Tipo BYTEA, Convercion de base64 desde el navegador,convercion a buffer en el servidor


