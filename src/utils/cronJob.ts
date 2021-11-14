import _, { update } from "lodash";
import * as constants from "../constants";
import * as helperFunction from "../utils/helperFunction";
import { coachManagementModel, employersModel } from "../models";
import { employeeModel } from  "../models/employee"
import { notificationModel } from "../models/notification";
import { teamGoalModel } from  "../models/teamGoal"
import { teamGoalAssignModel } from  "../models/teamGoalAssign"
import { teamGoalAssignCompletionByEmployeeModel } from  "../models/teamGoalAssignCompletionByEmployee"
import { employeeCoachSessionsModel } from "../models/employeeCoachSession";
const schedule = require('node-schedule');
const Sequelize = require('sequelize');
import moment from "moment";
import 'moment-timezone';
var Op = Sequelize.Op;

/*
* function to schedule job
*/
export const scheduleFreeTrialExpirationNotificationJob = async()=> {
    schedule.scheduleJob('0 7 * * *', async ()=> {

        let employers = await helperFunction.convertPromiseToObject(
            await employersModel.findAll({
                where: {
                    status: constants.STATUS.active,
                    subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.free
                }
            })
        )

        for (let employer of employers) {
            if (employer.free_trial_status == constants.EMPLOYER_FREE_TRIAL_STATUS.on_going) {
                let trialExpiryDate = new Date(employer.free_trial_start_datetime);
                trialExpiryDate.setDate(trialExpiryDate.getDate() + 14)
                const timeRemaining = Math.floor((trialExpiryDate.getTime() - (new Date()).getTime()) / 1000)
                if (Math.floor(timeRemaining / 3600) <= 72 && Math.floor(timeRemaining / 3600) >= 0) {

                    let notificationObj = <any>{
                        type_id: employer.id,
                        sender_id: employer.id,
                        reciever_id: employer.id,
                        reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employer,
                        type: constants.NOTIFICATION_TYPE.expiration_of_free_trial,
                        data: {
                            type: constants.NOTIFICATION_TYPE.expiration_of_free_trial,
                            title: 'Reminder',
                            message: `Employer free trial of 14 days is going to expire in ${Math.floor(timeRemaining / 3600)} hour(s)`,
                            senderEmplyeeData: employer
                        },
                    }
                    await notificationModel.create(notificationObj);

                    if (!employer.device_token) continue;

                    //send push notification
                    let notificationData = <any>{
                        title: 'Reminder',
                        body: `Employer free trial of 14 days is going to expire in ${Math.floor(timeRemaining / 3600)} hour(s)`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.expiration_of_free_trial,
                            title: 'Reminder',
                            message: `Employer free trial of 14 days is going to expire in ${Math.floor(timeRemaining / 3600)} hour(s)`,
                            senderEmplyeeData: employer
                        },
                    }
                    await helperFunction.sendFcmNotification([employer.device_token], notificationData);
                } else if (Math.floor(timeRemaining / 3600) < 0) {
                    await employersModel.update({
                        subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan,
                        free_trial_status:constants.EMPLOYER_FREE_TRIAL_STATUS.over,
                    }, {
                        where: {
                            id: parseInt(employer.id),
                        }
                    })
                }
            }
        }
    });

    console.log("Free trial expiration notification cron job started!")

    return true;
}

/*
* function to schedule job
*/
export const scheduleGoalSubmitReminderNotificationJob = async()=> {
    schedule.scheduleJob('0 10 * * *', async ()=> {

        teamGoalAssignModel.hasOne(teamGoalModel,{ foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
        teamGoalAssignModel.hasOne(employeeModel,{foreignKey: "id", sourceKey: "employee_id", targetKey: "id"});
        teamGoalModel.hasOne(employeeModel,{foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
        teamGoalAssignModel.hasMany(teamGoalAssignCompletionByEmployeeModel,{ foreignKey: "team_goal_assign_id", sourceKey: "id", targetKey: "team_goal_assign_id" });

        let employees = await helperFunction.convertPromiseToObject(
            await employeeModel.findAll({
                where: {
                    status: constants.STATUS.active,
                }
            })
        )

        for (let employee of employees) 
        {
            let goals = await helperFunction.convertPromiseToObject(  await teamGoalAssignModel.findAll({
                where: {employee_id: employee.id },
                    include: [
                        {
                            model: teamGoalModel,
                            required: false,
                        },
                        {
                            model:teamGoalAssignCompletionByEmployeeModel,
                            separate: true,
                            required: false,
                            order: [["createdAt", "DESC"]]
                        }
                    ],
                    order: [["createdAt", "DESC"]]
                })
            )

            let isActiveInPastTenDays=true;
            let employeeLastGoalReminderDate=new Date(employee.last_goal_reminder_datetime);
            

            for (let goal of goals){
                let goalEndDate=new Date(goal.team_goal.end_date);
                let employeeLastSubmitReminderDate=new Date(goal.last_submit_reminder_datetime);
                let employeeLastActivityDate=goal.team_goal_assign_completion_by_employees[0]?.updatedAt && new Date(goal.team_goal_assign_completion_by_employees[0].updatedAt);
                

                let timeDiff = Math.floor((goalEndDate.getTime()-(new Date()).getTime()) / 1000)

                if(parseInt(goal.team_goal.enter_measure)>parseInt(goal.complete_measure)){

                    if(timeDiff>0){

                        if(employeeLastActivityDate){
                            timeDiff = Math.floor(((new Date()).getTime() - employeeLastActivityDate.getTime()) / 1000)
                        }

                        if(!employeeLastActivityDate || timeDiff > 864000){
                            isActiveInPastTenDays=false;
                        }

                        if(!employeeLastActivityDate || timeDiff > 604800){
                            
                            timeDiff = Math.floor(((new Date()).getTime() - employeeLastSubmitReminderDate.getTime()) / 1000)

                            if(timeDiff > 420){

                                let notificationObj = <any>{
                                    type_id: employee.id,
                                    sender_id: employee.id,
                                    reciever_id: employee.id,
                                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                                    type: constants.NOTIFICATION_TYPE.goal_submit_reminder,
                                    data: {
                                        type: constants.NOTIFICATION_TYPE.goal_submit_reminder,
                                        title: 'Reminder',
                                        message: `You have not filled anything in respect of goal ${goal.team_goal.title} in past 7 days.`,
                                        senderEmplyeeData: employee
                                    },
                                }
                                await notificationModel.create(notificationObj);
            
                                if (!employee.device_token) continue;
            
                                //send push notification
                                let notificationData = <any>{
                                    title: 'Reminder',
                                    body: `You have not filled anything in respect of goal ${goal.team_goal.title} in past 7 days.`,
                                    data: {
                                        type: constants.NOTIFICATION_TYPE.goal_submit_reminder,
                                        title: 'Reminder',
                                        message: `You have not filled anything in respect of goal ${goal.team_goal.title} in past 7 days.`,
                                        senderEmplyeeData: employee
                                    },
                                }
                                await helperFunction.sendFcmNotification([employee.device_token], notificationData);

                                await teamGoalAssignModel.update(
                                        {
                                            last_submit_reminder_datetime:new Date(),
                                        },
                                        {
                                            where:{
                                                id:goal.id
                                            }
                                        }
                                )
                            
                            }
                        }
                    }   
                }             
            }

            let timeDiff = Math.floor(((new Date()).getTime() - employeeLastGoalReminderDate.getTime()) / 1000)

            if(timeDiff > 864000){
                isActiveInPastTenDays=false;
            }else{
                isActiveInPastTenDays=true;
            }

            if(!isActiveInPastTenDays && goals && goals.length>0){

                let notificationObj = <any>{
                    type_id: employee.id,
                    sender_id: employee.id,
                    reciever_id: employee.id,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: constants.NOTIFICATION_TYPE.goal_submit_reminder,
                    data: {
                        type: constants.NOTIFICATION_TYPE.goal_submit_reminder,
                        title: 'Reminder',
                        message: `You have not filled anything in respect of any goal in past 10 days.`,
                        senderEmplyeeData: employee
                    },
                }
                await notificationModel.create(notificationObj);

                if (!employee.device_token) continue;

                //send push notification
                let notificationData = <any>{
                    title: 'Reminder',
                    body: `You have not filled anything in respect of any goal in past 10 days.`,
                    data: {
                        type: constants.NOTIFICATION_TYPE.goal_submit_reminder,
                        title: 'Reminder',
                        message: `You have not filled anything in respect of any goal in past 10 days.`,
                        senderEmplyeeData: employee
                    },
                }
                await helperFunction.sendFcmNotification([employee.device_token], notificationData);

                await employeeModel.update(
                        {
                            last_goal_reminder_datetime:new Date(),
                        },
                        {
                            where:{
                                id:employee.id
                            }
                        }
                )
            }
        }

    });

    console.log("Goal submit reminder notification cron job has started!")

    return true;
}


export const scheduleDeleteNotificationJob = async()=> {
    schedule.scheduleJob('0 */24 * * *', async ()=> {

        let dateBeforeTenDays = new Date((new Date()).setDate(new Date().getDate()-10));

        notificationModel.destroy({
            where:{
                createdAt:{
                    [Op.lt]:dateBeforeTenDays,
                },
                status:{
                    [Op.notIn]:[constants.STATUS.active]
                }
            }
        })

        let dateBeforeSixtyDays = new Date((new Date()).setDate(new Date().getDate()-30));

        notificationModel.destroy({
            where:{
                createdAt:{
                    [Op.lt]:dateBeforeSixtyDays,
                },
            }
        })

        
    });

    console.log("Delete Notification cron job has started!")

    return true;
}

const sendNotification=async(params:any)=>{

    let coach=await helperFunction.convertPromiseToObject(
        await coachManagementModel.findByPk(params.session.coach_id)
    )

    delete coach.password;

    let notificationObj = <any>{
        type_id: coach.id,
        sender_id: coach.id,
        reciever_id: coach.id,
        reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
        type: constants.NOTIFICATION_TYPE.meeting_about_to_end,
        data: {
            type: params.notificationType,
            title: params.title,
            message: params.body,
            senderEmplyeeData: coach,
            session:params.session,
        },
    }
    await notificationModel.create(notificationObj);

    if (coach.device_token){
        //send push notification
        let notificationData = <any>{
            title: params.title,
            body: params.body,
            data: {
                type: params.notificationType,
                title: params.title,
                message: params.body,
                senderEmplyeeData: coach,
                session:params.session,
            },
        }
        await helperFunction.sendFcmNotification([coach.device_token], notificationData);
    }    

    if(params.isEmployee){
        let employee=await helperFunction.convertPromiseToObject(
            await employeeModel.findByPk(params.session.employee_id)
        )
    
        delete employee.password;

        notificationObj = <any>{
            type_id: employee.id,
            sender_id: employee.id,
            reciever_id: employee.id,
            reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
            type: params.notificationType,
            data: {
                type: params.notificationType,
                title: params.title,
                message: params.body,
                senderEmplyeeData: employee,
                session:params.session,
            },
        }
        await notificationModel.create(notificationObj);
    
        if (employee.device_token){
            //send push notification
            let notificationData = <any>{
                title: params.title,
                body: params.body,
                data: {
                    type: params.notificationType,
                    title: params.title,
                    message: params.body,
                    senderEmplyeeData: employee,
                    session:params.session,
                },
            }
            await helperFunction.sendFcmNotification([employee.device_token], notificationData);
        }
    }    
    
}

export const scheduleMeetingRemainingTimeNotificationJob = async()=> {
    schedule.scheduleJob('* * * * *', async ()=> {

        let sessions=await helperFunction.convertPromiseToObject(
                await employeeCoachSessionsModel.findAll({
                    where:{
                        status:constants.EMPLOYEE_COACH_SESSION_STATUS.accepted,
                        date:{
                            [Op.gte]:moment(new Date()).tz(constants.TIME_ZONE).format("YYYY-MM-DD")
                        },
                        end_time:{
                            [Op.gte]:moment(new Date()).tz(constants.TIME_ZONE).format("HH:mm:ss")
                        }
                    }
                }
            )
        )

        for(let session of sessions){
            let currentDateTime = moment(new Date()).tz(constants.TIME_ZONE).format("HH:mm:ss");
            let currentTime=moment(currentDateTime, "HH:mm:ss");
            let startTime = moment(session.start_time, "HH:mm:ss");
            let endTime = moment(session.end_time, "HH:mm:ss");

            let startDuration = moment.duration(currentTime.diff(startTime));
            let endDuration = moment.duration(endTime.diff(currentTime));

            let diffFromStartInSeconds = Math.ceil(startDuration.asSeconds());
            let diffToEndInSeconds = Math.ceil(endDuration.asSeconds());

            console.log(currentTime,"\n",startTime,"\n",endTime,"\n","\n",diffFromStartInSeconds,"\n",diffToEndInSeconds)

            if(session.type==constants.EMPLOYEE_COACH_SESSION_TYPE.free){                

                if(diffFromStartInSeconds>=1200){
                    let params=<any>{
                        session,
                    }
                    await helperFunction.endZoomMeeting(params)                    
                }else if(diffFromStartInSeconds>=900){
                    let params=<any>{
                        notificationType:constants.NOTIFICATION_TYPE.update_meeting_duration,
                        session,
                        title:`Update Meeting duration`,
                        body:`Do you want to update the meeting duration by 5 minutes`,
                        isEmployee:false,
                    }

                    await sendNotification(params);
                    
                }else if(diffFromStartInSeconds>=600){
                    let params=<any>{
                        notificationType:constants.NOTIFICATION_TYPE.meeting_about_to_end,
                        session,
                        title:`Reminder`,
                        body:`Ongoing zoom meeting will end in 5 minutes`,
                        isEmployee:true,
                    }

                    await sendNotification(params);                  
                }
            }else if(session.type==constants.EMPLOYEE_COACH_SESSION_TYPE.paid){

                if(diffToEndInSeconds<=300){
                    let params=<any>{
                        notificationType:constants.NOTIFICATION_TYPE.meeting_about_to_end,
                        session,
                        title:`Reminder`,
                        body:`Ongoing zoom meeting will end in 5 minutes`,
                        isEmployee:true,
                    }

                    await sendNotification(params);
                }
            }
        }
        
    });

    console.log("Delete Meeting Remaining Time Notification Job has started!")

    return true;
}

// export const scheduleMarkEmployeeCoachSessionAsComepletedOrRejetctedJob = async()=> {
//     schedule.scheduleJob('0 */24 * * *', async ()=> {

        
//         employeeCoachSessionsModel.update({
//                 status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed
//             },{
//                 where:{
//                     status:constants.EMPLOYEE_COACH_SESSION_STATUS.accepted,
//                     date:{
//                         [Op.lt]:moment(new Date()).format("YYYY-MM-DD")
//                     },
//                     end_time:{
//                         [Op.lt]:moment(new Date()).format("HH:mm:ss")
//                     }
//                 }
//             }
//         )

//         employeeCoachSessionsModel.update({
//                 status:constants.EMPLOYEE_COACH_SESSION_STATUS.rejected
//             },{
//                 where:{
//                     status:constants.EMPLOYEE_COACH_SESSION_STATUS.pending,
//                     date:{
//                         [Op.lt]:moment(new Date()).format("YYYY-MM-DD")
//                     },
//                     end_time:{
//                         [Op.lt]:moment(new Date()).format("HH:mm:ss")
//                     }
//                 }
//             }
//         )

        
//     });

//     console.log("schedule Mark Employee Coach Session As Comepleted Or Rejetcted Job has started!")

//     return true;
// }