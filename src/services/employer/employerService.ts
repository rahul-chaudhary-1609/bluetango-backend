import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import { employeeModel, employersModel } from "../../models";
import { subscriptionManagementModel } from "../../models/subscriptionManagement";
import { paymentManagementModel } from "../../models/paymentManagement";
import { industryTypeModel } from "../../models/industryType";
import { contactUsModel } from "../../models/contactUs";
import { notificationModel } from "../../models/notification";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class EmployerService {
    constructor() { }



    public async startFreeTrial(user: any) {
        let employer = await helperFunction.convertPromiseToObject(
            await employersModel.findOne({
                where: {
                    id: parseInt(user.uid),
                    status: { [Op.ne]: 2 }
                }
            })
        )

        if (employer.free_trial_status == constants.EMPLOYER_FREE_TRIAL_STATUS.on_going) {
            throw new Error(constants.MESSAGES.employer_free_trial_already_started)            
        } else if (employer.free_trial_status == constants.EMPLOYER_FREE_TRIAL_STATUS.over) {
            throw new Error(constants.MESSAGES.employer_free_trial_already_exhausted)
        } else {
            await employersModel.update({
                subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.free,
                free_trial_status: constants.EMPLOYER_FREE_TRIAL_STATUS.on_going,
                free_trial_start_datetime:new Date(),
            }, {
                where: {
                    id: parseInt(user.uid)
                }
            })

            return true;
        }
    }

    /**
    * function to get Subscription Plan List
    @param {} params pass all parameters from request
    */
    public async getSubscriptionPlanList(user:any) {
        let subscriptionList = await helperFunction.convertPromiseToObject( await subscriptionManagementModel.findAndCountAll({
            attributes: ['id', 'plan_name', 'description', 'charge', 'duration'],
            where: {
                status: constants.STATUS.active,
            }
        }));

        let subscription = await helperFunction.convertPromiseToObject(
            await paymentManagementModel.findOne({
                where: {
                    employer_id: parseInt(user.uid),
                    status: constants.EMPLOYER_SUBSCRIPTION_PLAN_STATUS.active,
                }
            })
        )

        if (subscription) {
            subscriptionList.rows = subscriptionList.rows.filter((row) => row.id != subscription.plan_id)
        }

        for (let plan of subscriptionList.rows) {
            let expiry_date = new Date();
            expiry_date.setDate(expiry_date.getDate() + parseInt(plan.duration));
            plan.expiry_date = expiry_date;
        }

        return subscriptionList;
    }

    /**
    * function to buy Subscription Plan
    @param {} params pass all parameters from request
    */
    public async buyPlan(params: any, user: any) {

        let plan =await paymentManagementModel.findOne({
                where: {
                    employer_id: parseInt(user.uid),
                    status: constants.EMPLOYER_SUBSCRIPTION_PLAN_STATUS.active,
                }
            })

        if (plan) {
            plan.status = constants.EMPLOYER_SUBSCRIPTION_PLAN_STATUS.exhausted;
            plan.save()
        }

        let subscriptionPlan = await helperFunction.convertPromiseToObject(
            await subscriptionManagementModel.findByPk(parseInt(params.plan_id))
        );

        let paymentObj = <any>{
            admin_id:constants.USER_ROLE.super_admin,
            employer_id: parseInt(user.uid),
            plan_id: parseInt(params.plan_id),
            purchase_date: params.purchase_date,
            expiry_date: params.expiry_date,
            amount: parseFloat(params.amount),
            transaction_id: params.transaction_id,
            details:subscriptionPlan,
        }

        let newPlan= await helperFunction.convertPromiseToObject(
            await paymentManagementModel.create(paymentObj)
        )

        if (newPlan) {
            await employersModel.update({
                subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.paid,
                free_trial_status:constants.EMPLOYER_FREE_TRIAL_STATUS.over,
            }, {
                where: {
                    id: parseInt(user.uid)
                }
            })
        }

        return newPlan
    }

    /*
* function to get profile 
*/
    public async getProfile(user: any) {
        //employersModel.hasOne(industryTypeModel, { foreignKey: "id", sourceKey: "industry_type", targetKey: "id" })
        
        let profile = await helperFunction.convertPromiseToObject(
            await employersModel.findOne({
                where: {
                    id: parseInt(user.uid),
                    status: { [Op.ne]: 2 }
                }
            })
        )

        profile.free_trial_expiry_date=null;

        if(profile.free_trial_start_datetime){

            let free_trial_expiry_date=new Date(profile.free_trial_start_datetime);
            free_trial_expiry_date.setDate(free_trial_expiry_date.getDate()+constants.EMPLOYER_FREE_TRIAL_DURATION)

            profile.free_trial_expiry_date=free_trial_expiry_date;

        }

        profile.industry_info = await helperFunction.convertPromiseToObject(
            await industryTypeModel.findOne({
                where: {
                    id: parseInt(profile.industry_type)
                }
            })
        )

        profile.no_of_employee = await helperFunction.convertPromiseToObject(
            await employeeModel.count({
                where: {
                    current_employer_id:parseInt(user.uid),
                    status:[constants.STATUS.active,constants.STATUS.inactive],
                }
            })
        )

        delete profile.password;

        return profile

    }


    /*
    * function to get profile 
    */
    public async editProfile(params: any, user: any) {
        let profile = await employersModel.findOne({
            where: {
                id: parseInt(user.uid),
                status: { [Op.ne]: 2 }
            }
        })

        let currentProfile = await helperFunction.convertPromiseToObject(profile);

        profile.name = params.name || currentProfile.name;
        profile.email = params.email || currentProfile.email;
        profile.password = params.password ? await appUtils.bcryptPassword(params.password) : currentProfile.password;
        profile.country_code = params.country_code || currentProfile.country_code;
        profile.phone_number = params.phone_number || currentProfile.phone_number;
        profile.industry_type = params.industry_type || currentProfile.industry_type;
        profile.address = params.address || currentProfile.address;
        profile.thought_of_the_day = params.thought_of_the_day || currentProfile.thought_of_the_day;
        profile.profile_pic_url = params.profile_pic_url || currentProfile.profile_pic_url;

        profile.save();

        return profile;

    }


    /*
    * function to view current plan details 
    */
    public async mySubscription( user: any) {

        paymentManagementModel.hasOne(subscriptionManagementModel, { foreignKey: "id", sourceKey: "plan_id", targetKey: "id" })
        
        let employer = await helperFunction.convertPromiseToObject( await employersModel.findOne({
            where: {
                id: parseInt(user.uid),
                status: { [Op.ne]: 2 }
            }
        })
        )

        let trialExpiryDate = null;

        if(employer.free_trial_start_datetime){

            trialExpiryDate=new Date(employer.free_trial_start_datetime);
            trialExpiryDate.setDate(trialExpiryDate.getDate()+constants.EMPLOYER_FREE_TRIAL_DURATION)
            
        }

        if (employer.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan || employer.free_trial_status== constants.EMPLOYER_FREE_TRIAL_STATUS.yet_to_start) {
            return {
                subscription_type: employer.subscription_type,
                message: constants.MESSAGES.employer_have_no_plan,
                subscription: null,
                expiry_date:null,
            }
        } else if (employer.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.free && employer.free_trial_status== constants.EMPLOYER_FREE_TRIAL_STATUS.on_going) {
            return {
                subscription_type: employer.subscription_type,
                message: constants.MESSAGES.employer_have_free_plan,
                subscription: null,
                expiry_date: trialExpiryDate,
            }
        } else {


            let subscription = await helperFunction.convertPromiseToObject(
                await paymentManagementModel.findOne({
                    where: {
                        employer_id: parseInt(user.uid),
                        status: constants.EMPLOYER_SUBSCRIPTION_PLAN_STATUS.active,
                    },
                    include: [
                        {
                            model: subscriptionManagementModel,
                            required: true
                        }
                    ]
                })
            )

            //if (!subscription) throw new Error(constants.MESSAGES.employer_have_no_plan);

            return {
                subscription_type: employer.subscription_type,
                message: constants.MESSAGES.employer_have_paid_plan,
                subscription: subscription,
                expiry_date: subscription?.expiry_date,
            }
        }
    }

    /*
    * function to cancel current plan 
    */
    public async cancelPlan(params: any, user: any) {
        
        let plan = await paymentManagementModel.findOne({
                where: {
                    id: parseInt(params.subscription_id),
                    employer_id: parseInt(user.uid),
                    status: constants.EMPLOYER_SUBSCRIPTION_PLAN_STATUS.active,
                }
            })

        if (plan) {
            plan.status = constants.EMPLOYER_SUBSCRIPTION_PLAN_STATUS.cancelled;
            plan.save()
            await employersModel.update({
                subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan,
                free_trial_status: constants.EMPLOYER_FREE_TRIAL_STATUS.over,
            }, {
                where: {
                    id: parseInt(user.uid)
                }
            })
            return plan
        }
        else {
           throw new Error(constants.MESSAGES.no_plan)
        }


    }

    /*
   * function to view my payments 
   */
    public async myPayments(user: any) {

        return await helperFunction.convertPromiseToObject(
            await paymentManagementModel.findAndCountAll({
                where: {
                    employer_id: parseInt(user.uid),
                },
                order: [["createdAt", "DESC"]]
            })
        )
    }

    /*
    * function to contact admin
    */
    public async contactUs(params: any, user: any) {

        let contactObj = <any>{
            employer_id: parseInt(user.uid),
            message: params.message,
            type:constants.CONTACT_TYPE.employer
        }

        return await contactUsModel.create(contactObj);
    }

    /*
* function to get notification
*/
    public async getNotifications( user: any) {

        let notifications = await helperFunction.convertPromiseToObject(await notificationModel.findAndCountAll({
            where: {
                reciever_id: user.uid,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employer,
                status: [0, 1]
            },
            order: [["createdAt", "DESC"]]
        }));

        await notificationModel.update({
            status: 0,
        }, {
            where: {
                status: 1,
                reciever_id: user.uid,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employer,
            }
        })


        return notifications;
    }

    /*
* function to get unseen notification count
*/
    public async getUnseenNotificationCount(user: any) {

        return {
            all: await notificationModel.count({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employer,
                    status: 1,
                }
            }),
        }



    }

}