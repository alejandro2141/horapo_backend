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
 
    console.log('JSON REQUEST BODY POST GET APPOINTMENT : ', req.body );
 
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
const resultado = client.query('SELECT * FROM appointment2', (err, result) => {

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
 
 

//********************************************* 
// PUBLIC POST TAKE APPOINTMENT
//********************************************* 
 
app.route('/bkn_take_appointment')
.post(function (req, res) {
 
    console.log('JSON REQUEST BODY - BKN TAKE APPOINTMENT : ', req.body );
 
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
//const resultado = client.query('INSERT INTO "appointment_taken" (								 patient_doc_id, patient_name ) VALUES (  "139093712', 'juan morales' ) ', (err, result) => {

console.log ("paciente nombreobtenido del post="+req.body.patient_name); 
//const resultado = client.query(' INSERT INTO "public"."appointment_taken" ("patient_name","patient_doc_id","patient_email","patient_phone","patient_insurance","app_id","appointment_profesional_id","appointment_specialty","appointment_date","appointment_time","appointment_profesional_name") VALUES ("nuevonombre","","","","",NULL,NULL,"",NULL,"","")  ') , (err, result) => {  
const query_insert = "INSERT INTO appointment_taken (patient_name, patient_doc_id , patient_email , patient_phone , patient_insurance, app_id   ) VALUES ('"+req.body.patient_name+"','"+req.body.patient_doc_id+"' ,'"+req.body.patient_email+"' ,'"+req.body.patient_phone+"','"+req.body.patient_insurance+"' ,'"+req.body.appointment_id+"' )" ;

const resultado = client.query(query_insert, (err, result) => {

  //console.log(err, 'JSON RESPONSE'+JSON.stringify(result))
     var json_response_ok = { 
			    result_status : 'inserted', 
			    result_code: '200',
			    	  };
  
    res.status(200).send(JSON.stringify(json_response_ok));
    console.log("JSON RESPONSE BODY : "+JSON.stringify(json_response_ok));
    console.log ("ERROR LOG : "+err);

  client.end()

})

  //console.log(JSON.stringify(JSON.stringify(req))) ;
  
  
  
 //res.send("saludos terricolas");
  //res.status(200).json(resultado.rows) ;
  // res.send(JSON.stringify(result));
})
 






app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);




