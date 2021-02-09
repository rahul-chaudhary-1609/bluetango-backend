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
exports.validateJsonString = exports.jsonSegregate = exports.comparePassword = exports.bcryptPassword = exports.getUnixTimeStamp = exports.currentUnixTimeStamp = exports.calcluateOtpTime = exports.CheckEmail = exports.gererateOtp = exports.successResponse = exports.errorResponse = void 0;
const lodash_1 = __importDefault(require("lodash"));
const constants = __importStar(require("../constants"));
const randomstring = __importStar(require("randomstring"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const helperFunction = __importStar(require("../utils/helperFunction"));
const moment = require("moment");
/* function for sending the error response */
exports.errorResponse = (res, error, errorCode, message = constants.MESSAGES.bad_request) => {
    let response = Object.assign({}, constants.defaultServerResponse);
    if (!lodash_1.default.isEmpty(error.message)) {
        if (error.message == 'SequelizeUniqueConstraintError: Validation error') {
            response.message = constants.MESSAGES.duplicate_value;
        }
        else {
            response.message = error.message;
        }
    }
    else {
        response.message = message;
    }
    response.success = false;
    response.status = errorCode;
    response.body = { data: error };
    return res.status(response.status).send(response);
};
/* function for sending the success response */
exports.successResponse = (res, params, message) => {
    let response = Object.assign({}, constants.defaultServerResponse);
    response.success = true;
    response.body = { data: params };
    response.message = message;
    response.status = 200;
    return res.status(response.status).send(response);
};
/*
* function to generate the random key
*/
exports.gererateOtp = () => {
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
exports.CheckEmail = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // check for email
    let result;
    if (/\@/.test(req.username)) {
        result = true;
    }
    else {
        result = false;
    }
    return result;
});
/*
* function to get the time
*/
exports.calcluateOtpTime = (date) => {
    var d = new Date(date);
    var t = d.getTime();
    return Math.floor(t);
};
/*
*get the current time value
*/
exports.currentUnixTimeStamp = () => {
    return Math.floor(Date.now());
};
/*
*get the current time value
*/
exports.getUnixTimeStamp = (date, n) => {
    var d = new Date(date);
    return d.getTime() + n * 60000;
};
/* function for bcrypt the password */
exports.bcryptPassword = (myPlaintextPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.hash(myPlaintextPassword, 10);
});
/* function for compare the passwords */
exports.comparePassword = (myPlaintextPassword, hash) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(myPlaintextPassword, hash);
});
/* function for compare the passwords */
exports.jsonSegregate = (jsonData) => __awaiter(void 0, void 0, void 0, function* () {
    let keys = Object.keys(jsonData);
    var values = [];
    Object.keys(jsonData).forEach(function (key) {
        if (typeof jsonData[key] == 'string') {
            values.push("'" + jsonData[key] + "'");
        }
        else if (typeof jsonData[key] == 'number') {
            values.push(jsonData[key]);
        }
    });
    keys.push('created_at', 'updated_at');
    values.push("'" + helperFunction.currentUnixTimeStamp + "'", "'" + helperFunction.currentUnixTimeStamp + "'");
    return [keys, values];
});
exports.validateJsonString = (text) => {
    if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        return true;
    }
    else {
        return false;
    }
};
//# sourceMappingURL=appUtils.js.map