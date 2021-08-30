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


// **************************************
// ********* COMMON API *****************
// **************************************

// GET ASSISTANTS
app.route('/get_public_token')
.post(function (req, res) {
    console.log('get_public_token:', req.body );
   
    var tday = new Date();
    //var date = tday.getMinutes()+(tday.getHours()*60)+'-'+tday.getDate()+''+(tday.getMonth()+1) ;
    var date = tday.getMinutes()+(tday.getHours()*60) ;

    var json_response = { 
        token :  date , 
        min : '23579',
            };
    console.log("get_public_token Response: "+JSON.stringify(json_response));
    console.log("Request Sesion. ID created:"+req.body.id+" Token Assigned:"+json_response.token );

    res.status(200).send(JSON.stringify(json_response) );
})


// GET ASSISTANTS
app.route('/get_professional_specialty')
.post(function (req, res) {
 
    console.log('get_professional_specialty:', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
    })

client.connect()
// ****** Run query to bring appointment
const sql  = "SELECT * from  specialty where id IN  (SELECT specialty_id FROM professional_specialty WHERE professional_id=1) ;" ;
console.log('get_professional_specialty: SQL GET PROFESSIONAL SPECIALTY = '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('get_professional_specialty ERR:'+err ) ;
    }

  console.log('get_professional_specialty : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})



// SAVE APPOINTMENT
app.route('/save_appointment')
.post(function (req, res) {
    console.log('save_appointment INPUT : ', req.body );
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})
client.connect()
//const query_update = "UPDATE appointment SET reserve_patient_name = '"+req.body.patient_name+"' ,  reserve_patient_doc_id = '"+req.body.patient_doc_id+"' , reserve_patient_email = '"+req.body.patient_email+"' , reserve_patient_phone ='"+req.body.patient_phone+"' , reserve_patient_insurance='"+req.body.patient_insurance+"' , reserve_available='FALSE'    WHERE id = '"+req.body.appointment_id+"' RETURNING * " ;

const query_update = "UPDATE appointment SET patient_name = '"+req.body.patient_name+"' ,  patient_doc_id = '"+req.body.patient_doc_id+"' , patient_email = '"+req.body.patient_email+"' , patient_phone1 ='"+req.body.patient_phone+"' , patient_insurance='"+req.body.patient_insurance+"' , app_available='FALSE'    WHERE id = '"+req.body.appointment_id+"'  RETURNING * ";

console.log(query_update);
const resultado = client.query(query_update, (err, result) => {
    //res.status(200).send(JSON.stringify(result)) ;
    if (err) {
      console.log('/save_appointment ERR:'+err ) ;

    }
    else {
    console.log("JSON RESPONSE BODY : "+JSON.stringify(result));
    res.status(200).send(JSON.stringify(result.rows[0])) ;  
    }
    

    client.end()
})

  //console.log(JSON.stringify(JSON.stringify(req))) ;
  
  
  
 //res.send("saludos terricolas");
  //res.status(200).json(resultado.rows) ;
  // res.send(JSON.stringify(result));
})

// CANCEL APPOINTMENT 
app.route('/cancel_appointment')
.post(function (req, res) {
    console.log('save_appointment INPUT : ', req.body );
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})
client.connect()
const query_update = "UPDATE appointment SET app_status = '1'  WHERE id = '"+req.body.appointment_id+"' RETURNING * " ;

console.log(query_update);
const resultado = client.query(query_update, (err, result) => {

     console.log('RESULTADO '+JSON.stringify(resultado))
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

// CANCEL AND BLOCK APPOINTMENT
app.route('/cancel_block_appointment')
.post(function (req, res) {
    console.log('cancel_block_appointment INPUT : ', req.body );
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})
client.connect()
const query_update = "UPDATE appointment SET app_status = '1' , app_blocked = '1' WHERE id = '"+req.body.appointment_id+"' RETURNING * " ;

console.log(query_update);
const resultado = client.query(query_update, (err, result) => {

     console.log('cancel_block_appointment JSON:'+JSON.stringify(resultado))
     var json_response_ok = { 
			    result_status : 'inserted', 
			    result_code: '200',
			    	  };
  
    res.status(200).send(JSON.stringify(json_response_ok));
    console.log("cancel_block_appointment OUTPUT : "+JSON.stringify(json_response_ok));
    console.log ("cancel_block_appointment ERROR LOG : "+err);

  client.end()

})
 
})

// GET SESSION 
app.route('/get_session')
.post(function (req, res) {

console.log('get_session INPUT:', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})

client.connect()
// ****** Run query to bring appointment
//const sql = "INSERT INTO session (name, user_id,last_login , last_activity_time , user_type) RETURNING * SELECT   name, user_id , now() as last_login ,now() as last_activity_time, 1 as user_type  FROM (SELECT * FROM (SELECT * FROM professional WHERE email ='"+req.body.form_email+"' )P LEFT JOIN account ON P.id = account.user_id) J WHERE j.pass = '"+req.body.form_pass+"' RETURNING id" ;
const sql = "SELECT * FROM session WHERE id = '"+req.body.token+"' ";
console.log('get_session  SQL:'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('get_session ERR:'+err ) ;
    }

  console.log('get_session : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})
 
// GET ASSISTANTS
app.route('/get_assistants')
.post(function (req, res) {
 
    console.log('get_assistants:', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
    })

client.connect()
// ****** Run query to bring appointment
const sql  = "SELECT * FROM assistant" ;
console.log('professional_get_assistants: SQL GET AGENDA = '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('professional_get_assistants ERR:'+err ) ;
    }

  console.log('professional_get_assistants : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})

// DELETE CENTER
app.route('/delete_center')
.post(function (req, res) {
     console.log('delete_center :', req.body );
 // ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})

client.connect()
// ****** Run query to bring appointment
const sql  = "DELETE FROM center WHERE id='"+req.body.center_id+"'  " ;
console.log('delete_center : SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('delete_center ERR:'+err ) ;
    }

  console.log('delete_center : JSON RESPONSE DELTE AGENDA  = '+result ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})

// GET SPECIALTY LIST
app.route('/common_get_specialty_list')
.post(function (req, res) {
     console.log('common_get_specialty_list :', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})

client.connect()
// ****** Run query to bring appointment
const sql  = "SELECT * FROM specialty " ;
console.log('common_get_specialty_list: SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('get_specialties ERR:'+err ) ;
    }

  console.log('get_specialties : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})


// GET COMUNA LIST
app.route('/common_get_comuna_list')
.post(function (req, res) {
     console.log('common_get_comuna_list :', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})

client.connect()
// ****** Run query to bring appointment
const sql  = "SELECT * FROM comuna " ;
console.log('common_get_comuna_list: SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('common_get_comuna_list ERR:'+err ) ;
    }

  console.log('common_get_comuna_list : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})


// GET INSURANCE LIST
app.route('/common_get_insurance_list')
.post(function (req, res) {
     console.log('common_get_insurance_list :', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})

client.connect()
// ****** Run query to bring appointment
const sql  = "SELECT * FROM insurance ORDER BY  id ASC " ;
console.log('common_get_insurance_list: SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('common_get_insurance_list ERR:'+err ) ;
    }

  console.log('common_get_insurance_list : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})


// PUBLIC POST get Professioal GET CALENDAR
app.route('/get_calendar')
.post(function (req, res) {
	console.log('get_calendar INPUT:', req.body );
 
 const json_response = { 
"version": "Chilean Calendar v1.0",
"years" : [ 
        {"year_number" : "2021", months : [
					{"name" : "Abril", "month_number" : "4" , days : [ 
						    {day_number: "", " " : " " } ,
						    {day_number: "", " " : " " } ,
							{day_number: "1", "special_comment" : "Holyday New Year" } ,
							{day_number: "2", "special_comment" : "" } ,
							{day_number: "3", "special_comment" : "" } ,
							{day_number: "4", "special_comment" : "" } ,
							{day_number: "5", "special_comment" : "" } ,
							{day_number: "6", "special_comment" : "" } ,
							{day_number: "7", "special_comment" : "" } ,
							{day_number: "8", "special_comment" : "" } ,
							{day_number: "9", "special_comment" : "" } ,
							{day_number: "10", "special_comment" : "" } ,
							{day_number: "11", "special_comment" : "" } ,
							{day_number: "12", "special_comment" : "" } ,
							{day_number: "13", "special_comment" : "" } ,
							{day_number: "14", "special_comment" : "" } ,
							{day_number: "15", "special_comment" : "" } ,
							{day_number: "16", "special_comment" : "" } ,
							{day_number: "17", "special_comment" : "" } ,
							{day_number: "18", "special_comment" : "" } ,
							{day_number: "19", "special_comment" : "" } ,
							{day_number: "20", "special_comment" : "" } ,
							{day_number: "21", "special_comment" : "" } ,
							{day_number: "22", "special_comment" : "" } ,
							{day_number: "23", "special_comment" : "" } ,
							{day_number: "24", "special_comment" : "" } ,
							{day_number: "25", "special_comment" : "" } ,
							{day_number: "26", "special_comment" : "" } ,
							{day_number: "27", "special_comment" : "" } ,
							{day_number: "28", "special_comment" : "" } ,
							{day_number: "29", "special_comment" : "" } ,
							{day_number: "30", "special_comment" : "" } ,
							{day_number: " ", " " : "" } ,
							{day_number: " ", " " : "" } ,
							{day_number: " ", " " : "" } ,
							 ] 
					}, 
					{"name" : "Mayo", "month_number" : "5" , days : [ 
						    {day_number: "", "special_comment" : " " } ,
							{day_number: "", "special_comment" : " " } ,
							{day_number: "", "special_comment" : " " } ,
							{day_number: "", "special_comment" : " " } ,
							{day_number: "", "special_comment" : " " } ,
							{day_number: "1", "special_comment" : "" } ,
							{day_number: "2", "special_comment" : "" } ,
							{day_number: "3", "special_comment" : "" } ,
							{day_number: "4", "special_comment" : "" } ,
							{day_number: "5", "special_comment" : "" } ,
							{day_number: "6", "special_comment" : "" } ,
							{day_number: "7", "special_comment" : "" } ,
							{day_number: "8", "special_comment" : "" } ,
							{day_number: "9", "special_comment" : "" } ,
							{day_number: "10", "special_comment" : "" } ,
							{day_number: "11", "special_comment" : "" } ,
							{day_number: "12", "special_comment" : "" } ,
							{day_number: "13", "special_comment" : "" } ,
							{day_number: "14", "special_comment" : "" } ,
							{day_number: "15", "special_comment" : "" } ,
							{day_number: "16", "special_comment" : "" } ,
							{day_number: "17", "special_comment" : "" } ,
							{day_number: "18", "special_comment" : "" } ,
							{day_number: "19", "special_comment" : "" } ,
							{day_number: "20", "special_comment" : "" } ,
							{day_number: "21", "special_comment" : "" } ,
							{day_number: "22", "special_comment" : "" } ,
							{day_number: "23", "special_comment" : "" } ,
							{day_number: "24", "special_comment" : "" } ,
							{day_number: "25", "special_comment" : "" } ,
							{day_number: "26", "special_comment" : "" } ,
							{day_number: "27", "special_comment" : "" } ,
							{day_number: "28", "special_comment" : "" } ,
							{day_number: "29", "special_comment" : "" } ,
							{day_number: "30", "special_comment" : "" } ,
							{day_number: "31", "special_comment" : "" } ,
							{day_number: "",   "special_comment" : " " } ,
							{day_number: "",   "special_comment" : " " } ,
							{day_number: "",   "special_comment" : " " } ,
							{day_number: "",   "special_comment" : " " } ,
							{day_number: "",   "special_comment" : " " } ,
							{day_number: "",   "special_comment" : " " } 
													
							 ] 
					}, 			
					{"name" : "Junio", "month_number" : "6" , days : [ 
						    {day_number: "", "special_comment" : " " } ,
							{day_number: "1", "special_comment" : "" } ,
							{day_number: "2", "special_comment" : "" } ,
							{day_number: "3", "special_comment" : "" } ,
							{day_number: "4", "special_comment" : "" } ,
							{day_number: "5", "special_comment" : "" } ,
							{day_number: "6", "special_comment" : "" } ,
							{day_number: "7", "special_comment" : "" } ,
							{day_number: "8", "special_comment" : "" } ,
							{day_number: "9", "special_comment" : "" } ,
							{day_number: "10", "special_comment" : "" } ,
							{day_number: "11", "special_comment" : "" } ,
							{day_number: "12", "special_comment" : "" } ,
							{day_number: "13", "special_comment" : "" } ,
							{day_number: "14", "special_comment" : "" } ,
							{day_number: "15", "special_comment" : "" } ,
							{day_number: "16", "special_comment" : "" } ,
							{day_number: "17", "special_comment" : "" } ,
							{day_number: "18", "special_comment" : "" } ,
							{day_number: "19", "special_comment" : "" } ,
							{day_number: "20", "special_comment" : "" } ,
							{day_number: "21", "special_comment" : "" } ,
							{day_number: "22", "special_comment" : "" } ,
							{day_number: "23", "special_comment" : "" } ,
							{day_number: "24", "special_comment" : "" } ,
							{day_number: "25", "special_comment" : "" } ,
							{day_number: "26", "special_comment" : "" } ,
							{day_number: "27", "special_comment" : "" } ,
							{day_number: "28", "special_comment" : "" } ,
							{day_number: "29", "special_comment" : "" } ,
							{day_number: "30", "special_comment" : "" } ,
							{day_number: "31", "special_comment" : "" } ,
							{day_number: "",   "special_comment" : " " } ,
							{day_number: "",   "special_comment" : " " } ,
							{day_number: "",   "special_comment" : " " } 
							
							 ] 
					},
          {"name" : "Julio", "month_number" : "7" , days : [ 
            {day_number: "", "special_comment" : " " } ,
            {day_number: "", "special_comment" : " " } ,
            {day_number: "", "special_comment" : " " } ,
          {day_number: "1", "special_comment" : "" } ,
          {day_number: "2", "special_comment" : "" } ,
          {day_number: "3", "special_comment" : "" } ,
          {day_number: "4", "special_comment" : "" } ,
          {day_number: "5", "special_comment" : "" } ,
          {day_number: "6", "special_comment" : "" } ,
          {day_number: "7", "special_comment" : "" } ,
          {day_number: "8", "special_comment" : "" } ,
          {day_number: "9", "special_comment" : "" } ,
          {day_number: "10", "special_comment" : "" } ,
          {day_number: "11", "special_comment" : "" } ,
          {day_number: "12", "special_comment" : "" } ,
          {day_number: "13", "special_comment" : "" } ,
          {day_number: "14", "special_comment" : "" } ,
          {day_number: "15", "special_comment" : "" } ,
          {day_number: "16", "special_comment" : "" } ,
          {day_number: "17", "special_comment" : "" } ,
          {day_number: "18", "special_comment" : "" } ,
          {day_number: "19", "special_comment" : "" } ,
          {day_number: "20", "special_comment" : "" } ,
          {day_number: "21", "special_comment" : "" } ,
          {day_number: "22", "special_comment" : "" } ,
          {day_number: "23", "special_comment" : "" } ,
          {day_number: "24", "special_comment" : "" } ,
          {day_number: "25", "special_comment" : "" } ,
          {day_number: "26", "special_comment" : "" } ,
          {day_number: "27", "special_comment" : "" } ,
          {day_number: "28", "special_comment" : "" } ,
          {day_number: "29", "special_comment" : "" } ,
          {day_number: "30", "special_comment" : "" } ,
          {day_number: "31", "special_comment" : "" } ,
          {day_number: "",   "special_comment" : " " } 
          
           ] 
      },

      {"name" : "Agosto", "month_number" : "8" , days : [ 
        {day_number: "", "special_comment" : " " } ,
        {day_number: "", "special_comment" : " " } ,
        {day_number: "", "special_comment" : " " } ,
        {day_number: "", "special_comment" : " " } ,
        {day_number: "", "special_comment" : " " } ,
        {day_number: "", "special_comment" : " " } ,
      {day_number: "1", "special_comment" : "" } ,
      {day_number: "2", "special_comment" : "" } ,
      {day_number: "3", "special_comment" : "" } ,
      {day_number: "4", "special_comment" : "" } ,
      {day_number: "5", "special_comment" : "" } ,
      {day_number: "6", "special_comment" : "" } ,
      {day_number: "7", "special_comment" : "" } ,
      {day_number: "8", "special_comment" : "" } ,
      {day_number: "9", "special_comment" : "" } ,
      {day_number: "10", "special_comment" : "" } ,
      {day_number: "11", "special_comment" : "" } ,
      {day_number: "12", "special_comment" : "" } ,
      {day_number: "13", "special_comment" : "" } ,
      {day_number: "14", "special_comment" : "" } ,
      {day_number: "15", "special_comment" : "" } ,
      {day_number: "16", "special_comment" : "" } ,
      {day_number: "17", "special_comment" : "" } ,
      {day_number: "18", "special_comment" : "" } ,
      {day_number: "19", "special_comment" : "" } ,
      {day_number: "20", "special_comment" : "" } ,
      {day_number: "21", "special_comment" : "" } ,
      {day_number: "22", "special_comment" : "" } ,
      {day_number: "23", "special_comment" : "" } ,
      {day_number: "24", "special_comment" : "" } ,
      {day_number: "25", "special_comment" : "" } ,
      {day_number: "26", "special_comment" : "" } ,
      {day_number: "27", "special_comment" : "" } ,
      {day_number: "28", "special_comment" : "" } ,
      {day_number: "29", "special_comment" : "" } ,
      {day_number: "30", "special_comment" : "" } ,
      {day_number: "31", "special_comment" : "" } ,
      {day_number: "",   "special_comment" : " " } ,
      {day_number: "",   "special_comment" : " " } ,
      {day_number: "",   "special_comment" : " " } ,
      {day_number: "",   "special_comment" : " " } ,
      {day_number: "",   "special_comment" : " " } 
      
       ] 
  },
					 
        ] //end year 2021        
       
		},  
		
		{"year_number" : "2022", months : [  
					{"name" : "Enero", "month_number" : "1" , days : [ 
						    {day_number: "", "special_comment" : " " } ,
							{day_number: "1", "special_comment" : "" } ,
							{day_number: "2", "special_comment" : "" } ,
							{day_number: "3", "special_comment" : "" } ,
							{day_number: "4", "special_comment" : "" } ,
							{day_number: "5", "special_comment" : "" } ,
							{day_number: "6", "special_comment" : "" } ,
							{day_number: "7", "special_comment" : "" } ,
							{day_number: "8", "special_comment" : "" } ,
							{day_number: "9", "special_comment" : "" } ,
							{day_number: "10", "special_comment" : "" } ,
							{day_number: "11", "special_comment" : "" } ,
							{day_number: "12", "special_comment" : "" } ,
							{day_number: "13", "special_comment" : "" } ,
							{day_number: "14", "special_comment" : "" } ,
							{day_number: "15", "special_comment" : "" } ,
							{day_number: "16", "special_comment" : "" } ,
							{day_number: "17", "special_comment" : "" } ,
							{day_number: "18", "special_comment" : "" } ,
							{day_number: "19", "special_comment" : "" } ,
							{day_number: "20", "special_comment" : "" } ,
							{day_number: "21", "special_comment" : "" } ,
							{day_number: "22", "special_comment" : "" } ,
							{day_number: "23", "special_comment" : "" } ,
							{day_number: "24", "special_comment" : "" } ,
							{day_number: "25", "special_comment" : "" } ,
							{day_number: "26", "special_comment" : "" } ,
							{day_number: "27", "special_comment" : "" } ,
							{day_number: "28", "special_comment" : "" } ,
							{day_number: "29", "special_comment" : "" } ,
							{day_number: "30", "special_comment" : "" } ,
							{day_number: "31", "special_comment" : "" } ,
							{day_number: "",   "special_comment" : " " } ,
							{day_number: "",   "special_comment" : " " } ,
							{day_number: "",   "special_comment" : " " } 
							 
                                                                ] 
					}, 
					]        
        },  
		
		]
  
} ;
	res.status(200).send(json_response);
})



//***************************************
//******** PROFESIONAL API  *************
//***************************************

// PROFESSIONAL professional_get_month_calendar
app.route('/professional_get_month_calendar')
.post(function (req, res) {
console.log('professional_get_month_calendar INPUT:', req.body );

const year_month_extract = req.body.requiredDay.substring(0, 7) ;
var json_response = { error : 'No Set'} ;

console.log("MONTH EXTRACT ="+year_month_extract );
switch ( year_month_extract ) {
  case '2021-05':
	console.log("professional_get_month_calendar  2021-05");
	json_response = { month_name : 'Mayo' , year : '2021' ,  weeks : [  
								{
								week_number: 12, 
								days : [  { day : '28' , month : '04' , year : '2021'  , comment:'Cumpleaños'  },  
										  { day : '29' , month : '04' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '30' , month : '04' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '01'  , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '02'  , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '03'  , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
										  { day : '04'  , month : '05' , year : '2021'  , comment:'Cumpleaños'  }
										]
								},
								{
								week_number: 13, 
								days : [ { day : '05' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },  
										  { day : '06' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '07' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '08' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '09' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '10' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
										  { day : '11' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
										]
								},
								{
								week_number: 14, 
								days : [ { day : '12' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },  
										  { day : '13' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '14' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '15' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '16' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '17' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
										  { day : '18' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
										]
								},
								{
								week_number: 15, 
								days : [ { day : '19' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },  
										  { day : '20' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '21' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '22' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '23' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '24' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
										  { day : '25' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
										]
								},
								{
								week_number: 16, 
								days : [ { day : '26' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },  
										  { day : '27' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '28' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '29' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '30' , month : '05' , year : '2021'  , comment:'Cumpleaños'  },
  										  { day : '01' , month : '06' , year : '2021'  , comment:'Cumpleaños'  },
										  { day : '02' , month : '06' , year : '2021'  , comment:'Cumpleaños'  },
										]
								},
							]				
						};
		
	break;
  case '2021-06':
    console.log("professional_get_month_calendar  2021-06");
	json_response = { month_name : 'Junio' , year : '2021' ,  weeks : [  
								{
								week_number: 12, 
								days : [  { day : '30' , month : '05' , year : '2021'  , comment:''  },  
										  { day : '31' , month : '05' , year : '2021'  , comment:''  },
  										  { day : '01' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '02'  , month : '06' , year : '2021'  , comment:''  },
  										  { day : '03'  , month : '06' , year : '2021'  , comment:''  },
  										  { day : '04'  , month : '06' , year : '2021'  , comment:''  },
										  { day : '05'  , month : '06' , year : '2021'  , comment:''  }
										]
								},
								{
								week_number: 13, 
								days : [ { day : '06' , month : '06' , year : '2021'  , comment:''  },  
										  { day : '07' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '08' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '09' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '10' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '11' , month : '06' , year : '2021'  , comment:''  },
										  { day : '12' , month : '06' , year : '2021'  , comment:''  },
										]
								},
								{
								week_number: 14, 
								days : [ { day : '13' , month : '06' , year : '2021'  , comment:''  },  
										  { day : '14' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '15' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '16' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '17' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '18' , month : '06' , year : '2021'  , comment:''  },
										  { day : '19' , month : '06' , year : '2021'  , comment:''  },
										]
								},
								{
								week_number: 15, 
								days : [ { day : '20' , month : '06' , year : '2021'  , comment:''  },  
										  { day : '21' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '22' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '23' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '24' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '25' , month : '06' , year : '2021'  , comment:''  },
										  { day : '26' , month : '06' , year : '2021'  , comment:''  },
										]
								},
								{
								week_number: 16, 
								days : [ { day : '27' , month : '06' , year : '2021'  , comment:''  },  
										  { day : '28' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '29' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '30' , month : '06' , year : '2021'  , comment:''  },
  										  { day : '01' , month : '07' , year : '2021'  , comment:''  },
  										  { day : '02' , month : '07' , year : '2021'  , comment:''  },
										  { day : '03' , month : '07' , year : '2021'  , comment:''  },
										]
								},
							]				
						};
    break;
    case '2021-07':
      console.log("professional_get_month_calendar  2021-07");
    json_response = { month_name : 'Julio' , year : '2021' ,  weeks : [  
                  {
                  week_number: 17, 
                  days : [
                          { day : '27' , month : '06' , year : '2021'  , comment:''  },  
                          { day : '29' , month : '06' , year : '2021'  , comment:''  },
                          { day : '30'  , month : '06' , year : '2021'  , comment:''  },
                          { day : '01'  , month : '07' , year : '2021'  , comment:''  },
                          { day : '02'  , month : '07' , year : '2021'  , comment:''  },
                          { day : '03'  , month : '07' , year : '2021'  , comment:''  },
                          { day : '04'  , month : '07' , year : '2021'  , comment:''  }
                         ]
                  },
                  {
                  week_number: 18, 
                  days : [ 
                          { day : '05' , month : '07' , year : '2021'  , comment:''  },  
                          { day : '06' , month : '07' , year : '2021'  , comment:''  },
                          { day : '07' , month : '07' , year : '2021'  , comment:''  },
                          { day : '08' , month : '07' , year : '2021'  , comment:''  },
                          { day : '09' , month : '07' , year : '2021'  , comment:''  },
                          { day : '10' , month : '07' , year : '2021'  , comment:''  },
                          { day : '11' , month : '07' , year : '2021'  , comment:''  }
                        ]
                  },
                  {
                  week_number: 19, 
                  days : [ 
                        { day : '12' , month : '07' , year : '2021'  , comment:''  },  
                        { day : '13' , month : '07' , year : '2021'  , comment:''  },
                        { day : '14' , month : '07' , year : '2021'  , comment:''  },
                        { day : '15' , month : '07' , year : '2021'  , comment:''  },
                        { day : '16' , month : '07' , year : '2021'  , comment:''  },
                        { day : '17' , month : '07' , year : '2021'  , comment:''  },
                        { day : '18' , month : '07' , year : '2021'  , comment:''  }        
                    ]
                  },
                  {
                  week_number: 20, 
                  days : [ 
                        { day : '19' , month : '07' , year : '2021'  , comment:''  },  
                        { day : '20' , month : '07' , year : '2021'  , comment:''  },
                        { day : '21' , month : '07' , year : '2021'  , comment:''  },
                        { day : '22' , month : '07' , year : '2021'  , comment:''  },
                        { day : '23' , month : '07' , year : '2021'  , comment:''  },
                        { day : '24' , month : '07' , year : '2021'  , comment:''  },
                        { day : '25' , month : '07' , year : '2021'  , comment:''  }    
                      ]
                  },
                  {
                  week_number: 21, 
                  days : [ 
                        { day : '26' , month : '07' , year : '2021'  , comment:''  },  
                        { day : '27' , month : '07' , year : '2021'  , comment:''  },
                        { day : '28' , month : '07' , year : '2021'  , comment:''  },
                        { day : '29' , month : '07' , year : '2021'  , comment:''  },
                        { day : '30' , month : '07' , year : '2021'  , comment:''  },
                        { day : '31' , month : '07' , year : '2021'  , comment:''  },
                        { day : '01' , month : '08' , year : '2021'  , comment:''  }    
                      ]
                  },
                ]				
              };
       case '2021-08':
                console.log("professional_get_month_calendar  2021-08");
              json_response = { month_name : 'Agosto' , year : '2021' ,  weeks : [  
                            {
                            week_number: 22, 
                            days : [
                                    { day : '26' , month : '07' , year : '2021'  , comment:''  },  
                                    { day : '27' , month : '07' , year : '2021'  , comment:''  },
                                    { day : '28'  , month : '07' , year : '2021'  , comment:''  },
                                    { day : '29'  , month : '07' , year : '2021'  , comment:''  },
                                    { day : '30'  , month : '07' , year : '2021'  , comment:''  },
                                    { day : '31'  , month : '07' , year : '2021'  , comment:''  },
                                    { day : '01'  , month : '08' , year : '2021'  , comment:''  }
                                   ]
                            },
                            {
                            week_number: 23, 
                            days : [ 
                                    { day : '02' , month : '08' , year : '2021'  , comment:''  },  
                                    { day : '03' , month : '08' , year : '2021'  , comment:''  },
                                    { day : '04' , month : '08' , year : '2021'  , comment:''  },
                                    { day : '05' , month : '08' , year : '2021'  , comment:''  },
                                    { day : '06' , month : '08' , year : '2021'  , comment:''  },
                                    { day : '07' , month : '08' , year : '2021'  , comment:''  },
                                    { day : '08' , month : '08' , year : '2021'  , comment:''  }
                                  ]
                            },
                            {
                            week_number: 24, 
                            days : [ 
                                  { day : '09' , month : '08' , year : '2021'  , comment:''  },  
                                  { day : '10' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '11' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '12' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '13' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '14' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '15' , month : '08' , year : '2021'  , comment:''  }        
                              ]
                            },
                            {
                            week_number: 25, 
                            days : [ 
                                  { day : '16' , month : '08' , year : '2021'  , comment:''  },  
                                  { day : '17' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '18' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '19' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '20' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '21' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '22' , month : '08' , year : '2021'  , comment:''  }    
                                ]
                            },
                            {
                            week_number: 26, 
                            days : [ 
                                  { day : '23' , month : '08' , year : '2021'  , comment:''  },  
                                  { day : '24' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '25' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '26' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '27' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '28' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '29' , month : '08' , year : '2021'  , comment:''  }    
                                ]
                            },
                            {
                            week_number: 27, 
                            days : [ 
                                  { day : '30' , month : '08' , year : '2021'  , comment:''  },  
                                  { day : '31' , month : '08' , year : '2021'  , comment:''  },
                                  { day : '01' , month : '09' , year : '2021'  , comment:''  },
                                  { day : '02' , month : '10' , year : '2021'  , comment:''  },
                                  { day : '03' , month : '11' , year : '2021'  , comment:''  },
                                  { day : '04' , month : '12' , year : '2021'  , comment:''  },
                                  { day : '05' , month : '13' , year : '2021'  , comment:''  }    
                                ]
                            },
                          ]				
                        };


    default:
	  break;
}//END SWITCH

	console.log(' professional_get_month_calendar RESPONSE  :', JSON.stringify(json_response) );
	res.status(200).send(json_response);
})

// PROFESIONAL GET ASSISTANTS
app.route('/professional_get_assistants')
.post(function (req, res) {
 
    console.log('professional_get_assistants :', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})

client.connect()
// ****** Run query to bring appointment
//const sql  = "SELECT * FROM center WHERE id IN  (SELECT center_id FROM center_professional where professional_id='"+req.body.professional_id+"' ) " ;
const sql  = "SELECT * FROM assistant WHERE id in( SELECT assistant_id FROM assistant_professional where professional_id='"+req.body.professional_id+"') AND assistant_deleted!='true' ORDER BY id DESC    " ;


console.log('professional_get_assistants: SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('professional_get_assistants ERR:'+err ) ;
    }

  console.log('professional_get_assistants : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})

// PROFESIONAL GET APPOINTMENT DAY
app.route('/professional_get_appointments_day')
.post(function (req, res) {
 
    console.log('professional_get_appointments_day : INPUT : ', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})
client.connect()
// ****** Run query to bring appointment
//const sql ="SELECT * FROM ( SELECT address as center_address, name as center_name, app_id,date, start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, blocked, professional_id   FROM   (SELECT  id as app_id, date , start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, blocked, professional_id   FROM appointment WHERE professional_id='"+req.body.professional_id+"' and Date >= '"+req.body.date+"' )   J LEFT JOIN center ON center.id=j.center_id  )K LEFT JOIN specialty ON specialty.id=K.specialty   " ;
const sql ="SELECT * FROM ( SELECT  app_status, patient_name, patient_email, patient_phone1, patient_phone2, patient_insurance ,  patient_doc_id , name as specialty_name, center_address, center_name, center_color , app_id,date, start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, app_blocked, professional_id, app_available   FROM (  SELECT app_status, patient_name, patient_email, patient_phone1, patient_phone2, patient_insurance ,  patient_doc_id , address as center_address, name as center_name, color as center_color, app_id,date, start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, app_blocked, professional_id ,app_available  FROM  (SELECT app_status, patient_name, patient_email, patient_phone1, patient_phone2, patient_insurance ,  patient_doc_id ,id as app_id, date , start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, app_blocked, professional_id , app_available  FROM appointment WHERE professional_id='"+req.body.professional_id+"' and Date = '"+req.body.date+"' ORDER BY start_time ASC ) J LEFT JOIN center ON center.id=j.center_id  )K LEFT JOIN specialty ON specialty.id=K.specialty ) L LEFT JOIN professional ON professional.id = L.professional_id " ;

console.log('professional_get_appointments_day SQL:'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('professional_get_appointments_day ERROR QUERY = '+sql ) ;
    }
  console.log('professional_get_appointments_day RESPONSE  = '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})
})

// PROFESSIONAL LOGIN 
app.route('/professional_login')
.post(function (req, res) {

console.log('professionalLogin INPUT:', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})

client.connect()
// ****** Run query to bring appointment
//const sql  = "SELECT * FROM professional WHERE email='"+req.body.form_email+"'  AND pass='"+req.body.form_pass+"'";

//const sql  = "SELECT * FROM (SELECT * FROM (SELECT * FROM professional WHERE email = '"+req.body.form_email+"')P LEFT JOIN account ON P.id = account.user_id) J WHERE j.pass = '"+req.body.form_pass+"' " ;
//const sql = "INSERT INTO session (name, user_id,last_login , last_activity_time , user_type) RETURNING * SELECT   name, user_id , now() as last_login ,now() as last_activity_time, 1 as user_type  FROM (SELECT * FROM (SELECT * FROM professional WHERE email ='"+req.body.form_email+"' )P LEFT JOIN account ON P.id = account.user_id) J WHERE j.pass = '"+req.body.form_pass+"' RETURNING id" ;
const sql = "INSERT INTO session (name, user_id,last_login , last_activity_time , user_type  ) SELECT   name, user_id , now() as last_login ,now() as last_activity_time, 1 as user_type  FROM (SELECT * FROM (SELECT * FROM professional WHERE email ='"+req.body.form_email+"' )P LEFT JOIN account ON P.id = account.user_id) J WHERE j.pass = '"+req.body.form_pass+"'   RETURNING * ";

console.log('professionalLogin SQL:'+sql ) ;
var json_response = {  professional_id: null , result_code : 33 };
const resultado = client.query(sql, (err, result) => {
	
	console.log("professionalLogin Result : "+JSON.stringify(result));
  if (err) {
      console.log('professionalLogin ERROR QUERY  = '+sql ) ;
    }
    
  if(result.rowCount == 1 )
  {
  console.log ("professionalLogin LOGIN MATCH!!");
  json_response = { professional_id: result.rows[0].user_id , 
					result_code: 0 ,
					professional_name: result.rows[0].name ,
					token : result.rows[0].id,
					};
  }
  else
  {
  console.log ("professionalLogin LOGIN NO MATCH!!");
  }
  
  res.status(200).send(JSON.stringify(json_response));
  console.log('professionalLogin OUTPUT:'+JSON.stringify(json_response) ) ;
  client.end()
})


})
 
// PROFESSIONAL CREATE CENTER 
app.route('/professional_create_center')
.post(function (req, res) {
    console.log('professional_create_center INPUT:', req.body );
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})
client.connect() ;
// GET PROFESSIONAL DATA
var sql  = null;
var json_response = { result_status : 1 };
//var res = null; 	
// CHECK INPUT PARAMETERS TO IDENTIFY IF  REQUEST IS TO CREATE CENTER
// CREATE DIRECTLY AGENDA 
//const sql  = "INSERT INTO centers ( name ,  address , phone1, phone2 ) VALUES (  '"+req.body.center_name+"', '"+req.body.center_address+"' , '"+req.body.center_phone1+"', '"+req.body.center_phone2+"' ) RETURNING id " ;
sql = " WITH ids AS (  INSERT INTO center ( name ,  address , phone1, phone2, comuna ) VALUES (  '"+req.body.center_name+"' , '"+req.body.center_address+"', '"+req.body.center_phone1+"' ,'"+req.body.center_phone2+"' ,'"+req.body.center_comuna+"' ) RETURNING id as center_id ) INSERT INTO center_professional (professional_id, center_id) VALUES ('"+req.body.professional_id+"', (SELECT center_id from ids) ) RETURNING * ;  ";

console.log('create_center SQL:'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('professional_create_center ERROR  CENTER CREATION QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	 // json_response = { result_status : 0  , center_id : result.data.center_id  };
	  res.status(200).send(JSON.stringify(result));
	  console.log('professional_create_center  SUCCESS CENTER INSERT ' ) ; 
    console.log('professional_create_center  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})

})

// PROFESSIONAL GET CENTERS
app.route('/professional_get_centers')
.post(function (req, res) {
 
    console.log('professional_get_centers :', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})

client.connect()
// ****** Run query to bring appointment
const sql  = "SELECT * FROM center WHERE id IN  (SELECT center_id FROM center_professional where professional_id='"+req.body.professional_id+"' ) AND center_deleted!='true'  ORDER BY id DESC  " ;
console.log('professional_get_centers: SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('professional_get_centers ERR:'+err ) ;
    }

  console.log('professional_get_centers : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})

// PROFESSIONAL delete Center
app.route('/professional_delete_center')
.post(function (req, res) {
     console.log('delete_center :', req.body );
 // ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})

client.connect()
// ****** Run query to bring appointment
//const sql  = "DELETE FROM center WHERE id='"+req.body.center_id+"'  " ;
//const sql = "UPDATE assistant  SET assistant_deleted = 'true' , assistant_active = 'false' WHERE id = '"+req.body.assistant_id+"' RETURNING * " ;
const sql  = "UPDATE center SET center_deleted = 'true' , active ='0' WHERE id = '"+req.body.center_id+"' RETURNING * " ;

console.log('delete_center : SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('delete_center ERR:'+err ) ;
    }

  console.log('delete_center : JSON RESPONSE DELTE AGENDA  = '+result ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})

// PROFESSIONAL  CREATE ASSISTANT
app.route('/professional_create_assistant')
.post(function (req, res) {
    console.log('professional_create_assistant INPUT:', req.body );
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})
client.connect() ;
// GET PROFESSIONAL DATA
var sql  = null;
var json_response = { result_status : 1 };
//var res = null; 	
// CHECK INPUT PARAMETERS TO IDENTIFY IF  REQUEST IS TO CREATE CENTER
// CREATE DIRECTLY AGENDA 
//const sql  = "INSERT INTO centers ( name ,  address , phone1, phone2 ) VALUES (  '"+req.body.center_name+"', '"+req.body.center_address+"' , '"+req.body.center_phone1+"', '"+req.body.center_phone2+"' ) RETURNING id " ;
//sql = " WITH ids AS (  INSERT INTO assistant ( assistant_document_id , assistant_name , assistant_email , assistant_phone , assistant_active ) VALUES (  '"+req.body.assistant_doc_id+"' , '"+req.body.assistant_name+"' , '"+req.body.assistant_email+"' ,'"+req.body.center_phone1+"' , '1' ) RETURNING id as center_id ) INSERT INTO center_professional (professional_id, center_id) VALUES ('"+req.body.professional_id+"', (SELECT center_id from ids) ) RETURNING * ;  ";

sql =   " WITH ids AS (  INSERT INTO assistant ( assistant_document_id , assistant_name , assistant_email , assistant_phone , assistant_active ) VALUES (  '"+req.body.assistant_doc_id+"' , '"+req.body.assistant_name+"', '"+req.body.assistant_email+"' ,'"+req.body.assistant_phone1+"','1' ) RETURNING id as assistant_id ) INSERT INTO assistant_professional (professional_id, assistant_id) VALUES ('"+req.body.professional_id+"', (SELECT assistant_id from ids) ) RETURNING * " ;



console.log('create_sistant SQL:'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('professional_create_assistant ERROR  CENTER CREATION QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	 // json_response = { result_status : 0  , center_id : result.data.center_id  };
	  res.status(200).send(JSON.stringify(result));
	  console.log('professional_create_assistant  SUCCESS CENTER INSERT ' ) ; 
    console.log('professional_create_assistant  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})

})

//  DELETE ASSISTANT 
app.route('/professional_delete_assistant')
.post(function (req, res) {
     console.log('professional_delete_assistant :', req.body );
 // ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})

client.connect()
// ****** Run query to bring appointment
//const sql  = "DELETE FROM assistant WHERE id='"+req.body.assistant_id+"'  " ;
const sql = "UPDATE assistant  SET assistant_deleted = 'true' , assistant_active = 'false' WHERE id = '"+req.body.assistant_id+"' RETURNING * " ;

console.log('professional_delete_assistant : SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('professional_delete_assistant ERR:'+err ) ;
    }

  console.log('professional_delete_assistant : RESPONSE:'+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})

// PPROFESSIONAL CREATE APPOINTMENTS
app.route('/professional_create_appointments')
.post(function (req, res) {
 
    console.log('aprofessional_create_appointments INPUT : ', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})

let agenda = null;
let agenda_name = 'No Name';
var agenda_result = null;
client.connect() ;

// CICLE TO CREATE APPOINTMENTS
let startTime=  new Date(req.body.form_date);
startTime.setHours( Math.trunc( req.body.form_start_time/60   )  );
startTime.setMinutes(  req.body.form_start_time % 60  );
console.log("StartTime:"+startTime);

let endTime =  new Date(req.body.form_date);
endTime.setHours( Math.trunc( req.body.form_end_time/60   )  );
endTime.setMinutes(  req.body.form_end_time % 60  );
console.log("endTime:"+endTime);

console.log("BLOQUE start ---->:"+startTime);
console.log("BLOQUE end   ---->:"+endTime);

let time_block = req.body.form_end_time - req.body.form_start_time ;
let cycles = Math.trunc( time_block / req.body.form_appointment_duration  )  ;
console.log("TIME BLOCK :"+req.body.form_appointment_duration );
console.log("cyces     :"+cycles);

var i;
//var SQL_VALUES="INSERT INTO appointment  (  date ,start_time , end_time ,duration , specialty , is_public , agenda_id, reserve_available ) VALUES ";

var SQL_VALUES= "INSERT INTO appointment  ( professional_id ,center_id , date ,start_time , end_time ,duration , specialty , available_public_search , app_available , app_blocked  ) VALUES " ;  
//( 1,1 ,'2021-04-27'  , '0:30:00' , '1:0:00' , '30'  , '3'  ,  '0' ,'1','0'   ) RETURNING id ;


for (  i = 0 ; i < cycles ; i++ ) 
{	console.log("cycle---->:"+i);
	
	endTime.setTime(startTime.getTime() + ( 1000 * 60 * req.body.form_appointment_duration  ));
	if (i != 0)
	{
		SQL_VALUES +="  , " ;
	}
	//Build SQL 
	//SQL_VALUES +=" ( '"+req.body.form_date+"'  , '"+startTime.getTime+"'  , '"+endTime.getTime+"'  , '"+req.body.form_appointment_duration+"'  , '"+req.body.form_specialty+"' ,  '"+req.body.form_public+"' , '"+req.body.form_agenda_id+"' , 1 ) " ;
	SQL_VALUES +=" ( '"+req.body.form_professional_id+"' , '"+req.body.form_center_id+"' , '"+req.body.form_date+"'  , '"+startTime.getHours()+":"+startTime.getMinutes()+":00' , '"+endTime.getHours()+":"+endTime.getMinutes()+":00' , '"+req.body.form_appointment_duration+"'  , '"+req.body.form_specialty_code+"'  ,  '"+req.body.form_public+"' ,'1','0'  )  " ;
	console.log("Hora start ---->:"+startTime);
	console.log("Hora fin   ---->:"+endTime);
	
	startTime.setTime(endTime.getTime()); 
}
console.log("SQL VALUES:"+SQL_VALUES);

const resultado = client.query(SQL_VALUES, (err, result) => {
  if (err) {
     // throw err ;
      console.log(' ERROR QUERY  = '+SQL_VALUES ) ;
      console.log(err ) ;
    }
  res.status(200).send(JSON.stringify(result));
  console.log('Success Insert = '+JSON.stringify(result) ) ;
 // client.end()
})


})
  
// PROFESSIONAL COPY CALENDAR DAY
app.route('/professional_copy_calendar_day')
.post(function (req, res) {
 
    console.log('professional_copy_calendar_day :', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})

client.connect()
// ****** Run query to bring appointment
//const sql  = "SELECT * FROM center WHERE id IN  (SELECT center_id FROM center_professional where professional_id='"+req.body.professional_id+"' ) " ;
const sql = "INSERT INTO appointment (  date ,start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, professional_id, app_available, app_status,app_blocked) SELECT   DATE '"+req.body.destination+"' as date,  start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, professional_id, app_available, app_status,app_blocked FROM appointment where professional_id='"+req.body.professional_id+"' and date='"+req.body.origin+"'  ";

console.log('professional_copy_calendar_day: SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('professional_copy_calendar_day ERR:'+err ) ;
    }

  console.log('professional_copy_calendar_day : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})


//***************************************
//******** PATIENT API  *****************
//***************************************

//PATIENT GET APPOINTMENTS DAY
app.route('/patient_get_appointments_day')
.post(function (req, res) {
 
    console.log('patient_get_appointments_day : INPUT : ', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
})
client.connect()
// ****** Run query to bring appointment
//const sql ="SELECT * FROM ( SELECT address as center_address, name as center_name, app_id,date, start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, blocked, professional_id   FROM   (SELECT  id as app_id, date , start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, blocked, professional_id   FROM appointment WHERE professional_id='"+req.body.professional_id+"' and Date >= '"+req.body.date+"' )   J LEFT JOIN center ON center.id=j.center_id  )K LEFT JOIN specialty ON specialty.id=K.specialty   " ;

let sql_and_specialty =" "; 
let sql_and_comuna =" "; 
let sql_and_insurance =" "; 


if (req.body.specialty != null && req.body.specialty != ""  )
{ sql_and_specialty = " AND specialty = '"+ req.body.specialty+"'"  }

if (req.body.comuna != null && req.body.comuna != ""  )
{ sql_and_comuna  = " WHERE   comuna = '"+ req.body.comuna+"'"  }

if (req.body.insurance != null  && req.body.insurance != "")
{ sql_and_insurance = " AND insurance = '"+ req.body.insurance+"'"   }

//const sql ="SELECT * FROM appointment where Date = '"+req.body.date+"' AND "+ sqland +"  ORDER BY date DESC " ;
const sql = `SELECT * FROM 
( SELECT  patient_name, app_status, name as specialty_name, center_address, center_name, app_id, date, start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, app_blocked, professional_id, app_available   FROM 
( SELECT app_status, patient_name, patient_email, patient_phone1, patient_phone2, patient_insurance ,  patient_doc_id , address as center_address, name as center_name, app_id,date, start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, app_blocked, professional_id ,app_available  FROM  
 (SELECT app_status, patient_name, patient_email, patient_phone1, patient_phone2, patient_insurance ,  patient_doc_id ,id as app_id, date , start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, app_blocked, professional_id , app_available  
FROM appointment WHERE Date >= '`+req.body.date+`' 
	AND available_public_search = '1'  
	AND app_blocked = '0' 
	AND app_available = 'true'  `+sql_and_specialty+`  
ORDER BY start_time ASC ) 
 J LEFT JOIN center ON center.id=j.center_id  `+sql_and_comuna +`  )
 K LEFT JOIN specialty ON specialty.id=K.specialty ) 
 L LEFT JOIN professional ON professional.id = L.professional_id   ORDER BY  date, start_time  ;` ; 


console.log('patient_get_appointments_day SQL:'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('patient_get_appointments_day ERROR QUERY = '+sql ) ;
    }
  console.log('patient_get_appointments_day RESPONSE  = '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})
})

 
 /*
  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 */
 
 
 
 

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

const query_update = "UPDATE appointment2 SET reserve_patient_name = '"+req.body.patient_name+"' ,  reserve_patient_doc_id = '"+req.body.patient_doc_id+"' , reserve_patient_email = '"+req.body.patient_email+"' , reserve_patient_phone ='"+req.body.patient_phone+"' , reserve_patient_insurance='"+req.body.patient_insurance+"' , reserve_available='FALSE'    WHERE id = '"+req.body.appointment_id+"' RETURNING * " ;

console.log(query_update);
const resultado = client.query(query_update, (err, result) => {

     console.log('RESULTADO '+JSON.stringify(resultado))
     var json_response_ok = { 
			    result_status : 'inserted', 
			    result_code: '200',
			    	  };
  
    res.status(200).send(JSON.stringify(json_response_ok));
    console.log("JSON RESPONSE BODY : "+JSON.stringify(json_response_ok));
    console.log ("ERROR LOG : "+err);

  client.end()

})

})
 

//********************************************* 
// PUBLIC POST Login
//********************************************* 
app.route('/loginAssistant')
.post(function (req, res) {
 
    console.log('POST LOGIN - JSON REQUEST : ', req.body );
 
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
const sql  = "SELECT * FROM users WHERE email='"+req.body.form_email+"'  AND password='"+req.body.form_pass+"'" ;
console.log('SQL  = '+sql ) ;
var json_response = { result_status : 'noset', result_code: 'noset', token: 'noset', user_id: 'noset', };
const resultado = client.query(sql, (err, result) => {

  if (err) {
      throw error ;
      console.log(' ERROR QUERY  = '+sql ) ;
    }
    
  if (result.rowCount == 1 )
  {
  console.log ("LOGIN MATCH!!");
  json_response = { login_result : 'Login Success', result_code: '200', token: '11234', user_id: +result.user_id  };
  }
  else
  {
  console.log ("LOGIN NO MATCH!!");
  json_response = { login_result : 'Login Failed', result_code: '700', token: '11234',  user_id: '0' };
  }
  
  res.status(200).send(JSON.stringify(json_response));
  console.log('JSON RESPONSE  = '+JSON.stringify(json_response) ) ;
  client.end()
})


})
 
 //********************************************* 
// PUBLIC POST ASSISTANT GET AGENDA
//********************************************* 
app.route('/assistant_get_agendas')
.post(function (req, res) {
 
    console.log('Assistant_get_agendas : ', req.body );
 
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
const sql  = "SELECT * FROM agendas WHERE assistant_id='"+req.body.assistant_id+"' " ;
console.log('SQL GET AGENDA = '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log(' ERROR QUERY = '+sql ) ;
    }

  console.log('JSON RESPONSE GET AGENDA  = '+result ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})


//********************************************* 
// PUBLIC POST PROFESSIONAL del AGENDA
//********************************************* 
/*
app.route('/professional_delete_agenda')
.post(function (req, res) {
 
    console.log('professional_delete_agendas :', req.body );
 
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
const sql  = "DELETE FROM agendas WHERE id='"+req.body.agenda_id+"'  " ;
console.log('professional_delete_agendas : SQL GET AGENDA = '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('professional_delete_agendas ERR:'+err ) ;
    }

  console.log('professional_delete_agendas : JSON RESPONSE DELTE AGENDA  = '+result ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})

*/
//********************************************* 
// PUBLIC POST professional_create_agenda
//********************************************* 
/*
app.route('/professional_create_agenda')
.post(function (req, res) {

    console.log('professional_create_agenda INPUT:', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb01',
  password: 'paranoid',
  port: 5432,
})

client.connect() ;
// GET PROFESSIONAL DATA

var sql  = null;
var json_response = { result_status : 1 };
//var res = null; 	
// CHECK INPUT PARAMETERS TO IDENTIFY IF  REQUEST IS TO CREATE CENTER
// CREATE DIRECTLY AGENDA 

console.log("CREACION DIRECTA AGENDA");
sql  = "INSERT INTO agendas ( professional_id ,   center_id, name ) VALUES (  '"+req.body.professional_id+"', '"+req.body.center_id+"' , '"+req.body.agenda_name+"' ) RETURNING id " ;

	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('professional_create_agenda ERROR QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	  json_response = { result_status : 0 , id: result.rows[0].id  };
	  res.status(200).send(JSON.stringify(json_response));
	  console.log('professional_create_agenda  SUCCESS INSERT :'+JSON.stringify(json_response) ) ; 
	   }
	   
	  client.end()
	})

})
 
*/

//********************************************* 
// PROFESSIONAL GET ASSISTANTS
//********************************************* 
/*
app.route('/professional_get_assistants')
.post(function (req, res) {
 
    console.log('professional_get_assistants:', req.body );
 
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
const sql  = "SELECT * FROM assistants WHERE id IN  (SELECT assistant_id FROM assistant_professional where professional_id='"+req.body.professional_id+"' ) " ;
console.log('professional_get_assistants: SQL GET AGENDA = '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('professional_get_assistants ERR:'+err ) ;
    }

  console.log('professional_get_assistants : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})

*/
//********************************************* 
// PUBLIC POST ASSISTANT GET AGENDA
//********************************************* 
app.route('/assistant_get_agenda_by_id')
.post(function (req, res) {
 
    console.log('Assistant_get_agenda by id : ', req.body );
 
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
const sql  = "SELECT * FROM agendas WHERE id='"+req.body.agenda_id+"' " ;
console.log('SQL GET AGENDA = '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log(' ERROR QUERY = '+sql ) ;
    }

  console.log('JSON RESPONSE GET AGENDA  = '+result ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})

//********************************************* 
// PUBLIC POST GET APPOINTMENT AVAILABLE LIST
//********************************************* 
app.route('/bakend_get_appointment_available_list')
.post(function (req, res) {
 
    console.log('INPUT POST : GET AGENDA APPOINTMENTS : JSON REQUEST : ', req.body );
 
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
const sql  = "SELECT * FROM appointment2 WHERE  reserve_available='TRUE' " ;
console.log('SQL GET AGENDA = '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log(' ERROR QUERY = '+sql ) ;
    }
      
    

  console.log('JSON RESPONSE GET AGENDA  APPOINTMENTS  = '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})

//********************************************* 
// PUBLIC POST GET APPOINTMENT AVAILABLE LIST of AGENDA
//********************************************* 
/*
app.route('/get_appointments_from_agenda')
.post(function (req, res) {
 
    console.log('INPUT POST : GET AGENDA APPOINTMENTS : JSON REQUEST : ', req.body );
 
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
const sql  = "SELECT * FROM appointments where agenda_id='"+req.body.agenda_id+"' " ;
console.log('SQL GET AGENDA = '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log(' ERROR QUERY = '+sql ) ;
    }
      
    

  console.log('JSON RESPONSE GET AGENDA  APPOINTMENTS  = '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})
*/

/*
//********************************************* 
// PUBLIC POST GET APPOINTMENT AVAILABLE LIST of AGENDA DAY
//********************************************* 
app.route('/get_appointments_from_agenda_day')
.post(function (req, res) {
 
    console.log('INPUT POST : GET AGENDA APPOINTMENTS : JSON REQUEST : ', req.body );
 
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
const sql  = "SELECT * FROM appointments where agenda_id='"+req.body.agenda_id+"' AND date='"+req.body.date+"' ORDER BY start_time " ;
console.log('SQL GET AGENDA = '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log(' ERROR QUERY = '+sql ) ;
    }
      
    

  console.log('JSON RESPONSE GET AGENDA  APPOINTMENTS  = '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})

*/
//********************************************* 
// PUBLIC POST GET APPOINTMENT AVAILABLE LIST of AGENDA DAY
//********************************************* 
/*
app.route('/professional_get_appointments_of_day')
.post(function (req, res) {
 
    console.log('professional_get_appointments_of_day  : INPUT : ', req.body );
 
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
//"SELECT  j.id as agenda_id ,  j.name as agenda_name, centers.address as center_address, centers.name as center_name   FROM (SELECT * FROM public.agendas where professional_id='"+req.body.professional_id+"') J  LEFT JOIN  centers ON j.center_id = centers.id " ;
//const sql  = "SELECT * FROM appointments where date='"+req.body.date+"'  AND agenda_id  IN (SELECT id FROM agendas where professional_id='"+req.body.professional_id+"') " ;
const sql =" SELECT * FROM ( SELECT *  FROM  (SELECT id as  app_id, date as app_date,  start_time as app_start_time, specialty as app_specialty, is_public as app_is_public,   agenda_id as app_agenda_id, reserve_patient_name as app_reserve_patient_name,  reserve_patient_doc_id as app_reserve_patient_doc_id,  reserve_patient_age as app_reserve_patient_age ,   reserve_available as app_reserve_available ,    reserve_patient_email as app_reserve_patient_email ,   reserve_patient_phone as app_reserve_patient_phone , reserve_patient_insurance as app_reserve_patient_insurance ,  end_time as app_end_time ,  duration as app_duration, blocked as app_blocked , reserve_status as app_reserve_status  FROM appointments WHERE agenda_id IN (SELECT id FROM agendas WHERE professional_id='"+req.body.professional_id+"' ) AND date ='"+req.body.date+"' ) J  LEFT JOIN agendas ON J.app_agenda_id = agendas.id ) K  LEFT JOIN centers ON  K.center_id = centers.id " ;


console.log('professional_get_appointments_of_day SQL:'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log(' ERROR QUERY = '+sql ) ;
    }
      
    

  console.log('JSON RESPONSE GET AGENDA  APPOINTMENTS  = '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})


})


*/





//********************************************* 
// Get APpointment details
//********************************************* 
app.route('/get_appointment_details')
.post(function (req, res) {
 
    console.log('Get Appointmetn Details  REQUEST : ', req.body );
 
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
const sql  = "SELECT * FROM appointment2 where id='"+req.body.appointment_id+"' " ;
console.log('SQL GET Apointment : '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log(' ERROR QUERY = '+sql ) ;
    }

  console.log('GET Appointment Details   = '+JSON.stringify(result.rows) ) ;
  //res.status(200).send(JSON.stringify(result) );
  res.status(200).json(result.rows)
  
  client.end()
})

})

//********************************************* 
// Get Centers professional Day 
//********************************************* 
app.route('/get_centers_professional_day')
.post(function (req, res) {
  console.log('get_centers_professional_day REQUEST : ', req.body );
 
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
const sql  = "SELECT * FROM appointments where agenda_id='"+req.body.agenda_id+"' " ;
console.log('SQL get_centers_professional_day : '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log(' ERROR QUERY = '+sql ) ;
      console.log(' ERR = '+err ) ;
    }

  console.log('GET get_centers_professional_day '+JSON.stringify(result) ) ;
  //res.status(200).send(JSON.stringify(result) );
  
  //FOREACH result rows to build a new json summary of centers
  var json_response = [];
  var temp_center_id = null ; 
  result.rows.forEach(function (app) {
  
	  console.log("center id ="+app.center_id);
	  console.log("center name ="+app.center_name);
	  
	  if (app.center_id != temp_center_id)
	  {
	  //var obj={ center_name : app.center_name } ;
	  json_response.push( { center : app.center, date : app.date , time : app.time, specialty : app.specialty, address :  app.address  } ) ;
   	//	json_response.push( app.center_id) ;
	  }
	  else
	  {
	  temp_center_id = app.center_id ;
	  }


	  
	})
  // END FOREACH

  console.log('Resultado nuevo JSON :'+JSON.stringify(json_response) ) ;
  
    res.status(200).json(json_response)
  
  
  
  client.end()
})

})


//********************************************* 
// PUBLIC POST add_hour_agenda
//********************************************* 
app.route('/add_hour_agenda')
.post(function (req, res) {
 
    console.log('add_hour_agenda - JSON REQUEST : ', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb01',
  password: 'paranoid',
  port: 5432,
})

let agenda = null;
let agenda_name = 'No Name';
var agenda_result = null;
client.connect() ;

// CICLE TO CREATE APPOINTMENTS
let startTime=  new Date(req.body.form_date);
startTime.setHours( Math.trunc( req.body.form_start_time/60   )  );
startTime.setMinutes(  req.body.form_start_time % 60  );
console.log("StartTime:"+startTime);

let endTime =  new Date(req.body.form_date);
endTime.setHours( Math.trunc( req.body.form_end_time/60   )  );
endTime.setMinutes(  req.body.form_end_time % 60  );
console.log("endTime:"+endTime);

console.log("BLOQUE start ---->:"+startTime);
console.log("BLOQUE end   ---->:"+endTime);

let time_block = req.body.form_end_time - req.body.form_start_time ;
let cycles = Math.trunc( time_block / req.body.form_appointment_duration  )  ;
console.log("TIME BLOCK :"+req.body.form_appointment_duration );
console.log("cyces     :"+cycles);

var i;
var SQL_VALUES="INSERT INTO appointments  (  date ,start_time , end_time ,duration , specialty , is_public , agenda_id, reserve_available ) VALUES ";

for (  i = 0 ; i < cycles ; i++ ) 
{	console.log("cycle---->:"+i);
	
	endTime.setTime(startTime.getTime() + ( 1000 * 60 * req.body.form_appointment_duration  ));
	if (i != 0)
	{
		SQL_VALUES +="  , " ;
	}
	//Build SQL 
	//SQL_VALUES +=" ( '"+req.body.form_date+"'  , '"+startTime.getTime+"'  , '"+endTime.getTime+"'  , '"+req.body.form_appointment_duration+"'  , '"+req.body.form_specialty+"' ,  '"+req.body.form_public+"' , '"+req.body.form_agenda_id+"' , 1 ) " ;
	SQL_VALUES +=" ( '"+req.body.form_date+"'  , '"+startTime.getHours()+":"+startTime.getMinutes()+":00' , '"+endTime.getHours()+":"+endTime.getMinutes()+":00' , '"+req.body.form_appointment_duration+"'  , '"+req.body.form_specialty+"'  ,  '"+req.body.form_public+"' , '"+req.body.form_agenda_id+"' , 'true'  )  " ;
	console.log("Hora start ---->:"+startTime);
	console.log("Hora fin   ---->:"+endTime);
	
	startTime.setTime(endTime.getTime()); 
}
console.log("SQL VALUES:"+SQL_VALUES);

const resultado = client.query(SQL_VALUES, (err, result) => {
  if (err) {
     // throw err ;
      console.log(' ERROR QUERY  = '+SQL_VALUES ) ;
      console.log(err ) ;
    }
  res.status(200).send(JSON.stringify(result));
  console.log('Success Insert = '+JSON.stringify(result) ) ;
 // client.end()
})


})
 
//********************************************* 
// PUBLIC POST create_center
//********************************************* 
app.route('/professional_create_center')
.post(function (req, res) {
    console.log('professional_create_center CENTER CREATION INPUT:', req.body );
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb01',
  password: 'paranoid',
  port: 5432,
})
client.connect() ;
// GET PROFESSIONAL DATA
var sql  = null;
var json_response = { result_status : 1 };
//var res = null; 	
// CHECK INPUT PARAMETERS TO IDENTIFY IF  REQUEST IS TO CREATE CENTER
// CREATE DIRECTLY AGENDA 
//sql  = "INSERT INTO centers ( name ,  address , phone1, phone2 ) VALUES (  '"+req.body.center_name+"', '"+req.body.center_address+"' , '"+req.body.center_phone+"', '"+req.body.center_phone2+"' ) RETURNING id " ;
sql = " WITH ids AS (  INSERT INTO centers ( name ,  address , phone1, phone2 ) VALUES (  '"+req.body.center_name+"' , '"+req.body.center_address+"', '"+req.body.center_phone+"' ,'undefined' ) RETURNING id as center_id ) INSERT INTO center_professional (professional_id, center_id) VALUES ('"+req.body.professional_id+"', (SELECT center_id from ids) ) RETURNING * ;  ";

console.log('create_center SQL:'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('professional_create_center ERROR  CENTER CREATION QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	 // json_response = { result_status : 0  , center_id : result.data.center_id  };
	  res.status(200).send(JSON.stringify(result));
	  console.log('professional_create_center  SUCCESS CENTER INSERT ' ) ; 
    console.log('professional_create_center  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})

})


//********************************************* 
// PUBLIC POST professional_create_agenda
//********************************************* 
/*
app.route('/professional_create_agenda')
.post(function (req, res) {

    console.log('professional_create_agenda INPUT:', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb01',
  password: 'paranoid',
  port: 5432,
})

client.connect() ;
// GET PROFESSIONAL DATA

var sql  = null;
var json_response = { result_status : 1 };
//var res = null; 	
// CHECK INPUT PARAMETERS TO IDENTIFY IF  REQUEST IS TO CREATE CENTER
// CREATE DIRECTLY AGENDA 

console.log("CREACION DIRECTA AGENDA");
sql  = "INSERT INTO agendas ( professional_id ,   center_id, name ) VALUES (  '"+req.body.professional_id+"', '"+req.body.center_id+"' , '"+req.body.agenda_name+"' ) RETURNING id " ;

	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('professional_create_agenda ERROR QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	  json_response = { result_status : 0 , id: result.rows[0].id  };
	  res.status(200).send(JSON.stringify(json_response));
	  console.log('professional_create_agenda  SUCCESS INSERT :'+JSON.stringify(json_response) ) ; 
	   }
	   
	  client.end()
	})

})
 
*/
//********************************************* 
// PUBLIC POST create_center
//********************************************* 
app.route('/create_center')
.post(function (req, res) {
	
    console.log('create_center CENTER CREATION INPUT:', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb01',
  password: 'paranoid',
  port: 5432,
})

client.connect() ;
// GET PROFESSIONAL DATA

var sql  = null;
var json_response = { result_status : 1 };
//var res = null; 	
// CHECK INPUT PARAMETERS TO IDENTIFY IF  REQUEST IS TO CREATE CENTER
// CREATE DIRECTLY AGENDA 

sql  = "INSERT INTO centers ( name ,  address , phone1, phone2 ) VALUES (  '"+req.body.center_name+"', '"+req.body.center_address+"' , '"+req.body.center_phone+"', '"+req.body.center_phone2+"' ) RETURNING id " ;
console.log('create_center SQL:'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('professional_create_agenda ERROR  CENTER CREATION QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	  json_response = { result_status : 0 , id: result.rows[0].id  };
	  res.status(200).send(JSON.stringify(json_response));
	  console.log('create_center  SUCCESS CENTER INSERT :'+JSON.stringify(json_response) ) ; 
	   }
	   
	  client.end()
	})

})
 

//********************************************* 
// PUBLIC POST get Professioal Data by  agenda id
//********************************************* 
app.route('/get_professional_from_agenda')
.post(function (req, res) {
	
    console.log('get_professional_from_agenda  INPUT:', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb01',
  password: 'paranoid',
  port: 5432,
})

client.connect() ;

const sql = "select * from professionals where id IN  (SELECT professional_id FROM agendas * where id='"+req.body.agenda_id+"' )";

console.log('get_professional_data_by_agenda_id  SQL:'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('get_professional_data_by_agenda_id  ERROR  CENTER CREATION QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	  res.status(200).send(JSON.stringify(result));
	  console.log('get_professional_data_by_agenda_id  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})

})
 

//********************************************* 
// PUBLIC POST get Professioal GET CALENDAR
//********************************************* 
app.route('/get_calendar')
.post(function (req, res) {
	console.log('get_calendar INPUT:', req.body );
 
 const json_response = { 
"version": "Chilean Calendar v1.0",
"years" : [ 
        {"year_number" : "2021", months : [
					{"name" : "abril", "month_number" : "4" , days : [ 
					
						    {day_number: "", " " : " " } ,
						    {day_number: "", " " : " " } ,
							 {day_number: "1", "special_comment" : "Holyday New Year" } ,
							 {day_number: "2", "special_comment" : "" } ,
							 {day_number: "3", "special_comment" : "" } ,
							 {day_number: "4", "special_comment" : "" } ,
							 {day_number: "5", "special_comment" : "" } ,
							 {day_number: "6", "special_comment" : "" } ,
							 {day_number: "7", "special_comment" : "" } ,
							 {day_number: "8", "special_comment" : "" } ,
							 {day_number: "9", "special_comment" : "" } ,
							{day_number: "10", "special_comment" : "" } ,
							{day_number: "11", "special_comment" : "" } ,
							{day_number: "12", "special_comment" : "" } ,
							{day_number: "13", "special_comment" : "" } ,
							{day_number: "14", "special_comment" : "" } ,
							{day_number: "15", "special_comment" : "" } ,
							{day_number: "16", "special_comment" : "" } ,
							{day_number: "17", "special_comment" : "" } ,
							{day_number: "18", "special_comment" : "" } ,
							{day_number: "19", "special_comment" : "" } ,



                                                                ] 
					}, 
					{"name" : "Junio", "month_number" : "6" , days : [ 
							{day_number: "1", "special_comment" : "Holyday New Year" } ,
							{day_number: "2", "special_comment" : "Holyday New Year" } ,
							{day_number: "3", "special_comment" : "Holyday New Year" } 
                                                                 ] 
					}, 
					{"name" : "Julio", "month_number" : "7" , days : [ 
							{day_number: "1", "special_comment" : "Holyday New Year" } ,
							{day_number: "2", "special_comment" : "Holyday New Year" } ,
							{day_number: "3", "special_comment" : "Holyday New Year" } 
                                                                 ] 
					} 
                                           ]        
       
		},  
		
		{"year_number" : "2022", months : [  
					{"name" : "Enero", "month_number" : "1" , days : [ 
						    {day_number: " ", "special_comment" : "Holyday New Year" } ,
						    {day_number: " ", "special_comment" : "Holyday New Year" } ,
							 {day_number: "1", "special_comment" : "Holyday New Year" } ,
							 {day_number: "2", "special_comment" : "" } ,
							 {day_number: "3", "special_comment" : "" } ,
							 {day_number: "4", "special_comment" : "" } ,
							 {day_number: "5", "special_comment" : "" } ,
							 {day_number: "6", "special_comment" : "" } ,
							 {day_number: "7", "special_comment" : "" } ,
							 {day_number: "8", "special_comment" : "" } ,
							 {day_number: "9", "special_comment" : "" } ,
							 
                                                                ] 
					}, 
					{"name" : "Febrero", "month_number" : "2" , days : [ 
							{day_number: "1", "special_comment" : "Holyday New Year" } ,
							{day_number: "2", "special_comment" : "Holyday New Year" } ,
							{day_number: "3", "special_comment" : "Holyday New Year" } 
                                                                 ] 
					}, 
					{"name" : "Marzo", "month_number" : "3" , days : [ 
							{day_number: "1", "special_comment" : "Holyday New Year" } ,
							{day_number: "2", "special_comment" : "Holyday New Year" } ,
							{day_number: "3", "special_comment" : "Holyday New Year" } 
                                                                 ] 
					} 
                                           ]        
       
		},  
		
		]
  
} ;
	res.status(200).send(json_response);
})


/*
app.route('/get_calendar')
.post(function (req, res) {
	
    console.log('get_calendar INPUT:', req.body );
 
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb01',
  password: 'paranoid',
  port: 5432,
})

client.connect() ;

const sql = "SELECT * FROM public.calendar_cl ORDER BY date  ";

console.log('get_calendar  SQL:'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('get_calendar  ERROR  CENTER CREATION QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	  res.status(200).send(JSON.stringify(result));
	  console.log('get_calendar  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})

})


*/

//********************************************* 
// PUBLIC POST get AGENDA
//********************************************* 
app.route('/get_agenda')
.post(function (req, res) {
    console.log('get_agenda INPUT:', req.body );
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb01',
  password: 'paranoid',
  port: 5432,
})

client.connect() ;

const sql = "SELECT * FROM public.agendas where id='"+req.body.agenda_id+"' ";

console.log('get_calendar  SQL:'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('get_agendas  ERROR  CENTER CREATION QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	  res.status(200).send(JSON.stringify(result));
	  console.log('get_agendas  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})

})
 

//********************************************* 
// PUBLIC POST get Appointments
//********************************************* 
app.route('/get_appointment')
.post(function (req, res) {
    console.log('get_appointment INPUT:', req.body );
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb01',
  password: 'paranoid',
  port: 5432,
})

client.connect() ;

const sql = "SELECT * FROM public.appointments where id='"+req.body.appointment_id+"' ";

console.log('get_appointments  SQL:'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('get_appointments  ERROR  CENTER CREATION QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	  res.status(200).send(JSON.stringify(result));
	  console.log('get_appointments  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})

})
 

//********************************************* 
// PUBLIC POST SAVE APPOINTMENT
//********************************************* 
/*
app.route('/save_appointment')
.post(function (req, res) {
    console.log('save_appointment INPUT : ', req.body );
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
const query_update = "UPDATE appointments SET reserve_patient_name = '"+req.body.patient_name+"' ,  reserve_patient_doc_id = '"+req.body.patient_doc_id+"' , reserve_patient_email = '"+req.body.patient_email+"' , reserve_patient_phone ='"+req.body.patient_phone+"' , reserve_patient_insurance='"+req.body.patient_insurance+"' , reserve_available='FALSE'    WHERE id = '"+req.body.appointment_id+"' RETURNING * " ;

console.log(query_update);
const resultado = client.query(query_update, (err, result) => {

     console.log('RESULTADO '+JSON.stringify(resultado))
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
*/
/*
//********************************************* 
// PUBLIC POST CANCEL APPOINTMENT
//********************************************* 
app.route('/cancel_appointment')
.post(function (req, res) {
    console.log('save_appointment INPUT : ', req.body );
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
const query_update = "UPDATE appointments SET reserve_status = '1'  WHERE id = '"+req.body.appointment_id+"' RETURNING * " ;

console.log(query_update);
const resultado = client.query(query_update, (err, result) => {

     console.log('RESULTADO '+JSON.stringify(resultado))
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

*/


//********************************************* 
// PUBLIC POST CANCEL AND BLOCK APPOINTMENT
//********************************************* 
app.route('/cancel_block_appointment')
.post(function (req, res) {
    console.log('save_appointment INPUT : ', req.body );
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
const query_update = "UPDATE appointments SET reserve_status = '1' , blocked = 'true' WHERE id = '"+req.body.appointment_id+"' RETURNING * " ;

console.log(query_update);
const resultado = client.query(query_update, (err, result) => {

     console.log('RESULTADO '+JSON.stringify(resultado))
     var json_response_ok = { 
			    result_status : 'inserted', 
			    result_code: '200',
			    	  };
  
    res.status(200).send(JSON.stringify(json_response_ok));
    console.log("JSON RESPONSE BODY : "+JSON.stringify(json_response_ok));
    console.log ("ERROR LOG : "+err);

  client.end()

})




 
 
 
 
})



//********************************************* 
// patient search appointment
//********************************************* 
app.route('/patient_search_appointment')
.post(function (req, res) {
    console.log('patient_search_appointment INPUT : ', req.body );
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb01',
  password: 'paranoid',
  port: 5432,
})

// first search specialty code 
//onst query_update = "UPDATE appointments SET reserve_status = '1' , blocked = 'true' WHERE id = '"+req.body.appointment_id+"' RETURNING * " ;
const query_search ="Select *, name as center_name,  address as app_address FROM (SELECT app_date, center_id,  name as app_professional_name,  app_agenda_name , app_professional_id , app_id,   app_start_time , app_specialty, app_is_public,app_agenda_id,  app_reserve_patient_name, app_reserve_patient_doc_id, app_reserve_patient_age ,   app_reserve_available  ,    app_reserve_patient_email ,    app_reserve_patient_phone ,  app_reserve_patient_insurance , app_end_time ,  app_duration, app_blocked ,  app_reserve_status FROM (SELECT  app_date, center_id, name as app_agenda_name , professional_id as app_professional_id , app_id,   app_start_time , app_specialty, app_is_public,app_agenda_id,  app_reserve_patient_name, app_reserve_patient_doc_id, app_reserve_patient_age ,   app_reserve_available  ,    app_reserve_patient_email ,    app_reserve_patient_phone ,  app_reserve_patient_insurance , app_end_time ,  app_duration, app_blocked ,  app_reserve_status  FROM  (SELECT   id as  app_id, date as app_date,  start_time as app_start_time, specialty as app_specialty, is_public as app_is_public,   agenda_id as app_agenda_id, reserve_patient_name as app_reserve_patient_name,  reserve_patient_doc_id as app_reserve_patient_doc_id,  reserve_patient_age as app_reserve_patient_age ,   reserve_available as app_reserve_available ,    reserve_patient_email as app_reserve_patient_email ,   reserve_patient_phone as app_reserve_patient_phone , reserve_patient_insurance as app_reserve_patient_insurance ,  end_time as app_end_time ,  duration as app_duration, blocked as app_blocked , reserve_status as app_reserve_status  FROM appointments WHERE date > '"+req.body.form_required_day+"' AND specialty = '"+req.body.form_specialty+"'  AND  is_public='true' AND reserve_available='true' )K  LEFT JOIN agendas ON K.app_agenda_id = agendas.id )P LEFT JOIN  professionals ON P.app_professional_id = professionals.id) C LEFT JOIN centers ON C.center_id = centers.id   ORDER BY date, start_time ASC ";

console.log("patient_search_appointment SQL:"+query_search);
client.connect()

const resultado = client.query(query_search, (err, result) => {
    console.log("JSON RESPONSE BODY : "+JSON.stringify(result));
    res.status(200).send(JSON.stringify(result));
  client.end()
})

 
})


//********************************************* 
// patient search appointment
//********************************************* 
app.route('/patient_get_appointment')
.post(function (req, res) {
    console.log('patient_get_appointment INPUT : ', req.body );
// ****** Connect to postgre
const { Pool, Client } = require('pg')
const client = new Client({
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb01',
  password: 'paranoid',
  port: 5432,
})

//let query_search = "SELECT * FROM ( Select *, name as agenda_name FROM ( Select *  FROM appointments where id = '"+req.body.appointment_id+ "' ) J  LEFT JOIN agendas ON J.agenda_id=agendas.id )K  LEFT JOIN centers ON K.center_id=centers.id  " ;
let query_search = " SELECT * FROM ( SELECT * FROM ( Select *, name as agenda_name FROM ( Select *  FROM appointments where id = '"+req.body.appointment_id+"' ) J  LEFT JOIN agendas ON J.agenda_id=agendas.id )K  LEFT JOIN centers ON K.center_id=centers.id ) P LEFT JOIN professionals ON P.professional_id=professionals.id   " ;

console.log("patient_get_appointment SQL:"+query_search);
client.connect()

const resultado = client.query(query_search, (err, result) => {
    console.log("patient_get_appointment RESPONSE:"+JSON.stringify(result));
    res.status(200).send(JSON.stringify(result));
  client.end()
})

 
})








app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);




