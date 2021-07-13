import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import * as tokenResponse from "../../utils/tokenResponse";
import { employersModel, industryTypeModel, employeeModel, } from "../../models";
import { paymentManagementModel } from "../../models/paymentManagement";
const schedule = require('node-schedule');
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
            //status: {[Op.in]: [0,1]}
        },
        order: [["createdAt", "DESC"]]
    });


       if (!_.isEmpty(existingUser) && existingUser.status == 0) {
           throw new Error(constants.MESSAGES.deactivate_account);
       } else if (!_.isEmpty(existingUser) && existingUser.status == 2) {
           throw new Error(constants.MESSAGES.delete_account);
       }else if (!_.isEmpty(existingUser)) {
        existingUser = await helperFunction.convertPromiseToObject(existingUser);
        let comparePassword = await appUtils.comparePassword(params.password, existingUser.password);
           if (comparePassword) {
               let updateObj = <any>{};
            delete existingUser.password;
            delete existingUser.reset_pass_otp;
            existingUser.isFirstTimeLogin = false;
            if (existingUser.first_time_login == 1) {
                existingUser.isFirstTimeLogin = true;

                updateObj = {
                    ...updateObj,
                    first_time_login_datetime: new Date(),
                }
                
            }
            if (existingUser.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.free) {
                let firstLoginDate = new Date(existingUser.first_time_login_datetime);
                let endTime = new Date((new Date(existingUser.first_time_login_datetime)).setDate(firstLoginDate.getDate() + 14));

                if ((new Date()) > endTime) {
                    updateObj = {
                        ...updateObj,
                        subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan,
                    }
                }
               }
               if (existingUser.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.paid) {
                   let plan = await paymentManagementModel.findOne({
                       where: {
                           employer_id: parseInt(existingUser.id),
                           status: constants.EMPLOYER_SUBSCRIPTION_PLAN_STATUS.active,
                       }
                   })

                   if (plan) {
                       if ((new Date()) < (new Date(plan.expiry_date))) {
                           updateObj = {
                               ...updateObj,
                               subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan,
                           }
                           plan.status = constants.EMPLOYER_SUBSCRIPTION_PLAN_STATUS.exhausted;
                           plan.save()
                       }                       
                   }
                   else
                    {
                       updateObj = {
                           ...updateObj,
                           subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan,
                       }
                    }
               }

               let token = await tokenResponse.employerTokenResponse(existingUser);

               await employersModel.update(updateObj,
                   {
                       where: {
                           email: params.username.toLowerCase(),
                       }
                   }
               );

               existingUser.industry_info = await helperFunction.convertPromiseToObject(await industryTypeModel.findByPk(existingUser.industry_type))
               existingUser.no_of_employee = await helperFunction.convertPromiseToObject(
                   await employeeModel.count({
                       where: {
                           current_employer_id: parseInt(existingUser.id),
                           status: [constants.STATUS.active, constants.STATUS.inactive],
                       }
                   })
               )
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

//     /*
//     e005JBg1RamqXfRccvlXoH:APA91bH_05rZB3PS8JRhzqJTf4ocQ6CW0V3UBw_QUzYbOqiOvHWOud6YfALazkXo50gM6zX2xKT1vsw83MO9TvOe8oD8oHjD_p_mqwYaGgwXpYqi-Aeuw9TsF1Ig4BUTpTzQhRhrFYHN
// * function to schedule job
// */
//     public async scheduleJob(user: any) {
//         let dev ="e005JBg1RamqXfRccvlXoH:APA91bH_05rZB3PS8JRhzqJTf4ocQ6CW0V3UBw_QUzYbOqiOvHWOud6YfALazkXo50gM6zX2xKT1vsw83MO9TvOe8oD8oHjD_p_mqwYaGgwXpYqi-Aeuw9TsF1Ig4BUTpTzQhRhrFYHN"
//         const startTime = new Date(Date.now() + 5000);
//         const endTime = new Date(startTime.getTime() + 25000);
//         const job = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/5 * * * * *' }, async function () {
//             console.log('Time for tea!');
//             let notificationData = <any>{
//                 title: 'Reminder Free Trial Expiration',
//                 body: `Your free trial of 14 days is going to expire in`,
//                 data: {
//                     type: constants.NOTIFICATION_TYPE.expiration_of_free_trial,
//                     title: 'Reminder Free Trial Expiration',
//                     message: `Your free trial of 14 days is going to expire in `,
//                 },
//             }
//             await helperFunction.sendFcmNotification([dev], notificationData);
//         });

//         return true;
//     }


    /*
    * function to change password 
    */
    public async changePassword(params: any, user: any) {
        let getEmployerData = await helperFunction.convertPromiseToObject(
            await employersModel.findOne({
                where: { id: user.uid }
            })
        );
        let comparePassword = await appUtils.comparePassword(params.old_password, getEmployerData.password);
        if (comparePassword) {
            let update = {
                'password': await appUtils.bcryptPassword(params.new_password)
            };

            return await employersModel.update(update, {
                where: { id: user.uid }
            });
        } else {
            throw new Error(constants.MESSAGES.invalid_old_password);
        }

    }

    /*
   * function to upload file 
   */
    public async uploadFile(params: any, folderName) {
        return await helperFunction.uploadFile(params, folderName);
    }

}