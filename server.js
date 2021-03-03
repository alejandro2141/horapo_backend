'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();


// APP SET CORS to allow Al Origins
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//APP Functions

  
//********************************************* 
// PUBLIC GET APPOINTMENT BKP
//********************************************* 
 /*
app.route('/public_appointment')
.get(function (req, res) {
 
client.connect() ;

const resultado = client.query('SELECT * FROM appointment', (err, res) => {
  console.log(err, res)
  client.end()
})
  
 res.send("saludos terricolas");
  //res.status(200).json(res.rows)
  // res.send(res);
   
 })
*/

//********************************************* 
// PUBLIC POST APPOINTMENT BKP
//********************************************* 
 
app.route('/get_appointment')
.post(function (req, res) {
 
    console.log('JSON REQUEST BODY  : ', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb01',
  password: 'paranoid',
  port: 5432,
})

client.connect()
// ****** Run query to bring appointment
const resultado = client.query('SELECT * FROM appointment', (err, result) => {

  //console.log(err, 'JSON RESPONSE'+JSON.stringify(result))
  res.status(200).send(JSON.stringify(result))
    console.log("JSON RESPONSE BODY : "+JSON.stringify(result ));

  client.end()

})

  //console.log(JSON.stringify(JSON.stringify(req))) ;
  
  
  
 //res.send("saludos terricolas");
  //res.status(200).json(resultado.rows) ;
  // res.send(JSON.stringify(result));
})
 
 








app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);




