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
import { industryTypeModel } from  "../../models/industryType"
import { promises } from "fs";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class EmployeeServices {
    constructor() { }

    /*
    * function to get list of team members
    */
    public async getListOfTeamMemberByManagerId(params:any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit);
        managerTeamMemberModel.hasOne(employeeModel,{ foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
        return await managerTeamMemberModel.findAndCountAll({
            where: { manager_id: params.manager_id},
            include: [
                {
                    model: employeeModel, 
                    required: false,
                    attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                }
            ],
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]]

        })
    }

    /*
    * function to get details of employee
    */
    public async viewDetailsEmployee(params:any) {
        return await employeeModel.findOne({
            where: { id: params.id},
            attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']

        })
    }

    /*
    * function to get details of employee
    */
   public async searchTeamMember(params:any) {
    let [offset, limit] = await helperFunction.pagination(params.offset, params.limit);

    managerTeamMemberModel.hasOne(employeeModel,{ foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
    return await managerTeamMemberModel.findAndCountAll({
        where: { manager_id: params.manager_id},
        include: [
            {
                model: employeeModel, 
                required: true,
                where: {
                    [Op.or]:[
                        {name: params.search_string},
                        {phone_number: params.search_string},
                        {email: params.search_string}
                    ]
                },
                attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
            }
        ],
        limit: limit,
        offset: offset,
        order: [["createdAt", "DESC"]]

    })
}

}