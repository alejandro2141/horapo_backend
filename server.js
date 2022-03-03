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
// ********* PUBLIC API ******************
// **************************************

// RECOVER APPOINTMENTS
app.route('/recover_appointments')
.post(function (req, res) {
    console.log('recover_appointments INPUT:', req.body );
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
// GET RECOVER APPOINTMENTS 
var sql  = null;
sql = "insert into patient_recover_appointments ( email ) values ('"+req.body.email+"') RETURNING * ;  ";

console.log('recover_appointments SQL :'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('recover_appointments ERROR CENTER CREATION QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	  res.status(200).send(JSON.stringify(result));
	  console.log('recover_appointments  SUCCESS INSERT ' ) ; 
    console.log('recover_appointments  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})

})


// REGISTER PROFESIONAL
app.route('/public_register_professional')
.post(function (req, res) {
    console.log('public_register_professional INPUT:', req.body );
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
sql = "INSERT INTO professional_register ( name ,  last_name1 , last_name2 , email , doc_id , passwd , personal_address , personal_phone , specialty  ) VALUES (  '"+req.body.name+"' , '"+req.body.last_name1+"', '"+req.body.last_name2+"' ,'"+req.body.email+"' ,'"+req.body.doc_id+"'  ,'"+req.body.passwd+"' ,'"+req.body.personal_address+"' ,'"+req.body.personal_phone+"' ,'"+req.body.specialty+"'  ) RETURNING *  ";

console.log('public_register_professional SQL :'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('public_register_professional ERROR  CENTER CREATION QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	 // json_response = { result_status : 0  , center_id : result.data.center_id  };
	  res.status(200).send(JSON.stringify(result));
	  console.log('public_register_professional  SUCCESS INSERT ' ) ; 
    console.log('public_register_professional  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})

})


// SAVE APPOINTMENT New Version
app.route('/public_take_appointment')
.post(function (req, res) {
    console.log('public_take_appointment INPUT : ', req.body );
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
/*
//const query_update = "UPDATE appointment SET reserve_patient_name = '"+req.body.patient_name+"' ,  reserve_patient_doc_id = '"+req.body.patient_doc_id+"' , reserve_patient_email = '"+req.body.patient_email+"' , reserve_patient_phone ='"+req.body.patient_phone+"' , reserve_patient_insurance='"+req.body.patient_insurance+"' , reserve_available='FALSE'    WHERE id = '"+req.body.appointment_id+"' RETURNING * " ;
let query_reserve =  "INSERT INTO appointment (date, start_time, duration, specialty, specialty1, specialty2,specialty3,specialty4, center_id, professional_id , app_available , app_public , available_public_search, location1,location2,location3 , location4 , location6, location7, location8, app_type_home , app_type_center, app_type_remote) " ;
sql = sql + " SELECT '"+req.body.destination+"' , start_time, duration, specialty, specialty1, specialty2,specialty3,specialty4,  center_id, professional_id , true , app_public , false ,  location1, location2,location3 , location4 , location6, location7, location8,  app_type_home ,  app_type_center,  app_type_remote";
sql = sql + " FROM appointment  WHERE professional_id = '"+req.body.p_id+"'  AND date='"+req.body.origin+"'  " ; 

 INSERT INTO appointment ( 
	 date , start_time,  duration,  center_id, confirmation_status, professional_id, patient_doc_id, patient_name,  
	 patient_email, app_available, app_status, app_blocked, app_public,  location1, location2, location3, location4, location5, location6, 
	 app_type_home, app_type_center, patient_notification_email_reserved , specialty_reserved , patient_address 
 )
 VALUES ( '2022-01-01' , '01:00:00' , '15' ,  '12' , '0' , '2' , '13909371-2' , 'JUan Alejandro MOrales' , 'alejandro2141@gmail.com' ,
		 '1' , '1' , '0' , '1', '1017', '1017','1017','1017','1017','1017',
		'true', 'false' , '1' , '153', 'avenida Vivaceta 1543, Departamento 123, Independencia, Santiago Chile'
		)
*/

let query_reserve = "INSERT INTO appointment (  date , start_time,  duration,  center_id, confirmation_status, professional_id, patient_doc_id, patient_name,    patient_email, patient_phone1,  patient_age,  app_available, app_status, app_blocked, app_public,  location1, location2, location3, location4, location5, location6,   app_type_home, app_type_center, patient_notification_email_reserved , specialty_reserved , patient_address )  "  ; 
query_reserve  += " VALUES ( '"+req.body.appointment_date+"' , '"+req.body.appointment_start_time+"' , '"+req.body.appointment_duration+"' ,  "+req.body.appointment_center_id+" , '0' , '"+req.body.appointment_professional_id+"' , '"+req.body.patient_doc_id+"' , '"+req.body.patient_name+"' , '"+req.body.patient_email+"' , '"+req.body.patient_phone+"' ,  '"+req.body.patient_age+"' ,'false' , '1' , '0' , '1', "+req.body.appointment_location1+" , "+req.body.appointment_location2+" ,"+req.body.appointment_location3+" ,"+req.body.appointment_location4+" ,"+req.body.appointment_location5+" ,"+req.body.appointment_location6+" , '"+req.body.appointment_type_home+"' , '"+req.body.appointment_type_center+"' , '1' , '"+req.body.specialty_reserved+"' , '"+req.body.patient_address+"'  	) RETURNING * " ; 


//const query_update = "UPDATE appointment SET patient_name = '"+req.body.patient_name+"' ,  patient_doc_id = '"+req.body.patient_doc_id+"' , patient_email = '"+req.body.patient_email+"' , patient_phone1 ='"+req.body.patient_phone+"' , patient_insurance='"+req.body.patient_insurance+"' , app_available='FALSE'     WHERE id = '"+req.body.appointment_id+"'  RETURNING * ";

console.log(query_reserve);
const resultado = client.query(query_reserve, (err, result) => {
    //res.status(200).send(JSON.stringify(result)) ;
    if (err) {
      console.log('/public_take_appointment ERR:'+err ) ;
    }
    else {
    console.log("public_take_appointment JSON RESPONSE BODY : "+JSON.stringify(result));
    res.status(200).send(JSON.stringify(result.rows[0])) ;  
    }
    

    client.end()
})

})


/*
// SAVE APPOINTMENT
app.route('/public_take_appointment')
.post(function (req, res) {
    console.log('public_take_appointment INPUT : ', req.body );
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
let query_update = "UPDATE appointment SET " ;

// from Update Form
if  (req.body.form_start_time != null )
{ query_update += " start_time = '"+req.body.form_start_time+"'  , "   ;}

if  (req.body.form_appointment_duration != null )
{ query_update += " duration = '"+req.body.form_appointment_duration+"'  , "   ;}

if  (req.body.form_center_id != null )
{ query_update += " center_id = '"+req.body.form_center_id+"'  , "   ;}

if  (req.body.form_specialty_code != null )
{ query_update += " specialty = '"+req.body.form_specialty_code+"'  , "   ;}


// FROM Take Appointment. 
if  (req.body.patient_name != null )
{ query_update += " patient_name = '"+req.body.patient_name+"'  , "   ;}

if  (req.body.patient_doc_id != null )
{  query_update += "patient_doc_id = '"+req.body.patient_doc_id+"' , " ; } 

if  (req.body.patient_email != null )
{  query_update += "patient_email = '"+req.body.patient_email+"' , "   ; } 
 
if  (req.body.patient_phone != null )
{  query_update += "patient_phone1 ='"+req.body.patient_phone+"' ,  " ; } 
 
if  (req.body.patient_insurance != null )
{  query_update += "patient_insurance='"+req.body.patient_insurance+"' , " ; } 
//set PATIENT ADDRESS
if  (req.body.patient_address != null )
{  query_update += "patient_address='"+req.body.patient_address+"' , " ; } 
//set SPECIALTY RESERVED
if  (req.body.specialty_reserved != null )
{  query_update += "specialty_reserved ='"+req.body.specialty_reserved+"' , " ; } 

//last one of the query.- 
query_update += " app_available ='false' , " ;

if  (req.body.form_public != null )
{  query_update += " available_public_search ='"+req.body.form_public+" ' " ; } 

query_update += "    WHERE id = '"+req.body.appointment_id+"'  RETURNING * " ;

//const query_update = "UPDATE appointment SET patient_name = '"+req.body.patient_name+"' ,  patient_doc_id = '"+req.body.patient_doc_id+"' , patient_email = '"+req.body.patient_email+"' , patient_phone1 ='"+req.body.patient_phone+"' , patient_insurance='"+req.body.patient_insurance+"' , app_available='FALSE'     WHERE id = '"+req.body.appointment_id+"'  RETURNING * ";

console.log(query_update);
const resultado = client.query(query_update, (err, result) => {
    //res.status(200).send(JSON.stringify(result)) ;
    if (err) {
      console.log('/public_take_appointment ERR:'+err ) ;
    }
    else {
    console.log("public_take_appointment JSON RESPONSE BODY : "+JSON.stringify(result));
    res.status(200).send(JSON.stringify(result.rows[0])) ;  
    }
    

    client.end()
})

  //console.log(JSON.stringify(JSON.stringify(req))) ;
  
  
  
 //res.send("saludos terricolas");
  //res.status(200).json(resultado.rows) ;
  // res.send(JSON.stringify(result));
})

*/

// **************************************
// ********* COMMON API ******************
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
const sql  = "SELECT * from  specialty where id IN  (SELECT specialty_id FROM professional_specialty WHERE professional_id="+req.body. professional_id+") ;" ;
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
let query_update = "UPDATE appointment SET " ;

// from Update Form
if  (req.body.form_start_time != null )
{ query_update += " start_time = '"+req.body.form_start_time+"'  , "   ;}

if  (req.body.form_appointment_duration != null )
{ query_update += " duration = '"+req.body.form_appointment_duration+"'  , "   ;}

if  (req.body.form_center_id != null )
{ query_update += " center_id = '"+req.body.form_center_id+"'  , "   ;}

if  (req.body.form_specialty_code != null )
{ query_update += " specialty = '"+req.body.form_specialty_code+"'  , "   ;}


// FROM Take Appointment. 
if  (req.body.patient_name != null )
{ query_update += " patient_name = '"+req.body.patient_name+"'  , "   ;}

if  (req.body.patient_doc_id != null )
{  query_update += "patient_doc_id = '"+req.body.patient_doc_id+"' , " ; } 

if  (req.body.patient_email != null )
{  query_update += "patient_email = '"+req.body.patient_email+"' , "   ; } 
 
if  (req.body.patient_phone != null )
{  query_update += "patient_phone1 ='"+req.body.patient_phone+"' ,  " ; } 
 
if  (req.body.patient_insurance != null )
{  query_update += "patient_insurance='"+req.body.patient_insurance+"' , " ; } 
/*
  form_start_time: '09:00:00',
  form_appointment_duration: '45',
  appointment_id: 1235,
  form_center_id: 45,
  form_professional_id: '1',
  form_date: '2021-10-21',
  form_specialty_code: 131,
  form_public:
*/
//last one of the query.- 
if  (req.body.form_public != null )
{  query_update += " available_public_search ='"+req.body.form_public+" ' " ; } 

query_update += "    WHERE id = '"+req.body.appointment_id+"'  RETURNING * " ;

//const query_update = "UPDATE appointment SET patient_name = '"+req.body.patient_name+"' ,  patient_doc_id = '"+req.body.patient_doc_id+"' , patient_email = '"+req.body.patient_email+"' , patient_phone1 ='"+req.body.patient_phone+"' , patient_insurance='"+req.body.patient_insurance+"' , app_available='FALSE'     WHERE id = '"+req.body.appointment_id+"'  RETURNING * ";

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

/*****************************************************

PROFESIONAL API

*******************************************************/
// PROFESSIONAL DUPLICATE DAY 
app.route('/professional_duplicate_day')
.post(function (req, res) {
    console.log('professional_duplicate_day INPUT:', req.body );
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
//sql = " WITH ids AS (  INSERT INTO center ( name ,  address , phone1, phone2, comuna ) VALUES (  '"+req.body.center_name+"' , '"+req.body.center_address+"', '"+req.body.center_phone1+"' ,'"+req.body.center_phone2+"' ,'"+req.body.center_comuna+"' ) RETURNING id as center_id ) INSERT INTO center_professional (professional_id, center_id) VALUES ('"+req.body.professional_id+"', (SELECT center_id from ids) ) RETURNING * ;  ";

sql = "INSERT INTO appointment (date, start_time, duration, specialty, specialty1, specialty2,specialty3,specialty4, center_id, professional_id , app_available , app_public , available_public_search, location1,location2,location3 , location4 , location6, location7, location8, app_type_home , app_type_center, app_type_remote) " ;
sql = sql + " SELECT '"+req.body.destination+"' , start_time, duration, specialty, specialty1, specialty2,specialty3,specialty4,  center_id, professional_id , true , app_public , false ,  location1, location2,location3 , location4 , location6, location7, location8,  app_type_home ,  app_type_center,  app_type_remote";
sql = sql + " FROM appointment  WHERE professional_id = '"+req.body.p_id+"'  AND date='"+req.body.origin+"'  " ; 
  

console.log('professional_duplicate_day SQL:'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('professional_duplicate_day ERROR  CENTER CREATION QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	 // json_response = { result_status : 0  , center_id : result.data.center_id  };
	  res.status(200).send(JSON.stringify(result));
	  console.log('professional_duplicate_day  SUCCESS CENTER INSERT ' ) ; 
    console.log('professional_duplicate_day  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})

})


// SHUT DOWN FIRST LOGIN
app.route('/professional_shutdown_firstlogin')
.post(function (req, res) {
    console.log('professional_shutdown_firstlogin INPUT : ', req.body );
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
const query_update = "UPDATE professional SET first_time = 'false' WHERE id = '"+req.body.professional_id+"' RETURNING * " ;

console.log(query_update);
const resultado = client.query(query_update, (err, result) => {

     console.log('RESULTADO '+JSON.stringify(resultado))
     var json_response_ok = { 
			    result_status : 'Updated', 
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

/*
// PROFESSIONAL CANCEL APPOINTMENT 
app.route('/professional_cancel_appointment')
.post(function (req, res) {
    console.log('Cancel App INPUT : ', req.body );
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
const query_update = "UPDATE appointment SET app_status = '0' , app_available = true , patient_doc_id = null , patient_name = null , patient_phone1 = null , patient_phone2 = null , patient_email = null , confirmation_status = null      WHERE id = '"+req.body.appointment_id+"' RETURNING * " ;

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


// PROFESSIONAL CANCEL APPOINTMENT 
app.route('/professional_cancel_appointment')
.post(function (req, res) {
    console.log('professional_cancel_appointment INPUT : ', req.body );
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
//const query_update = "UPDATE appointment SET app_status = '0' , app_available = true , patient_doc_id = null , patient_name = null , patient_phone1 = null , patient_phone2 = null , patient_email = null , confirmation_status = null      WHERE id = '"+req.body.appointment_id+"' RETURNING * " ;

const query_update = "DELETE  FROM appointment WHERE id = '"+req.body.appointment_id+"' RETURNING * " ;



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



// CANCEL APPOINTMENT 
app.route('/cancel_hour')
.post(function (req, res) {
    console.log('Cancel HOUR INPUT : ', req.body );
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

//***************************************
//******** PROFESIONAL API  *************
//***************************************


// PROFESSIONAL CREATE CALENDAR 
app.route('/professional_create_calendar')
.post(function (req, res) {
    console.log('professional_create_calendar INPUT:', req.body );
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
/*
form_start_time: '02:00',
  form_end_time: '03:00',
  form_specialty_id: 152,
  form_app_duration: '30',
  form_app_time_between: '15',
  form_recurrency_mon: true,
  form_recurrency_tue: false,
  form_recurrency_wed: true,
  form_recurrency_thu: false,
  form_recurrency_fri: true,
  form_recurrency_sat: false,
  form_recurrency_sun: true,
  form_calendar_start: '2022-02-01',
  form_calendar_end: '2022-02-04',
  form_appointment_center: false,
  form_appointment_home: true,
  form_appointment_remote: false,
  form_appointment_home_locations: [ 1662, 1511 ],
  form_appointment_center_code: null,
  professional_id: 1
*/
let sql_location = " " ;
if (req.body.form_appointment_home_locations != null  )
{
  if (req.body.form_appointment_home_locations[0] != null )
  {
    sql_location += ", '"+req.body.form_appointment_home_locations[0]+"' "
  } else { sql_location += ", null " }
  if (req.body.form_appointment_home_locations[1] != null )
  {
    sql_location += ", '"+req.body.form_appointment_home_locations[1]+"' "
  }else { sql_location += ", null " }
  if (req.body.form_appointment_home_locations[2] != null )
  {
    sql_location += ", '"+req.body.form_appointment_home_locations[2]+"' "
  }else { sql_location += ", null " }
}

let center_code = " null " ;
if (req.body.form_appointment_center_code != null)
{
center_code = " '"+req.body.form_appointment_center_code+"' " ;
}


sql = "INSERT INTO professional_calendar (professional_id , start_time,  end_time, specialty1, duration, time_between, monday, tuesday, wednesday, thursday, friday, saturday , sunday, date_start, date_end,  home_visit, center_visit,  center_visit_center_id,  video_call, status , home_visit_location1 , home_visit_location2  , home_visit_location3  ) VALUES ( '"+req.body.professional_id+"',  '"+req.body.form_start_time+"' , '"+req.body.form_end_time+"', '"+req.body.form_specialty_id+"' , '"+req.body.form_app_duration+"' , '"+req.body.form_app_time_between+"' ,  '"+req.body.form_recurrency_mon+"' ,  '"+req.body.form_recurrency_tue+"'  ,  '"+req.body.form_recurrency_wed +"' ,  '"+req.body.form_recurrency_thu+"'  ,  '"+req.body.form_recurrency_fri+"'  , '"+req.body.form_recurrency_sat+"'  ,  '"+req.body.form_recurrency_sun+"'  ,   '"+req.body.form_calendar_start+"'  ,  '"+req.body.form_calendar_end+"'  ,  '"+req.body.form_appointment_home+"' , '"+req.body.form_appointment_center+"'  ,  "+req.body.form_appointment_center_code+" ,   '"+req.body.form_appointment_remote+"'  , '1'  "+sql_location+" )  " ;
console.log('create_calendar SQL:'+sql ) ;

  
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('professional_create_calendar ERROR  CENTER CREATION QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	 // json_response = { result_status : 0  , center_id : result.data.center_id  };
	  res.status(200).send(JSON.stringify(result));
	  console.log('professional_create_calendar  SUCCESS CENTER INSERT ' ) ; 
    console.log('professional_create_calendar  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})
  

})


// PROFESSIONAL ACTIVATE  CALENDAR 
app.route('/professional_activate_calendar')
.post(function (req, res) {
    console.log('professional_activate_calendar INPUT:', req.body );
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

let sql = " UPDATE professional_calendar SET active = true WHERE id = "+req.body.calendar_id+"  " ;

console.log('Professional activate calendar  SQL:'+sql ) ;
  
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('ACTIVATE CALENDAR  ERROR:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	 // json_response = { result_status : 0  , center_id : result.data.center_id  };
	  res.status(200).send(JSON.stringify(result));
	  console.log('ACTIVATE CALENDAR SUCCESS ' ) ; 
    console.log('ACTIVATE CALENDAR OUTPUT :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})
  

})

// PROFESSIONAL INACTIVATE  CALENDAR 
app.route('/professional_inactivate_calendar')
.post(function (req, res) {
    console.log('professional_inactivate_calendar INPUT:', req.body );
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

let sql = " UPDATE professional_calendar SET active = false WHERE id = "+req.body.calendar_id+"  " ;

console.log('Professional INactivate calendar  SQL:'+sql ) ;
  
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('INACTIVATE CALENDAR  ERROR:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	 // json_response = { result_status : 0  , center_id : result.data.center_id  };
	  res.status(200).send(JSON.stringify(result));
	  console.log('INACTIVATE CALENDAR SUCCESS ' ) ; 
    console.log('INACTIVATE CALENDAR OUTPUT :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})
  
})


// PROFESSIONAL GET TimeTable
app.route('/rofessional_get_calendars')
.post(function (req, res) {
 
    console.log('rofessional_get_calendars :', req.body );
 
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
const sql  = "SELECT * FROM professional_calendar WHERE professional_id='"+req.body.professional_id+"' ORDER BY id DESC " ;
console.log('professional_get_centers: SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('rofessional_get_calendars ERR:'+err ) ;
    }

  console.log('professional_get_calendars : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end() ;
})

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

/*
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
const sql ="SELECT * FROM ( SELECT specialty_reserved, patient_address, app_type_home ,app_type_center, app_type_remote, location1, location2,location3,location4,location5,location6, app_status, patient_name, patient_email, patient_phone1, patient_phone2, patient_insurance ,  patient_doc_id , name as specialty_name, center_address, center_name, center_color , app_id,date, start_time, end_time, duration, specialty,  specialty1 ,specialty2 ,specialty3,specialty4 , specialty5, center_id, available_public_search, confirmation_status, app_blocked, professional_id, app_available   FROM (  SELECT specialty_reserved, patient_address, app_type_home ,app_type_center, app_type_remote, location1, location2,location3,location4,location5,location6, app_status, patient_name, patient_email, patient_phone1, patient_phone2, patient_insurance ,  patient_doc_id , address as center_address, name as center_name, color as center_color, app_id,date, start_time, end_time, duration, specialty,  specialty1 ,specialty2 ,specialty3,specialty4 , specialty5, center_id, available_public_search, confirmation_status, app_blocked, professional_id ,app_available  FROM  (SELECT specialty_reserved, patient_address, app_type_home ,app_type_center, app_type_remote, location1, location2,location3,location4,location5,location6, app_status, patient_name, patient_email, patient_phone1, patient_phone2, patient_insurance ,  patient_doc_id ,id as app_id, date , start_time, end_time, duration, specialty,  specialty1 ,specialty2 ,specialty3,specialty4 , specialty5, center_id, available_public_search, confirmation_status, app_blocked, professional_id , app_available  FROM appointment WHERE professional_id='"+req.body.professional_id+"' and Date = '"+req.body.date+"' ORDER BY start_time ASC ) J LEFT JOIN center ON center.id=j.center_id  )K LEFT JOIN specialty ON specialty.id=K.specialty ) L LEFT JOIN professional ON professional.id = L.professional_id " ;

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
*/

/*
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
const sql ="SELECT * FROM ( SELECT specialty_reserved, patient_address, app_type_home ,app_type_center, app_type_remote, location1, location2,location3,location4,location5,location6, app_status, patient_name, patient_email, patient_phone1, patient_phone2, patient_insurance ,  patient_doc_id , name as specialty_name, center_address, center_name, center_color , app_id,date, start_time, end_time, duration, specialty,  specialty1 ,specialty2 ,specialty3,specialty4 , specialty5, center_id, available_public_search, confirmation_status, app_blocked, professional_id, app_available   FROM (  SELECT specialty_reserved, patient_address, app_type_home ,app_type_center, app_type_remote, location1, location2,location3,location4,location5,location6, app_status, patient_name, patient_email, patient_phone1, patient_phone2, patient_insurance ,  patient_doc_id , address as center_address, name as center_name, color as center_color, app_id,date, start_time, end_time, duration, specialty,  specialty1 ,specialty2 ,specialty3,specialty4 , specialty5, center_id, available_public_search, confirmation_status, app_blocked, professional_id ,app_available  FROM  (SELECT specialty_reserved, patient_address, app_type_home ,app_type_center, app_type_remote, location1, location2,location3,location4,location5,location6, app_status, patient_name, patient_email, patient_phone1, patient_phone2, patient_insurance ,  patient_doc_id ,id as app_id, date , start_time, end_time, duration, specialty,  specialty1 ,specialty2 ,specialty3,specialty4 , specialty5, center_id, available_public_search, confirmation_status, app_blocked, professional_id , app_available  FROM appointment WHERE professional_id='"+req.body.professional_id+"' and Date = '"+req.body.date+"' ORDER BY start_time ASC ) J LEFT JOIN center ON center.id=j.center_id  )K LEFT JOIN specialty ON specialty.id=K.specialty ) L LEFT JOIN professional ON professional.id = L.professional_id " ;

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

*/


// PROFESIONAL GET APPOINTMENT DAY
app.route('/professional_get_appointments_day2')
.post(function (req, res) {
     console.log('professional_get_appointments_day2 : INPUT : ', req.body );
 
     let resp_app_available = get_appointments_available_professional(req.body);
     resp_app_available.then( v => {  console.log("RESPONSE: "+JSON.stringify(v)) ; return (res.status(200).send(JSON.stringify(v))) } )
     
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
const sql = "INSERT INTO session (name, user_id,last_login , last_activity_time , user_type , first_time ) SELECT   name, user_id , now() as last_login ,now() as last_activity_time, 1 as user_type , first_time  FROM (SELECT * FROM (SELECT * FROM professional WHERE email ='"+req.body.form_email+"' )P LEFT JOIN account ON P.id = account.user_id) J WHERE j.pass = '"+req.body.form_pass+"'   RETURNING * ";

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
          first_time : result.rows[0].first_time,
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

// PPROFESSIONAL CREATE APPOINTMENT SIN S
app.route('/professional_create_appointment')
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
startTime.setHours (req.body.form_start_time.substring(0,2) , req.body.form_start_time.substring(3,5) ) 
console.log("StartTime:"+startTime);

req.body.form_specialty_code.push("null");
req.body.form_specialty_code.push("null");
req.body.form_specialty_code.push("null");
req.body.form_specialty_code.push("null");
req.body.form_specialty_code.push("null");
req.body.form_specialty_code.push("null");

req.body.form_type_home_comunas.push("null");
req.body.form_type_home_comunas.push("null");
req.body.form_type_home_comunas.push("null");
req.body.form_type_home_comunas.push("null");
req.body.form_type_home_comunas.push("null");
req.body.form_type_home_comunas.push("null");


console.log("professional_create_appointments");

var SQL_VALUES= "INSERT INTO appointment ( app_type_home , app_type_center , app_type_remote ,  professional_id ,center_id , date ,start_time , duration , specialty , specialty1, specialty2, specialty3, specialty4, specialty5  , available_public_search , app_available , app_blocked , location1, location2 , location3 , location4 , location5 , location6 ) VALUES (   "+req.body.form_type_home+"   , "+req.body.form_type_center+" , "+req.body.form_type_remote+"  ,  '"+req.body.form_professional_id+"' , "+req.body.form_center_id+" , '"+req.body.form_date+"'  , '"+startTime.getHours()+":"+startTime.getMinutes()+":00' ,  '"+req.body.form_appointment_duration+"'  , "+ req.body.form_specialty_code[0] +" , "+ req.body.form_specialty_code[1] +" , "+ req.body.form_specialty_code[2] +" , "+ req.body.form_specialty_code[3] +" , "+ req.body.form_specialty_code[4] +" , "+ req.body.form_specialty_code[5] +"  ,  '"+req.body.form_public+"' ,'1','0' , "+req.body.form_type_home_comunas[0]+" , "+req.body.form_type_home_comunas[1]+" , "+req.body.form_type_home_comunas[2]+" , "+req.body.form_type_home_comunas[3]+" , "+req.body.form_type_home_comunas[4]+" , "+req.body.form_type_home_comunas[5]+" ) " ;  

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


//PATIENT GET APPOINTMENTS  SEARCH BY CALENDAR
app.route('/patient_get_appointments_day2')
.post(function (req, res) {
 
    console.log('patient_get_appointments_day2 : INPUT : ', req.body );
    
    //res.status(200).send(JSON.stringify( get_appointments_available(req.body)));
    
    let resp_app_available = get_appointments_available(req.body);
    resp_app_available.then( v => {  console.log("RESPONSE: "+JSON.stringify(v)) ; return (res.status(200).send(JSON.stringify(v))) } )
    
    //res.status(200).send(JSON.stringify(resp_app_available));

    /*
    resp_calendar.then(result => console.log(result) )
    
    let resp_app_taken=get_professional_apptointments_day()
    resp_app_taken.then(result => console.log(result) )
    res.status(200).send(JSON.stringify(result) );
  client.end()
    */
})

 
/*
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
let sql_appType =" "; 


  //DEFINE  SQL RELATED TO APP TYPE : REMOTE, CENTER OR TELE
if  ( req.body.type_home || req.body.type_center || req.body.type_remote )
{  sql_appType = " AND  ( " ;
  
  if (req.body.type_home)
  { sql_appType = sql_appType+" app_type_home = "+req.body.type_home+"   " }
        //add separator if exits both
        if (req.body.type_home && req.body.type_center)
        { sql_appType = sql_appType+ " OR " ;}

  if (req.body.type_center)
  { sql_appType =sql_appType+"  app_type_center = "+req.body.type_center+"   " }

        //add separator if exits both
        if ((req.body.type_remote && req.body.type_center) || (req.body.type_home && req.body.type_remote ))
        { sql_appType = sql_appType+ " OR " ;}

  if (req.body.type_remote)
  { sql_appType =sql_appType+"  app_type_remote = "+req.body.type_remote+"  " }
  
  sql_appType =sql_appType+" ) ";
}


// DEFINE SQL RELATED TO SPECIALTY
if (req.body.specialty != null && req.body.specialty != ""  )
{ sql_and_specialty = " AND ( specialty = '"+ req.body.specialty+"' OR  specialty1 = '"+ req.body.specialty+"' OR  specialty2 = '"+ req.body.specialty+"' OR  specialty3 = '"+ req.body.specialty+"'  OR  specialty4 = '"+ req.body.specialty+"' OR  specialty5 = '"+ req.body.specialty+"' ) " }

//IF FILTER BY COMUNA
if (req.body.comuna != null && req.body.comuna != ""  )
{ 
  //Means user include Comuna filter, 
  //first check if filter Home and Center are False. 
  if ( !req.body.type_home && !req.body.type_center )  
  { // SO, we pefrom a search by comuna (center) or Location (for Home)
    sql_and_comuna  = " WHERE  ( comuna = '"+ req.body.comuna+"' OR location1 = '"+ req.body.comuna+"' OR location2 = '"+ req.body.comuna+"'  OR  location3 = '"+ req.body.comuna+"'  OR  location4 = '"+ req.body.comuna+"'  OR  location5 = '"+ req.body.comuna+"'  OR  location6 = '"+ req.body.comuna+"'  )"   ;
  }
  // check if user click on Both Filter Home and Center
  else if (req.body.type_home && req.body.type_center)
  {
        sql_and_comuna  = " WHERE  ( comuna = '"+ req.body.comuna+"' OR location1 = '"+ req.body.comuna+"' OR location2 = '"+ req.body.comuna+"'  OR  location3 = '"+ req.body.comuna+"'  OR  location4 = '"+ req.body.comuna+"'  OR  location5 = '"+ req.body.comuna+"'  OR  location6 = '"+ req.body.comuna+"'  )"   ;
  }
  //means we have a mix, True and False in center or Home
  else {
        if (req.body.type_center)
          {
          sql_and_comuna  = " WHERE   comuna = '"+ req.body.comuna+"' "   ;
          }
        else if (req.body.type_home)
          {
          sql_and_comuna  = " WHERE  ( location1 = '"+ req.body.comuna+"'  OR   location2 = '"+ req.body.comuna+"'  OR  location3 = '"+ req.body.comuna+"'  OR  location4 = '"+ req.body.comuna+"'  OR  location5 = '"+ req.body.comuna+"'  OR  location6 = '"+ req.body.comuna+"' ) "  ;
          }   
  }

 

} //END FILTER BY COMUNA

//agregar aqui logica para incluir busqueda de citas a domicilio busqueda por comuna

if (req.body.insurance != null  && req.body.insurance != "")
{ sql_and_insurance = " AND insurance = '"+ req.body.insurance+"'"   }

//const sql ="SELECT * FROM appointment where Date = '"+req.body.date+"' AND "+ sqland +"  ORDER BY date DESC " ;
const sql = `SELECT * FROM 
( SELECT app_type_home ,app_type_center, app_type_remote, location1, location2,location3,location4,location5,location6, url_map, comuna, patient_name, app_status, name as specialty_name, center_address, center_name, app_id, date, start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, app_blocked, professional_id, app_available   FROM 
( SELECT app_type_home ,app_type_center, app_type_remote, location1, location2,location3,location4,location5,location6, url_map, comuna, app_status, patient_name, patient_email, patient_phone1, patient_phone2, patient_insurance ,  patient_doc_id , address as center_address, name as center_name, app_id,date, start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, app_blocked, professional_id ,app_available  FROM  
 (SELECT app_type_home ,app_type_center, app_type_remote, location1, location2,location3,location4,location5,location6, app_status, patient_name, patient_email, patient_phone1, patient_phone2, patient_insurance ,  patient_doc_id ,id as app_id, date , start_time, end_time, duration, specialty, center_id, available_public_search, confirmation_status, app_blocked, professional_id , app_available  
FROM appointment WHERE Date >= '`+req.body.date+`' 
	AND available_public_search = '1'  
	AND app_blocked = '0' 
	AND app_available = 'true' 
   `+sql_and_specialty+`  
   `+sql_appType+`  
   `+sql_and_comuna+`  
   
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

*/ 
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

//********************************************************************/
//********************************************************************/
//********************* FUNCTIONS ************************************/
//********************************************************************/
//********************************************************************/

const conn_data = {
  user: 'conmeddb_user',
  host: '127.0.0.1',
  database: 'conmeddb02',
  password: 'paranoid',
  port: 5432,
}
  

async function get_appointments_available(json)
{
  let professional_ids = [] ;
    professional_ids.push(999);
  let dates = [] ;
   // dates.push("2022-02-01");
  let appointments_available = [] ; 
  console.log('GET APPOINTMENT AVAILABLE ');
   // 1.-  CALENDARS 
  let calendars = await get_calendars_available(json)
  console.log('1.- GET CALENDARS Match with Search Parameters Total:'+calendars.length );
  calendars.forEach(cal => console.log("CALENDAR ID :"+cal.id));

  // get all appointments of Profecioals belog calendars for the days required
  //extract professional ids from Calendars
  for(var i=0; i<calendars.length; i++){
    professional_ids.push(calendars[i]['professional_id']);
  }

  professional_ids = professional_ids.sort().filter(function(item, pos, ary) {
    return !pos || item != ary[pos - 1];
    });
  console.log('CALENDARS LIST Professional Ids:'+professional_ids );
  
  //filtrar para no tener ids repetidos. 
  //MUST ELIMINATE DUPLICATED IDs 
   dates.push(json.date);

   // 2.-  APPOINTMENTS TAKEN
  let appointments = await get_professional_appointment_day(professional_ids,dates)
  
  // now we cut calendar skiping appotintments taken 
  for(var i=0; i<calendars.length; i++){
      let appointment_id_filtered = appointments.filter(appointments => appointments.professional_id == calendars[i].professional_id );
     
        let aux_date_start = new Date(calendars[i].date_start) ; 
        let aux_date_end = new Date(calendars[i].date_end) ;
      /*
        console.log("CALENDAR: Date Start Javascript  -> "+aux_date_start.getDay()+"/"+( aux_date_start.getMonth() +1 )+"/"+ aux_date_start.getFullYear() ); 
        console.log("CALENDAR: Date End Javascript  -> "+aux_date_end.getDay()+"/"+( aux_date_end.getMonth() +1 )+"/"+ aux_date_end.getFullYear() ); 
       */
        let aux_start_time = new Date ('Thu, 01 Jan 1970 '+calendars[i].start_time ).getTime();
        let aux_end_time = new Date ('Thu, 01 Jan 1970 '+calendars[i].end_time ).getTime();      

        let total_available_time =  aux_end_time  - aux_start_time ; 
        let app_duration =  (( parseInt(calendars[i].duration) + parseInt(calendars[i].time_between) ) * 60 * 1000 ) ;
        let app_total_slots = total_available_time / app_duration ;
        console.log("CALENDAR TOTAL DRAFT slots TO CREATE:"+ app_total_slots+"   FOR PROFESSIONAL ID:"+calendars[i].professional_id )
        console.log("CALENDAR APPOINTMENT ALREADY RESERVED :"+appointment_id_filtered.length+ " For Professional id: "+calendars[i].professional_id);
        console.log("START CYCLE TO CREATE SLOTS (skiping reserved)");

        let start_time_slot = aux_start_time;
        //INSERT Appointments TO ARRAY based in CALENDAR times 
                  for (let x = 1; x <= app_total_slots ; x ++) {
                      
                        let aux_date = new Date(start_time_slot)

                        var appointment_slot = {
                          calendar_id : calendars[i].calendar_id , 
                          date : json.date ,
                          professional_name : calendars[i].professional_name , 
                          specialty1 : calendars[i].specialty1 , 
                          duration : calendars[i].duration ,
                          professional_id : calendars[i].professional_id , 

                          pattient_doc_id : calendars[i].pattient_doc_id ,

                          home_visit : calendars[i].home_visit ,
                          home_visit_location1 : calendars[i].home_visit_location1 ,
                          home_visit_location2 : calendars[i].home_visit_location2 ,
                          home_visit_location3 : calendars[i].home_visit_location3 ,
                          home_visit_location4 : calendars[i].home_visit_location4 ,
                          home_visit_location5 : calendars[i].home_visit_location5 ,
                          home_visit_location6 : calendars[i].home_visit_location6 ,

                          center_visit :calendars[i].center_visit ,
                          center_id :calendars[i].center_visit_center_id ,
                          center_name :calendars[i].center_name ,
                          center_address :calendars[i].center_address ,
                          status : calendars[i].status  ,
                          //start_time : "0"+aux_date.getHours()+":0"+aux_date.getMinutes() , 
                          start_time :  aux_date.getHours().toString().padStart(2, '0')+":"+aux_date.getMinutes().toString().padStart(2, '0') , 
                          //new String(new char[width - toPad.length()]).replace('\0', fill) + toPad;
                        }

                      start_time_slot +=  app_duration ;
                      
                      console.log("--> DRAFT SLOT "+x+"/"+app_total_slots+" Start_Time: "+appointment_slot.start_time+" Duration:"+appointment_slot.duration );
                      //check if this Available App is not already taken by users. 
                      //AQUI ME QUEDE
                      //console.log("FILTERS CALENDAR    -> id: "+calendars[i].calendar_id+" Professional Id: "+calendars[i].professional_id+"   " )
                      //let exist = appointments_filtered.filter(w => w.start_time == aux_date.getTime() );
                      let aux_date_slot= new Date ('Thu, 01 Jan 1970 '+appointment_slot.start_time ).getTime();
                      let skip_insert = false ; 
                      if (appointment_id_filtered.length > 0) 
                      {
                            for (let i = 0; i < appointment_id_filtered.length; i++) {
                             // console.log("----> CYCLE APPOINTMENTS to compare "+(i+1)+"/"+appointment_id_filtered.length );
                              let aux_date_app = new Date('Thu, 01 Jan 1970 '+appointment_id_filtered[i].start_time).getTime(); ;
                            /*  console.log("---> FILTERS Appointment id: "+appointment_id_filtered[i].id+" StartTIme: "+appointment_id_filtered[i].start_time  )
                              console.log("---> FILTERS APP  StartTIme: "+appointment_id_filtered[i].start_time+" vs APPSLOT " +appointment_slot.start_time  )
                              console.log("---> FILTERS comparison result : slot Startime:  "+aux_date_slot +" vs APPFound " +aux_date_app )
                              */
                                if ( aux_date_slot === aux_date_app)
                                {
                                  console.log("------> MATCH TRUE --> SKIPING "+appointment_slot.date+" "+appointment_slot.start_time+" Professional_id: "+appointment_slot.professional_id );
                                  skip_insert = true ;
                                }
                                else
                                {
                                  //console.log("------> MATCH FALSE. ADD TO APP AVAILABLE LIST "+appointment_slot.date+" "+appointment_slot.start_time+" Professional_id: "+appointment_slot.professional_id );
                                  //appointments_available.push(appointment_slot)
                                }
                            }
                            if (!skip_insert) 
                            {
                              appointments_available.push(appointment_slot)
                            }

                      }
                      else{ 
                          appointments_available.push(appointment_slot) ;
                      }
                      //console.log("FILTER APPOINTMENT  -> Comparison AppId: "+appointments_filtered[0].id+" Slot StartTime n"+x+" : "+ appointment.start_time + " 1st Appointment StartTIme: "+appointments_filtered[0].start_time  );
                      //console.log("COMPARISON RESULT  : "+('00:00'=='00:00') );

                      //console.log("COMPARISON RESULT DATE GetTime : "+ ( Date('00:00').getTime() == Date('00:00').getTime() ) );
                      //exist.forEach(element => console.log("FILTERS ->  Appointment id:"+element.id+ " Start Date:"+element.start_date+" \n " ));                      
/*                   
                      if (exist.length > 0 )
                      {
                     // console.log("DISMISS block time :Appointment id "+exist.id+ " TIME:"+exist.start_time ) ; 
                      console.log("DISMISS block time :"+JSON.stringify(exist) ) ; 
                      }
                      else
                      {
                      appointments_available.push(appointment) ;
                      }
*/
              
                     //console.log("CALENDAR APPOINTMENT AVAILABLE to display Lenght:"+appointments_available.lenght);
                    
                    }

             } // END FOR CYCLE CALENDARS
  console.log("CALENDAR APPOINTMENT SORT")
  appointments_available.sort(function(b, a){ return (new Date('Thu, 01 Jan 1970 '+b.start_time) - new Date('Thu, 01 Jan 1970 '+a.start_time )) } ) 
                  
  console.log ("************* FINAL TO DISPLAY ************************ ");
  console.log ("FINAL  APPOINTMENTS AVAILABLE TO DISPLAY :"+appointments_available.length);
  console.log ("DETAILS FINAL  APPOINTMENTS AVAILABLE TO DISPLAY :"+JSON.stringify(appointments_available));

  return  appointments_available ;

}


async function get_calendars_available(json)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
  
  let specialty = " " ;
  if (json.specialty != null )
  {
    specialty = "AND specialty1 = '"+json.specialty+"'  " ;
  }

  // IF HOME VISIT  OR IN CENTER 
  let app_type = " " ;
  if (json.type_home)
        {
          app_type = "AND home_visit = 'true'  " ;
        }
  if (json.type_center)
        {
          app_type = "AND center_visit = 'true'  " ;
        }
  
   if (json.type_center && json.type_home)
   {
    app_type = " " ;
   }
   // END HOME VISIT

   // IF LOCATION SEARCH
   let sql_location = "" ;
   if (json.location != null )
   { 
      if ( (json.type_home && json.type_home) || (!json.type_home && !json.type_home)   )
      {
        sql_location = " WHERE home_visit_location1 IN ("+json.location+") OR home_visit_location2 IN ("+json.location+")  OR home_visit_location3 IN ("+json.location+") OR home_visit_location4 IN ("+json.location+") OR home_visit_location5 IN ("+json.location+") OR home_visit_location6 IN ("+json.location+")  OR comuna IN ("+json.location+")  " ;
      }   
      else if (json.type_home)
      {
      sql_location = " WHERE home_visit_location1 IN ("+json.location+") OR home_visit_location2 IN ("+json.location+")  OR home_visit_location3 IN ("+json.location+") OR home_visit_location4 IN ("+json.location+") OR home_visit_location5 IN ("+json.location+") OR home_visit_location6 IN ("+json.location+")    " ;
      }
      else if (json.type_center)
      {
      sql_location = "WHERE comuna IN ("+json.location+") " ;
      }
  }
  //END IF LOCATION
  //const sql_calendars  = " SELECT * FROM (SELECT id as calendar_id , *  FROM professional_calendar WHERE "+specialty+" date_start <= '"+json.date+"' AND date_end >= '"+json.date+"'  AND start_time  >= '00:00:00' AND active = true ) C  LEFT JOIN  professional ON C.professional_id = professional.id ";
  const sql_calendars  = "SELECT * FROM (SELECT name AS center_name, address AS center_address, * FROM (  SELECT name AS professional_name , calendar_id, professional_id, start_time, end_time, specialty1, duration, time_between, monday, tuesday, wednesday, thursday, friday, saturday, sunday, date_start, date_end , home_visit,  center_visit, video_call, status, home_visit_location1, home_visit_location2, home_visit_location3, home_visit_location4, home_visit_location5,  home_visit_location6, center_visit_center_id, phone AS professional_phone  FROM (SELECT id as calendar_id , *  FROM professional_calendar WHERE  active = true "+specialty+"  AND date_start <= '"+json.date+"'  AND date_end >= '"+json.date+"'  AND start_time  >= '00:00:00'  "+app_type+" ) C  LEFT JOIN professional ON C.professional_id = professional.id )     K LEFT JOIN center ON  k.center_visit_center_id = center.id )J  "+sql_location+" " ; 

  //console.log ("QUERY GET CALENDAR = "+sql_calendars);
  const res = await client.query(sql_calendars) 
  return res.rows ;
  await client.end() 
}


async function get_professional_appointment_day(ids,dates)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
  //console.log("ids:"+ids+" dates:"+dates)

  let aux_dates =" ";
  for(var i=0; i<dates.length; i++){
      aux_dates += "'"+dates[i]+"' " ;
      
      if (i < dates.length-1) 
      {
      aux_dates += "," ;
      }
    //console.log ("\n Value= "+calendars[i]['professional_id']) ; 
  }

  const sql_apps_taken  = "SELECT * FROM appointment WHERE date IN ("+aux_dates+")  and professional_id  IN ("+ids+") ;";
  //console.log("SQL QUERY: "+sql_apps_taken)
  const res = await client.query(sql_apps_taken)
  return res.rows;
  await client.end() 
}


async function get_appointments_available_professional(json)
{
  let professional_ids = [] ;
    professional_ids.push(999);
  let dates = [] ;
   // dates.push("2022-02-01");
  let appointments_available = [] ; 
  console.log('GET APPOINTMENT AVAILABLE PROFESSIONAL ');
   // 1.-  CALENDARS 
  let calendars = await get_calendars_available_professional(json)
  console.log('1.- GET CALENDARS Match with Search Parameters Total:'+calendars.length );
  calendars.forEach(cal => console.log("CALENDAR ID :"+cal.id));

  // get all appointments of Profecioals belog calendars for the days required
  //extract professional ids from Calendars
  for(var i=0; i<calendars.length; i++){
    professional_ids.push(calendars[i]['professional_id']);
  }

  professional_ids = professional_ids.sort().filter(function(item, pos, ary) {
    return !pos || item != ary[pos - 1];
    });
  console.log('CALENDARS LIST Professional Ids:'+professional_ids );
  
  //filtrar para no tener ids repetidos. 
  //MUST ELIMINATE DUPLICATED IDs 
   dates.push(json.date);

   // 2.-  APPOINTMENTS TAKEN
  let appointments = await get_professional_appointment_day(professional_ids,dates)
  
  // now we cut calendar skiping appotintments taken 
  for(var i=0; i<calendars.length; i++){
      let appointment_id_filtered = appointments.filter(appointments => appointments.professional_id == calendars[i].professional_id );
     
        let aux_date_start = new Date(calendars[i].date_start) ; 
        let aux_date_end = new Date(calendars[i].date_end) ;
      /*
        console.log("CALENDAR: Date Start Javascript  -> "+aux_date_start.getDay()+"/"+( aux_date_start.getMonth() +1 )+"/"+ aux_date_start.getFullYear() ); 
        console.log("CALENDAR: Date End Javascript  -> "+aux_date_end.getDay()+"/"+( aux_date_end.getMonth() +1 )+"/"+ aux_date_end.getFullYear() ); 
       */
        let aux_start_time = new Date ('Thu, 01 Jan 1970 '+calendars[i].start_time ).getTime();
        let aux_end_time = new Date ('Thu, 01 Jan 1970 '+calendars[i].end_time ).getTime();      

        let total_available_time =  aux_end_time  - aux_start_time ; 
        let app_duration =  (( parseInt(calendars[i].duration) + parseInt(calendars[i].time_between) ) * 60 * 1000 ) ;
        let app_total_slots = total_available_time / app_duration ;
        console.log("CALENDAR TOTAL DRAFT slots TO CREATE:"+ app_total_slots+"   FOR PROFESSIONAL ID:"+calendars[i].professional_id )
        console.log("CALENDAR APPOINTMENT ALREADY RESERVED :"+appointment_id_filtered.length+ " For Professional id: "+calendars[i].professional_id);
        console.log("START CYCLE TO CREATE SLOTS (skiping reserved)");

        let start_time_slot = aux_start_time;
        //INSERT Appointments TO ARRAY based in CALENDAR times 
                  for (let x = 1; x <= app_total_slots ; x ++) {
                      
                        let aux_date = new Date(start_time_slot)

                        var appointment_slot = {
                          calendar_id : calendars[i].calendar_id , 
                          date : json.date ,
                          professional_name : calendars[i].professional_name , 
                          specialty1 : calendars[i].specialty1 , 
                          duration : calendars[i].duration ,
                          professional_id : calendars[i].professional_id , 

                          pattient_doc_id : calendars[i].pattient_doc_id ,

                          home_visit : calendars[i].home_visit ,
                          home_visit_location1 : calendars[i].home_visit_location1 ,
                          home_visit_location2 : calendars[i].home_visit_location2 ,
                          home_visit_location3 : calendars[i].home_visit_location3 ,
                          home_visit_location4 : calendars[i].home_visit_location4 ,
                          home_visit_location5 : calendars[i].home_visit_location5 ,
                          home_visit_location6 : calendars[i].home_visit_location6 ,

                          center_visit :calendars[i].center_visit ,
                          center_id :calendars[i].center_visit_center_id ,
                          center_name :calendars[i].center_name ,
                          center_address :calendars[i].center_address ,
                          status : calendars[i].status  ,
                          //start_time : "0"+aux_date.getHours()+":0"+aux_date.getMinutes() , 
                          start_time :  aux_date.getHours().toString().padStart(2, '0')+":"+aux_date.getMinutes().toString().padStart(2, '0') , 
                          //new String(new char[width - toPad.length()]).replace('\0', fill) + toPad;
                        }

                      start_time_slot +=  app_duration ;
                      
                      console.log("--> DRAFT SLOT "+x+"/"+app_total_slots+" Start_Time: "+appointment_slot.start_time+" Duration:"+appointment_slot.duration );
                      //check if this Available App is not already taken by users. 
                      //AQUI ME QUEDE
                      //console.log("FILTERS CALENDAR    -> id: "+calendars[i].calendar_id+" Professional Id: "+calendars[i].professional_id+"   " )
                      //let exist = appointments_filtered.filter(w => w.start_time == aux_date.getTime() );
                      let aux_date_slot= new Date ('Thu, 01 Jan 1970 '+appointment_slot.start_time ).getTime();
                      let skip_insert = false ; 
                      if (appointment_id_filtered.length > 0) 
                      {
                            for (let i = 0; i < appointment_id_filtered.length; i++) {
                             // console.log("----> CYCLE APPOINTMENTS to compare "+(i+1)+"/"+appointment_id_filtered.length );
                              let aux_date_app = new Date('Thu, 01 Jan 1970 '+appointment_id_filtered[i].start_time).getTime(); ;
                            /*  console.log("---> FILTERS Appointment id: "+appointment_id_filtered[i].id+" StartTIme: "+appointment_id_filtered[i].start_time  )
                              console.log("---> FILTERS APP  StartTIme: "+appointment_id_filtered[i].start_time+" vs APPSLOT " +appointment_slot.start_time  )
                              console.log("---> FILTERS comparison result : slot Startime:  "+aux_date_slot +" vs APPFound " +aux_date_app )
                              */
                                if ( aux_date_slot === aux_date_app)
                                {
                                  console.log("------> MATCH TRUE --> SKIPING "+appointment_slot.date+" "+appointment_slot.start_time+" Professional_id: "+appointment_slot.professional_id );
                                 // skip_insert = true ;
                                }
                                else
                                {
                                  //console.log("------> MATCH FALSE. ADD TO APP AVAILABLE LIST "+appointment_slot.date+" "+appointment_slot.start_time+" Professional_id: "+appointment_slot.professional_id );
                                  //appointments_available.push(appointment_slot)
                                }
                            }
                            if (!skip_insert) 
                            {
                              appointments_available.push(appointment_slot)
                            }

                      }
                      else{ 
                          appointments_available.push(appointment_slot) ;
                      }
                      //console.log("FILTER APPOINTMENT  -> Comparison AppId: "+appointments_filtered[0].id+" Slot StartTime n"+x+" : "+ appointment.start_time + " 1st Appointment StartTIme: "+appointments_filtered[0].start_time  );
                      //console.log("COMPARISON RESULT  : "+('00:00'=='00:00') );

                      //console.log("COMPARISON RESULT DATE GetTime : "+ ( Date('00:00').getTime() == Date('00:00').getTime() ) );
                      //exist.forEach(element => console.log("FILTERS ->  Appointment id:"+element.id+ " Start Date:"+element.start_date+" \n " ));                      
/*                   
                      if (exist.length > 0 )
                      {
                     // console.log("DISMISS block time :Appointment id "+exist.id+ " TIME:"+exist.start_time ) ; 
                      console.log("DISMISS block time :"+JSON.stringify(exist) ) ; 
                      }
                      else
                      {
                      appointments_available.push(appointment) ;
                      }
*/
              
                     //console.log("CALENDAR APPOINTMENT AVAILABLE to display Lenght:"+appointments_available.lenght);
                    
                    }

             } // END FOR CYCLE CALENDARS
  console.log("CALENDAR APPOINTMENT SORT")
  appointments_available.sort(function(b, a){ return (new Date('Thu, 01 Jan 1970 '+b.start_time) - new Date('Thu, 01 Jan 1970 '+a.start_time )) } ) 
                  
  console.log ("************* FINAL TO DISPLAY ************************ ");
  console.log ("FINAL  APPOINTMENTS AVAILABLE TO DISPLAY :"+appointments_available.length);
  console.log ("DETAILS FINAL  APPOINTMENTS AVAILABLE TO DISPLAY :"+JSON.stringify(appointments_available));

  return  appointments_available ;

}

async function get_calendars_available_professional(json)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
    
  //END IF LOCATION
  //const sql_calendars  = " SELECT * FROM (SELECT id as calendar_id , *  FROM professional_calendar WHERE "+specialty+" date_start <= '"+json.date+"' AND date_end >= '"+json.date+"'  AND start_time  >= '00:00:00' AND active = true ) C  LEFT JOIN  professional ON C.professional_id = professional.id ";
  const sql_calendars  = "SELECT * FROM (SELECT name AS center_name, address AS center_address, * FROM (  SELECT name AS professional_name , calendar_id, professional_id, start_time, end_time, specialty1, duration, time_between, monday, tuesday, wednesday, thursday, friday, saturday, sunday, date_start, date_end , home_visit,  center_visit, video_call, status, home_visit_location1, home_visit_location2, home_visit_location3, home_visit_location4, home_visit_location5,  home_visit_location6, center_visit_center_id, phone AS professional_phone  FROM (SELECT id as calendar_id , *  FROM professional_calendar WHERE  active = true  AND date_start <= '"+json.date+"'  AND date_end >= '"+json.date+"'  AND start_time  >= '00:00:00' AND  professional_id = '"+json.professional_id+"' ) C  LEFT JOIN professional ON C.professional_id = professional.id )     K LEFT JOIN center ON  k.center_visit_center_id = center.id )J  " ; 

  //console.log ("QUERY GET CALENDAR = "+sql_calendars);
  const res = await client.query(sql_calendars) 
  return res.rows ;
  await client.end() 
}









