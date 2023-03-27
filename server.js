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


// *******************************************************
// *********                                  ************
// *********   PUBLIC API                     ************
// *********                                  ************
// *******************************************************
// *******************************************************

//*****  RECOVER APPOINTMENTS  ******************** */
// sanitized 24-03-2023
//*************************************************** */
app.route('/recover_appointments')
.post(function (req, res) {

  req=sntz_json(req)
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
sql = "INSERT INTO professional_register ( name ,  last_name1 , last_name2 , email , doc_id , passwd , personal_address , personal_phone , specialty  ) VALUES (  '"+sntz(req.body.name)+"' , '"+sntz(req.body.last_name1)+"', '"+req.body.last_name2+"' ,'"+req.body.email+"' ,'"+req.body.doc_id+"'  ,'"+req.body.passwd+"' ,'"+req.body.personal_address+"' ,'"+req.body.personal_phone+"' ,'"+req.body.specialty+"'  ) RETURNING *  ";

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

//********************************** */
// PUBLIC TAKE APPOINTMENT
// Sanitized 23-03-2023 
//********************************** */
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

let query_reserve = "INSERT INTO appointment (  date , start_time,  duration,  center_id, confirmation_status, professional_id, patient_doc_id, patient_name,    patient_email, patient_phone1,  patient_age,  app_available, app_status, app_blocked, app_public,  location1, location2, location3, location4, location5, location6,   app_type_home, app_type_center,  app_type_remote, patient_notification_email_reserved , specialty_reserved , patient_address , calendar_id )  "  ; 
query_reserve  += " VALUES ( '"+req.body.appointment_date+"' , '"+req.body.appointment_start_time+"' , '"+req.body.appointment_duration+"' ,  "+req.body.appointment_center_id+" , '0' , '"+req.body.appointment_professional_id+"' , '"+req.body.patient_doc_id.toUpperCase()+"' , '"+sntz(req.body.patient_name.toUpperCase())+"' , '"+req.body.patient_email.toUpperCase()+"' , '"+req.body.patient_phone+"' ,  '"+req.body.patient_age+"' ,'false' , '1' , '0' , '1', "+req.body.appointment_location1+" , "+req.body.appointment_location2+" ,"+req.body.appointment_location3+" ,"+req.body.appointment_location4+" ,"+req.body.appointment_location5+" ,"+req.body.appointment_location6+" , '"+req.body.appointment_type_home+"' , '"+req.body.appointment_type_center+"' , '"+req.body.appointment_type_remote+"' , '1' , '"+req.body.specialty_reserved+"' , '"+req.body.patient_address+"'  , '"+req.body.appointment_calendar_id+"' 	) RETURNING * " ; 

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

/*
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
const sql  = "SELECT * from  specialty where id IN  (SELECT specialty_id FROM professional_specialty WHERE professional_id="+req.body.professional_id+") ;" ;
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
*/

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
/*
// PROFESSIONAL DUPLICATE DAY 
app.route('/professional_lock_day')
.post(function (req, res) {
    console.log('professional_lock_day INPUT:', req.body );
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
var sql  = "INSERT INTO professional_day_locked ( professional_id, date ) values ('"+req.body.appointment_professional_id+"','"+req.body.appointment_date+"') ;"

console.log('professional_lock_day SQL:'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('professional_lock_day ERROR CREATION REGISTER, QUERY:'+sql ) ;
	      console.log(err ) ;
        res.status(200).send(JSON.stringify(result));
	    }
	    else
	    {
	  res.status(200).send(JSON.stringify(result));
	  console.log('professional_lock_day  SUCCESS CENTER INSERT ' ) ; 
    console.log('professional_lock_day  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})
  

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

/* const query_update = "DELETE  FROM appointment WHERE id = '"+req.body.appointment_id+"' RETURNING * " ;
*/

const query_update = "WITH app AS (DELETE FROM appointment  WHERE id = "+req.body.appointment_id+" RETURNING *) INSERT INTO appointment_cancelled  SELECT * FROM app";
console.log("SQL professional_cancel_appointment :"+query_update)

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

/*
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
*/


//***************************************
//*****                      ************
//*****    REQUEST EMAILS    ************
//*****                      ************
//***************************************


//***************************************/
//  RECOVER APPOINTMENTS  01/02/2022
//***************************************/
app.route('/professional_request_confirmation')
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
sql = "insert into request_app_confirm ( app_id ,email ) values ('"+req.body.app_id+"'  ,'"+req.body.patient_email+"') RETURNING * ;  ";

console.log('professional_request_confirmation SQL :'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('professional_request_confirmation ERROR CENTER CREATION QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	  res.status(200).send(JSON.stringify(result));
	  console.log('professional_request_confirmation  SUCCESS INSERT ' ) ; 
    console.log('professional_request_confirmation  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})
})

//*** EMAIL to share Calendar *****/
//  01/02/2022
//****************************/
app.route('/professional_send_calendar_to_patient')
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
sql = "insert into send_calendar_patient ( email, calendar_id ) values ('"+req.body.email+"'  ,'"+req.body.calendar_id+"') RETURNING * ;  ";

console.log('professional_send_calendar_to_patient SQL :'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('professional_send_calendar_to_patient ERROR CENTER CREATION QUERY:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	  res.status(200).send(JSON.stringify(result));
	  console.log('professional_send_calendar_to_patient  SUCCESS INSERT ' ) ; 
    console.log('professional_send_calendar_to_patient  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
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
/*
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
*/

let center_code = " null " ;
if (req.body.form_appointment_center_code != null)
{
center_code = " '"+req.body.form_appointment_center_code+"' " ;
}


sql = "INSERT INTO professional_calendar (professional_id , start_time,  end_time, specialty1, duration, time_between, monday, tuesday, wednesday, thursday, friday, saturday , sunday, date_start, date_end,   center_id,  status , deleted_professional, color ) VALUES ( '"+req.body.professional_id+"',  '"+req.body.form_start_time+"' , '"+req.body.form_end_time+"', '"+req.body.form_specialty_id+"' , '"+req.body.form_app_duration+"' , '"+req.body.form_app_time_between+"' ,  '"+req.body.form_recurrency_mon+"' ,  '"+req.body.form_recurrency_tue+"'  ,  '"+req.body.form_recurrency_wed +"' ,  '"+req.body.form_recurrency_thu+"'  ,  '"+req.body.form_recurrency_fri+"'  , '"+req.body.form_recurrency_sat+"'  ,  '"+req.body.form_recurrency_sun+"'  ,   '"+req.body.form_calendar_start+"'  ,  '"+req.body.form_calendar_end+"'  ,   "+req.body.form_appointment_center_code+" , '1' , false , '"+req.body.form_calendar_color+"' )  " ;
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

// PROFESSIONAL DELETE CALENDAR 
app.route('/professional_delete_calendar')
.post(function (req, res) {
    console.log('professional_delete_calendar INPUT:', JSON.stringify(req.body) );
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

let sql = " UPDATE professional_calendar SET deleted_professional = true WHERE id = "+req.body.calendar_id+"  " ;

console.log('Professional delete calendar  SQL:'+sql ) ;
  
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('DELETE CALENDAR  ERROR:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	 // json_response = { result_status : 0  , center_id : result.data.center_id  };
	  res.status(200).send(JSON.stringify(result));
	  console.log('DELETE CALENDAR SUCCESS ' ) ; 
    console.log('DELETE CALENDAR OUTPUT :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})
  
})

// PROFESSIONAL UPDATE  CALENDAR 
app.route('/professional_update_calendar')
.post(function (req, res) {
    console.log('professional_update_calendar INPUT:', req.body );
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

let variables_sql = "" 

if (req.body.form_calendar_active !=null)
{ variables_sql = " active = "+req.body.form_calendar_active+" "  }
if (req.body.form_center_id !=null)
{ variables_sql =  variables_sql +" , center_id = "+req.body.form_center_id+"" }

if (req.body.form_date_start !=null)
{ variables_sql =  variables_sql +", date_start = '"+req.body.form_date_start+"'" }

if (req.body.form_date_end !=null)
{ variables_sql =  variables_sql +", date_end = '"+req.body.form_date_end+"'" }

if (req.body.form_time_start !=null)
{ variables_sql =  variables_sql +", start_time = '"+req.body.form_time_start+"'" }

if (req.body.form_time_end !=null)
{ variables_sql =  variables_sql +", end_time = '"+req.body.form_time_end+"'" }

if (req.body.form_day_mon !=null)
{ variables_sql =  variables_sql +", monday = '"+req.body.form_day_mon+"'" }

if (req.body.form_day_tue !=null)
{ variables_sql =  variables_sql +", tuesday = '"+req.body.form_day_tue+"'" }

if (req.body.form_day_wed !=null)
{ variables_sql =  variables_sql +", wednesday= '"+req.body.form_day_wed+"'" }

if (req.body.form_day_thu !=null)
{ variables_sql =  variables_sql +", thursday= '"+req.body.form_day_thu+"'" }

if (req.body.form_day_fri !=null)
{ variables_sql =  variables_sql +", friday= '"+req.body.form_day_fri+"'" }

if (req.body.form_day_sat !=null)
{ variables_sql =  variables_sql +", saturday= '"+req.body.form_day_sat+"'" }

if (req.body.form_day_sun !=null)
{ variables_sql =  variables_sql +", sunday = '"+req.body.form_day_sun+"'" }

if (req.body.form_color !=null)
{ variables_sql =  variables_sql +", color = '"+req.body.form_color+"' " }


let sql = " UPDATE professional_calendar SET "+variables_sql+"   WHERE id = "+req.body.calendar_id+"  " ;

console.log('Professional UPDATE calendar  SQL:'+sql ) ;
  
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('Update CALENDAR  ERROR:'+sql ) ;
	      console.log(err ) ;
	    }
	    else
	    {
	 // json_response = { result_status : 0  , center_id : result.data.center_id  };
	  res.status(200).send(JSON.stringify(result));
	  console.log('UPDATE CALENDAR SUCCESS ' ) ; 
    console.log('UPDATE  CALENDAR OUTPUT :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})
  

})

// PROFESIONAL GET APPOINTMENT DAY
app.route('/professional_get_appointments_day2')
.post(function (req, res) {
     console.log('professional_get_appointments_day2 : INPUT : ', req.body );
 
     let resp_app_available = get_appointments_available_professional(req.body);
     resp_app_available.then( v => {  console.log("RESPONSE: "+JSON.stringify(v)) ; return (res.status(200).send(JSON.stringify(v))) } )
     
})
 
// PROFESSIONAL CREATE CENTER 
app.route('/professional_create_center')
.post(function (req, res) {
    console.log('professional_create_center INPUT:', req.body );

  // ****** Connect to postgre
  const { Client } = require('pg')
  const client = new Client(conn_data)
  client.connect()
  // GET PROFESSIONAL DATA

var sql  = null;
var json_response = { result_status : 1 };
//var res = null; 	
// CHECK INPUT PARAMETERS TO IDENTIFY IF  REQUEST IS TO CREATE CENTER
// CREATE DIRECTLY AGENDA 

//INSERT APP TYPE  CENTER
if (req.body.app_type == 1 )
{
  let location = req.body.locations[0]
  sql = "INSERT INTO center ( name ,  address , phone1, phone2, comuna , center_visit, home_visit, remote_care, center_color , professional_id ) VALUES (  '"+req.body.name+"' , '"+req.body.address+"', '"+req.body.phone1+"' ,'"+req.body.phone2+"' ,"+location+" , true, false, false, '"+req.body.center_color+"' , '"+req.body.professional_id+"'  ) RETURNING  *";
}
//INSERT APP TYPE HOME VISIT
if (req.body.app_type == 2 )
{ 
  let comuna1 = null
  let comuna2 = null
  let comuna3 = null
  let comuna4 = null
  let comuna5 = null 
  let comuna6 = null 

  if (req.body.locations[0]!=null) { comuna1=req.body.locations[0] ;}
  if (req.body.locations[1]!=null) { comuna2=req.body.locations[1] ;}
  if (req.body.locations[2]!=null) { comuna3=req.body.locations[2] ;}
  if (req.body.locations[3]!=null) { comuna4=req.body.locations[3] ;}
  if (req.body.locations[4]!=null) { comuna5=req.body.locations[4] ;}
  if (req.body.locations[5]!=null) { comuna6=req.body.locations[5] ;}

  /*
  let comuna1 = null ;
  if (req.body.locations[0]!=null) { comuna1=req.body.locations[0] ;}
  let comuna2 = null ;
  if (req.body.locations[1]!=null) { comuna2=req.body.locations[1] ;}
  let comuna3 = null ;
  if (req.body.locations[2]!=null) { comuna3=req.body.locations[2] ;}
  let comuna4 = null ;
  if (req.body.locations[3]!=null) { comuna4=req.body.locations[3] ;}
  let comuna5 = null ;
  if (req.body.locations[4]!=null) { comuna5=req.body.locations[4] ;}
  let comuna6 = null ;
  if (req.body.locations[5]!=null) { comuna6=req.body.locations[5] ;}
  */
  
  sql = " INSERT INTO center ( name ,  phone1, phone2,  center_visit, home_visit, remote_care , home_comuna1, home_comuna2, home_comuna3, home_comuna4, home_comuna5, home_comuna6  , center_color , professional_id ) VALUES (  '"+req.body.name+"' ,  '"+req.body.phone1+"' ,'"+req.body.phone2+"' , false, true , false , "+comuna1+", "+comuna2+" , "+comuna3+" , "+comuna4+" , "+comuna5+" , "+comuna6+" , '"+req.body.center_color+"' ,'"+req.body.professional_id+"'  ) ;  ";
}
if (req.body.app_type == 3 )
{
  sql = " INSERT INTO center ( name , phone1, phone2, center_visit, home_visit, remote_care  , center_color , professional_id ) VALUES (  '"+req.body.name+"' ,  '"+req.body.phone1+"' ,'"+req.body.phone2+"' , false, false, true , '"+req.body.center_color+"' ,'"+req.body.professional_id+"' ) ;";
}


//const sql  = "INSERT INTO centers ( name ,  address , phone1, phone2 ) VALUES (  '"+req.body.center_name+"', '"+req.body.center_address+"' , '"+req.body.center_phone1+"', '"+req.body.center_phone2+"' ) RETURNING id " ;
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


// ********************************************************/
// ESTA FUNCION AL PARECER NO SE USA CANDIDATA A ELIMINAR 23-03-2023
// TIENE UN CICLO DE CREACION QUE AL PARECER ES ANTIGUO YA DEPRECADO
// PPROFESSIONAL CREATE APPOINTMENT SIN S
//****************************************************** */
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

// ********************************************************/
// ESTA FUNCION AL PARECER NO SE USA CANDIDATA A ELIMINAR 23-03-2023
// TIENE UN CICLO DE CREACION QUE AL PARECER ES ANTIGUO YA DEPRECADO
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


// PROFESSIONAL GET CENTERS
app.route('/professional_get_data')
.post(function (req, res) {
 
    console.log('professional_get_data :', req.body );
 
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
const sql  = "SELECT * FROM professional WHERE id = '"+req.body.professional_id+"' " ;
console.log('pprofessional_get_data: SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('professional_get_data ERR:'+err ) ;
    }

  console.log('RESPONSE professional_get_data : '+JSON.stringify(result.rows[0]) ) ;
  res.status(200).send(JSON.stringify(result.rows[0]) );
  client.end()
})

})


//***************************************************************
//********                                      *****************
//******** PATIENT PUBLIC GET PROFESSIONAL CALENDARS   **********
//********                                      *****************
//***************************************************************

// PROFESSIONAL GET TimeTable
app.route('/patient_get_professional_calendars')
.post(function (req, res) {
 
    console.log('patient_get_professional_calendars :', req.body );
 
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
//const sql  = "SELECT * FROM professional_calendar WHERE professional_id='"+req.body.professional_id+"' ORDER BY id DESC " ;

const sql  = "SELECT * FROM (SELECT *, id AS calendar_id, active as calendar_active FROM professional_calendar WHERE professional_id='"+req.body.professional_id+"' AND  deleted_professional = false )j   LEFT JOIN  center ON   j.center_id = center.id  ORDER BY j.id ASC  " ;

console.log('patient_get_professional_calendars: SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('patient_get_professional_calendars ERR:'+err ) ;
    }

  console.log('patient_get_professional_calendars RESULT : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end() ;
})

})


//*******************************************************************************
//*******************************************************************************
//********   PROFESSIONAL WEB SITE    publicSiteProfessional    *****************
//*********                                                     *****************
//********  professional_pwsite_get_calendar                    *****************
//********                                                      *****************
//*******************************************************************************
//*******************************************************************************

// PROFESSIONAL GET TimeTable
app.route('/professional_pwsite_get_calendar')
.post(function (req, res) {
 
  console.log('professional_pwsite_get_calendar :', req.body );
  
  let json_response=professional_pwsite_get_calendar(req)

  json_response.then( v => {  console.log("professional_pwsite_get_calendar RESPONSE: "+JSON.stringify(v)) ; return (res.status(200).send(JSON.stringify(v))) } )
    
})

async function professional_pwsite_get_calendar(req)
{ 
  
  let professional_data = await get_professional_public_data(req.body.professional_id)
  let calendar_data = await get_calendar_data(req.body.calendar_id)
  
  let center_data = []
  if (calendar_data != null && calendar_data.length > 0  )
  {
  center_data = await get_center_data( calendar_data[0].center_id  )
  }
  
  let specialties = await get_specialties()
  let locations = await get_locations()

  let jsonresp = {
            professional_data : professional_data[0],
            calendars : calendar_data ,
            centers : center_data ,
            specialties : specialties ,
            locations : locations ,
                }

  return jsonresp 
}

async function get_professional_public_data(id)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
  //console.log("ids:"+ids+" dates:"+dates)

  const pdata  = "SELECT name FROM professional WHERE id ="+id+" ";
  console.log("SQL QUERY: "+pdata)
  const res = await client.query(pdata)
  client.end() 
  return res.rows;
}

async function get_calendar_data(id)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
  //console.log("ids:"+ids+" dates:"+dates)

  const cdata  = "SELECT * FROM professional_calendar WHERE id ="+id+" ";
  console.log("SQL QUERY: "+cdata)
  const res = await client.query(cdata)
  client.end() 
  return res.rows;
}

async function get_center_data(id)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
  //console.log("ids:"+ids+" dates:"+dates)

  const centerdata  = "SELECT * FROM center WHERE id ="+id+" ";
  console.log("SQL QUERY: "+centerdata)
  const res = await client.query(centerdata)
  client.end() 
  return res.rows;
}

async function get_specialties()
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
  //console.log("ids:"+ids+" dates:"+dates)

  const centerdata  = "SELECT * FROM specialty ";
  console.log("SQL QUERY: "+centerdata)
  const res = await client.query(centerdata)
  client.end() 
  return res.rows;
}

async function get_locations()
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
  //console.log("ids:"+ids+" dates:"+dates)

  const centerdata  = "SELECT * FROM comuna ";
  console.log("SQL QUERY: "+centerdata)
  const res = await client.query(centerdata)
  client.end() 
  return res.rows;
}

//****************************************************************************
//********   PROFESSIONAL WEB SITE   publicSiteProfessional         **********
//********        GET CALENDAR                                      **********
//********  professional_pwsite_get_appointments_calendar           **********
//********                                                          **********
//****************************************************************************
//****************************************************************************
app.route('/professional_pwsite_get_appointments_calendar')
.post(function (req, res) {
 
  console.log('professional_pwsite_get_appointments_calendar INPUT :', JSON.stringify(req.body) );
  
  let json_response=professional_pwsite_get_appointments_calendar(req.body)

  json_response.then( v => {  console.log("----------------------------  professional_pwsite_get_appointments_calendar RESPONSE: "+JSON.stringify(v)) ; return (res.status(200).send(JSON.stringify(v))) } )   
})


async function professional_pwsite_get_appointments_calendar(params)
{
  let days_list = []
  let lock_days = []
  let days_list_filtered = []
  
  let json_response = {
    appointments : [] ,
    other : "bbbb",
        }
  

  console.log(" professional_pwsite_get_appointments_calendar "+JSON.stringify(params) );
  //let apps = await get_appointments_available_from_calendar( [params.calendar_id], params.date ,true )
  // 1.- GET CALENDAR DATA
  let calendar_data = await get_calendar_data(params.calendar_id)
  console.log("calendar_data = "+JSON.stringify(calendar_data))
  
  // 2.- GET LOCK DAYS PROFESSIONAL
  lock_days = await get_professional_lock_days(calendar_data[0].professional_id)
  console.log("LOCK DAYS:"+JSON.stringify(lock_days))

  // 3.- HOW MANY DAYS in PUBLIC CALENDAR SEARCH  40 ???
  let aux_date = new Date(params.date) 
   for (let i = 1; i < 40 ; i++) {
    days_list.push( new Date( aux_date.getTime()+ ((1000*60*60*24)*i)) ) 
  }
  
  // FILTER DAYS ONLY IF ACTIVE IN CALENDAR 
  let day_cal_start = new Date(calendar_data[0].date_start)
  let day_cal_end   = new Date(calendar_data[0].date_end  )
  
  for (let i = 0; i < days_list.length; i++) {
    
      let day_eval = new Date(days_list[i])
      //check if day[i] is in BLockDays list
      const lock_date_found = lock_days.find(elem => (new Date(elem.date).getDate() ==  day_eval.getDate() && new Date(elem.date).getMonth() ==  day_eval.getMonth() && new Date(elem.date).getFullYear() ==  day_eval.getFullYear()     ));
   
      //let findInBlockedDays = lock_days.find(elem => Date(elem.date).getTime() ==  Date(day_eval).getTime()  )

      if ( day_cal_start.getTime() < day_eval.getTime() && day_eval.getTime()  < day_cal_end.getTime() && lock_date_found== undefined  )   
      {
      // let lockDates_aux = await is_professional_lock_day(calendars[i].professional_id , date.toISOString()  );
       
        console.log("lock_date_found:"+lock_date_found+"    day_cal_start.getTime()"+day_cal_start.getTime()+" < day_eval.getTime()"+day_eval.getTime()+" <  day_cal_end.getTime()"+day_cal_end.getTime() )
        days_list_filtered.push(day_eval)
      }   
  }

  // FILTER FROM BLOCKER DAYS  


  //********************************************************* */
  
  for (let i = 0; i < days_list_filtered.length; i++) {
    // console.log("-----------Day to get:"+days_list[i])
      let app_calendars = calendar_cutter_day( calendar_data[0] , days_list_filtered[i] )
      //LOOK FOR APPOINTMENT RESERVED FOR THIS DAY PROFESSIONAL ID and DAY
      let appointments_reserved = await get_professional_appointments_by_date(calendar_data[0].professional_id , days_list_filtered[i] , days_list_filtered[i] )     
      let app_calendar_filtered = filter_app_from_appTaken(app_calendars,appointments_reserved)

    let day_apps_aux = 
        { date : days_list_filtered[i] , 
          appointments : app_calendar_filtered
        } 
    json_response.appointments.push(day_apps_aux)

    }

    /*
    let aux_appointments = await get_public_appointments_available_of_a_day(json.specialty , days_list[i], json.location, json.type_center, json.type_home, json.type_remote ) //type_center,type_home,type_remote
     //console.log("-----------Appointments:"+JSON.stringify(aux_appointments))
            let aux_app_day = {
              date : days_list[i] ,
              appointments : aux_appointments.appointments ,
              centers: aux_appointments.centers  ,
              calendars : aux_appointments.calendars  ,
            } 

     json_response.appointments.push(aux_app_day)    
    */
  /*
  let aux_date_start = new Date(params.date) 
  let aux_date_end = new Date(aux_date_start.getTime()+( (1000*60*60*24)* 40 ) )
  let appointments_reserved = await get_professional_appointments_by_date( params.professional_id , aux_date_start , aux_date_end )
  */  
  
  console.log("--------------------------- professional_pwsite_get_appointments_calendar response "+JSON.stringify(json_response ) );
 
  return json_response 
 
}

//***************************************************************
//***************************************************************
//***************************************************************
//***************************************************************


//********************************************* 
// PUBLIC POST TAKE APPOINTMENT removed 23-03-2023
//********************************************* 
/*
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
*/

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
// candaidata a eliminar  al parecer ya no la usamos 23-03-2023
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
client.end()
 
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
client.end()
 
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


//**************************************************************** */
// **********  PUBLIC PATIENT SEARCH *****************************
//**************************************************************** */

//called from Both
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
  console.log("SQL QUERY: "+sql_apps_taken)
  const res = await client.query(sql_apps_taken)
  client.end() 
  return res.rows;

}

//called from  professional_get_appointment_day2
async function get_appointments_available_professional(json)
{
  console.log("get_appointments_available_professional INPUT:"+json);
  
  let professional_ids = [] ;
  professional_ids.push(json.professional_id);
  
  let dates = [] ;
  let appointments_available = [] ; 
  
  // 1.-  CALENDARS 
  let calendars = await get_calendars_available_professional(json)
  console.log('1.- GET CALENDARS PROFESSIONAL Match with Search Parameters Total:'+calendars.length );
  console.log ("1.- CALENDARS  FOUND : "+JSON.stringify(calendars));
  //extract professional ids from Calendars
  /*
  for(var i=0; i<calendars.length; i++){
    professional_ids.push(calendars[i]['professional_id']);
  }
  */

  professional_ids = professional_ids.sort().filter(function(item, pos, ary) {
    return !pos || item != ary[pos - 1];
    });
  console.log('Professional Ids:'+professional_ids );
  
  //filtrar para no tener ids repetidos. 
  //MUST ELIMINATE DUPLICATED IDs 
   dates.push(json.date);

   // 2.-  APPOINTMENTS TAKEN
  let appointment_id_filtered = await get_professional_appointment_day(professional_ids,dates)
  console.log("APPOINTMENTS FOUND Professional IDs"+professional_ids +" Dates"+dates);

//INSER APPOINTMENTS

// get appointments reserved 
  if (appointment_id_filtered.length > 0) 
  {
        for (let i = 0; i < appointment_id_filtered.length; i++) {

        //GET COLOR
        let message1 = null
        let cal_color =  calendars.find(cal => cal.calendar_id === appointment_id_filtered[i].calendar_id) ;
        let aux_color = '#EEE' ;

        if (cal_color != null)
         {
           aux_color = cal_color.color ; 
         }
         else
         {
            message1 ="" ; 
         }
         //console.log (" painting appointment taken (Cal:id:"+appointment_id_filtered[i].calendar_id+"):   CALENDAR FOUND : "+ calendars.find(cal => cal.calendar_id === appointment_id_filtered[i].calendar_id).color );
         //console.log (" ********************************************************************************** "); 
        
          let appointment_taken = {
                 calendar_id : appointment_id_filtered[i].calendar_id , 
                 id :  appointment_id_filtered[i].id ,
                 date :appointment_id_filtered[i].date ,
                 start_time :  appointment_id_filtered[i].start_time , 
                 duration : appointment_id_filtered[i].duration ,
                 patient_doc_id : appointment_id_filtered[i].patient_doc_id ,
                 patient_name : appointment_id_filtered[i].patient_name ,
                 patient_email : appointment_id_filtered[i].patient_email ,
                 patient_phone1 : appointment_id_filtered[i].patient_phone1 ,
                 patient_phone2 : appointment_id_filtered[i].patient_phone2 ,
                 app_status : appointment_id_filtered[i].app_status , 

                 patient_notification_email_reserved : appointment_id_filtered[i].patient_notification_email_reserved ,
                 patient_address : appointment_id_filtered[i].patient_address , 
                 patient_age  : appointment_id_filtered[i].patient_age ,  
                 specialty1 : appointment_id_filtered[i].specialty_reserved , 
            
                  home_visit : appointment_id_filtered[i].app_type_home ,
                  center_visit :appointment_id_filtered[i].app_type_center ,
                  remote_care :appointment_id_filtered[i].app_type_remote ,
            
                  center_id :appointment_id_filtered[i].center_id ,
              //    center_name :calendars[i].center_name ,
              //    center_address :calendars[i].center_address ,
              //    status : appointment_id_filtered[i].status  ,
                  //start_time : "0"+aux_date.getHours()+":0"+aux_date.getMinutes() , 
                  //new String(new char[width - toPad.length()]).replace('\0', fill) + toPad;
                  center_color :  aux_color  ,
                  calendar_color : aux_color ,
                  app_available : appointment_id_filtered[i].app_available ,
                  message1 : message1 
                }

          appointments_available.push(appointment_taken);
        }
  }


// CALENDAR CUTTER  
  for(var i=0; i<calendars.length; i++){
      
        let aux_date_start = new Date(calendars[i].date_start) ; 
        let aux_date_end = new Date(calendars[i].date_end) ;
    
        let aux_start_time = new Date ('Thu, 01 Jan 1970 '+calendars[i].start_time ).getTime();
        let aux_end_time = new Date ('Thu, 01 Jan 1970 '+calendars[i].end_time ).getTime();      

        let total_available_time =  aux_end_time  - aux_start_time ; 
        let app_duration =  (( parseInt(calendars[i].duration) + parseInt(calendars[i].time_between) ) * 60 * 1000 ) ;
        let app_total_slots = total_available_time / app_duration ;
        console.log("CALENDAR TOTAL DRAFT slots TO CREATE:"+ app_total_slots+"   FOR PROFESSIONAL ID:"+calendars[i].professional_id )
       
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
                          center_id :calendars[i].center_id ,
                          center_name :calendars[i].center_name ,
                          center_address :calendars[i].center_address ,

                          remote_care :calendars[i].remote_care ,

                          status : calendars[i].status  ,
                          //start_time : "0"+aux_date.getHours()+":0"+aux_date.getMinutes() , 
                          start_time :  aux_date.getHours().toString().padStart(2, '0')+":"+aux_date.getMinutes().toString().padStart(2, '0') , 
                          //new String(new char[width - toPad.length()]).replace('\0', fill) + toPad;
                          center_color : calendars[i].center_color ,
                          calendar_color : calendars[i].calendar_color ,

                        }

                      start_time_slot +=  app_duration ;  
                      //console.log("--> DRAFT SLOT "+x+"/"+app_total_slots+" Start_Time: "+appointment_slot.start_time+" Duration:"+appointment_slot.duration +" Color:"+appointment_slot.color );
                      let aux_date_slot= new Date ('Thu, 01 Jan 1970 '+appointment_slot.start_time ).getTime();
                      //CHECK IF time is taken
                      /*
                      if (appointments_available[0] != null)
                      {
                      console.log("-------------> COMPARISON  APP:"+appointments_available[0].start_time + " CALENDAR:"+appointment_slot.start_time)
                      }
                      */
                     let aux = appointments_available.find( x => x.start_time.substring(0,4) === appointment_slot.start_time.substring(0,4) ) ;
                     
                     if (aux != null)
                     {
                     console.log ("-----------MATCH : "+aux.start_time.substring(0,4)  )
                        //skip the push because there is a appointment before taken at same tiem
                        if ( aux.app_status != null )
                        {
                            //skip
                        }
                        else{
                          appointments_available.push(appointment_slot)
                        }
                     // appointments_available.find( x => x.start_time.substring(0,4) === appointment_slot.start_time )
                     }
                     else
                     {
                      appointments_available.push(appointment_slot)
                     }

                      /*
                      let found = appointment_id_filtered.find( x => x.start_date.substring(0,4) === appointment_slot.start_time.substring(0,4) )
                        if (found != null)
                        {
                          console.log("----------> MATCH "+x.start_date);
                        }
                        else{
                          console.log("---------->NO MATCH");
                        }
                        */
     
                    }

             } // END FOR CYCLE CALENDARS

  appointments_available.sort(function(b, a){ return (new Date('Thu, 01 Jan 1970 '+b.start_time) - new Date('Thu, 01 Jan 1970 '+a.start_time )) } ) 
                  
  console.log ("Calendar Cutter result ("+appointments_available.length+") Appointments to display :"+JSON.stringify(appointments_available));
 
  return  appointments_available ;

}

async function get_calendars_available_professional(json)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
    
  //END IF LOCATION
   const sql_calendars  = "SELECT * FROM (SELECT name AS center_name, address AS center_address, * FROM (  SELECT name AS professional_name , calendar_id, calendar_color ,professional_id, start_time, end_time, specialty1, duration, time_between, monday, tuesday, wednesday, thursday, friday, saturday, sunday, date_start, date_end , status, center_id, phone AS professional_phone, color  FROM (SELECT id as calendar_id , color as calendar_color, *  FROM professional_calendar WHERE  active = true  AND date_start <= '"+json.date+"'  AND date_end >= '"+json.date+"'  AND start_time  >= '00:00:00' AND  professional_id = '"+json.professional_id+"' AND deleted_professional = false ) C  LEFT JOIN professional ON C.professional_id = professional.id )     K LEFT JOIN center ON  k.center_id = center.id )J  " ; 

   console.log("get_calendars_available_professional SQL: "+sql_calendars);
  //console.log ("QUERY GET CALENDAR = "+sql_calendars);
  const res = await client.query(sql_calendars) 
  client.end() 
  return res.rows ;
  
}

//***************************************************** */
//**********       PROFESSIONA LOGIN            ******* */
//**********                                   ******** */
//***************************************************** */
app.route('/professional_login')
.post(function (req, res) {
  console.log ("professional_login REQUEST",req.body);

  if (req.body["form_email"]  && req.body["form_pass"] )
  {
    let json_response = access_login(req)
    json_response.then( v => {  console.log("professional_login RESPONSE: "+JSON.stringify(v)) ; return (res.status(200).send(JSON.stringify(v))) } )
    //res.status(200).send(JSON.stringify(json_response));
    //console.log('professional_login RESPONSE  :'+JSON.stringify(json_response) ) ;
  }
  else
  {
    let json_response_error = { 
      professional_id: null , 
      result_code: 3 ,
      professional_name: null ,
      token : null ,
      first_time : null,
                  };
    return (res.status(200).send(JSON.stringify(json_response_error))) 
  }
})

async function access_login(req)
{
  console.log("access_login REQUEST") ; 
  //1- Get login data
  let login_data = await get_access_login(req)
  console.log("access_login ESPONSE "+JSON.stringify(login_data)) ;
  //get response centers 
  //2.- Get Centers
  if (login_data.result_code == 0)
  {
  let response_centers = await get_professional_centers(login_data.professional_id);
  //add centers to login_data
  login_data =  { ...login_data ,  centers : response_centers };  
  }
  //3.- Get CALENDARS
  if (login_data.result_code == 0)
  {
  let response_calendars = await get_professional_calendars(login_data.professional_id);
  //add centers to login_data
  login_data =  { ...login_data ,  calendars : response_calendars };  
  }
    
  
  return login_data
}

async function get_access_login(req)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
    
  const sql = "INSERT INTO session (name, user_id,last_login , last_activity_time , user_type , first_time ,tutorial_start, tutorial_center, tutorial_calendar, tutorial_menu ) SELECT   name, user_id , now() as last_login ,now() as last_activity_time, 1 as user_type , first_time ,tutorial_start, tutorial_center, tutorial_calendar, tutorial_menu  FROM (SELECT * FROM (SELECT * FROM professional WHERE email ='"+req.body.form_email+"' )P LEFT JOIN account ON P.id = account.user_id) J WHERE j.pass = '"+req.body.form_pass+"'   RETURNING * ";
  console.log('professionalLogin SQL:'+sql ) ;
  //set default error
  var json_response = {  professional_id: null , result_code : 33 };
  const result = await client.query(sql) 
  //IF SUCCESS FOUND USER
  if (result.rows.length>0 )
  {
  json_response = { 
          professional_id: result.rows[0].user_id , 
          result_code: 0 ,
          professional_name: result.rows[0].name ,
          token : result.rows[0].id,
          first_time : result.rows[0].first_time,
          tutorial_start : result.rows[0].tutorial_start,
          tutorial_center : result.rows[0].tutorial_center,
          tutorial_calendar : result.rows[0].tutorial_calendar,
          tutorial_menu : result.rows[0].tutorial_menu,
    };
  }
  

  client.end() 
  return json_response ;

}

//***************************************************** */
//********** PROFESSIONAL SEND COMMENTS HELP    ******* */
//**********                                   ******** */
//***************************************************** */

app.route('/professional_send_comments')
.post(function (req, res) {
  console.log('professional_send_comments  REQUEST : ', req.body );

// ****** Connect to postgre
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect()

// ****** Run query to bring appointment
const sql = "INSERT INTO customers_messages (professional_id, message , animo ) VALUES ("+req.body.professional_id+", '"+req.body.message+"', '"+req.body.animo+"') "
//const sql  = "SELECT * FROM center where id IN ( "+req.body.centers_ids+" )  " ;
console.log('SQL professional_send_comments : '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log(' ERROR QUERY = '+sql ) ;
      console.log(' ERR = '+err ) ;
    }

  if (result !=null)
  {
  console.log('RESULT professional_send_comments '+JSON.stringify(result.rows) ) ;
  res.status(200).send(JSON.stringify(result.rows) );
  }
  else
  {
    res.status(200).send( null ) ;
  }
  
  client.end()
})


})


//***************************************************** */
//********** PUBLIC GET CENTERS ARRAY from ids  ******* */
//**********                                   ******** */
//***************************************************** */
app.route('/common_get_centers')
.post(function (req, res) {
  console.log('common_get_centers REQUEST : ', req.body );
 
// ****** Connect to postgre
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect()

// ****** Run query to bring appointment
const sql  = "SELECT * FROM center where id IN ( "+req.body.centers_ids+" )  " ;
console.log('SQL common_get_centers : '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log(' ERROR QUERY = '+sql ) ;
      console.log(' ERR = '+err ) ;
    }

  if (result !=null)
  {
  console.log('GET common_get_centers '+JSON.stringify(result.rows) ) ;
  res.status(200).send(JSON.stringify(result.rows) );
  }
  else
  {
    res.status(200).send( null ) ;
  }
  
  client.end()
})

})

//***************************************************** */
//************* PUBLIC SEARCH   *********************** */
//******* PUBLIC APPOINTMENTS IN CALENDAR ID ********** */
//***************************************************** */
//PATIENT GET APPOINTMENTS  SEARCH BY CALENDAR
app.route('/patient_get_appointments_calendar')
.post(function (req, res) {
 
    console.log('patient_get_appointments_calendar : INPUT : ', req.body );
    //get Appointments and remove the lock days from the response adding true to last parameter. 
    let calendars = [req.body.cal_id]
    let appointments_available = get_appointments_available_from_calendar(calendars,req.body.date,true  ) ;

    appointments_available.then( v => {  console.log("patient_get_appointments_calendar  RESPONSE: "+JSON.stringify(v)) ; return (res.status(200).send(JSON.stringify(v))) } )
})
// CALLED FROM PUBLIC CALENDAR VIEWS
async function get_appointments_available_from_calendar(cal_ids, date_start,remove_lock_days )
{
  // 1.- get Calendar
  let calendars = await get_calendar_available_by_id(cal_ids) ;
  console.log("patient_get_appointments_calendars : INPUT"+JSON.stringify(calendars));
  // 2.- get Professional Appointment
  // 
  let appointments_reserved = await get_professional_appointments_by_date( calendars[0].professional_id , date_start , '2023-06-04')
  console.log("get_professional_appointments_by_date : OUTPUT "+JSON.stringify(appointments_reserved));
 
  // 3.- GET Lock Dates
  let lockDates = await get_professional_lock_days(calendars[0].professional_id);
  lockDates = lockDates.map(lockDates => (new Date(lockDates.date) )) ;
  console.log("getLockDays:"+JSON.stringify(lockDates));

  // 4.- cutter calendar from date, remove_lock_days = true
  // calendar_cutter(calendar, fromDate ,endDate ,lockDates, remove_lock_days )
  let app_calendar = calendar_cutter(calendars[0],date_start, null , lockDates, remove_lock_days );
  let app_calendar_filtered = filter_app_from_appTaken(app_calendar,appointments_reserved)

  return(app_calendar_filtered); 
}

//***************************************************** */
//****************    VIEW       ********************** */
//********** GET DATA FOR PROFESSIONAL CALENDARS VIEW * */
//***************************************************** */

// PROFESSIONAL GET CALENDARS
app.route('/professional_get_data_for_calendars_view')
.post(function (req, res) {
console.log('professional_get_data_for_calendars_view :', req.body );

let response = professional_get_data_for_calendars_view(req.body);
response.then( v => {  console.log("professional_get_data_for_calendars_view  RESPONSE: "+JSON.stringify(v)) ; return (res.status(200).send(JSON.stringify(v))) } )
})
// ASYNC Function  PROFESSIONAL GET CALENDARS
async function professional_get_data_for_calendars_view(json)
{
  
  let professional_calendars = []
  professional_calendars = await get_professional_calendars(json.professional_id)
  
  let professional_centers = []
  professional_centers = await get_professional_centers(json.professional_id)

  let json_response = {
    calendars : professional_calendars ,
    centers : professional_centers
    }

    return json_response
}

//******************************************************** */
//**********                                      ******** */
//**********      PUBLIC SEARCH Main Page Public  ******** */
//**********          PUBLIC APPOINTMENTS         ******** */
//**********                21/12/2022            ******** */
//******************************************************** */

app.route('/patient_get_appointments_generic')
.post(function (req, res) {
    console.log('patient_get_appointments_generic : INPUT : ', req.body );
    //res.status(200).send(JSON.stringify( get_appointments_available(req.body)));
    let resp_app_available = get_public_appointments_available(req.body);
    resp_app_available.then( v => {  console.log("patient_get_appointments_generic  RESPONSE: "+JSON.stringify(v)) ; return (res.status(200).send(JSON.stringify(v))) } )
})

async function get_public_appointments_available(json)
{
  let date =new Date(json.date) ;
  date.setHours(0,0,0,0)

   //*********** response message *********/
   let json_response = {
    appointments_list: [] , //here we put the appointments object
    }
  //*********************************** */   

   // DAYS CICLE
   let days_list = []
  //days_list.push(date)
    
  // HOW MANY DAYS  40 ???
   for (let i = 1; i < 40 ; i++) {
    days_list.push(new Date(date.getTime()+( (1000*60*60*24)*i ) ) )
  }

  // console.log("-----------Days to search:"+days_list)

   for (let i = 0; i < days_list.length; i++) {
    // console.log("-----------Day to get:"+days_list[i])
     let aux_appointments = await get_public_appointments_available_of_a_day(json.specialty , days_list[i], json.location, json.type_center, json.type_home, json.type_remote ) //type_center,type_home,type_remote
     //console.log("-----------Appointments:"+JSON.stringify(aux_appointments))
            let aux_app_day = {
              date : days_list[i] ,
              appointments : aux_appointments.appointments ,
              centers: aux_appointments.centers  ,
              calendars : aux_appointments.calendars  ,
            } 

     json_response.appointments_list.push(aux_app_day)    
    }

   //console.log("-----------GET PUBLIC APPOINTMENTS AVAILABLE JSON Response :"+JSON.stringify(json_response))
   return (json_response)
}

async function get_public_appointments_available_of_a_day(specialty, date_to_get,location,type_center,type_home,type_remote)
{
    //************************************* */
    let date =new Date(date_to_get) ;
    date.setHours(0,0,0,0)

    let is_lock_day=false ; 
    let calendars_ids = [] ;
    let professional_ids = [] ;

    let centers_ids = [] ;
    let centers = [] ;
    //*********** response message *********/
      let json_response = {
            appointments :  [] ,
            centers : [] ,
            calendars : [] ,
              }
    //*********************************** */    
  
    // **************************************************
    // 1.-  GET CALENDAR AVAILABLE BY DATE & SPECIALTY  
    // **************************************************
     let calendars = await get_calendars_available_by_date_specialty(date.toISOString(),specialty)
     if (calendars.length <= 0 )
     {
       return []
     }
     //extract Calendard Ids
     calendars_ids = calendars.map(val => val.id)
     console.log("calendars_ids: "+calendars_ids);
     //extract Professional_Ids
     professional_ids = calendars.map(val => val.professional_id)
     console.log("Professional_ids: "+professional_ids);
     //extract Center_Ids
     centers_ids = calendars.map(val => val.center_id)
  
    // *********************************************************************
    // 2.-  GET CENTERS belong to professional IDs obtained from calendars  
    // *********************************************************************
    centers = await get_public_centers(centers_ids)

    // *********************************************************************
    // 2.1 - FILTER CENTERS only MATCH WITH type_center,type_home,type_remote  
    // *********************************************************************
    if (type_center)
    { console.log("Filter Center Active :"+JSON.stringify(centers))
      centers =  centers.filter(center =>  center.center_visit == 1 ) 
    }
    if (type_home)
    { console.log("Filter Home Active :"+JSON.stringify(centers))
      centers =  centers.filter(center =>  center.home_visit == 1 ) 
    }
    if (type_remote)
    { console.log("Filter REMOTE CARE Active :"+JSON.stringify(centers))
      centers =  centers.filter(center =>  center.remote_care == 1 ) 
    }

    let centers_ids_filtered = centers.map(val => val.id)
    console.log("Centers : "+JSON.stringify(centers))
        
    // *********************************************************************
    // 3.- REMOVE CALENDARS LINKED TO DELETED CENTERS
    //**********************************************************************
    //filter CALENDARS have only active centers.
    calendars =  calendars.filter(cal =>  centers_ids_filtered.includes(cal.center_id) ) 
    //**********************************************************************
    
    // *********************************************************************
    // 4.- REMOVE CALENDARS NOT MATCH with Search Parameters 
    //**********************************************************************
    // remove CALENDARS not match with Location parameter search
    if ( location != null )
    {
      console.log("Location filter TRUE "+location);
      //Reduce centers list based in LOCATION
      centers = centers.filter(obj => 
          (location == obj.comuna || location == obj.home_comuna1 || location == obj.home_comuna2 || location == obj.home_comuna3 || location == obj.home_comuna4 || location == obj.home_comuna5 || location == obj.home_comuna6  )  );
      //regenerate center ids list
      centers_ids = centers.map(val => val.id)
      console.log("Centers IDS Filtered by LOCATION : "+JSON.stringify(centers_ids))  
      calendars = calendars.filter( calendar  =>  centers_ids.includes(calendar.center_id) )
      console.log("calendars Filtered by LOCATION: "+JSON.stringify(calendars));
      calendars_ids = calendars.map(val => val.id)
      console.log("calendars_ids Filtered by LOCATION: "+calendars_ids);
      professional_ids = calendars.map(val => val.professional_id)
    }
    console.log("calendars Filtered by LOCATION LATER: "+JSON.stringify(calendars));
    //*************************************** */
  
    // *********************************************************************
    // 5.- REMOVE DUPLICATED PROFESSIONAL IDS  
    //**********************************************************************
    professional_ids = professional_ids.sort().filter(function(item, pos, ary) {
      return !pos || item != ary[pos - 1];
      });
    console.log("Professional_ids NO DUP: "+professional_ids);
    //***********************************************************************
    //SUMMARY
    //console.log("Public Search :"+JSON.stringify(json));
    console.log("Calendars MATCH Search parameters : "+calendars_ids);
    console.log("Professional IDS in Calendars: "+professional_ids);
    
    // *********************************************************************
    // 6.- CYCLE CUTTING CALENDARS FOUND   
    //**********************************************************************
    // let app_calendars = [] 
    //  let lockDates = [] 
   
    let app_calendar_filtered = []
  
    for (let i = 0; i < calendars.length; i++) {
      // *********************************************************************
      // 6 - 1  GET PROFESSIONAL LOCK DAYS    
      //**********************************************************************
        let lockDates_aux = await is_professional_lock_day(calendars[i].professional_id , date.toISOString()  );
        if (lockDates_aux  != null && lockDates_aux.length >= 1 )
        {
          console.log("IS A DAY BLOCK !!! Calendar:"+calendars[i].id+" Skip Calendar");
          continue;
        }
      
      let app_calendars = calendar_cutter_day(calendars[i] ,date )
           
      //get appointments already reserved by professional id belong this calendar.

        // *********************************************************************
        // 6 - 4  FILTER APPS AVAILABLE FROM APP TAKEN     
        //**********************************************************************
        //first set day end
        let aux_date_start = new Date(date)
        aux_date_start.setHours(0,0,0,0)
        let aux_date_end = new Date( aux_date_start.getTime()  + (1000*60*60*24) )
        let appointments_reserved = await get_professional_appointments_by_date( calendars[i].professional_id , aux_date_start , aux_date_end )
      
        let apps_removed_reserved = filter_app_from_appTaken(app_calendars ,appointments_reserved, false )
        //******************************************************************** */
      
        //finally concat the result
        app_calendar_filtered = app_calendar_filtered.concat(apps_removed_reserved)
      }
      //END 6 CYCLE
     
      // *********************************************************************
      // 7 - SORT BY DATE TIME     
      //**********************************************************************  
      app_calendar_filtered.sort((a, b) => a.start_time - b.start_time) 
      //console.log("PUBLIC SEARCH Response DATE:"+date+"  APPOINTMENTS:"+JSON.stringify(app_calendar_filtered));
      
      //json_response.date = date
      json_response.appointments = app_calendar_filtered
      json_response.centers = centers
      json_response.calendars = calendars
      //json_response.specialties = 
       
      //return  app_calendar_filtered ;
      //console.log("get_public_appointments_available_of_a_day"+JSON.stringify(json_response))
      return  json_response ;
}

// 1.-  PUBLIC GET CALENDARS 
async function get_calendars_available_by_date_specialty(date,specialty)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
 
  const sql_calendars  = "SELECT * FROM professional_calendar WHERE specialty1 = "+specialty+" AND  active = true AND deleted_professional = false AND status = 1  AND date_start <= '"+date+"'  AND date_end >= '"+date+"'  " ;  

  console.log("PUBLIC get_calendars_available_by_date_specialty  SQL:"+sql_calendars) 
  
  //console.log ("QUERY GET CALENDAR = "+sql_calendars);
  const res = await client.query(sql_calendars) 
  client.end() 
  return res.rows ;
}

// 2.- PROFESSIONAL GET APPOINTMENT DAY
// Return appointments taken in DATE belong to a PROFESSIONAL ID
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
  console.log("SQL QUERY: "+sql_apps_taken)
  const res = await client.query(sql_apps_taken)
  client.end() 
  return res.rows;

}

// GET CENTERS DATA
async function get_public_centers(center_ids)
{
  console.log('get_public_centers  REQUEST : ', center_ids );
 
  // ****** Connect to postgre
  const { Client } = require('pg')
  const client = new Client(conn_data)
  client.connect()
  
  // ****** Run query to bring appointment
  const sql  = "SELECT * FROM center WHERE id IN ("+center_ids+" ) and center_deleted != true" ;
  console.log('SQL get_public_centers  : '+sql ) ;
  console.log("SQL QUERY: "+sql)
  const res = await client.query(sql)
  client.end() 
  return res.rows;
}

//************************************************************* */
//************************************************************* */
//********** PROFESSIONAL GET ALL APPOINTMENTS TAKEN    ******* */
//**********                                           ******** */
//************************************************************* */

app.route('/professional_get_appointments_taken')
.post(function (req, res) {  
  let appsTaken = professional_get_appointments_taken(req)
  appsTaken.then( v => {  console.log("professional_get_appointments_taken RESPONSE: "+JSON.stringify(v)) ; return (res.status(200).send(JSON.stringify(v))) } )

})

async function professional_get_appointments_taken(req)
{
  let app_taken = await professional_get_all_appointments_by_prof_id(req)
  let calendars = await get_all_professional_calendars(req.body.professional_id)
  let centers = await get_all_professional_centers(req.body.professional_id)
  let specialties  = await get_professional_specialties(req.body.professional_id)
  
  let json_response = {
    appointments: app_taken  ,
    calendars : calendars ,
    centers : centers  ,
    specialties : specialties ,
    }
  return json_response ;
}

async function professional_get_all_appointments_by_prof_id(req)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()  
  //END IF LOCATION
  //const sql_calendars SELECT * FROM professional_day_locked WHERE professional_id = 1 ;  = "SELECT * FROM professional_calendar WHERE id = 139 AND date_start <='2022-06-02' AND date_end >= '2022-06-01' AND  active = true AND deleted_professional = false AND status = 1  " ;  
  console.log("professional_get_appointments_taken REQUEST "+JSON.stringify(req.body));

  const sql  = "SELECT *, id as app_id FROM appointment WHERE Professional_id='"+req.body.professional_id+"' AND app_blocked = 0  ORDER BY start_time ASC" 
  console.log("professional_get_appointments_taken  SQL:"+sql) 
  const response = await client.query(sql) 
  client.end() 
  
  return response.rows ;
}


//***************************************************** */
//********** PROFESSIONAL GET MONT SUMMARY   ******* */
//**********                                   ******** */
//***************************************************** */
app.route('/professional_get_month_summary')
.post(function (req, res) {  

  let month_summary = professional_get_month_summary(req)
  month_summary.then( v => {  console.log("professional_get_month_summary RESPONSE: "+JSON.stringify(v)) ; return (res.status(200).send(JSON.stringify(v))) } )

})

async function professional_get_month_summary(req)
{
  let appointments  = await professional_get_appointments(req) ;
  let lock_days = await get_professional_lock_days(req.body.professional_id)
  let calendars = await get_all_calendars_available_by_professional_id(req.body.professional_id)

  let json_response = {
    appointments: appointments,
    lock_days: lock_days ,
    calendars : calendars ,
  }

  return json_response ;
}

async function professional_get_appointments(req)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()  
  //END IF LOCATION
  //const sql_calendars SELECT * FROM professional_day_locked WHERE professional_id = 1 ;  = "SELECT * FROM professional_calendar WHERE id = 139 AND date_start <='2022-06-02' AND date_end >= '2022-06-01' AND  active = true AND deleted_professional = false AND status = 1  " ;  
  console.log("professional_get_appointments REQUEST "+JSON.stringify(req.body));

  const sql_calendars  = "SELECT * FROM appointment WHERE Professional_id='"+req.body.professional_id+"'  AND date > '"+req.body.start_date+"'  AND date < '"+req.body.end_date+"'  " 
  console.log("professional_get_appointments  SQL:"+sql_calendars) 
  const response = await client.query(sql_calendars) 
  client.end() 
  
  return response.rows ;
}

//******************************************************************
//******************************************************************
//******************************************************************
//*
//*          PROFESSIONAL BACKEND 
//*          LIST APPOINTMENTS DAY 
//*  
//*          PROFESIONAL GET APPOINTMENT DAY 3
//*           V 23-12-22
//*
//*****************************************************************
//*****************************************************************
//*****************************************************************

app.route('/professional_get_appointments_day3')
.post(function (req, res) {
  console.log('professional_get_appointments_day3 : INPUT : ', req.body );
  //get Appointments and remove the lock days from the response adding true to last parameter. 
  let appointments_available = professional_get_appointments_from_calendars(req.body.professional_id , req.body.date,false  ) ;

  appointments_available.then( v => {  console.log("professional_get_appointments_day3  RESPONSE: "+JSON.stringify(v)) ; return (res.status(200).send(JSON.stringify(v))) } )
})

// GET APPOINTMENTS New Method
async function professional_get_appointments_from_calendars(prof_id, date,remove_lock_days )
{
  //***** response message *****/
  let json_response = {
    appointments_list : { 
                  appointments  : {
                        date: null , 
                        appointments :  null
                            } ,
                        },
    centers : [] ,
    calendars : [] ,
    specialties : [],
    lock_dates : [] ,
    error : [],
    lock_date: false,
      }

  /*********************************************************** */
  // 1.- GET APPOINTMENTS TAKEN BELONG TO PROFESSIONAL FOR A REQUIRED DAY
  /************************************************************ */
      //first set day end
      let aux_date_start = new Date(date)
      aux_date_start.setHours(0,0,0,0)
      let aux_date_end = new Date( aux_date_start.getTime()  + (1000*60*60*24) )
   // date_end.setDate(date_end.getDate()+1)
   let appointments_reserved = await get_professional_appointments_by_date( prof_id , aux_date_start , aux_date_end)
   console.log("RESERVED:"+JSON.stringify(appointments_reserved));
   
  // ***********************************************************/
  // 2.- GET PROFESSIONAL CALENDARS AVAILABLE FOR REQUIRED DAY
  //  (prof_id, date , includeCalendars Not Available )
  /*************************************************************/
  let calendars = await get_calendars_available_by_professional_date(prof_id, date ) ;
  console.log("CALENDARS:"+JSON.stringify(calendars));
  json_response.calendars = await get_calendars_by_professional(prof_id) 
  //json_response.calendars = calendars 

  //************************************************************ */
  // 3.- GET CENTERS
  /************************************************************ */
  let centers_professional = await get_professional_centers(prof_id);
  let centers_professional_ids = centers_professional.map(center => center.id ) ;
  //json_response.centers =  centers_professional
  json_response.centers =  await get_all_professional_centers(prof_id);
  
  /************************************************************ */
  // 4.- FILTER CALENDARS, JUST MANTAIN CALENDARS BELONG TO A CENTERS IS ACTIVE
  /************************************************************ */
  let calendars_filtered =  calendars.filter(cal =>  centers_professional_ids.includes(cal.center_id) ) 

   // 5.- INCLUDE SPECIALTY LIST 
   let specialties = await get_professional_specialties(prof_id)
   json_response.specialties = specialties 

  //*****************************************/
  // 6.- GET Lock Dates
  //*************************************** */
  let lockDates = await get_professional_lock_days(prof_id);
  lockDates = lockDates.map(lockDates => (new Date(lockDates.date) )) ;
  console.log("LOCK DAYS:"+JSON.stringify(lockDates));

  let aux_date_midnight  = new Date(date)
  aux_date_midnight.setHours(0,0,0,0)

  const lock_date_found = lockDates.find(element => new Date(element).getTime() === aux_date_midnight.getTime()  );
      if (lock_date_found != null )
      {  
        //sort to display properly
        appointments_reserved = appointments_reserved.sort(function(b, a){ return ( new Date(b.start_time).getTime() - new Date(a.start_time ).getTime() ) } ) 
  
        console.log("LOCK DAY FOUND, SO EXIT: ERROR 1")
        json_response.appointments_list.date  = aux_date_midnight
        json_response.appointments_list.appointments  = appointments_reserved
        json_response.error = 1
        json_response.lock_date = true 
        return(json_response); 
      }
  // CONTINUE NEXT STEPS IF NOT A LOCK DATE 

  // 7 - SEND CALENDAR TO CUTTER 
  let app_day_calendar = [] ;
  
  for (let i = 0; i < calendars_filtered.length; i++) {
   // app_calendars = app_calendars.concat( calendar_cutter_day(calendars_filtered[i],date )) 
      // 7.1 CUTTER
    let app_calendars = calendar_cutter_day(calendars_filtered[i],date )
    app_day_calendar = app_day_calendar.concat(app_calendars)
    //app_day_calendar = app_day_calendar.concat(app_calendars)
      // 7.2 CUTER FILTER APPOINTMENTS FROM TAKEN 
    //let app_calendar_filtered = filter_app_from_appTaken(app_calendars , appointments_reserved, true )
    /*
      let json_day_apps = {
        day: aux_date_start,
        appointments : app_calendar_filtered
      }
      
    app_day_calendar = app_day_calendar.concat(json_day_apps)
    */
  }
  // 8.- INCLUDE APP TAKEN per day 
   let app_calendar_filtered = filter_app_from_appTaken(app_day_calendar , appointments_reserved, true )
   app_calendar_filtered = app_calendar_filtered.sort(function(b, a){ return ( new Date(b.start_time).getTime() - new Date(a.start_time ).getTime() ) } ) 
  
            /*
   let appointments  = {
            date: aux_date_midnight , 
            appointments :  app_calendar_filtered
            }
            */
  json_response.appointments_list.date  = aux_date_midnight
  json_response.appointments_list.appointments = app_calendar_filtered
 
  return(json_response); 
}

/******************************************************************** */
/******************************************************************** */
/****************       TOOLS UTILS  ******************************** */
/******************************************************************** */
/******************************************************************** */

//******  PUBLIC CANCEL APP 
//******   24-01-2023  
app.route('/public_cancel_app')
.post(function (req, res) {
    console.log('public_cancel_app INPUT : ', req.body );
// ****** Connect to postgre
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect()

/* INPUT
    req_date : req_date,
    req_id  : req_id,
    req_center_id :  req_center_id,
    req_patient_doc_id : req_patient_doc_id,
 */

//let query_reserve =   "INSERT INTO appointment (  date , start_time,  duration,  center_id, confirmation_status, professional_id, patient_doc_id, patient_name,    patient_email, patient_phone1,  patient_age,  app_available, app_status, app_blocked, app_public,  location1, location2, location3, location4, location5, location6,   app_type_home, app_type_center,  app_type_remote, patient_notification_email_reserved , specialty_reserved , patient_address , calendar_id )"   
let query_reserve = "DELETE FROM appointment WHERE id="+req.body.req_id+" AND center_id="+req.body.req_center_id+" AND patient_doc_id='"+req.body.req_patient_doc_id+"' "

//query_reserve  += " VALUES ( '"+req.body.appointment_date+"' , '"+req.body.appointment_start_time+"' , '"+req.body.appointment_duration+"' ,  "+req.body.appointment_center_id+" , '0' , '"+req.body.appointment_professional_id+"' , '"+req.body.patient_doc_id.toUpperCase() +"' , '"+req.body.patient_name.toUpperCase()+"' , '"+req.body.patient_email.toUpperCase()+"' , '"+req.body.patient_phone+"' ,  '"+req.body.patient_age+"' ,'false' , '1' , '0' , '1', "+req.body.appointment_location1+" , "+req.body.appointment_location2+" ,"+req.body.appointment_location3+" ,"+req.body.appointment_location4+" ,"+req.body.appointment_location5+" ,"+req.body.appointment_location6+" , '"+req.body.appointment_type_home+"' , '"+req.body.appointment_type_center+"' , '"+req.body.appointment_type_remote+"' , '1' , '"+req.body.appointment_specialty+"' , '"+req.body.patient_address+"'  , '"+req.body.appointment_calendar_id+"' 	) RETURNING * " ; 

console.log(query_reserve);
const resultado = client.query(query_reserve, (err, result) => {
    //res.status(200).send(JSON.stringify(result)) ;
    if (err) {
      console.log('/public_cancel_app ERR:'+err ) ;
    }
    else {
    console.log("public_cancel_app JSON RESPONSE BODY : "+JSON.stringify(result));
    res.status(200).send(JSON.stringify(result.rows[0])) ;  
    }
    client.end()
})

})

//******  PUBLIC CONFIRM APP 
//******   24-01-2023  
app.route('/public_confirm_app')
.post(function (req, res) {
    console.log('public_confirm_app INPUT : ', req.body );
// ****** Connect to postgre
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect()

/* INPUT
    req_date : req_date,
    req_id  : req_id,
    req_center_id :  req_center_id,
    req_patient_doc_id : req_patient_doc_id,
 */

//let query_reserve =   "INSERT INTO appointment (  date , start_time,  duration,  center_id, confirmation_status, professional_id, patient_doc_id, patient_name,    patient_email, patient_phone1,  patient_age,  app_available, app_status, app_blocked, app_public,  location1, location2, location3, location4, location5, location6,   app_type_home, app_type_center,  app_type_remote, patient_notification_email_reserved , specialty_reserved , patient_address , calendar_id )"   
//let query_reserve = "DELETE FROM appointment WHERE id="+req.body.req_id+" AND center_id="+req.body.req_center_id+" AND patient_doc_id='"+req.body.req_patient_doc_id+"' "

let query_confirm = "UPDATE appointment SET confirmation_status = 1 WHERE id = "+req.body.req_id+" AND center_id ="+req.body.req_center_id+"  AND patient_doc_id='"+req.body.req_patient_doc_id+"' returning * " 
//query_reserve  += " VALUES ( '"+req.body.appointment_date+"' , '"+req.body.appointment_start_time+"' , '"+req.body.appointment_duration+"' ,  "+req.body.appointment_center_id+" , '0' , '"+req.body.appointment_professional_id+"' , '"+req.body.patient_doc_id.toUpperCase() +"' , '"+req.body.patient_name.toUpperCase()+"' , '"+req.body.patient_email.toUpperCase()+"' , '"+req.body.patient_phone+"' ,  '"+req.body.patient_age+"' ,'false' , '1' , '0' , '1', "+req.body.appointment_location1+" , "+req.body.appointment_location2+" ,"+req.body.appointment_location3+" ,"+req.body.appointment_location4+" ,"+req.body.appointment_location5+" ,"+req.body.appointment_location6+" , '"+req.body.appointment_type_home+"' , '"+req.body.appointment_type_center+"' , '"+req.body.appointment_type_remote+"' , '1' , '"+req.body.appointment_specialty+"' , '"+req.body.patient_address+"'  , '"+req.body.appointment_calendar_id+"' 	) RETURNING * " ; 

console.log(query_confirm);
const resultado = client.query(query_confirm, (err, result) => {
    //res.status(200).send(JSON.stringify(result)) ;
    if (err) {
      console.log('/public_confirm_app ERR:'+err ) ;
    }
    else {
    console.log("public_confirm_app JSON RESPONSE BODY : "+JSON.stringify(result));
    res.status(200).send(JSON.stringify(result.rows[0])) ;  
    }
    client.end()
})

})


// PROFESSIONAL GET SPECIALT 
app.route('/get_professional_specialty')
.post(function (req, res) {
 
    console.log('get_professional_specialty:', req.body );
 
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect()


// ****** Run query to bring appointment
const sql  = "SELECT * from  specialty where id IN  (SELECT specialty_id FROM professional_specialty WHERE professional_id="+req.body.professional_id+") ;" ;
console.log('get_professional_specialty: SQL GET PROFESSIONAL SPECIALTY = '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('get_professional_specialty ERR:'+err ) ;
    }

  //console.log('get_professional_specialty : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})

// PROFESSIONAL TAKE APPOINTMENT
app.route('/professional_take_appointment')
.post(function (req, res) {
    console.log('professional_take_appointment INPUT : ', req.body );
// ****** Connect to postgre
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect()

let query_reserve =   "INSERT INTO appointment (  date , start_time,  duration,  center_id, confirmation_status, professional_id, patient_doc_id, patient_name,    patient_email, patient_phone1,  patient_age,  app_available, app_status, app_blocked, app_public,  location1, location2, location3, location4, location5, location6,   app_type_home, app_type_center,  app_type_remote, patient_notification_email_reserved , specialty_reserved , patient_address , calendar_id )"   

query_reserve  += " VALUES ( '"+req.body.appointment_date+"' , '"+req.body.appointment_start_time+"' , '"+req.body.appointment_duration+"' ,  "+req.body.appointment_center_id+" , '0' , '"+req.body.appointment_professional_id+"' , '"+req.body.patient_doc_id.toUpperCase() +"' , '"+req.body.patient_name.toUpperCase()+"' , '"+req.body.patient_email.toUpperCase()+"' , '"+req.body.patient_phone+"' ,  '"+req.body.patient_age+"' ,'false' , '1' , '0' , '1', "+req.body.appointment_location1+" , "+req.body.appointment_location2+" ,"+req.body.appointment_location3+" ,"+req.body.appointment_location4+" ,"+req.body.appointment_location5+" ,"+req.body.appointment_location6+" , '"+req.body.appointment_type_home+"' , '"+req.body.appointment_type_center+"' , '"+req.body.appointment_type_remote+"' , '1' , '"+req.body.appointment_specialty+"' , '"+req.body.patient_address+"'  , '"+req.body.appointment_calendar_id+"' 	) RETURNING * " ; 

console.log(query_reserve);
const resultado = client.query(query_reserve, (err, result) => {
    //res.status(200).send(JSON.stringify(result)) ;
    if (err) {
      console.log('/professional_take_appointment ERR:'+err ) ;
    }
    else {
    console.log("professional_take_appointment JSON RESPONSE BODY : "+JSON.stringify(result));
    res.status(200).send(JSON.stringify(result.rows[0])) ;  
    }
    client.end()
})

})

// PROFESSIONAL BLOCK APPOINTMENTS  PLURAL MANY
app.route('/professional_block_appointments')
.post(function (req, res) {
 
  console.log("professional_block_appointments "+JSON.stringify(req.body) )

  let response_blocking = professional_block_appointments(req.body.lock_apps) 
  let json_response = {
                      result : 'success'
                      }

  response_blocking.then( v => {  console.log("professional_block_appointments  RESPONSE: "+JSON.stringify(json_response)) ; return (res.status(200).send(JSON.stringify(json_response))) } )
})

// PROFESSIONAL GET CALENDARS
app.route('/professional_get_calendars')
.post(function (req, res) {
 
    console.log('professional_get_calendars :', req.body );
 
// ****** Connect to postgre
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect()

// ****** Run query to bring appointment
//const sql  = "SELECT * FROM professional_calendar WHERE professional_id='"+req.body.professional_id+"' ORDER BY id DESC " ;

const sql  = "SELECT * FROM (SELECT *, id AS calendar_id, active as calendar_active FROM professional_calendar WHERE professional_id='"+req.body.professional_id+"' AND  deleted_professional = false )j   LEFT JOIN  center ON   j.center_id = center.id  ORDER BY j.id ASC  " ;

//console.log('professional_get_calendars: SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('rofessional_get_calendars ERR:'+err ) ;
    }

  //console.log('professional_get_calendars : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end() ;
})

})

// PROFESSIONAL GET CENTERS
app.route('/professional_get_centers')
.post(function (req, res) {
 
    console.log('professional_get_centers :', req.body );

// ****** Connect to postgre
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect()

// ****** Run query to bring appointment
const sql  = "SELECT * FROM center WHERE  professional_id='"+req.body.professional_id+"' AND center_deleted='false' ORDER BY id ASC  " ;
console.log('professional_get_centers: SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('professional_get_centers ERR:'+err ) ;
    }

  //console.log('professional_get_centers : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})

// PROFESSIONAL GET CENTERS Return even deleted

app.route('/professional_get_config_data')
.post(function (req, res) {
 
    console.log('professional_get_config_data :', req.body );

// ****** Connect to postgre
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect()

// ****** Run query to bring appointment
const sql  = "SELECT * FROM center WHERE  professional_id='"+req.body.professional_id+"'  ORDER BY id ASC  " ;
console.log('professional_get_config_data: SQL :'+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
      console.log('professional_get_config_data ERR:'+err ) ;
    }

  console.log('professional_get_config_data : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})



//PROFESSIONAL UPDATE CENTER
app.route('/professional_update_center')
.post(function (req, res) {
 
    console.log('professional_update_center :', req.body );
 
// ****** Connect to postgre
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect()

let sql = ""

if (req.body.name != null ) 
{
sql = sql+" name='"+req.body.name+"' " ; ;
}

if (req.body.address!= null ) 
{
  sql = sql+", address='"+req.body.address+"' " ; ;
}

if (req.body.comuna_code!= null ) 
{
 sql = sql+", comuna ='"+req.body.comuna_code+"' " ;
}

if (req.body.phone1!= null ) 
{
 sql = sql+", phone1='"+req.body.phone1+"' " ; 
}

if (req.body.phone2!= null ) 
{
 sql = sql+", phone2='"+req.body.phone2+"' " ;
}

sql = sql+", home_comuna1="+req.body.home_comuna1+" " ;
sql = sql+", home_comuna2="+req.body.home_comuna2+" " ;
sql = sql+", home_comuna3="+req.body.home_comuna3+" " ;
sql = sql+", home_comuna4="+req.body.home_comuna4+" " ;
sql = sql+", home_comuna5="+req.body.home_comuna5+" " ;

sql = sql+", comuna="+req.body.center_comuna+" " ;




req.body.professional_id
// ****** Run query to bring appointment
//const sql  = "SELECT * FROM center WHERE id IN  (SELECT center_id FROM center_professional where professional_id='"+req.body.professional_id+"' ) AND center_deleted!='true'  ORDER BY id ASC  " ;
const sql_request  = "UPDATE center SET "+sql+"  WHERE id = "+req.body.center_id+" ;" ;

console.log('professional_get_centers: SQL :'+sql_request ) ;
const resultado = client.query(sql_request, (err, result) => {

  if (err) {
      console.log('professional_get_centers ERR:'+err ) ;
    }

  console.log('professional_get_centers : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})


})

//PROFESSIONAL DELETE CENTER
app.route('/professional_delete_center')
.post(function (req, res) {
 
    console.log('professional_delete_center :', req.body );
 
// ****** Connect to postgre
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect()

const sql_request  = "UPDATE center  SET  center_deleted = 'true'  WHERE id ="+req.body.center_id+" ;" ;

console.log('professional_delete_center : SQL :'+sql_request ) ;
const resultado = client.query(sql_request, (err, result) => {

  if (err) {
      console.log('professional_delete_center ERR:'+err ) ;
    }

  console.log('professional_delete_center : '+JSON.stringify(result) ) ;
  res.status(200).send(JSON.stringify(result) );
  client.end()
})

})

// GET PROFESSIONAL DATA 
app.route('/patient_get_professional')
.post(function (req, res) {
 
    //console.log('patient_get_professional  REQUEST : ', req.body );
 
// ****** Connect to postgre
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect()

// ****** Run query to bring appointment
const sql  = "SELECT * FROM professional WHERE id='"+req.body.professional_id+"' " ;
console.log('SQL patient_get_professional  : '+sql ) ;
const resultado = client.query(sql, (err, result) => {

  if (err) {
    // throw err ;
     console.log('patient_get_professional ERROR '+sql ) ;
     console.log(err ) ;
   }
   else
   {
  res.status(200).send(JSON.stringify(result.rows[0]));
  //console.log('patient_get_professional RESPONSE  :'+JSON.stringify(result) ) ; 
  }
  
  client.end()
})

})

// PROFESSIONAL LOCK  DAY 
app.route('/professional_lock_day')
.post(function (req, res) {
console.log('professional_lock_day INPUT:', req.body );
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect() 
var sql  = "INSERT INTO professional_day_locked ( professional_id, date ) values ('"+req.body.appointment_professional_id+"','"+req.body.appointment_date+"') ;"
console.log('professional_lock_day SQL:'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('professional_lock_day ERROR CREATION REGISTER, QUERY:'+sql ) ;
	      console.log(err ) ;
        res.status(200).send(JSON.stringify(result));
	    }
	    else
	    {
	  res.status(200).send(JSON.stringify(result));
	  console.log('professional_lock_day  SUCCESS CENTER INSERT ' ) ; 
    console.log('professional_lock_day  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})
  
})

// PROFESSIONAL UN LOCK  DAY 
app.route('/professional_unlock_day')
.post(function (req, res) {
console.log('professional_lock_day INPUT:', req.body );
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect() 
var sql  = "DELETE FROM  professional_day_locked  WHERE professional_id='"+req.body.appointment_professional_id+"' AND date='"+req.body.appointment_date+"' ;"
console.log('professional_lock_day SQL:'+sql ) ;
	client.query(sql, (err, result) => {
	  if (err) {
	     // throw err ;
	      console.log('professional_lock_day ERROR CREATION REGISTER, QUERY:'+sql ) ;
	      console.log(err ) ;
        res.status(200).send(JSON.stringify(result));
	    }
	    else
	    {
	  res.status(200).send(JSON.stringify(result));
	  console.log('professional_lock_day  SUCCESS CENTER INSERT ' ) ; 
    console.log('professional_lock_day  OUTPUT  :'+JSON.stringify(result) ) ; 
	   }
	   
	  client.end()
	})
  
})

// ***************************************************
// ******   TUTORIAL  02-03-2923    ****************** 
// ***************************************************

// PROFESSIONAL SHUTDOWN TUTORIAL
app.route('/professional_shutdown_tutorial')
.post(function (req, res) {
    console.log('professional_shutdown_tutorial INPUT : ', req.body );
// ****** Connect to postgre
const { Client } = require('pg')
const client = new Client(conn_data)
client.connect() 

//first_time = 0 ;tutorial_star = 1 ; tutorial_center = 2
let tutorials = ["first_time","tutorial_start","tutorial_center","tutorial_calendar","tutorial_menu"]

const query_update = "UPDATE professional SET "+tutorials[req.body.tutorial]+" = 'false' WHERE id = '"+req.body.professional_id+"' RETURNING * " ;

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

})



// ***************************************************
// ****************  END TUTORIAL   ****************** 
// ***************************************************



// PROFESSIONAL GET LOCK DAYS 
app.route('/professional_get_lock_days')
.post(function (req, res) {
  //console.log('professional_get_lock_days INPUT : ', req.body );
  let lock_days = get_professional_lock_days(req.body.professional_id)
  lock_days.then( v => {  console.log("professional_get_lock_days  RESPONSE: "+JSON.stringify(v)) ; return (res.status(200).send(JSON.stringify(v))) } )

})

//******************************************************************** */
//***************    Funciones        ******************************** */
//******************************************************************** */

//GET PROFESSIONAL Calendars 

async function get_professional_specialties(prof_id)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
  //console.log("ids:"+ids+" dates:"+dates)
  const sql_calendars  =  "SELECT * from  specialty where id IN  (SELECT specialty_id FROM professional_specialty WHERE professional_id="+prof_id+") ;" ;

 //const sql_calendars  = "SELECT * FROM professional_calendar WHERE professional_id ='"+prof_id+"' AND  deleted_professional = false  ORDER BY id DESC  " ;
 // const sql_apps_taken  = "SELECT * FROM appointment WHERE date IN ("+aux_dates+")  and professional_id  IN ("+ids+") ;";
  //console.log("SQL QUERY: "+sql_calendars)
  const res = await client.query(sql_calendars)
  client.end() 
  //console.log("get_professional_specialties Return: "+JSON.stringify(res.rows));
  return res.rows;
}

async function professional_block_appointments(apps_list)
{  
  console.log("Blocking appointment:"+JSON.stringify(apps_list))

  for (let i = 0;  i < apps_list.length ; i++) {
    await professional_block_appointment(apps_list[i])
  }

  //apps_list.forEach(app =>  await professional_block_appointment(app) )

  console.log("Blocking appointment List DONE : ");
  return 200 ;
}

async function professional_block_appointment(app)
{  
  console.log("Blocking appointment:"+JSON.stringify(app))
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()

   let query = [] 
      if (app.app_id != null)
      {
        query = "DELETE FROM  appointment WHERE id = "+app.app_id+" " 
      }
      else
      {
        query =   "INSERT INTO appointment ( date , start_time,  duration,  center_id, confirmation_status, professional_id, patient_doc_id, patient_name,    patient_email, patient_phone1,  patient_age,  app_available, app_status, app_blocked, app_public,  location1, location2, location3, location4, location5, location6,   app_type_home, app_type_center,  app_type_remote, patient_notification_email_reserved , specialty_reserved , patient_address , calendar_id )"   
        query += " VALUES (  '"+app.date+"' , '"+app.start_time+"' , '"+app.duration+"' ,  "+app.center_id+" , '0' , '"+app.professional_id+"' , 'BLOCKEADO' , 'BLOQUEADO' , 'BLOQUEADO' , 'BLOQUEADO' ,  '111' ,'false' , '1' , '1' , '1', '0' , '0' ,'0' , '0' , '0' , '0' , false , false , false , '1' , '"+app.specialty+"' , 'BLOCKED'  , '"+app.calendar_id+"' 	)  " ; 
      }
      console.log("SQL QUERY: "+query)
  const res =  await client.query(query)   
  client.end() 
  console.log("Blocking appointment : "+res );
  return 200 ;
}

//GET PROFESSIONAL Calendars
async function get_professional_calendars(prof_id)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
  //console.log("ids:"+ids+" dates:"+dates)
  
  const sql_calendars  = "SELECT * FROM professional_calendar WHERE professional_id ='"+prof_id+"' AND  deleted_professional = false  ORDER BY id DESC  " ;

 // const sql_apps_taken  = "SELECT * FROM appointment WHERE date IN ("+aux_dates+")  and professional_id  IN ("+ids+") ;";
  console.log("SQL QUERY: "+sql_calendars)
  const res = await client.query(sql_calendars)
  client.end() 
  return res.rows;
}

//GET ALL PROFESSIONAL Calendars
async function get_all_professional_calendars(prof_id)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
  //console.log("ids:"+ids+" dates:"+dates)
  
  const sql_calendars  = "SELECT * FROM professional_calendar WHERE professional_id ='"+prof_id+"'   ORDER BY id DESC  " ;

 // const sql_apps_taken  = "SELECT * FROM appointment WHERE date IN ("+aux_dates+")  and professional_id  IN ("+ids+") ;";
  console.log("SQL QUERY: "+sql_calendars)
  const res = await client.query(sql_calendars)
  client.end() 
  return res.rows;
}

//GET PROFESSIONAL Centers
async function get_professional_centers(id)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
  //console.log("ids:"+ids+" dates:"+dates)
  const sql_centers  = "SELECT * FROM center WHERE professional_id ='"+id+"' AND center_deleted!='true'  ORDER BY id ASC  " ;
 // const sql_apps_taken  = "SELECT * FROM appointment WHERE date IN ("+aux_dates+")  and professional_id  IN ("+ids+") ;";
  //console.log("SQL QUERY: "+sql_centers)
  const res = await client.query(sql_centers)
  client.end() 
  return res.rows;
}
//GET PROFESSIONAL Centers
async function get_all_professional_centers(id)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()
  //console.log("ids:"+ids+" dates:"+dates)
  const sql_centers  = "SELECT * FROM center WHERE professional_id ='"+id+"'  ORDER BY id ASC  " ;
 // const sql_apps_taken  = "SELECT * FROM appointment WHERE date IN ("+aux_dates+")  and professional_id  IN ("+ids+") ;";
  //console.log("SQL QUERY: "+sql_centers)
  const res = await client.query(sql_centers)
  client.end() 
  return res.rows;
}

//GET ALL CALENDARS  BY Professional and Date
async function get_calendars_by_professional(prof_id)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()  
  //END IF LOCATION
  //const sql_calendars  = "SELECT * FROM professional_calendar WHERE id = 139 AND date_start <='2022-06-02' AND date_end >= '2022-06-01' AND  active = true AND deleted_professional = false AND status = 1  " ;  
  const sql_calendars  = "SELECT * FROM professional_calendar WHERE professional_id = "+prof_id+"  " ;  
  //const sql_calendars  = "SELECT * FROM professional_calendar WHERE professional_id = "+prof_id+"  AND deleted_professional = false AND status = 1  AND date_start <= '"+date+"'  AND date_end >= '"+date+"'  " ;  

  //console.log("get_calendar_available_by_ProfessionalId  SQL:"+sql_calendars) 
  
  const res = await client.query(sql_calendars) 
  client.end() 
  return res.rows ;
}

//GET CALENDARS BY Professional and Date
async function get_calendars_available_by_professional_date(prof_id,date)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()  
  //END IF LOCATION
  //const sql_calendars  = "SELECT * FROM professional_calendar WHERE id = 139 AND date_start <='2022-06-02' AND date_end >= '2022-06-01' AND  active = true AND deleted_professional = false AND status = 1  " ;  
  const sql_calendars  = "SELECT * FROM professional_calendar WHERE professional_id = "+prof_id+" AND  active = true AND deleted_professional = false AND status = 1  AND date_start <= '"+date+"'  AND date_end >= '"+date+"'  " ;  
  //const sql_calendars  = "SELECT * FROM professional_calendar WHERE professional_id = "+prof_id+"  AND deleted_professional = false AND status = 1  AND date_start <= '"+date+"'  AND date_end >= '"+date+"'  " ;  

  //console.log("get_calendar_available_by_ProfessionalId  SQL:"+sql_calendars) 
  
  const res = await client.query(sql_calendars) 
  client.end() 
  return res.rows ;
}

//GET ALL ACTIVE CALENDARS BY Professional ID
async function get_all_calendars_available_by_professional_id(prof_id)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()  
  //END IF LOCATION
  //const sql_calendars  = "SELECT * FROM professional_calendar WHERE id = 139 AND date_start <='2022-06-02' AND date_end >= '2022-06-01' AND  active = true AND deleted_professional = false AND status = 1  " ;  
  const sql_calendars  = "SELECT * FROM professional_calendar WHERE professional_id = "+prof_id+" AND  active = true AND deleted_professional = false AND status = 1  " ;  

  //console.log("get_all_calendars_available_by_professional_id SQL:"+sql_calendars) 
  
  const res = await client.query(sql_calendars) 
  client.end() 
  return res.rows ;
}

//GET CALENDARS BY ID
async function get_calendar_available_by_id(cal_id)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()  
  //END IF LOCATION
  //const sql_calendars  = "SELECT * FROM professional_calendar WHERE id = 139 AND date_start <='2022-06-02' AND date_end >= '2022-06-01' AND  active = true AND deleted_professional = false AND status = 1  " ;  
  const sql_calendars  = "SELECT * FROM professional_calendar WHERE id In ("+cal_id+") AND  active = true AND deleted_professional = false AND status = 1  " ;  


  //console.log("get_calendars_available_by_id  SQL:"+sql_calendars) 
  
  const res = await client.query(sql_calendars) 
  client.end() 
  return res.rows ;
}

//GET all professional appointments taken between two dates  
async function get_professional_appointments_by_date(prof_id ,date_start ,date_end)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()  
   
  //END IF LOCATION
  //const sql_calendars  = "SELECT * FROM professional_calendar WHERE id = 139 AND date_start <='2022-06-02' AND date_end >= '2022-06-01' AND  active = true AND deleted_professional = false AND status = 1  " ;  

  //const sql_calendars  = "SELECT * FROM appointment WHERE professional_id = "+prof_id+"  AND date >='"+date_start+"'  AND date <='"+date_end+"' AND  app_available = false " ; 
  let aux_date_start = new Date(date_start).toISOString()
  let aux_date_end = new Date(date_end).toISOString()
  const sql_calendars  = "SELECT * FROM appointment WHERE professional_id = "+prof_id+"  AND date >='"+aux_date_start+"' AND date <='"+aux_date_end+"' AND  app_available = false " ; 
  //console.log("get_professional_appointments_by_date  SQL:"+sql_calendars) 
  
  const res = await client.query(sql_calendars) 
  client.end() 
  return res.rows ;
}

// GET LOCK DAYS
async function get_professional_lock_days(prof_id)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()  
  //END IF LOCATION
  //const sql_calendars SELECT * FROM professional_day_locked WHERE professional_id = 1 ;  = "SELECT * FROM professional_calendar WHERE id = 139 AND date_start <='2022-06-02' AND date_end >= '2022-06-01' AND  active = true AND deleted_professional = false AND status = 1  " ;  

  const sql_calendars  = "SELECT * FROM professional_day_locked WHERE professional_id = "+prof_id ; 
  //console.log("************* get_professional_lock_days  SQL:"+sql_calendars) 
  const res = await client.query(sql_calendars) 
  client.end() 
  //console.log ("LOCK DAYS: PID:"+prof_id+" DLOCK:"+JSON.stringify(res.rows));
  return res.rows ;
}

// IS PROFESSIONAL LOCK DAYS
async function is_professional_lock_day(prof_id,date)
{
  const { Client } = require('pg')
  const client = new Client(conn_data)
  await client.connect()  
  //END IF LOCATION
  //const sql_calendars SELECT * FROM professional_day_locked WHERE professional_id = 1 ;  = "SELECT * FROM professional_calendar WHERE id = 139 AND date_start <='2022-06-02' AND date_end >= '2022-06-01' AND  active = true AND deleted_professional = false AND status = 1  " ;  

  const sql_calendars  = "SELECT * FROM professional_day_locked WHERE professional_id ="+prof_id+" AND date ='"+date+"'" ; 
  //console.log("************* get_professional_lock_days SQL:"+sql_calendars) 
  const res = await client.query(sql_calendars) 
  client.end() 
  //console.log ("LOCK DAYS: PID:"+prof_id+" DLOCK:"+JSON.stringify(res.rows));
  return res.rows ;
}

//******************************************************* */
//*******************  NEW CUTTER *********************** */
//************** UNIQUE AND IMPORTAN ******************** */
//**************   CALENDAR CUTTER  ********************* */
//******************************************************* */
//let apps = calendar_cutter(calendars[i],json.date, date_end.toISOString() , lockDates, true) ;  
//******************************************************* */


//******************************************************* */
//**********                                ************* */
//**********     CALENDAR CUTTER DAY        ************* */
//**********       12/12/2022 
//**********      From Public Search        ************* */
//**********                                ************* */
//******************************************************* */
function calendar_cutter_day(calendar, date_to_cut)
{
  //console.log("Calendar Cutter:"+calendar.id +" dateToCut:"+date_to_cut );
  let cal_days = [] ; // ARRAY TO STORE DAYS
  let cal_hours = [] ; //ARRAY TO STORE TIMES
  let cal_appointments = [] ; //ARRAY TO STORE TIMES
  let cal_days_noBlock = []
 
  /***************************** */
  /*** IF CALENDAR EXIST ******* */
  /***************************** */
  if (calendar != null){

  //get days available in calendar
  let date = new Date(date_to_cut); 
  date.setHours(0,0,0,0)
    
  let cal_day_active = [] ;
    if (calendar.sunday)    { cal_day_active.push(0) }   
    if (calendar.monday)    { cal_day_active.push(1) }
    if (calendar.tuesday)   { cal_day_active.push(2) }
    if (calendar.wednesday) { cal_day_active.push(3) }
    if (calendar.thursday)  { cal_day_active.push(4) }
    if (calendar.friday)    { cal_day_active.push(5) }
    if (calendar.saturday)  { cal_day_active.push(6) }
   
    // **************************
    // *** IF DAY IS ACTIVE ******
    // **************************
      if(cal_day_active.includes( date.getDay()) )
      {
    // **************************
    // ****** CUTTER HOURS ******
    // **************************
     //console.log("Calendar Start Time: "+calendar.start_time)
     //console.log("Calendar End   Time: "+calendar.end_time)

      let string_start_date = date.toString().slice(0,16)+" "+calendar.start_time
      let string_end_date = date.toString().slice(0,16)+" "+calendar.end_time

      let time_start = new Date(string_start_date) ;
      let time_end = new Date(string_end_date ) ;

      //console.log("time_start: "+ time_start) 
      //console.log("time_end: "+ time_end) 

      for (var t = new Date(time_start); t.getTime() <= ( time_end.getTime() - (calendar.time_between*60*1000)  ); t.setTime(t.getTime() + ((calendar.duration + calendar.time_between)*60*1000) ) ) 
      { 
            var appointment_slot = {
              calendar_id : calendar.id , 
              date : new Date(t.getTime()) ,
              specialty : calendar.specialty1 , 
              duration : calendar.duration ,
              center_id :calendar.center_id ,
              start_time : new Date(t.getTime())  , 
              time_between : calendar.time_between ,
              professional_id : calendar.professional_id ,
              //lock_day :lock_day ,
              app_available : true ,
              app_blocked : null , 
              }
              cal_appointments.push(appointment_slot)
      }
      //console.log("Appointments: "+cal_appointments ) 
            
      /*
      var appointments_json = {
            appointments : cal_appointments 
             }
             */
      
      }//end if is active
    
       return (cal_appointments) ;
      }
} 

//******************************************************* */
//************** UNIQUE AND IMPORTAN ******************** */
//**************   CALENDAR CUTTER  ********************* */
//******************************************************* */
function calendar_cutter(calendar, fromDate ,endDate ,lockDates, remove_lock_days )
{
  //console.log("Calendar Cutter : "+calendar.id);
  let cal_days = [] ; // ARRAY TO STORE DAYS
  let cal_hours = [] ; //ARRAY TO STORE TIMES
  let cal_appointments = [] ; //ARRAY TO STORE TIMES
  let cal_days_noBlock = []
 
  if (calendar != null ){
  //get days available in calendar
  let date_start = new Date(fromDate); 
  let date_end = new Date(calendar.date_end);


    if (endDate != null)
    {
      date_end = new Date(endDate)
    }

  let cal_day_active = [] ;
    if (calendar.sunday)    { cal_day_active.push(0) }   
    if (calendar.monday)    { cal_day_active.push(1) }
    if (calendar.tuesday)   { cal_day_active.push(2) }
    if (calendar.wednesday) { cal_day_active.push(3) }
    if (calendar.thursday)  { cal_day_active.push(4) }
    if (calendar.friday)    { cal_day_active.push(5) }
    if (calendar.saturday)  { cal_day_active.push(6) }
   
    // **************************
    // ****** CUTTER DAYS ******
    // **************************
    //console.log("DAY CUTTER :" );
    for (var d = new Date(date_start); (d <= date_end && d <= new Date(calendar.date_end)  )  ; d.setDate(new Date(d).getDate() + 1)) 
    { 
      if(cal_day_active.includes( d.getDay()) )
      {
        cal_days.push(new Date(d))
      }   
    }
   // cal_days.forEach(day => console.log("cal_days:"+day.toUTCString()  ) );
    //**************************/


    // **************************
    // ****** CUTTER HOURS ******
    // **************************
    console.log(" HOUR CUTTER :" );
    let time_start = new Date('Thu, 01 Jan 1970 '+calendar.start_time ) ;
    let time_end = new Date('Thu, 01 Jan 1970 '+calendar.end_time ) ;
    for (var t = new Date(time_start); t.getTime() <= ( time_end.getTime() - (calendar.time_between*60*1000)  ); t.setTime(t.getTime() + ((calendar.duration + calendar.time_between)*60*1000) ) ) 
    { 
    //let aux_hour=new String( ((t.getHours()).toString().padStart(2, '0') )+":"+(t.getMinutes().toString().padStart(2, '0')) ) ;
     let aux_hour= new Date(t.getTime())  ;
     cal_hours.push(aux_hour) 
    }
    cal_hours.forEach(hour => console.log("cal_hours:"+hour.toUTCString()  ) );
    //********************** */

    // *********************************
    // ****** REMOVE LOCKED DAYS  ******
    // *********************************
    //console.log("Remove_lock_days ONLY PUBLIC SEARCH :"+remove_lock_days  );
    //lockDates.forEach(date => console.log("Lock_Day:"+date.toUTCString()  ) );
    if (remove_lock_days == true) 
    {
    cal_days.forEach( function filterApp(day) { 
       if (!lockDates.includes(day)) {  cal_days_noBlock.push(day) }    
       //NOTE: NO COPY, just point memory addres when REMOVE LOCK DAYS is TRUE 
        cal_days = cal_days_noBlock ;
      })
    }
    //********************************** */
    //console.log("After remove lock days:");
    //cal_days.forEach(date => console.log("cal_day:"+date.toUTCString()  ) );



    // **************************************
    // ****** CICLE TO BUILD APP LIST  ******
    // **************************************
    let lock_day=false ; 
    for (let d=0 ; d < cal_days.length ; d++ )
    {  
        let aux_date = new Date(cal_days[d])
        aux_date.setHours(0,0,0,0);
        
        const lock_date_found = lockDates.find(element => new Date(element).getTime() === aux_date.getTime()  );
       // console.log("lockDates:"+ lockDates );
       // console.log("day match ?:"+ new Date(cal_days[d]) );

        if (lock_date_found != null )
        { lock_day=true ; }
        else
        {lock_day=false ; }

      //  console.log("Is a Lock Date ?  :"+ lock_day );

      
        for (let t=0 ; t < cal_hours.length ; t++ )
            {
              //first set date
              let time_start_set = cal_days[d];
              time_start_set.setUTCHours(0,0,0) 
              //time_start_set.setTime(time_start_set.getTime() + cal_hours[t].getTime() ) 
              let time_app_json = new Date(time_start_set.getTime() + cal_hours[t].getTime() )
              time_app_json.setMilliseconds(0)
           /*   
             console.log("********* cal_days[d]     ="+cal_days[d].toUTCString() )
             console.log("********* cal_hours[t]    ="+cal_hours[t].toUTCString() )
             console.log("********* time_start_set  ="+time_start_set.toUTCString() )
           */
              var appointment_slot = {
                calendar_id : calendar.id , 
                date : time_app_json ,
                specialty : calendar.specialty1 , 
                duration : calendar.duration ,
                center_id :calendar.center_id ,
                start_time : time_app_json  , 
                time_between : calendar.time_between ,
                professional_id : calendar.professional_id ,
                lock_day :lock_day ,
                app_available : true ,
                app_blocked : null , 
                }
               cal_appointments.push(appointment_slot) ;
              }           
    } 

   //cal_appointments.forEach(a => console.log("Appointment :"+JSON.stringify(a) ))
  }
   return (cal_appointments) ;
} 

// filter app from app taken
function filter_app_from_appTaken(apps , appsTaken, includeAppTaken)
{
  //console.log("FILTER FUNCTION APPS:"+JSON.stringify(apps ));
  //console.log("FILTER FUNCTION APPS TAKEN:"+JSON.stringify(appsTaken));
 
  let apps_taken_array = [] ;  
  if (appsTaken != null)
  {
    for (let i = 0; i < appsTaken.length; i++) {
         
      var appointment_slot = {
        app_id : appsTaken[i].id ,
        calendar_id : appsTaken[i].calendar_id , 
        date : appsTaken[i].date  ,
        specialty :   appsTaken[i].specialty_reserved , 
        duration : appsTaken[i].duration ,
        center_id :appsTaken[i].center_id ,
        start_time :  appsTaken[i].date  , 
        professional_id : appsTaken[i].professional_id ,
        lock_day : false ,
        app_available : false ,
        app_type_center : appsTaken[i].app_type_center ,
        app_type_home : appsTaken[i].app_type_home ,
        app_type_remote : appsTaken[i].app_type_remote ,
        
        patient_name : appsTaken[i].patient_name , 
        patient_doc_id : appsTaken[i].patient_doc_id , 
        patient_age : appsTaken[i].patient_age, 
        patient_address : appsTaken[i].patient_address , 
        patient_email : appsTaken[i].patient_email , 
        patient_phone1 : appsTaken[i].patient_phone1 ,

        app_blocked : appsTaken[i].app_blocked ,
       }

       if (includeAppTaken == true )
       {
       apps_taken_array.push(appointment_slot)
       }

       //NOW Look for this APP and remove from Available list
      let matchAPP = apps.findIndex( (element) => new Date(element.start_time).getTime()  === new Date(appointment_slot.start_time).getTime() );
      if (matchAPP != -1 )
      {
      //console.log ("MATCH To be removed from APPS available list:  "+matchAPP+" apps:"+JSON.stringify(apps[matchAPP]) )
      apps.splice(matchAPP,1);
      }

      }    
  }

  let apps_taken_plus_available = apps.concat(apps_taken_array);

  console.log("FILTER FUNCTION APPS RETURN : "+JSON.stringify(apps_taken_plus_available));
  return (apps_taken_plus_available)

}





// ***************************************************************
// ***********    SECURITY    ************************************
//              24-03-2023
// ***************************************************************

    function sntz(inputdata , flaw )
    {
    const regular_exp= /[^a-z0-9,' ',-,@,.]/ig
    
    if (  regular_exp.test(inputdata))
    {
      console.log ("SECURITY WARNING: INPUT includes special characters:"+JSON.stringify(inputdata) )    
    }
    return inputdata.replaceAll( regular_exp, "" );
    
    }


// ***************************************************************
// **** SECURITY Goes Through a JSON to sanitize  every field  ***
//              24-03-2023
// ***************************************************************

function sntz_json(json_input)
{ 
  console.log("sanitization JSON INPUT: "+JSON.stringify(json_input))
  /*
    var p = {
      "p1": "value1",
      "p2": "value2",
      "p3": "value3"
  };
  */

  for (var key in json_input) {
      if (json_input.hasOwnProperty(key)) {
        json_input[key] = sntz(json_input[key])
        }
  }
  return json_input
}

 








