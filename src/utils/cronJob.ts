import _, { update } from "lodash";
import * as constants from "../constants";
import * as helperFunction from "../utils/helperFunction";
import { employersModel } from "../models";
import { employeeModel } from  "../models/employee"
import { notificationModel } from "../models/notification";
import { teamGoalModel } from  "../models/teamGoal"
import { teamGoalAssignModel } from  "../models/teamGoalAssign"
import { teamGoalAssignCompletionByEmployeeModel } from  "../models/teamGoalAssignCompletionByEmployee"
const schedule = require('node-schedule');
const Sequelize = require('sequelize');
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
    schedule.scheduleJob('*/4 * * * *', async ()=> {

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

                        if(!employeeLastActivityDate || timeDiff > 600){
                            isActiveInPastTenDays=false;
                        }

                        if(!employeeLastActivityDate || timeDiff > 420){
                            
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

            if(timeDiff > 600){
                isActiveInPastTenDays=false;
            }else{
                isActiveInPastTenDays=true;
            }

            if(!isActiveInPastTenDays){

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

    console.log("Goal submit reminder notification cron job started!")

    return true;
}