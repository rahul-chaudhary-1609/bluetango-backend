import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import * as tokenResponse from "../../utils/tokenResponse";
import { employersModel } from "../../models";
import { notificationModel } from "../../models/notification";
import { subscriptionManagementModel } from "../../models/subscriptionManagement";
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
            attributes: ['id', 'plan_name', 'description', 'charge', 'duration']
        });

        return await helperFunction.convertPromiseToObject(subscriptionList);
    }

    /*
* function to get profile 
*/
    public async getProfile(user: any) {
        let profile = await helperFunction.convertPromiseToObject(
            await employersModel.findOne({
                where: {
                    id: parseInt(user.uid),
                    status: { [Op.ne]: 2 }
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


   

}