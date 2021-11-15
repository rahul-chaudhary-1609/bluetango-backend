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
exports.getUniqueSlotTimeGroupId = exports.getUniqueSlotDateGroupId = exports.getMonday = exports.getUniqueChatRoomId = exports.randomStringEightDigit = exports.checkPermission = exports.updateZoomMeetingDuration = exports.endZoomMeeting = exports.cancelZoomMeeting = exports.scheduleZoomMeeting = exports.sendFcmNotification = exports.getCurrentDate = exports.convertPromiseToObject = exports.pagination = exports.currentUnixTimeStamp = exports.sendEmail = exports.uploadFile = void 0;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
const constants = __importStar(require("../constants"));
const AWS = __importStar(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
const randomstring = __importStar(require("randomstring"));
const FCM = require('fcm-node');
const fcm = new FCM(process.env.FCM_SERVER_KEY); //put your server key here
const employersService_1 = require("../services/admin/employersService");
const chatRelationMappingInRoom_1 = require("../models/chatRelationMappingInRoom");
const coachSchedule_1 = require("../models/coachSchedule");
const groupChatRoom_1 = require("../models/groupChatRoom");
const zoomUsers_1 = require("../models/zoomUsers");
const node_fetch_1 = __importDefault(require("node-fetch"));
const models_1 = require("../models");
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
const employeeCoachSession_1 = require("../models/employeeCoachSession");
//Instantiates a Home services  
const employersService = new employersService_1.EmployersService();
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
        let msg = {
            to: params.to,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: 'BluXinga'
            },
            subject: params.subject,
            html: params.html,
        };
        if (params.attachments) {
            msg = {
                to: params.to,
                from: {
                    email: process.env.SENDGRID_FROM_EMAIL,
                    name: 'BluXinga'
                },
                subject: params.subject,
                html: params.html,
                attachments: params.attachments,
            };
        }
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
/**
 *
 * @param tokens - fcm-device token for user's device
 * @param notification - object with body and title
 * @param payload
 */
exports.sendFcmNotification = (tokens, notification) => __awaiter(void 0, void 0, void 0, function* () {
    var message = {
        registration_ids: tokens,
        notification: {
            title: notification.title,
            body: notification.body,
            image: notification.image || null,
            sound: "sound",
        },
        data: notification.data
    };
    if (tokens.length) {
        fcm.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!", notification, JSON.stringify(err));
            }
            else {
                console.log("Successfully sent with response: ", response);
                return response;
            }
        });
    }
    else {
        console.log("No FCM Device token registered yet.");
    }
});
exports.scheduleZoomMeeting = (params) => __awaiter(void 0, void 0, void 0, function* () {
    //comming soon...
    let coach = yield exports.convertPromiseToObject(yield models_1.coachManagementModel.findByPk(params.session.coach_id));
    let employee = yield exports.convertPromiseToObject(yield models_1.employeeModel.findByPk(params.session.employee_id));
    let zoomUser = yield exports.convertPromiseToObject(yield zoomUsers_1.zoomUserModel.findOne({
        where: {
            user_id: params.session.coach_id,
            type: constants.ZOOM_USER_TYPE.coach,
            status: constants.STATUS.active,
        }
    }));
    console.log("zoomUser1", zoomUser, constants.SECRETS.ZOOM_SECRETS.jwt_token);
    if (!zoomUser) {
        let newZoomUser = yield node_fetch_1.default(`${constants.URLS.ZOOM_URLS.base_url}/users/${coach.email}`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
                'content-type': "application/json"
            }
        });
        newZoomUser = yield newZoomUser.json();
        console.log("zoomUser2", zoomUser);
        if (!newZoomUser.id) {
            let userBody = {
                action: "custCreate",
                user_info: {
                    email: coach.email,
                    type: 1,
                    first_name: coach.name.split(" ")[0],
                }
            };
            yield node_fetch_1.default(`${constants.URLS.ZOOM_URLS.base_url}/users`, {
                method: "POST",
                headers: {
                    authorization: `Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
                    'content-type': "application/json"
                },
                body: JSON.stringify(userBody)
            });
            newZoomUser = yield node_fetch_1.default(`${constants.URLS.ZOOM_URLS.base_url}/users/${coach.email}`, {
                method: "GET",
                headers: {
                    authorization: `Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
                    'content-type': "application/json"
                }
            });
            newZoomUser = yield newZoomUser.json();
            console.log("zoomUser3", zoomUser);
        }
        let zoomUserObj = {
            user_id: params.session.coach_id,
            zoom_user_id: newZoomUser.id,
            email: coach.email,
            type: constants.ZOOM_USER_TYPE.coach,
            details: newZoomUser,
        };
        console.log("zoomUser4", zoomUserObj);
        zoomUser = yield exports.convertPromiseToObject(yield zoomUsers_1.zoomUserModel.create(zoomUserObj));
    }
    let startTime = moment_1.default(params.session.start_time, "HH:mm:ss");
    let endTime = moment_1.default(params.session.end_time, "HH:mm:ss");
    let duration = moment_1.default.duration(endTime.diff(startTime));
    let meetingBody = {
        topic: `${params.session.query}`,
        type: 2,
        start_time: `${params.session.date}T${params.session.start_time}`,
        duration: `${Math.ceil(duration.asMinutes())}`,
        timezone: params.timezone,
        password: `${Math.floor(100000 + Math.random() * 900000)}`,
        agenda: `${params.session.query}`,
    };
    let meeting = yield node_fetch_1.default(`${constants.URLS.ZOOM_URLS.base_url}/users/${coach.email}/meetings`, {
        method: "POST",
        headers: {
            authorization: `Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
            'content-type': "application/json"
        },
        body: JSON.stringify(meetingBody)
    });
    console.log(meetingBody, meeting, meeting.status);
    if (meeting.status == 201) {
        meeting = yield meeting.json();
        delete meeting.settings;
        let mailParams = {};
        mailParams.subject = "Zoom Meeting Details";
        //email to employee
        mailParams.to = employee.email;
        mailParams.html = `Hi  ${employee.name}
        <br> Please find zoom meeting details:
        <br><br><b> Join URL</b>: ${meeting.join_url}<br>
        <br><b>Meeting ID</b>: ${meeting.id}
        <br><b> Passcode</b>: ${meeting.password}
        `;
        yield exports.sendEmail(mailParams);
        //email to coach
        mailParams.to = coach.email;
        mailParams.html = `Hi  ${coach.name}
        <br> Please find zoom meeting details:
        <br><br><b> Join URL</b>: ${meeting.start_url}<br>
        <br><b>Meeting ID</b>: ${meeting.id}
        <br><b> Passcode</b>: ${meeting.password}
        `;
        yield exports.sendEmail(mailParams);
        // let details={
        //     "created_at": "2019-09-05T16:54:14Z",
        //     "duration": 15,
        //     "host_id": "AbcDefGHi",
        //     "id": 1100000,
        //     "join_url": "https://zoom.us/j/1100000",
        // }
        return meeting;
    }
    else {
        throw new Error(constants.MESSAGES.zoom_schedule_meeting_error);
    }
});
exports.cancelZoomMeeting = (params) => __awaiter(void 0, void 0, void 0, function* () {
    //comming soon...
    let coach = yield exports.convertPromiseToObject(yield models_1.coachManagementModel.findByPk(params.session.coach_id));
    let employee = yield exports.convertPromiseToObject(yield models_1.employeeModel.findByPk(params.session.employee_id));
    let meeting = yield node_fetch_1.default(`${constants.URLS.ZOOM_URLS.base_url}/meetings/${params.session.details.id}`, {
        method: "DELETE",
        headers: {
            authorization: `Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
            'content-type': "application/json"
        },
    });
    if (meeting.status == 204) {
        let mailParams = {};
        mailParams.subject = "Cancel Zoom Meeting";
        //email to employee
        mailParams.to = employee.email;
        mailParams.html = `Hi  ${employee.name}
        <br> Please find cancelled zoom meeting details:
        <br><b>Meeting ID</b>: ${params.session.details.id}
        `;
        yield exports.sendEmail(mailParams);
        //email to coach
        mailParams.to = coach.email;
        mailParams.html = `Hi  ${coach.name}
        <br> Please find cancelled zoom meeting details:
        <br><b>Meeting ID</b>: ${params.session.details.id}
        `;
        yield exports.sendEmail(mailParams);
        return true;
    }
    else if (meeting.status == 404) {
        throw new Error(constants.MESSAGES.zoom_meeting_not_found);
    }
    else {
        throw new Error(constants.MESSAGES.zoom_cancel_meeting_error);
    }
});
exports.endZoomMeeting = (params) => __awaiter(void 0, void 0, void 0, function* () {
    //comming soon...
    let meeting = yield node_fetch_1.default(`${constants.URLS.ZOOM_URLS.base_url}/meetings/${params.session.details.id}/status`, {
        method: "PUT",
        headers: {
            authorization: `Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
            'content-type': "application/json"
        },
        body: JSON.stringify({
            action: "end"
        })
    });
    if (meeting.status == 204) {
        console.log("meeting.status\n", meeting.status);
        employeeCoachSession_1.employeeCoachSessionsModel.update({
            status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed
        }, {
            where: {
                id: params.session_id,
            }
        });
        yield node_fetch_1.default(`${constants.URLS.ZOOM_URLS.base_url}/meetings/${params.session.details.id}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
                'content-type': "application/json"
            },
        });
        return true;
    }
    else if (meeting.status == 404) {
        console.log("meeting.status\n", meeting.status);
        throw new Error(constants.MESSAGES.zoom_meeting_not_found);
    }
    else {
        console.log("meeting.status\n", meeting.status);
        throw new Error(constants.MESSAGES.zoom_end_meeting_error);
    }
});
exports.updateZoomMeetingDuration = (params) => __awaiter(void 0, void 0, void 0, function* () {
    //comming soon...
    let meetingBody = {
        duration: `${parseInt(params.session.details.duration) + 5}`,
    };
    let meeting = yield node_fetch_1.default(`${constants.URLS.ZOOM_URLS.base_url}/meetings/${params.session.details.id}`, {
        method: "PATCH",
        headers: {
            authorization: `Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
            'content-type': "application/json"
        },
        body: JSON.stringify(meetingBody)
    });
    if (meeting.status == 204) {
        let endTime = moment_1.default(params.session.end_time, "HH:mm:ss").add(5, "minutes").format("HH:mm:ss");
        let duration = `${parseInt(params.session.details.duration) + 5}`;
        yield employeeCoachSession_1.employeeCoachSessionsModel.update({
            end_time: endTime,
            details: Object.assign(Object.assign({}, params.session.details), { duration })
        }, {
            where: {
                id: params.session.id
            }
        });
        return true;
    }
    else if (meeting.status == 404) {
        throw new Error(constants.MESSAGES.zoom_meeting_not_found);
    }
    else {
        throw new Error(constants.MESSAGES.zoom_update_meeting_error);
    }
});
exports.checkPermission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req - - -  -', req.user.user_role);
        if (req.user.user_role == constants.USER_ROLE.sub_admin) {
            let params = {};
            params.subAdminId = req.user.uid;
            const subAdmin = yield employersService.subAdminDetails(params);
            if (subAdmin) {
                console.log('subAdmin - - -', subAdmin);
                req.permissions = subAdmin.permissions;
                return next();
            }
        }
        else {
            return next();
        }
    }
    catch (error) {
        throw new Error(error);
    }
});
/*
* function to generate the random key
*/
exports.randomStringEightDigit = () => {
    // Generate Random Number
    const uniqueID = randomstring.generate({
        charset: 'numeric',
        length: 15,
        numeric: true,
        letters: false,
        special: false,
        exclude: ["0"],
    });
    return uniqueID;
};
/**
     * function to generate unique room id
     */
exports.getUniqueChatRoomId = () => __awaiter(void 0, void 0, void 0, function* () {
    let isUniqueFound = false;
    let room_id = null;
    while (!isUniqueFound) {
        room_id = exports.randomStringEightDigit();
        let chatRoom = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findOne({
            where: {
                room_id
            }
        });
        if (!chatRoom) {
            let groupChatRoom = yield groupChatRoom_1.groupChatRoomModel.findOne({
                where: {
                    room_id
                }
            });
            if (!groupChatRoom)
                isUniqueFound = true;
        }
    }
    return room_id;
});
exports.getMonday = (params) => {
    let date = new Date(params);
    let day = date.getDay();
    let diff = date.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(date.setDate(diff));
};
/*
* function to generate the random key
*/
let getRandomStringOfLengthTen = () => {
    // Generate Random Number
    return randomstring.generate({
        charset: "alphanumeric",
        length: 10,
        readable: true,
    });
};
exports.getUniqueSlotDateGroupId = () => __awaiter(void 0, void 0, void 0, function* () {
    let isUniqueFound = false;
    let slot_date_group_id = null;
    while (!isUniqueFound) {
        slot_date_group_id = getRandomStringOfLengthTen();
        let schedule = yield coachSchedule_1.coachScheduleModel.findOne({
            where: {
                slot_date_group_id
            }
        });
        if (!schedule)
            isUniqueFound = true;
    }
    return slot_date_group_id;
});
exports.getUniqueSlotTimeGroupId = () => __awaiter(void 0, void 0, void 0, function* () {
    let isUniqueFound = false;
    let slot_time_group_id = null;
    while (!isUniqueFound) {
        slot_time_group_id = getRandomStringOfLengthTen();
        let schedule = yield coachSchedule_1.coachScheduleModel.findOne({
            where: {
                slot_time_group_id
            }
        });
        if (!schedule)
            isUniqueFound = true;
    }
    return slot_time_group_id;
});
//# sourceMappingURL=helperFunction.js.map