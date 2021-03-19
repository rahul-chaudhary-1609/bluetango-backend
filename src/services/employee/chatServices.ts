import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import { employeeModel } from  "../../models/employee"
import { teamGoalModel } from  "../../models/teamGoal"
import { teamGoalAssignModel } from  "../../models/teamGoalAssign"
import { teamGoalAssignCompletionByEmployeeModel } from  "../../models/teamGoalAssignCompletionByEmployee"
import { notificationModel } from "../../models/notification";
import { qualitativeMeasurementCommentModel } from "../../models/qualitativeMeasurementComment";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class ChatServices {
    constructor() { }

    /*
    * function to getchat popup list as employee
    */
    public async getChatPopListAsEmployee( user: any) {

        teamGoalAssignModel.hasOne(teamGoalModel,{foreignKey: "id", sourceKey: "goal_id", targetKey: "id"})
        let employeeGoalData = await teamGoalAssignModel.findAll({
            where: {
                employee_id: user.uid
            },
            attributes:['id'],
            include:[
                {
                    model: teamGoalModel,
                    required: false,
                    attributes: ['title']
                }
            ]
        });

        let getQuantitativeData = await qualitativeMeasurementCommentModel.findAll();

         return employeeGoalData.concat(getQuantitativeData);
    }

}