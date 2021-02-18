'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let usuario = {
 nombre:'aaa',
 apellido: 'bbb'
};
let respuesta = {
 error: false,
 codigo: 200,
 mensaje: ''
};


//APP Functions
/*
app.get('/hola', (req, res) => {
  res.send('hoy hola GET ');
});
*/

app.route('/public_appointments')
 .get(function (req, res) {
  
  respuesta = {
  
	   "code": 200,
	   "mainDate": "SEPT 29",
	   "app_available" : {
	   
	   	"app_id" : "000001",
	   	"date" : "28-08-2021",
	   	"time" : "08:30" ,
	   	"doc_id" : "000001",
	   	"doc_name" : "Dr Juan Carlos Gonzales",
	   
	   }
  
  };
  
  /*
  
  if(usuario.nombre === '' || usuario.apellido === '') {
   respuesta = {
    error: true,
    codigo: 501,
    mensaje: 'El usuario no ha sido creado'
   };
  } else {
   respuesta = {
    error: false,
    codigo: 200,
    mensaje: 'respuesta del usuario',
    respuesta: usuario
   };
  }
  */
  res.send(respuesta);
 })
 
 
 
 .post(function (req, res) {
  if(!req.body.nombre || !req.body.apellido) {
   respuesta = {
    error: true,
    codigo: 502,
    mensaje: 'El campo nombre y apellido son requeridos'
   };
  } else {
   if(usuario.nombre !== '' || usuario.apellido !== '') {
    respuesta = {
     error: true,
     codigo: 503,
     mensaje: 'El usuario ya fue creado previamente'
    };
   } else {
    usuario = {
     nombre: req.body.nombre,
     apellido: req.body.apellido
    };
    respuesta = {
     error: false,
     codigo: 200,
     mensaje: 'Usuario creado',
     respuesta: usuario
    };
   }
  }
  
  res.send(respuesta);
 })
 .put(function (req, res) {
  if(!req.body.nombre || !req.body.apellido) {
   respuesta = {
    error: true,
    codigo: 502,
    mensaje: 'El campo nombre y apellido son requeridos'
   };
  } else {
   if(usuario.nombre === '' || usuario.apellido === '') {
    respuesta = {
     error: true,
     codigo: 501,
     mensaje: 'El usuario no ha sido creado'
    };
   } else {
    usuario = {
     nombre: req.body.nombre,
     apellido: req.body.apellido
    };
    respuesta = {
     error: false,
     codigo: 200,
     mensaje: 'Usuario actualizado',
     respuesta: usuario
    };
   }
  }
  
  res.send(respuesta);
 })
 .delete(function (req, res) {
  if(usuario.nombre === '' || usuario.apellido === '') {
   respuesta = {
    error: true,
    codigo: 501,
    mensaje: 'El usuario no ha sido creado'
   };
  } else {
   respuesta = {
    error: false,
    codigo: 200,
    mensaje: 'Usuario eliminado'
   };
   usuario = { 
    nombre: '', 
    apellido: '' 
   };
  }
  res.send(respuesta);
 });
app.use(function(req, res, next) {
 respuesta = {
  error: true, 
  codigo: 404, 
  mensaje: 'URL no encontrada'
 };
 res.status(404).send(respuesta);
});




app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);




