const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser');
const houseRoutes = require('./api/routes/house');
app.use(morgan('dev')); // for console logging

app.use(bodyParser.urlencoded({extended:false })); 
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", 'PUT, POST,PATCH, DELETE');
        return res.status(201).json({});
    }
    next();
    
})

app.use('/house', houseRoutes); //Router to the house object route


app.use((req,res, next) => {
    const error = new Error('url invalid try: localhost:3000/house');
    error.status(404);
    next(error);
    
})

app.use((error, req, res, next)=> {
    res.status(error.status || 500);
        
    res.json({
        error: {
            message: error.message
        }         
        
    });
})

module.exports = app;