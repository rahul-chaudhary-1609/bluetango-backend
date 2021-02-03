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
import { promises } from "fs";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class GoalServices {
    constructor() { }

    /*
    * function to get list of team members
    */
    public async addGoal(params:any, user: any) {
        console.log(params);
        for (let i=0; i<params.goal_details; i++) {
            let teamGoalObj = <any>{
                manager_id: user.uid,
                title: (params.title?params.title: ''),
                description: (params.description?params.description: ''),
            }
            teamGoalModel.create()
        }
        return params;
        // let [offset, limit] = await helperFunction.pagination(params.offset, params.limit);
        // managerTeamMemberModel.hasOne(employeeModel,{ foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
        // return await managerTeamMemberModel.findAndCountAll({
        //     where: { manager_id: user.uid},
        //     include: [
        //         {
        //             model: employeeModel, 
        //             required: false,
        //             attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
        //         }
        //     ],
        //     limit: limit,
        //     offset: offset,
        //     order: [["createdAt", "DESC"]]

        // })
    }

    

}