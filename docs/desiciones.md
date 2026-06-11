## Arquitectura

Se utilizó el patrón MVC (Modelo - Vista - Controlador) para separar la lógica de negocio, las vistas y el acceso a los datos.

## Base de Datos

Se eligió PostgreSQL por ser un sistema gestor robusto, gratuito y ampliamente utilizado en aplicaciones web.

## ORM

Se utilizó Sequelize para simplificar el acceso a la base de datos y facilitar la definición de relaciones entre entidades.

## Motor de Vistas

Se utilizó Pug para generar vistas dinámicas de manera sencilla y mantener el código HTML más limpio.

## Gestión de Sesiones

Se utilizó express-session para mantener la autenticación de usuarios durante la navegación.

## Imágenes

Las imágenes se almacenan en la base de datos mediante campos BYTEA (BLOB), evitando depender de almacenamiento externo.

## Licencias

Se implementaron dos tipos de licencia:

- free
- copyright

Las imágenes con copyright no pueden guardarse libremente en colecciones por otros usuarios.

## Moderación

Se implementó un sistema de denuncias para imágenes y comentarios.

Cuando una publicación recibe múltiples denuncias queda en estado de revisión para ser evaluada por un validador.

## Mensajería

Se implementó un sistema de mensajes basado en intereses sobre imágenes, permitiendo el contacto entre usuarios.

## Notificaciones

El sistema genera notificaciones para informar eventos relevantes como denuncias o interacciones realizadas por otros usuarios.

## Colecciones

Los usuarios pueden organizar publicaciones e imágenes en colecciones personales.