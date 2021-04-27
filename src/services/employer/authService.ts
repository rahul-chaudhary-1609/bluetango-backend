import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import * as tokenResponse from "../../utils/tokenResponse";
import { employersModel } from  "../../models";
import { notificationModel } from "../../models/notification";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class AuthService {
    constructor() { }

    /**
    * login function
    @param {} params pass all parameters from request
    */
   public async login(params: any) {

    let existingUser = await employersModel.findOne({
        where: {
            email: params.username.toLowerCase(),
            status: {[Op.in]: [0,1]}
        }
    });


       if (!_.isEmpty(existingUser) && existingUser.status == 0) {
           throw new Error(constants.MESSAGES.deactivate_account);
       } else if (!_.isEmpty(existingUser) && existingUser.status == 2) {
           throw new Error(constants.MESSAGES.delete_account);
       }else if (!_.isEmpty(existingUser)) {
        existingUser = await helperFunction.convertPromiseToObject(existingUser);
        let comparePassword = await appUtils.comparePassword(params.password, existingUser.password);
        if (comparePassword) {
            delete existingUser.password;
            delete existingUser.reset_pass_otp;
            existingUser.isFirstTimeLogin = false;
            if (existingUser.first_time_login == 1) {
                existingUser.isFirstTimeLogin = true;
                await employersModel.update({
                    first_time_login_datetime: new Date(),
                },
                    {
                        where: {
                            email: params.username.toLowerCase(),
                        }
                    }
                );
                
            }
            else {
                let trial_expiry_date = new Date(existingUser.first_time_login_datetime);
                trial_expiry_date.setDate(trial_expiry_date.getDate()+14)
                const timeDiff = Math.floor((trial_expiry_date.getTime() - (new Date()).getTime()) / 1000)

                if (timeDiff <= 259200) {
                    //add notification 
                    let notificationObj = <any>{
                        type_id: existingUser.id,
                        sender_id: existingUser.id,
                        reciever_id: existingUser.id,
                        type: constants.NOTIFICATION_TYPE.expiration_of_free_trial,
                        data: {
                            type: constants.NOTIFICATION_TYPE.expiration_of_free_trial,
                            title: 'Reminder Free Trial Expiration',
                            message: `Your free trial of 14 days is going to expire in ${Math.floor(timeDiff / 3600)} hour(s)`,
                            existingUser
                        },
                    }
                    await notificationModel.create(notificationObj);

                    //send push notification
                    let notificationData = <any>{
                        title: 'Reminder Free Trial Expiration',
                        body: `Your free trial of 14 days is going to expire in ${Math.floor(timeDiff / 3600)} hour(s)`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.expiration_of_free_trial,
                            title: 'Reminder Free Trial Expiration',
                            message: `Your free trial of 14 days is going to expire in ${Math.floor(timeDiff / 3600)} hour(s)`,
                            existingUser
                        },
                    }
                    await helperFunction.sendFcmNotification([existingUser.device_token], notificationData);
                }
            }
            let token = await tokenResponse.employerTokenResponse(existingUser);
            existingUser.token = token.token;
            return existingUser;
        } else {
            throw new Error(constants.MESSAGES.invalid_password);
        }
    } else {
        throw new Error(constants.MESSAGES.invalid_email);
    }
    }
    
    /*
    * function to set new pass 
    */
    public async resetPassword(params: any, user: any) {
        const update = <any>{
            password: await appUtils.bcryptPassword(params.password)
        };

        console.log("User", user)
        console.log("update",update)

        const qry = <any>{
            where: {
                id: user.uid
            }
        };
        if (user.user_role == constants.USER_ROLE.employer) {
            update.first_time_reset_password = 0;
            update.first_time_login = 0;
            return await employersModel.update(update, qry);
        } else {
            throw new Error(constants.MESSAGES.user_not_found);
        }

    }

    /**
* reset password function to add the data
* @param {*} params pass all parameters from request 
*/
    public async forgotPassword(params: any) {
        var existingUser;
        const qry = <any>{
            where: {
                email: params.email.toLowerCase(),
                status: { [Op.ne]: 2 }
            }
        };

        if (params.user_role == constants.USER_ROLE.employer) {
            existingUser = await employersModel.findOne(qry);
        } else {
            throw new Error(constants.MESSAGES.user_not_found);
        }

        if (!_.isEmpty(existingUser)) {
            // params.country_code = existingUser.country_code;
            let token = await tokenResponse.forgotPasswordTokenResponse(existingUser, params.user_role);
            const mailParams = <any>{};
            mailParams.to = params.email;
            mailParams.html = `Hi ${existingUser.name}
                <br> Click on the link below to reset your password
                <br> ${process.env.WEB_HOST_URL}?token=${token.token}
                <br> Please Note: For security purposes, this link expires in ${process.env.FORGOT_PASSWORD_LINK_EXPIRE_IN_MINUTES} Hours.
                `;
            mailParams.subject = "Reset Password Request";
            await helperFunction.sendEmail(mailParams);
            return true;
        } else {
            throw new Error(constants.MESSAGES.user_not_found);
        }

    }

    /*
 * function to update device token
 */
    public async updateEmployerDeviceToken(params: any, user: any) {
       return await employersModel.update(
            {
                device_token: params.device_token
            },
            {
                where: { id: user.uid },
                returning:true
            }
        )
    }


    /*
 * function to clear device token
 */
    public async clearEmployerDeviceToken(user: any) {
        return await employersModel.update(
            {
                device_token: null,
            },
            {
                where: { id: user.uid },
                returning: true
            }
        )
    }



}