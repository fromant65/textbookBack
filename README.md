# API para la página Textbook - WIP

Textbook es un proyecto que emula la interfaz de una red social.
Este repositorio contiene todo el código correspondiente al Backend de la aplicación Textbook.
El objetivo del proyecto es meramente ilustrativo.

## Features

### Registro

El cliente puede ir a la página de regristro y crear una cuenta asociada a una dirección de e-mail que posea

### Recuperación de contraseña por e-mail

El cliente, en caso de olvidar su contraseña, puede obtener un código de recuperación que será enviado a su e-mail y que podrá utilizar para modificar su contraseña

### Login

El cliente podrá utilizar su usuario y contraseña para ingresar a su cuenta.
En estos momentos el sistema de Login solo funciona localmente. Esto se debe a que Express Session utiliza una cookie para identificar la session, y esta cookie no puede ser enviada entre servidores de distintos dominios. La app en su totalidad debería ser hosteada en un mismo dominio para funcionar.

### Realizar publicaciones

El usuario puede crear publicaciones basadas en texto y publicarlas. Además, tanto él como otros usuarios que las vean podrán darle like y comentarlas. Las publicaciones y los comentarios pueden ser editados y eliminados

### Perfil de usuario

Cada usuario puede acceder a su perfil donde se mostrarán algunos de sus datos, su cantidad de seguidores y seguidos, y la lista de sus publicaciones

### Buscar usuarios

También existe la posibilidad de buscar a otros usuarios mediante su username. Cuando se encuentren usuarios, se mostrará una lista de usernames; el cliente podrá hacer click en cualquiera de los nombres y esto lo llevará al perfil de ese usuario, donde podrá ver su información y decidir si seguirlo o dejar de hacerlo.

### Modificar información

El usuario podrá cambiar sus datos y su contraseña si lo desea, una vez inicie sesión, en la pestaña de configuración.

## Especificaciones del código

Esta API se hizo con Node Js, Express y MongoDB del lado del backend
