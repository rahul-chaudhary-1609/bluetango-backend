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
exports.validateUnavailableTime = exports.calculate_time_slot = exports.parseTime = exports.createTimeSlots = exports.formatPassedAwayTime = exports.validateJsonString = exports.jsonSegregate = exports.comparePassword = exports.bcryptPassword = exports.getUnixTimeStamp = exports.currentUnixTimeStamp = exports.calcluateOtpTime = exports.CheckEmail = exports.gererateOtp = exports.successResponse = exports.errorResponse = void 0;
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
    if (/\@/.test(req.email)) {
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
exports.formatPassedAwayTime = (data) => {
    const formatedData = data;
    const today = new Date();
    for (let k = 0; k < data.length; k++) {
        const b = moment(data[k].date), a = moment(today), intervals = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'], out = [];
        for (let i = 0; i < intervals.length; i++) {
            const diff = a.diff(b, intervals[i]);
            b.add(diff, intervals[i]);
            out.push(diff);
        }
        if (out[0] >= 1) {
            formatedData[k]["time_passed"] = `${out[0]} year`;
        }
        else if (out[1] >= 1) {
            formatedData[k]["time_passed"] = `${out[1]} month`;
        }
        else if (out[2] >= 1) {
            formatedData[k]["time_passed"] = `${out[2]} week`;
        }
        else if (out[3] >= 1) {
            formatedData[k]["time_passed"] = `${out[3]} day`;
        }
        else if (out[4] >= 1) {
            formatedData[k]["time_passed"] = `${out[4]} hour`;
        }
        else if (out[5] >= 1) {
            formatedData[k]["time_passed"] = `${out[5]} minutes`;
        }
        else {
            formatedData[k]["time_passed"] = `${out[6]} seconds`;
        }
    }
    return formatedData;
};
exports.createTimeSlots = (data) => {
};
exports.parseTime = (s) => {
    let c = s.split(':');
    return parseInt(c[0]) * 60 + parseInt(c[1]);
};
const convertHours = (mins) => {
    let hour = Math.floor(mins / 60);
    let Mins = mins % 60;
    let converted = pad(hour, 2) + ':' + pad(Mins, 2);
    return converted;
};
const pad = (str, max) => {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
};
exports.calculate_time_slot = (start_time, end_time, interval) => {
    let i, formatted_time;
    let time_slots = new Array();
    for (let i = start_time; i <= end_time; i = i + interval) {
        formatted_time = convertHours(i);
        time_slots.push(formatted_time);
    }
    return time_slots;
};
exports.validateUnavailableTime = (timeSlots, slots, time_capture_type) => {
    var validSlots = [];
    var unavaibaleSlots = [];
    for (let i = 0; i < timeSlots.length; i++) {
        slots.filter((value, index, array) => {
            if (exports.parseTime(timeSlots[i].start_time) <= exports.parseTime(value.start_time) && exports.parseTime(timeSlots[i].end_time) > exports.parseTime(value.start_time) || exports.parseTime(timeSlots[i].start_time) < exports.parseTime(value.end_time) && exports.parseTime(timeSlots[i].end_time) >= exports.parseTime(value.end_time)) {
                validSlots.push(index);
            }
        });
    }
    if (time_capture_type == 1) {
        [...new Set(validSlots)].map((value) => {
            unavaibaleSlots.push(slots[value]);
            slots[value] = null;
        });
        slots = slots.filter(function (el) {
            return el != null;
        });
        return { availableSlots: unavaibaleSlots, unavailableSlots: slots };
    }
    else {
        [...new Set(validSlots)].map((value) => {
            unavaibaleSlots.push(slots[value]);
            slots[value] = null;
        });
        slots = slots.filter(function (el) {
            return el != null;
        });
        return { availableSlots: slots, unavailableSlots: unavaibaleSlots };
    }
};
//# sourceMappingURL=appUtils.js.map