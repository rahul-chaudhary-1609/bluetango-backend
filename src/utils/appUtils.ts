import _ from 'lodash';
import * as constants from '../constants';
import * as randomstring from 'randomstring';
import bcrypt from 'bcrypt';
import * as helperFunction from '../utils/helperFunction';
const moment = require("moment")

/* function for sending the error response */
export const errorResponse = (res: any, error: any, errorCode: any, message = constants.MESSAGES.bad_request) => {
    let response = { ...constants.defaultServerResponse };
    if (!_.isEmpty(error.message)) {
        if (error.message == 'SequelizeUniqueConstraintError: Validation error') {
            response.message = constants.MESSAGES.duplicate_value;
        } else {
            response.message = error.message;
        }
    } else {
        response.message = message;
    }
    response.success = false;
    response.status = errorCode;
    response.body = {data : error};
    return res.status(response.status).send(response);
};

/* function for sending the success response */
export const successResponse = (res: any, params: any, message: any) => {
    let response = { ...constants.defaultServerResponse };
    response.success = true;
    response.body = {data : params};
    response.message = message;
    response.status = <number>200;
    return res.status(response.status).send(response);
}

/*
* function to generate the random key
*/
export const gererateOtp = () => {
    // Generate Random Number
    const otp = randomstring.generate({
        charset: 'numeric',
        length: 4,
        numeric: true,
        letters: false,
        special: false,
        exclude: ["0"],
    });
    return process.env.DEFAULT_OTP == "true" ? '1234' : otp;
};

/*
* function to check, req is email or not
*/
export const CheckEmail = async (req: any) => {
    // check for email
    let result;
    if (/\@/.test(req.username)) {
        result = true;
    } else {
        result = false;
    }
    return result;
};

/*
* function to get the time
*/
export const calcluateOtpTime = (date: any) => {
    var d = new Date(date);
    var t = d.getTime();
    return Math.floor(t);
}

/*
*get the current time value
*/
export const currentUnixTimeStamp = () => {
    return Math.floor(Date.now());
}

/*
*get the current time value
*/
export const getUnixTimeStamp = (date: any, n: number) => {
    var d = new Date(date);
    return d.getTime() + n*60000;
}


/* function for bcrypt the password */
export const bcryptPassword = async (myPlaintextPassword) => {
    return bcrypt.hash(myPlaintextPassword, 10);
}

/* function for compare the passwords */
export const comparePassword = async (myPlaintextPassword, hash) => {
    return bcrypt.compare(myPlaintextPassword, hash);
}

/* function for compare the passwords */
export const jsonSegregate = async (jsonData: any) => {
    let keys = Object.keys(jsonData);
    var values = [];
    Object.keys(jsonData).forEach(function (key) {
        if (typeof jsonData[key] == 'string') {
            values.push("'" + jsonData[key] + "'");
        } else if (typeof jsonData[key] == 'number') {
            values.push(jsonData[key]);
        }
    });
    keys.push('created_at', 'updated_at');
    values.push("'" + helperFunction.currentUnixTimeStamp + "'", "'" + helperFunction.currentUnixTimeStamp + "'");

    return [keys, values];
}

export const validateJsonString = (text: string) => {
    if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        return true
    } else {
        return false
    }
}
