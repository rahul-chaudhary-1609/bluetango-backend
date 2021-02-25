"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv")); // import environment 
const express_1 = __importDefault(require("express"));
dotenv.config();
const app = express_1.default();
const body_parser_1 = __importDefault(require("body-parser"));
const port = process.env.PORT || 3000;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express")); // import swagger package for documentation
const swagger_json_1 = __importDefault(require("./swagger.json"));
const cors_1 = __importDefault(require("cors"));
//import json2csv from 'json2csv';
const json2csv = require('json2csv');
app.use(body_parser_1.default.urlencoded({
    extended: false,
    limit: "50mb",
}));
app.use(body_parser_1.default.json({ limit: "50mb" }));
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
//options for cors midddleware
const options = {
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
};
//use cors middleware
app.use(cors_1.default());
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
app.use('/api-swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// for adding more route and api
require("./routes")(app);
// app.use(cors()); 
/*Initialize Listner*/
var server = app.listen(port, () => {
    console.log('Listening on port: ', port);
}).on('error', (e) => {
    console.log('Error happened: ', e.message);
});
//# sourceMappingURL=app.js.map