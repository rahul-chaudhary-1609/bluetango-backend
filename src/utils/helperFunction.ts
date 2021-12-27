const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
import * as constants from '../constants';
import * as AWS from 'aws-sdk';
import fs from 'fs';
import * as randomstring from 'randomstring';
const FCM = require('fcm-node');
const fcm = new FCM(process.env.FCM_SERVER_KEY); //put your server key here
import { EmployersService } from '../services/admin/employersService'
import { chatRealtionMappingInRoomModel } from "../models/chatRelationMappingInRoom";
import { coachScheduleModel } from "../models/coachSchedule";
import { groupChatRoomModel } from "../models/groupChatRoom";
import { zoomUserModel } from '../models/zoomUsers';
import fetch from 'node-fetch';
import { coachManagementModel, employeeModel } from '../models';
import moment from 'moment';
import 'moment-timezone';
import { employeeCoachSessionsModel } from '../models/employeeCoachSession';

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
        let msg =<any> {
            to: params.to,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: params.name || 'BluXinga'
            },
            subject: params.subject,
            html: params.html,
        };

        if(params.attachments){
            msg =<any> {
                to: params.to,
                from: {
                    email: process.env.SENDGRID_FROM_EMAIL,
                    name: 'BluXinga'
                },
                subject: params.subject,
                html: params.html,
                attachments:params.attachments,
            };
        }
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

export const pagination = async (page:number, page_size:number) => {
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
            sound:"sound",
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

export const scheduleZoomMeeting=async(params:any)=>{
    //comming soon...

    let coach=await convertPromiseToObject(
        await coachManagementModel.findByPk(params.session.coach_id)
    )

    let employee=await convertPromiseToObject(
        await employeeModel.findByPk(params.session.employee_id)
    )

    let zoomUser=await convertPromiseToObject(
        await zoomUserModel.findOne({
            where:{
                user_id:params.session.coach_id,
                type:constants.ZOOM_USER_TYPE.coach,
                status:constants.STATUS.active,
            }
        })
    )

    console.log("zoomUser1",zoomUser, constants.SECRETS.ZOOM_SECRETS.jwt_token)

    if(!zoomUser){

        let newZoomUser:any=await fetch(`${constants.URLS.ZOOM_URLS.base_url}/users/${coach.email}`,{
                    method:"GET",
                    headers:{
                        authorization:`Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
                        'content-type': "application/json"
                    }
                })
        
        newZoomUser=await newZoomUser.json();

        console.log("zoomUser2",zoomUser)

        if(!newZoomUser.id){
            let userBody=<any>{
                action: "custCreate",
                user_info: {
                  email: coach.email,
                  type: 1,
                  first_name: coach.name.split(" ")[0],
                }
              }
            
            await fetch(`${constants.URLS.ZOOM_URLS.base_url}/users`,{
                method:"POST",
                headers:{
                    authorization:`Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
                    'content-type': "application/json"
                },
                body:JSON.stringify(userBody)
            })

            
            
            newZoomUser=await fetch(`${constants.URLS.ZOOM_URLS.base_url}/users/${coach.email}`,{
                        method:"GET",
                        headers:{
                            authorization:`Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
                            'content-type': "application/json"
                        }
                    })
            
            newZoomUser=await newZoomUser.json();

            console.log("zoomUser3",zoomUser)
        }
        

        let zoomUserObj=<any>{
            user_id:params.session.coach_id,
            zoom_user_id:newZoomUser.id,
            email:coach.email,
            type:constants.ZOOM_USER_TYPE.coach,
            details:newZoomUser,
        }

        console.log("zoomUser4",zoomUserObj)

        zoomUser=await convertPromiseToObject( await zoomUserModel.create(zoomUserObj));
        
    }

    let startTime = moment(params.session.start_time, "HH:mm:ss");
    let endTime = moment(params.session.end_time, "HH:mm:ss");

    let duration = moment.duration(endTime.diff(startTime));

    let meetingBody=<any>{
        topic: `${params.session.query}`,
        type: 2,
        start_time: `${params.session.date}T${params.session.start_time}`,
        duration: `${Math.ceil(duration.asMinutes())}`,
        timezone: params.timezone,
        password:`${Math.floor(100000 + Math.random() * 900000)}`,
        agenda: `${params.session.query}`,

    }
    
    let meeting:any=await fetch(`${constants.URLS.ZOOM_URLS.base_url}/users/${coach.email}/meetings`,{
                    method:"POST",
                    headers:{
                        authorization:`Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
                        'content-type': "application/json"
                    },
                    body:JSON.stringify(meetingBody)
                })

    console.log(meetingBody,meeting,meeting.status)
    
    if(meeting.status==201){
        meeting=await meeting.json();

        delete meeting.settings;

        let mailParams = <any>{};
        mailParams.subject = "Zoom Meeting Details";

        //email to employee
        mailParams.to = employee.email;
        mailParams.html = `Hi  ${employee.name}
        <br> Please find zoom meeting details:
        <br><br><b> Join URL</b>: ${meeting.join_url}<br>
        <br><b>Meeting ID</b>: ${meeting.id}
        <br><b> Passcode</b>: ${meeting.password}
        `;

        await sendEmail(mailParams);

        //email to coach
        mailParams.to = coach.email;
        mailParams.html = `Hi  ${coach.name}
        <br> Please find zoom meeting details:
        <br><br><b> Join URL</b>: ${meeting.start_url}<br>
        <br><b>Meeting ID</b>: ${meeting.id}
        <br><b> Passcode</b>: ${meeting.password}
        `;

        await sendEmail(mailParams);

        // let details={
        //     "created_at": "2019-09-05T16:54:14Z",
        //     "duration": 15,
        //     "host_id": "AbcDefGHi",
        //     "id": 1100000,
        //     "join_url": "https://zoom.us/j/1100000",
        // }
        return meeting;
    }else{
        throw new Error(constants.MESSAGES.zoom_schedule_meeting_error)
    }

    
}

export const cancelZoomMeeting= async (params:any)=>{
    //comming soon...

    let coach=await convertPromiseToObject(
        await coachManagementModel.findByPk(params.session.coach_id)
    )

    let employee=await convertPromiseToObject(
        await employeeModel.findByPk(params.session.employee_id)
    )

    let meeting=await fetch(`${constants.URLS.ZOOM_URLS.base_url}/meetings/${params.session.details.id}`,{
        method:"DELETE",
        headers:{
            authorization:`Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
            'content-type': "application/json"
        },
    })

    if(meeting.status==204){
        let mailParams = <any>{};
        mailParams.subject = "Cancel Zoom Meeting";

        //email to employee
        mailParams.to = employee.email;
        mailParams.html = `Hi  ${employee.name}
        <br> Please find cancelled zoom meeting details:
        <br><b>Meeting ID</b>: ${params.session.details.id}
        `;

        await sendEmail(mailParams);

        //email to coach
        mailParams.to = coach.email;
        mailParams.html = `Hi  ${coach.name}
        <br> Please find cancelled zoom meeting details:
        <br><b>Meeting ID</b>: ${params.session.details.id}
        `;

        await sendEmail(mailParams);

        return true;
    }else if(meeting.status==404){
        throw new Error(constants.MESSAGES.zoom_meeting_not_found)
    }else{
        throw new Error(constants.MESSAGES.zoom_cancel_meeting_error)
    }
}

export const endZoomMeeting= async (params:any)=>{
    //comming soon...

    let meeting=await fetch(`${constants.URLS.ZOOM_URLS.base_url}/meetings/${params.session.details.id}/status`,{
        method:"PUT",
        headers:{
            authorization:`Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
            'content-type': "application/json"
        },
        body:JSON.stringify({
        action:"end"
        })
    })

    if(meeting.status==204){
        console.log("meeting.status\n",meeting.status)
        let startTime = moment(params.session.start_time, "HH:mm:ss");
        let endTime = moment(params.session.end_time, "HH:mm:ss");

        let duration = moment.duration(endTime.diff(startTime));
        
        employeeCoachSessionsModel.update({
                status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                call_duration:Math.ceil(duration.asMinutes()),
            },{
                where:{
                    id:params.session_id,
                }
            }
        )

        let meetingDeleted=await fetch(`${constants.URLS.ZOOM_URLS.base_url}/meetings/${params.session.details.id}`,{
            method:"DELETE",
            headers:{
                authorization:`Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
                'content-type': "application/json"
            },
        })        
        console.log("meetingDeleted.status\n",meetingDeleted.status)
        return true;
    }else if(meeting.status==404){
        console.log("meeting.status\n",meeting.status)
        throw new Error(constants.MESSAGES.zoom_meeting_not_found)
    }else{
        console.log("meeting.status\n",meeting.status)
        throw new Error(constants.MESSAGES.zoom_end_meeting_error)
    }
}

export const updateZoomMeetingDuration= async (params:any)=>{
    //comming soon...
    let meetingBody=<any>{
        duration: `${parseInt(params.session.details.duration)+parseInt(params.extendingMinutes)}`,
    }

    let meeting=await fetch(`${constants.URLS.ZOOM_URLS.base_url}/meetings/${params.session.details.id}`,{
        method:"PATCH",
        headers:{
            authorization:`Bearer ${constants.SECRETS.ZOOM_SECRETS.jwt_token}`,
            'content-type': "application/json"
        },
        body:JSON.stringify(meetingBody)
    })

    if(meeting.status==204){
        let endTime=moment(params.session.end_time,"HH:mm:ss").add(parseInt(params.extendingMinutes),"minutes").format("HH:mm:ss");
        let duration=`${parseInt(params.session.details.duration)+parseInt(params.extendingMinutes)}`;
        
        await employeeCoachSessionsModel.update({
            end_time:endTime,
            details:{
                ...params.session.details,
                duration,
            }
        },{
            where:{
                id:params.session.id
            }
        })

        return true;
    }else if(meeting.status==404){
        throw new Error(constants.MESSAGES.zoom_meeting_not_found)
    }else{
        throw new Error(constants.MESSAGES.zoom_update_meeting_error)
    }
}

export const checkPermission = async (req, res, next) => {
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
export const getUniqueChatRoomId = async ()=> {
    let isUniqueFound = false;
    let room_id = null;
    while (!isUniqueFound) {
        room_id = randomStringEightDigit();
        let chatRoom = await chatRealtionMappingInRoomModel.findOne({
            where: {
                room_id
            }
        });

        if (!chatRoom) {
            let groupChatRoom = await groupChatRoomModel.findOne({
                where: {
                    room_id
                }
            });

            if (!groupChatRoom) isUniqueFound = true;
        }
    }

    return room_id;
}

export const getMonday = (params) => {
    let date = new Date(params);
    let day = date.getDay();
    let diff =date.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

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

export const getUniqueSlotDateGroupId = async ()=> {
    let isUniqueFound = false;
    let slot_date_group_id= null;
    while (!isUniqueFound) {
        slot_date_group_id = getRandomStringOfLengthTen();
        let schedule = await coachScheduleModel.findOne({
            where: {
                slot_date_group_id
            }
        });

        if (!schedule) isUniqueFound=true 
    }

    return slot_date_group_id;
}

export const getUniqueSlotTimeGroupId = async ()=> {
    let isUniqueFound = false;
    let slot_time_group_id= null;
    while (!isUniqueFound) {
        slot_time_group_id = getRandomStringOfLengthTen();
        let schedule = await coachScheduleModel.findOne({
            where: {
                slot_time_group_id
            }
        });

        if (!schedule) isUniqueFound=true 
    }

    return slot_time_group_id;
}
export const deleteFile = (params: any) => {
    params.Bucket = process.env.AWS_BUCKET_NAME;
    s3Client.deleteObject(params, (error, data) => {
      if (error) {
        console.log(error)
      }
      console.log(data)
    });
  
  }