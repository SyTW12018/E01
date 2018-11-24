# videocon.io
[![Build Status](https://travis-ci.org/SyTW12018/E01-videocon.svg?branch=master)](https://travis-ci.org/SyTW12018/E01-videocon)

videocon.io es una aplicación web para realizar videoconferencias de forma sencilla, segura y rápida, diseñada para ser escalable y fácilmente distribuible.

La aplicación está basada en salas de tal forma que cualquier usuario pueda unirse/crear una simplemente especificando su nombre, dentro de la sala es donde se establecerá la videoconferencia.

Los usuarios en ningún momento deberán registrarse para poder hacer uso del servicio de videoconferencia, sin embargo, haciéndolo podrán obtener funciones adicionales.


## Planificación

El objetivo de la planificación es fijar unos objetivos para conseguir un *MVP* (Minimum Viable Product) y a partir de ese punto iterar y mejorar el producto siguiendo metodologías ágiles con la ayuda de Pivotal Tracker.

### Lista de objetivos para MVP

* Permitir a cualquier usuario crear/unirse a una sala de videoconferencia
  * Introducir el nombre de la sala
  * Unirse o crear la sala
  * Pedir contraseña en el caso de que esté protegida
  * Pedir permiso al usuario para usar su camara/microfono
  * Mostrar feedback al usuario en caso de que ocurra algún error

* Mostrar información general de la sala
  * Mostrar usuarios conectados a la sala
  * Mostrar quién está usando el micrófono
  * Mostrar si está protegida actualmente con contraseña

* Permitir a los usuarios de una sala comunicarse por texto
  * Mostrar un chat común para todos los integrantes de la sala

* Permitir administrar la sala al usuario dueño de la misma (quien la ha creado)
  * Permitir establecer/modificar/eliminar la contraseña de la sala

* Permitir al usuario la creación de una cuenta en la app
  * Permitir al usuario registrarse en la app mediante un formulario
  * Permitir al usuario administrar la información proporcionada en el registro
  * Permitir al usuario eliminar su cuenta

### Arquitectura de la app

La app empleará el stack MERN, el backend se basará en NodeJS y Express con el fin de implementar una API RESTful que usará el front-end mediante la librería React, para el almacenamiento persistente se usará MongoDB, tal y como se muestra en la siguiente figura.

  ![figura 1](https://raw.githubusercontent.com/SyTW12018/E01-videocon/master/docs/fig1.png "Figura 1")
  
El trabajo principal de la app es mediar entre los clientes de una sala para que inicien una comunicación P2P entre ellos, usando una topología de red en malla, de esta forma el backend no tiene que procesar ni reenviar en ningún momento el video/sonido de los clientes que están usando el servicio de videoconferencia, esto libera mucha carga del servidor y lo hace fácilmente escalable.

La principal dificultad de establecer una red de malla entre los clientes es la NAT de los propios clientes, para ello existen los protocolos STUN (Session Traversal Utilities for NAT) y TURN (Traversal Using Relays around NAT), que forman parte a su vez del protocolo ICE (Interactive Connectivity Establishment) estandarizado por el IETF. 

Para resolver la IP pública de los clientes se hará uso del protocolo STUN, en caso de que no sea suficiente para establecer la conexión, se usará como fallback el protocolo TURN tal y como establece ICE y se muestra en la siguiente figura.

  ![figura 2](https://raw.githubusercontent.com/SyTW12018/E01-videocon/master/docs/fig2.png "Figura 2")

## Miembros

Andrés García Pérez

Manuel Jesús Peraza Alonso

Alejandro Lorenzo Dávila

Joram Real Gómez

Carlos Arvelo García
