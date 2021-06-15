import _ from "lodash";
import * as constants from "../constants";
import * as helperFunction from "../utils/helperFunction";
import { employersModel } from "../models";
import { notificationModel } from "../models/notification";
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
            let trialExpiryDate = new Date(employer.first_time_login_datetime);
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
            }
        }
    });

    console.log("Free trial expiration notification cron job started!")

    return true;
}