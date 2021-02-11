import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import * as tokenResponse from "../../utils/tokenResponse";
import { employeeModel } from  "../../models/employee"
import { managerTeamMemberModel } from  "../../models/managerTeamMember"
import { teamGoalModel } from  "../../models/teamGoal"
import { teamGoalAssignModel } from  "../../models/teamGoalAssign"
import { teamGoalAssignCompletionByEmployeeModel } from  "../../models/teamGoalAssignCompletionByEmployee"
import { Model } from "sequelize/types";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class GoalServices {
    constructor() { }

    /*
    * function to add goal
    */
    public async addGoal(params:any, user: any) {
        let employeeData = await employeeModel.findOne({
                where: {id: user.uid, is_manager:1}
            })
        if (employeeData) {
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
        } else {
            throw new Error(constants.MESSAGES.goal_management_check);
        }
    }

    /*
    * function to edit goal
    */
    public async editGoal(params:any, user: any) {
        let employeeData = await employeeModel.findOne({
            where: {id: user.uid, is_manager:1}
        })
        if (employeeData) {
            let teamGoalObj = <any>{
                manager_id: user.uid,
                title: (params.title?params.title: ''),
                description: (params.description?params.description: ''),
                start_date: (params.start_date?params.start_date: ''),
                end_date: (params.end_date?params.end_date: ''),
                select_measure: (params.select_measure?params.select_measure: ''),
                enter_measure: (params.enter_measure?params.enter_measure: '')
            }
            let teamGoalRes = await teamGoalModel.update(teamGoalObj,{
                    where: { id: params.id, manager_id: user.uid}
                });
            if (teamGoalRes) {
                await teamGoalAssignModel.destroy({
                    where: { 
                        goal_id: params.id,
                        employee_id: { 
                            [Op.notIn]: params.employee_ids
                        }
                    }
                });

                for (let j=0; j< (params.employee_ids).length; j++) {
                    let goalAssignData = await teamGoalAssignModel.findOne({
                            where: { 
                                goal_id: params.id, 
                                employee_id: params.employee_ids[j]
                            }
                        });

                    if (_.isEmpty(goalAssignData) ) {
                        let teamGoalAssignObj = <any> {
                            goal_id: params.id,
                            employee_id: params.employee_ids[j]
                        }
    
                        await teamGoalAssignModel.create(teamGoalAssignObj);
                    } 
                   
                }
            }
        }else {
            throw new Error(constants.MESSAGES.goal_management_check);
        }

    }

    /*
    * function to view goal
    */
    public async viewGoalAsManager (params: any, user: any) {
        console.log(params);
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit);

        teamGoalModel.hasMany(teamGoalAssignModel,{ foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
        teamGoalAssignModel.hasOne(employeeModel,{foreignKey: "id", sourceKey: "employee_id", targetKey: "id"});
        teamGoalModel.hasMany(employeeModel,{ foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });

        if (params.search_string) {
            var whereCondition = <any> {
               name: { [Op.iLike]: `%${params.search_string}%` }
            }
        }
       
        return await teamGoalModel.findAndCountAll({
            where: {manager_id: user.uid },
            include: [
                {
                    model: employeeModel,
                    required: true,
                    attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                },
                {
                    model: teamGoalAssignModel,
                    include: [
                        {
                            model: employeeModel,
                            where: whereCondition,
                            required: true,
                            attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                        }
                    ]
                }
            ],
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]]
        })
    }

     /*
    * function to view goal as employee
    */
    public async viewGoalAsEmployee(params: any, user: any) {
        console.log(params);
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit);

        teamGoalAssignModel.hasOne(teamGoalModel,{ foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
        teamGoalAssignModel.hasOne(employeeModel,{foreignKey: "id", sourceKey: "employee_id", targetKey: "id"});
        teamGoalModel.hasOne(employeeModel,{foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
        teamGoalAssignModel.hasMany(teamGoalAssignCompletionByEmployeeModel,{ foreignKey: "team_goal_assign_id", sourceKey: "id", targetKey: "team_goal_assign_id" });

        return await teamGoalAssignModel.findAndCountAll({
            where: {employee_id: user.uid },
            include: [
                {
                    model: teamGoalModel,
                    required: true,
                    include: [
                        {
                            model: employeeModel,
                            required: true,
                            attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                        }
                    ]
                },
                {
                    model:teamGoalAssignCompletionByEmployeeModel,
                    required: false
                }
            ],
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]]
        })
    }

    /*
    * function to delete goal
    */
    public async deleteGoal(params: any, user: any) {
        let deleteTeamGoalRes = await teamGoalModel.destroy({
                where: {id: params.id, manager_id: user.uid}
            })
        if (deleteTeamGoalRes) {
            return await teamGoalAssignModel.destroy({
                where: { goal_id: params.id}
            })
        } else {
            throw new Error(constants.MESSAGES.bad_request);
        }
        
    }


     /*
    * function to submit goal for employee
    */
    public async submitGoalAsEmployee(params: any, user: any) {
        let getGoalData = await helperFunction.convertPromiseToObject( await teamGoalModel.findOne({
            where: { id: params.goal_id}
        }) );

        let compeleteData = await helperFunction.convertPromiseToObject( await teamGoalAssignCompletionByEmployeeModel.findAll({
                where: { team_goal_assign_id: params.team_goal_assign_id },
                 attributes: [ [Sequelize.fn('sum', Sequelize.col('complete_measure')), 'total_complete'],
                ],
            }) );

         if (getGoalData.enter_measure >= ( parseInt(compeleteData[0].total_complete)+ parseInt(params.complete_measure) ) ) {
            let createObj = <any> {
                team_goal_assign_id: params.team_goal_assign_id,
                goal_id: params.goal_id,
                description: params.description,
                complete_measure: params.complete_measure
            };
            return await teamGoalAssignCompletionByEmployeeModel.create(createObj);
         } else {
            throw new Error(constants.MESSAGES.invalid_measure);
         }
     
    }

    /*
    * function to get goal request as manager
    */
    public async getGoalCompletedRequestAsManager(params: any, user: any) {

        teamGoalModel.hasMany(teamGoalAssignModel,{ foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
        teamGoalAssignModel.hasOne(teamGoalAssignCompletionByEmployeeModel,{ foreignKey: "team_goal_assign_id", sourceKey: "id", targetKey: "team_goal_assign_id" });
        teamGoalAssignModel.hasOne(employeeModel,{ foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
        return await teamGoalModel.findAndCountAll({
            where: {manager_id: user.uid},
            include: [
                {
                    model: teamGoalAssignModel,
                    required: true,
                    include: [
                        {
                            model: employeeModel,
                            required: true,
                            attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                        },
                        {
                            model: teamGoalAssignCompletionByEmployeeModel,
                            where: {status: constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.requested},
                            required: true
                        }
                    ]
                }                        
            ]
        })
    }

     /*
    * function to goal accept reject as manager
    */
    public async goalAcceptRejectAsManager(params: any, user: any) {

        let teamGoalAssignCompletionByEmployeeObj = <any> {
            status: params.status
        };

        await teamGoalAssignCompletionByEmployeeModel.update(teamGoalAssignCompletionByEmployeeObj,{
            where: {id: params.team_goal_assign_completion_by_employee_id }
        });

        if ( parseInt(params.status) == constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.approve) {
            let getGoalCompleteData = await teamGoalAssignCompletionByEmployeeModel.findOne({
                where: {id: params.team_goal_assign_completion_by_employee_id }
            });
            let teamGoalAssignObj = <any> {
                status: 1,
                complete_measure: getGoalCompleteData.complete_measure
            }
            return teamGoalAssignModel.update(teamGoalAssignObj,{
                where: { id: params.team_goal_assign_id}
            })
        } else {
            return true;
        }

    }
}