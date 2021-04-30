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
   

}