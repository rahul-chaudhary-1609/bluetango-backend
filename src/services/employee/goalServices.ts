import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import { employeeModel } from  "../../models/employee"
import { teamGoalModel } from  "../../models/teamGoal"
import { teamGoalAssignModel } from  "../../models/teamGoalAssign"
import { teamGoalAssignCompletionByEmployeeModel } from  "../../models/teamGoalAssignCompletionByEmployee"
import { notificationModel } from "../../models/notification";
import { parse } from "path";
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

                    delete employeeData.password

                    // add notification for employee
                    let notificationObj = <any> {
                        type_id: teamGoaRes.id,
                        sender_id: user.uid,
                        reciever_id: params[i].employee_ids[j],
                        type: constants.NOTIFICATION_TYPE.assign_new_goal,
                        data: {
                            type: constants.NOTIFICATION_TYPE.assign_new_goal,
                            title: 'Assign new goal',
                            message: `Your manager assigned a new goal- ${(params[i].title ? params[i].title : '')}`,
                            goal_id: teamGoaRes.id,
                            senderEmplyeeData: employeeData,
                            //title: (params[i].title?params[i].title: ''),                            
                        },
                    }
                    await notificationModel.create(notificationObj);

                    let employeeNotify = await employeeModel.findOne({
                        where: { id: params[i].employee_ids[j],}
                    })

                    //send push notification
                    let notificationData = <any> {
                        title: 'Assign new goal',
                        body: `Your manager assigned a new goal- ${(params[i].title?params[i].title: '')}`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.assign_new_goal,
                            title: 'Assign new goal',
                            message: `Your manager assigned a new goal- ${(params[i].title ? params[i].title : '')}`,
                            goal_id: teamGoaRes.id,                            
                            senderEmplyeeData:employeeData,
                            //title: (params[i].title?params[i].title: ''),                            
                        },                        
                    }
                    await helperFunction.sendFcmNotification([employeeNotify.device_token], notificationData);
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

                        // add notification for employee
                        let notificationObj = <any> {
                            type_id: params.id,
                            sender_id: user.uid,
                            reciever_id: params.employee_ids[j],
                            type: constants.NOTIFICATION_TYPE.assign_new_goal
                        }
                        await notificationModel.create(notificationObj);

                        // send push notification
                        let notificationData = <any> {
                            title: 'Assign new goal',
                            body: `Your manager assign a new goal- ${(params.title?params.title: '')}`,
                            data: {
                                goal_id: teamGoalRes.id,
                                title: (params.title?params.title: ''),
                                type: constants.NOTIFICATION_TYPE.assign_new_goal
                            },          
                        }
                        await helperFunction.sendFcmNotification( [employeeData.device_token], notificationData);
                    } 
                   
                }
                return true;
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
        var count, whereCondition;
        if (params.search_string) {
            whereCondition = <any> {
               name: { [Op.iLike]: `%${params.search_string}%` }
            }
            count = await teamGoalModel.count({
                where: {manager_id: user.uid },
                include: [
                    {
                        model: employeeModel,
                        required: false,
                    },
                    {
                        model: teamGoalAssignModel,
                        required: true,
                        include: [
                            {
                                model: employeeModel,
                                where: whereCondition,
                                required: true,
                            }
                        ]
                    }
                ],
            })
        } else {
            count = await teamGoalModel.count({
                where: {manager_id: user.uid }
            })
        }

       
       
        let rows =  await teamGoalModel.findAll({
            where: {manager_id: user.uid },
            include: [
                {
                    model: employeeModel,
                    required: false,
                    attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                },
                {
                    model: teamGoalAssignModel,
                    required: false,
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

        return { count, rows}
    }

    /*
    * function to view goal details as manager
    */
    public async viewGoalDetailsAsManager (params: any, user: any) {

        teamGoalModel.hasMany(teamGoalAssignModel,{ foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
        teamGoalAssignModel.hasOne(employeeModel,{foreignKey: "id", sourceKey: "employee_id", targetKey: "id"});
        teamGoalModel.hasMany(employeeModel,{ foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });

    
        return  await teamGoalModel.findOne({
            where: {manager_id: user.uid, id: params.goal_id },
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
                            required: true,
                            attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                        }
                    ]
                }
            ],
            order: [["createdAt", "DESC"]]
        })
    }

     /*
    * function to view goal as employee
    */
    public async viewGoalAsEmployee(params: any, user: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit);

        teamGoalAssignModel.hasOne(teamGoalModel,{ foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
        teamGoalAssignModel.hasOne(employeeModel,{foreignKey: "id", sourceKey: "employee_id", targetKey: "id"});
        teamGoalModel.hasOne(employeeModel,{foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
        teamGoalAssignModel.hasMany(teamGoalAssignCompletionByEmployeeModel,{ foreignKey: "team_goal_assign_id", sourceKey: "id", targetKey: "team_goal_assign_id" });

        let count = await teamGoalAssignModel.count({
            where: {employee_id: user.uid }
        })

        let rows =  await teamGoalAssignModel.findAll({
            where: {employee_id: user.uid },
            include: [
                {
                    model: teamGoalModel,
                    required: false,
                    include: [
                        {
                            model: employeeModel,
                            required: false,
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

        return { count, rows}
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

        let compeleteData = await helperFunction.convertPromiseToObject( await teamGoalAssignModel.findOne({
                where: { id: params.team_goal_assign_id }
            }) );

        if (getGoalData.enter_measure >= ( parseInt(compeleteData.complete_measure)+ parseInt(params.complete_measure) ) ) {
            let createObj = <any> {
                team_goal_assign_id: params.team_goal_assign_id,
                goal_id: params.goal_id,
                description: params.description,
                complete_measure: params.complete_measure,
                status:constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.requested
            };
            let teamGoalAssignRequestRes = await helperFunction.convertPromiseToObject(  
                await teamGoalAssignCompletionByEmployeeModel.create(createObj)
            );
            // notification add
            let notificationReq = <any> {
                type_id: params.goal_id,
                team_goal_assign_id: params.team_goal_assign_id,
                team_goal_assign_completion_by_employee_id: teamGoalAssignRequestRes.id,
                sender_id: user.uid,
                reciever_id: getGoalData.manager_id,
                type: constants.NOTIFICATION_TYPE.goal_complete_request,
                data: {
                    goal_id: params.goal_id,
                    type: constants.NOTIFICATION_TYPE.goal_complete_request
                },
            }
            await notificationModel.create(notificationReq);


            let managerData = await employeeModel.findOne({
                where: { id: getGoalData.manager_id }
            })

            let employeeData = await employeeModel.findOne({
                where: { id: getGoalData.manager_id }
            })

            // send push notification
            let notificationData = <any> {
                title: 'Goal Submit',
                body: `Goal submitted by ${employeeData.name}`,
                data: {
                    goal_id: params.goal_id,
                    type: constants.NOTIFICATION_TYPE.goal_complete_request
                },                                      
            }
            await helperFunction.sendFcmNotification([managerData.device_token], notificationData);

            return teamGoalAssignRequestRes;
        } else {
            throw new Error(constants.MESSAGES.invalid_measure);
         }
     
    }

    /*
    * function to get goal request as manager
    */
    public async getGoalCompletedRequestAsManager(params: any, user: any) {

        // teamGoalModel.hasMany(teamGoalAssignCompletionByEmployeeModel,{ foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
        // teamGoalAssignCompletionByEmployeeModel.hasOne(teamGoalAssignModel, { foreignKey: "id", sourceKey: "team_goal_assign_id", targetKey: "id" });
        teamGoalModel.hasMany(teamGoalAssignModel, { foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
        teamGoalAssignModel.hasMany(teamGoalAssignCompletionByEmployeeModel, { foreignKey: "team_goal_assign_id", sourceKey: "id", targetKey: "team_goal_assign_id" });
        teamGoalAssignModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });

        return await teamGoalModel.findAndCountAll({
            where: {manager_id: user.uid},
            include: [
                {
                    model: teamGoalAssignModel,
                    required: true,                   
                    include: [
                        {
                            model: teamGoalAssignCompletionByEmployeeModel,
                            where: { status: constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.requested },
                            required: true,
                        },
                        {
                            model: employeeModel,
                            required: true,
                            attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
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

        let teamGoalAssignCompletionByEmployeeObj = <any>{
            status: parseInt(params.status)
        };
        let teamGoalAssignCompletionByEmployeeCheck = await teamGoalAssignCompletionByEmployeeModel.findOne({
            where: {
                goal_id: params.goal_id,
                team_goal_assign_id: params.team_goal_assign_id,
                id: params.team_goal_assign_completion_by_employee_id,
                status: constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.requested
            }
        });

        if (teamGoalAssignCompletionByEmployeeCheck) {
            await teamGoalAssignCompletionByEmployeeModel.update(teamGoalAssignCompletionByEmployeeObj, {
                where: { id: params.team_goal_assign_completion_by_employee_id }
            });
    
            var getEmployeeId = await teamGoalAssignModel.findOne({
                where: { id: params.team_goal_assign_id }
            })

            let employeeData = await employeeModel.findOne({
                where: { id: getEmployeeId.employee_id }
            })
    
            if (parseInt(params.status) == constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.approve) {
               
                // add goal approve notification
                let notificationObj = <any>{
                    type_id: params.goal_id,
                    sender_id: user.uid,
                    reciever_id: getEmployeeId.employee_id,
                    type: constants.NOTIFICATION_TYPE.goal_accept,
                    data: {
                        goal_id: params.goal_id,
                        type: constants.NOTIFICATION_TYPE.goal_accept
                    },
                }
                await notificationModel.create(notificationObj);
    
                // send push notification
                let notificationData = <any>{
                    title: 'Accept your goal',
                    body: `Your manager has accepted your goal`,
                    data: {
                        goal_id: params.goal_id,
                        type: constants.NOTIFICATION_TYPE.goal_accept
                    },
                }
                await helperFunction.sendFcmNotification([employeeData.device_token], notificationData);
    
                let getGoalCompleteData = await teamGoalAssignCompletionByEmployeeModel.findOne({
                    where: { id: params.team_goal_assign_completion_by_employee_id }
                });
                let teamGoalAssignObj = <any>{
                    status: 1, // 
                    complete_measure: parseInt(getEmployeeId.complete_measure) + parseInt(getGoalCompleteData.complete_measure)
                }
                return teamGoalAssignModel.update(teamGoalAssignObj, {
                    where: { id: params.team_goal_assign_id }
                })
            } else {
                // add goal reject notification
                let notificationObj = <any>{
                    type_id: params.goal_id,
                    sender_id: user.uid,
                    reciever_id: getEmployeeId.employee_id,
                    type: constants.NOTIFICATION_TYPE.goal_reject,
                    data: {
                        goal_id: params.goal_id,
                        type: constants.NOTIFICATION_TYPE.goal_reject
                    },
                }
                await notificationModel.create(notificationObj);
    
                // send push notification
                let notificationData = <any>{
                    title: 'Reject your goal',
                    body: `Your manager rejected your goal`,
                    data: {
                        goal_id: params.goal_id,
                        type: constants.NOTIFICATION_TYPE.goal_reject
                    },
                }
                await helperFunction.sendFcmNotification([employeeData.device_token], notificationData);
                return true;
            }
        } else {
            throw new Error(constants.MESSAGES.bad_request);
        }

    }
       /*
    * function to get Quantitative Stats of goals
    */
    public async getQuantitativeStatsOfGoals(params: any, user: any) {

        teamGoalAssignModel.hasOne(teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
        let quantitativeStatsOfGoals= await teamGoalAssignModel.findAll({
            where: { employee_id: user.uid },
            attributes: ['id', 'goal_id', 'employee_id', 'complete_measure'],
            include: [
                {
                    model: teamGoalModel,
                    required: true,
                    attributes: ['id', 'title', 'enter_measure']
                }
            ]
        })

        quantitativeStatsOfGoals = quantitativeStatsOfGoals.map((goal: any) => {
            return <any>{
                id: goal.id,
                goal_id: goal.goal_id,
                employee_id: goal.employee_id,
                title: goal.team_goal.title,
                quantitative_stats: `${parseFloat(goal.complete_measure)}/${parseFloat(goal.team_goal.enter_measure)}`,
                quantitative_stats_percent: (parseFloat(goal.complete_measure)/parseFloat(goal.team_goal.enter_measure))*100,
            }
        })

        return quantitativeStatsOfGoals;

    }

    /*
    * function to view goal details as employee
    */
    public async viewGoalDetailsAsEmployee(params: any, user: any) {

        teamGoalModel.hasMany(teamGoalAssignModel, { foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
        teamGoalAssignModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });

        let GoalDetailsAsEmployee= await helperFunction.convertPromiseToObject( await teamGoalModel.findOne({
                where: { id: params.goal_id },
                include: [
                    {
                        model: teamGoalAssignModel,
                        where: { employee_id: user.uid },
                        include: [
                            {
                                model: employeeModel,
                                required: true,
                                attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                            }
                        ]
                    }
                ],
                order: [["createdAt", "DESC"]]
            })
        )
        
        GoalDetailsAsEmployee.team_goal_assigns[0].complete_measure_percent = (parseFloat(GoalDetailsAsEmployee.team_goal_assigns[0].complete_measure) / parseFloat(GoalDetailsAsEmployee.enter_measure)) * 100;
            
        return GoalDetailsAsEmployee;
    
    }


}