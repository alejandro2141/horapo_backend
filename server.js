'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/hola', (req, res) => {
  res.send('Hola hola pirinola ');
});

// App
const app = express();
app.get('/chao', (req, res) => {
  res.send('chaolin bombin ');
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

