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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDate = exports.convertPromiseToObject = exports.pagination = exports.currentUnixTimeStamp = exports.sendEmail = exports.uploadFile = void 0;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
const constants = __importStar(require("../constants"));
const AWS = __importStar(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
const s3Client = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
const uploadParams = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: '',
    Body: null,
    ContentType: null
};
/*
* Upload A file
*/
exports.uploadFile = (params, folderName) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const buffer = fs_1.default.createReadStream(params.path);
        //assigining parameters to send the value in s3 bucket
        uploadParams.Key = folderName + '/' + `${Date.now()}_ ${params.originalname}`;
        uploadParams.Body = buffer;
        uploadParams.ContentType = params.mimetype;
        var s3upload = s3Client.upload(uploadParams).promise();
        s3upload.then(function (data) {
            resolve(data.Location);
        })
            .catch(function (err) {
            reject(err);
        });
    });
    // return true;   
});
/**
 *
 * @param params to, from, subject, html
 */
exports.sendEmail = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const msg = {
            to: params.to,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: 'BluXinga'
            },
            subject: params.subject,
            html: params.html,
        };
        console.log(msg);
        yield sgMail.send(msg);
    }
    catch (error) {
        if (error.response) {
            console.error(error.response.body);
        }
        throw new Error(error);
    }
});
/*
*get the current time value
*/
exports.currentUnixTimeStamp = () => {
    return Math.floor(Date.now());
};
exports.pagination = (page, page_size) => __awaiter(void 0, void 0, void 0, function* () {
    if (page_size) {
        page_size = Number(page_size);
    }
    else {
        page_size = constants.OFFSET_LIMIT;
    }
    if (page) {
        page = ((Number(page) - 1) * Number(page_size));
    }
    else {
        page = 0;
    }
    return [page, page_size];
});
exports.convertPromiseToObject = (promise) => __awaiter(void 0, void 0, void 0, function* () {
    return JSON.parse(JSON.stringify(promise));
});
exports.getCurrentDate = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Date().toISOString().split('T')[0];
});
//# sourceMappingURL=helperFunction.js.map