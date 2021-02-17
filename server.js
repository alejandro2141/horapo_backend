'use strict';

const express = require('express');

// Constants
const PORT = 8081;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/hola', (req, res) => {
  res.send('hola pirinola');
});

app.get('/chao', (req, res) => {
  res.send('chao terricola');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

