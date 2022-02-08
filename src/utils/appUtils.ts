import _ from 'lodash';
import * as constants from '../constants';
import * as randomstring from 'randomstring';
import bcrypt from 'bcrypt';
import * as helperFunction from '../utils/helperFunction';
const moment = require("moment")
const excelToJson = require('convert-excel-to-json');

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
    response.body = { data: error };
    return res.status(response.status).send(response);
};

/* function for sending the success response */
export const successResponse = (res: any, params: any, message: any) => {
    let response = { ...constants.defaultServerResponse };
    response.success = true;
    response.body = { data: params };
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
    if (/\@/.test(req.email)) {
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
    return d.getTime() + n * 60000;
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
export const formatPassedAwayTime = (data: any) => {
    const formatedData = data;
    const today = new Date();
    for (let k = 0; k < data.length; k++) {
        const b = moment(data[k].date),
            a = moment(today),
            intervals = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'],
            out = [];

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
    return formatedData
}
export const createTimeSlots = (data: any) => {

}
export const parseTime = (s: any) => {
    let c = s.split(':');
    return parseInt(c[0]) * 60 + parseInt(c[1]);
}

const convertHours = (mins: any) => {
    let hour = Math.floor(mins / 60);
    let Mins = mins % 60;
    let converted = pad(hour, 2) + ':' + pad(Mins, 2);
    return converted;
}

const pad = (str: any, max: any) => {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

export const calculate_time_slot = (start_time: any, end_time: any, interval: any) => {
    let i, formatted_time;
    let time_slots = new Array();
    for (let i = start_time; i <= end_time; i = i + interval) {
        formatted_time = convertHours(i);
        time_slots.push(formatted_time);
    }
    return time_slots;
}
export const validateUnavailableTime = (timeSlots, slots, time_capture_type) => {
    var validSlots = [];
    var unavaibaleSlots = [];
    for (let i = 0; i < timeSlots.length; i++) {
        slots.filter((value, index, array) => {
            if (parseTime(timeSlots[i].start_time) <= parseTime(value.start_time) && parseTime(timeSlots[i].end_time) > parseTime(value.start_time) || parseTime(timeSlots[i].start_time) < parseTime(value.end_time) && parseTime(timeSlots[i].end_time) >= parseTime(value.end_time)) {
                validSlots.push(index);
            }
        })
    }
    if (time_capture_type == 1) {
        [... new Set(validSlots)].map((value) => {
            unavaibaleSlots.push(slots[value])
            slots[value] = null;

        })
        slots = slots.filter(function (el) {
            return el != null;
        });
        return { availableSlots: unavaibaleSlots.map(v => ({...v, is_available: constants.COACH_SCHEDULE_STATUS.available})), unavailableSlots: slots.map(v => ({...v, is_available: constants.COACH_SCHEDULE_STATUS.unavailable})) }
    } else {
        [... new Set(validSlots)].map((value) => {
            unavaibaleSlots.push(slots[value])
            slots[value] = null;

        })
        slots = slots.filter(function (el) {
            return el != null;
        });
        return { availableSlots: slots.map(v => ({...v, is_available: constants.COACH_SCHEDULE_STATUS.available})), unavailableSlots: unavaibaleSlots.map(v => ({...v, is_available: constants.COACH_SCHEDULE_STATUS.unavailable})) }
    }
}
export const UploadExcelToJson=async(path, headerRow, columnToKey)=> {
    try {
        console.log(path, headerRow, columnToKey)
      columnToKey['*'] = '{{columnHeader}}'
      let result = excelToJson({
        sourceFile: path,
        columnToKey: columnToKey,
        header: {
          rows: headerRow
        }
      });
      let columnKeyObj = {}
      for (const value of Object.values(columnToKey)) {
        columnKeyObj[`${value}`] = null
      }
      delete columnKeyObj["{{columnHeader}}"];
      result = (result && result[Object.keys(result)[0]]) ? result[Object.keys(result)[0]] : [];
      result.forEach((element, index, array) => {
        result[index] = { ...columnKeyObj, ...element }
      })
      return result;
    } catch (err) {
      return err;
    }
  }
