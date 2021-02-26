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
import { teamGoalAssignModel } from  "../../models/teamGoalAssign"
import { qualitativeMeasurementModel } from  "../../models/qualitativeMeasurement"
import { promises } from "fs";
import { teamGoalModel } from "../../models/teamGoal";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class EmployeeServices {
    constructor() { }

    /*
    * function to get list of team members
    */
    public async getListOfTeamMemberByManagerId(params:any, user: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit);
        managerTeamMemberModel.hasOne(employeeModel,{ foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
        return await managerTeamMemberModel.findAndCountAll({
            where: { manager_id: user.uid},
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
        employeeModel.hasMany(teamGoalAssignModel,{ foreignKey: "employee_id", sourceKey: "id", targetKey: "employee_id" });
        teamGoalAssignModel.hasOne(teamGoalModel,{ foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
        let employeeDetails = await helperFunction.convertPromiseToObject( await employeeModel.findOne({
                where: { id: params.id},
                include:[
                    {
                        model: teamGoalAssignModel,
                        required: false,
                        include: [
                            {
                                model: teamGoalModel,
                                required: false
                            }
                        ]
                    }
                ],
                attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
            }) );

        let qualitativeMeasurementDetails = await qualitativeMeasurementModel.findOne({
            where:{ employee_id: params.id},
            group: 'employee_id',
            attributes:[
                'employee_id',
                [Sequelize.fn('AVG', Sequelize.col('initiative')), 'initiative_count'],
                [Sequelize.fn('AVG', Sequelize.col('ability_to_delegate')), 'ability_to_delegate_count'],
                [Sequelize.fn('AVG', Sequelize.col('clear_Communication')), 'clear_Communication_count'],
                [Sequelize.fn('AVG', Sequelize.col('self_awareness_of_strengths_and_weaknesses')), 'self_awareness_of_strengths_and_weaknesses_count'],
                [Sequelize.fn('AVG', Sequelize.col('agile_thinking')), 'agile_thinking_count'],
                [Sequelize.fn('AVG', Sequelize.col('influence')), 'influence_count'], 
                [Sequelize.fn('AVG', Sequelize.col('empathy')), 'empathy_count'],
                [Sequelize.fn('AVG', Sequelize.col('leadership_courage')), 'leadership_courage_count'], 
                [Sequelize.fn('AVG', Sequelize.col('customer_client_patient_satisfaction')), 'customer_client_patient_satisfaction_count'],
                [Sequelize.fn('AVG', Sequelize.col('team_contributions')), 'team_contributions_count'], 
                [Sequelize.fn('AVG', Sequelize.col('time_management')), 'time_management_count'],
                [Sequelize.fn('AVG', Sequelize.col('work_product')), 'work_product_count']
            ]
        })

        employeeDetails.qualitativeMeasurementDetails = qualitativeMeasurementDetails;
        return employeeDetails;
    }

    /*
    * function to get details of employee
    */
    public async searchTeamMember(params:any, user: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit);

        managerTeamMemberModel.hasOne(employeeModel,{ foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
        return await managerTeamMemberModel.findAndCountAll({
            where: { manager_id: user.uid},
            include: [
                {
                    model: employeeModel, 
                    required: true,
                    where: {
                        [Op.or]:[
                            {name: { [Op.iLike]: `%${params.search_string}%` }},
                            {phone_number: {[Op.iLike]: `%${params.search_string}%`}},
                            {email: { [Op.iLike]: `%${params.search_string}%`}}
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

    /*
    * function to add thought of the day
    */
    public async thoughtOfTheDay(params:any, user: any) {
        await employeeModel.update(
            {
                thought_of_the_day: params.thought_of_the_day
            },
            {
                where: { id: user.uid}
            }
        )

        return employeeModel.findOne({
            where: { id: user.uid}
        })
    }

}