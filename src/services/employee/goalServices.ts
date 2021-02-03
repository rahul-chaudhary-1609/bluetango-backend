import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import * as tokenResponse from "../../utils/tokenResponse";
import { employeeModel } from  "../../models/employee"
import { adminModel } from "../../models/admin";
import { employersModel } from  "../../models/employers"
import { departmentModel } from  "../../models/department"
import { managerTeamMemberModel } from  "../../models/managerTeamMember"
import { teamGoalModel } from  "../../models/teamGoal"
import { teamGoalAssignModel } from  "../../models/teamGoalAssign"
import { promises } from "fs";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class GoalServices {
    constructor() { }

    /*
    * function to add goal
    */
    public async addGoal(params:any, user: any) {
        for (let i=0; i<params.length; i++) {
            let teamGoalObj = <any>{
                manager_id: user.uid,
                title: (params[i].title?params[i].title: ''),
                description: (params[i].description?params[i].description: ''),
                start_date: params[i].start_date,
                end_date: params[i].end_date,
                select_measure: params[i].select_measure,
                enter_measure: params[i].enter_measure
            }
            let teamGoaRes = await teamGoalModel.create(teamGoalObj);
            for (let j=0; j< (params[i].employee_ids).length; j++) {

                let teamGoalAssignObj = <any> {
                    goal_id: teamGoaRes.id,
                    employee_id: params[i].employee_ids[j]
                }

                await teamGoalAssignModel.create(teamGoalAssignObj);
            }
        }
        return true;
    }

    

}