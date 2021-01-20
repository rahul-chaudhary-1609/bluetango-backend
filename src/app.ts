import * as dotenv from "dotenv";  // import environment 
import express from "express";
dotenv.config();
const app = express();
import bodyParser from "body-parser";
const port: any = process.env.PORT || 3000;
import swaggerUi from "swagger-ui-express";   // import swagger package for documentation
import swaggerDocument from "./swagger.json";
import cors from 'cors';

app.use(bodyParser.urlencoded(
    {
        extended: false,
        limit: "50mb",
    },
));
app.use(bodyParser.json({ limit: "50mb" }));



/**
 * [req] :type of request
 * [res] :type of response
 * use for set header for language default as english 
 */

//create custom headers to solve cors isssue 
const customHeaders = (req, res, next) => {
    // OR set your own header here
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.header("Accept", "application/json, text/plain,*/*");
    res.header("Access-Control-Allow-Origin", ip);
    res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization,Access-Control-Allow-Origin,Access-Control-Allow-Methods,access-token,lang");

    next();
}
app.use(customHeaders);

app.use((req, res, next) => {
   
    //options for cors midddleware
    // const options: cors.CorsOptions = {
    //     allowedHeaders: [
    //     'Origin',
    //     'X-Requested-With',
    //     'Content-Type',
    //     'Accept',
    //     'X-Access-Token',
    //     ],
    //     credentials: true,
    //     methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    //     origin: ip,
    //     preflightContinue: false,
    // };
    
    // //use cors middleware
    // app.use(cors(options));

    // //enable pre-flight
    // app.options('*', cors(options));

    

    next();
});

// welcome route for bluetango 
app.get('/', (req, res) => {
    res.send("<center><p><b>Welcome to BlueTango!</b></p></center>");
});
// basic route for check server is working properly
app.get('/api', (req, res) => {
    res.send("<center><p><b>Server is working properly!</b></p></center>");
});
//setup swagger for documentation
app.use('/api-swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
 
// for adding more route and api
require("./routes")(app);
  
  


/*Initialize Listner*/
var server = app.listen(port, () => {
    console.log('Listening on port: ', port);
}).on('error', (e) => {
    console.log('Error happened: ', e.message)
});

