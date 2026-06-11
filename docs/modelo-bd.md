# Modelo de Base de Datos - Fotaza2

## User

Representa los usuarios registrados en el sistema.

Campos principales:

- id
- name
- email
- password
- role
- active
- removed_posts_count

Relaciones:

- Un usuario puede crear muchas publicaciones.
- Un usuario puede realizar comentarios.
- Un usuario puede valorar imágenes.
- Un usuario puede seguir a otros usuarios.
- Un usuario puede recibir notificaciones.
- Un usuario puede crear colecciones.



## Post

Representa una publicación realizada por un usuario.

Campos principales:

- id
- title
- description
- status
- locked_by_report

Relaciones:

- Pertenece a un usuario.
- Contiene una o más imágenes.
- Posee etiquetas.
- Puede ser guardada en colecciones.



## Image

Representa una imagen publicada.

Campos principales:

- id
- image_data
- mime_type
- license
- watermark_text
- comments_open

Relaciones:

- Pertenece a una publicación.
- Puede recibir comentarios.
- Puede recibir valoraciones.
- Puede ser denunciada.
- Puede formar parte de colecciones.



## Comment

Representa comentarios realizados sobre imágenes.

Campos principales:

- id
- content
- active

Relaciones:

- Pertenece a un usuario.
- Pertenece a una imagen.



## Rating

Representa valoraciones realizadas por usuarios.

Campos principales:

- id
- value

Relaciones:

- Pertenece a un usuario.
- Pertenece a una imagen.



## Report

Representa denuncias realizadas por usuarios.

Campos principales:

- id
- reason
- description
- status
- target_type

Relaciones:

- Pertenece a un usuario.
- Puede estar asociada a una imagen o comentario.



## Notification

Representa las notificaciones del sistema.

Campos principales:

- id
- type
- message
- read

Relaciones:

- Pertenece a un usuario.



## Collection

Representa colecciones creadas por usuarios.

Campos principales:

- id
- name

Relaciones:

- Pertenece a un usuario.
- Contiene publicaciones.
- Contiene imágenes.



## Interest

Representa el interés de un usuario sobre una imagen.

Relaciones:

- Pertenece a un usuario.
- Pertenece a una imagen.



## Message

Representa mensajes intercambiados entre usuarios.

Campos principales:

- id
- content
- read

Relaciones:

- Asociado a un Interest.
- Posee remitente.
- Posee destinatario.