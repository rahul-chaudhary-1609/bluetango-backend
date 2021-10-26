import * as dotenv from "dotenv";  // import environment 
import express from "express";
dotenv.config();
const app = express();
import bodyParser from "body-parser";
const port: any = process.env.PORT || 3000;
import swaggerUi from "swagger-ui-express";   // import swagger package for documentation
import swaggerDocument from "./swagger.json";
import cors from 'cors';
import { 
    scheduleFreeTrialExpirationNotificationJob,
    scheduleGoalSubmitReminderNotificationJob,
    scheduleDeleteNotificationJob,
    scheduleMarkEmployeeCoachSessionAsComepletedOrRejetctedJob
} from "./utils/cronJob"
//import json2csv from 'json2csv';
//const json2csv = require('json2csv');

//options for cors midddleware
const options: cors.CorsOptions = {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'contenttype',
      'Accept',
      'X-Access-Token',
      'Authorization',
      'authorization'
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: "*",
    // preflightContinue: true,
  };
  
//use cors middleware
app.use(cors(options));

app.use(bodyParser.urlencoded(
    {
        extended: false,
        limit: "50mb",
    },
));
app.use(bodyParser.json({ limit: "50mb" }));

//app.use(json2csv.middleware)

// //options for cors midddleware
// const options: cors.CorsOptions = {
//     "origin": "*",
//     "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//     "preflightContinue": false,
//     "optionsSuccessStatus": 204
//   };
  
// //use cors middleware
// app.use(cors(options));



// //enable pre-flight
// app.options('*', cors(options));

// //create custom headers to solve cors isssue 
// const customHeaders = (req, res, next) => {
//     // OR set your own header here
//     res.header("Accept", "application/json, text/plain,*/*");
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, PATCH, DELETE');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Contenttype Accept,Authorization,Access-Control-Allow-Origin,Access-Control-Allow-Methods,accesstoken,lang,authorization");

//     next();
// }
// app.use(customHeaders);

/**
 * [req] :type of request
 * [res] :type of response
 * use for set header for language default as english 
 */
app.use((req, res, next) => {
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
app.use('/api-swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { swaggerOptions: { docExpansion: "none" } }));
 
// for adding more route and api
require("./routes")(app);
  
// app.use(cors()); 


/*Initialize Listner*/
var server = app.listen(port, async () => {
    console.log('Listening on port: ', port);
    await scheduleFreeTrialExpirationNotificationJob();
    await scheduleGoalSubmitReminderNotificationJob();
    await scheduleDeleteNotificationJob();
    await scheduleMarkEmployeeCoachSessionAsComepletedOrRejetctedJob();

}).on('error', (e) => {
    console.log('Error happened: ', e.message)
});

