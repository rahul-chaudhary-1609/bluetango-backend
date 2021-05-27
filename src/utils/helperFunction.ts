const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
import * as constants from '../constants';
import * as AWS from 'aws-sdk';
import fs from 'fs';
import * as randomstring from 'randomstring';
const FCM = require('fcm-node');
const fcm = new FCM(process.env.FCM_SERVER_KEY); //put your server key here
import { EmployersService } from '../services/admin/employersService'

//Instantiates a Home services  
const employersService = new EmployersService();

const s3Client = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const uploadParams = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: '', // pass key
    Body: null, // pass file body
    ContentType: null
};

/*
* Upload A file
*/
export const uploadFile = async (params: any, folderName: any) => {

    return new Promise((resolve, reject) => {
        const buffer = fs.createReadStream(params.path);
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
}


/**
 * 
 * @param params to, from, subject, html
 */
export const sendEmail = async (params) => {
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
        await sgMail.send(msg);
    } catch (error) {
        if (error.response) {
            console.error(error.response.body)
        }
        throw new Error(error);
    }
}


/*
*get the current time value
*/
export const currentUnixTimeStamp = () => {
    return Math.floor(Date.now());
}

export const pagination = async (page, page_size) => {
    if (page_size) {
        page_size = Number(page_size)
    } else {
        page_size = constants.OFFSET_LIMIT
    }
    if (page) {
        page = ((Number(page) - 1) * Number(page_size))
    } else {
        page = 0
    }
    return [page, page_size];
}

export const convertPromiseToObject = async (promise) => {
    return JSON.parse(JSON.stringify(promise));
}

export const getCurrentDate = async () => {
    return new Date().toISOString().split('T')[0];
}

/**
 * 
 * @param tokens - fcm-device token for user's device
 * @param notification - object with body and title
 * @param payload 
 */
export const sendFcmNotification = async (tokens: any, notification: any) => {


    var message = {
        registration_ids: tokens,
        notification: {
            title: notification.title,
            body: notification.body,
            image: notification.image || null,
        },
        data: notification.data
    };
    if (tokens.length) {
        fcm.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!", notification, JSON.stringify(err));
            } else {
                console.log("Successfully sent with response: ", response);
                return response;
            }
        });
    } else {
        console.log("No FCM Device token registered yet.");
    }
}

export const checkPermission = async (req, re, next) => {
    try {
        console.log('req - - -  -', req.user.user_role)
        if(req.user.user_role == constants.USER_ROLE.sub_admin) {
            let params:any = {}
            params.subAdminId = req.user.uid
            const subAdmin = await employersService.subAdminDetails(params)
            if(subAdmin) {
                console.log('subAdmin - - -',subAdmin)
                req.permissions = subAdmin.permissions
                return next()
            }
        }else {
           return next()
        }
    } catch (error) {
        throw new Error(error)
    }
}

/*
* function to generate the random key
*/
export const randomStringEightDigit = () => {
    // Generate Random Number
    const otp = randomstring.generate({
        charset: 'numeric',
        length: 8,
        numeric: true,
        letters: false,
        special: false,
        exclude: ["0"],
    });
    return otp;
};
