import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import * as tokenResponse from "../../utils/tokenResponse";
import { employeeModel, employersModel } from "../../models";
import { notificationModel } from "../../models/notification";
import { subscriptionManagementModel } from "../../models/subscriptionManagement";
import { paymentManagementModel } from "../../models/paymentManagement";
import { industryTypeModel } from "../../models/industryType";
import { contactUsModel } from "../../models/contactUs";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class EmployerService {
    constructor() { }

    /**
    * function to get Subscription Plan List
    @param {} params pass all parameters from request
    */
    public async getSubscriptionPlanList(user:any) {
        let subscriptionList = await subscriptionManagementModel.findAndCountAll({
            attributes: ['id', 'plan_name', 'description', 'charge', 'duration'],
            where: {
                status: constants.STATUS.active,
            }
        });

        return await helperFunction.convertPromiseToObject(subscriptionList);
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
                subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.paid
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
        employersModel.hasOne(industryTypeModel, { as:"industry_info",foreignKey: "id", sourceKey: "industry_type", targetKey: "id" })
        
        let profile = await helperFunction.convertPromiseToObject(
            await employersModel.findOne({
                where: {
                    id: parseInt(user.uid),
                    status: { [Op.ne]: 2 }
                },
                include: [
                    {
                        model: industryTypeModel,
                        as:"industry_info",
                        required:true
                    }
                ]
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

        profile.save();

        return profile;

    }


    /*
    * function to view current plan details 
    */
    public async mySubscription( user: any) {

        paymentManagementModel.hasOne(subscriptionManagementModel,{foreignKey:"id",sourceKey:"plan_id",targetKey:"id"})

        let subscription= await helperFunction.convertPromiseToObject(
            await paymentManagementModel.findOne({
                where: {
                    employer_id: parseInt(user.uid),
                    status:constants.EMPLOYER_SUBSCRIPTION_PLAN_STATUS.active,
                },
                include: [
                    {
                        model: subscriptionManagementModel,
                        required:true                        
                    }
                ]
            })
        )

        if (!subscription) throw new Error(constants.MESSAGES.employer_no_plan);

        return subscription
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
                subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan
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
        }

        return await contactUsModel.create(contactObj);
    }

   

}