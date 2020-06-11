const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const ibmdb = require('ibm_db');
dotenv.config();

let connStr = "DATABASE="+process.env.DB_DATABASE+";HOSTNAME="+process.env.DB_HOSTNAME+";PORT="+process.env.DB_PORT+";PROTOCOL=TCPIP;UID="+process.env.DB_UID+";PWD="+process.env.DB_PWD+";";

router.post('/', (req, response , next) => {
        const house = {
        name: req.body.OWNERNAME,
        surname: req.body.SURNAME,
        contact: req.body.CONTACT,
        rooms: req.body.BEDROOMS,
        garage: req.body.GARAGE,
        price: req.body.PRICE
    };
    
    ibmdb.open(connStr, function (err,conn) {
      if (err){
        return response.json({success:-1, message:err});
      }
      conn.query("SELECT MAX(HOUSEID) FROM "+process.env.DB_SCHEMA+".HOUSE_INFO;", function (err, data) {
        if (err){
          return response.json({success:-2, message:err});
        }
        else{
         var id = data[0]['1'] + 1; 
         var str = "INSERT INTO "+process.env.DB_SCHEMA+".HOUSE_INFO (HOUSEID,OWNERNAME,SURNAME,CONTACT,BEDROOMS,GARAGE,PRICE) VALUES ('"+id+"','"+house['name']+"','"+house['surname']+"','"+house['contact']+"','"+house['rooms']+"','"+house['garage']+"',"+house['price']+");";
                  
         conn.query(str, function (err, data) {
            if (err){
              return response.json({success:-3, message:err});  
            }
               else{
                  conn.close(function () {
                    return response.json({success:1, message:'Data Entered!', createdHouse:house,});
                  });
                }
              });
            }
                
      });  
        
    });
});

router.get('/', (request, response , next) => {
    
    ibmdb.open(connStr, function (err,conn) {
        if (err){
          return response.json({success:-1, message:err});
        }
        conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".HOUSE_INFO;", function (err, data) {
          if (err){
            return response.json({success:-1, message:err});
          }
          conn.close(function () {
            return response.json({success:1, message:'House Information', data: data});
          });
        });
      });    
});

router.get('/:Id', (request, response , next) => {
    const id = request.params.Id;  
    ibmdb.open(connStr, function (err,conn) {
        if (err){
          return respose.json({success:-1, message:err});
        }
        conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".HOUSE_INFO WHERE HOUSEID="+id+";", function (err, data) {
          if (err){
            return response.json({success:-1, message:err});
          }
          conn.close(function () {
            return response.json({success:1, message:'House Information', data:data});
          });
        });
      });    
 });

 router.patch('/', (req, response , next) => {
    const house = {
        id: req.body.HOUSEID,
        name: req.body.OWNERNAME,
        surname: req.body.SURNAME,
        contact: req.body.CONTACT,
        rooms: req.body.BEDROOMS,
        garage: req.body.GARAGE,
        price: req.body.PRICE
    };
    
    ibmdb.open(connStr, function (err,conn) {
      if (err){
        return response.json({success:-1, message:err});
      }
        else{
            
         
          var query = "UPDATE "+process.env.DB_SCHEMA+".HOUSE_INFO SET OWNERNAME='"+house['name']+"',SURNAME='"+house['surname']+"',CONTACT='"+house['contact']+"',BEDROOMS='"+house['rooms']+"',GARAGE='"+house['garage']+"',PRICE="+house['price']+" WHERE HOUSEID="+house['id']+";";
          
          conn.query(query, function (err, data) {
            if (err){
              return response.json({success:-3, message:err});
            }
                   else{
                  conn.close(function () {
                    return response.json({success:1, message:'Updated!', data:house});
                  });
                }
              });
            }
      
      });
  });
    
 router.delete('/:Id', (request, response , next) => {
  const id = request.params.Id;  
  console.log('in');
  ibmdb.open(connStr, function (err,conn) {
      if (err){
        return respose.json({success:-1, message:err});
      }
      conn.query("DELETE FROM "+process.env.DB_SCHEMA+".HOUSE_INFO WHERE HOUSEID="+id+";", function (err, data) {
        if (err){
          return response.json({success:-1, message:err});
        }
        conn.close(function () {
          return response.json({success:1, message:'House Information deleted!', });
        });
      });
    });    
});



module.exports = router;