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
                        reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                        type: constants.NOTIFICATION_TYPE.assign_new_goal,
                        data: {
                            type: constants.NOTIFICATION_TYPE.assign_new_goal,
                            title: 'New goal assigned',
                            //message: `New goal is assigned by your manager - ${(params[i].title ? params[i].title : '')}`,
                            message: `${(params[i].title ? params[i].title : '')}`,
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
                        title: 'New goal assigned',
                        body: `${(params[i].title?params[i].title: '')}`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.assign_new_goal,
                            title: 'New goal assigned',
                            message: `${(params[i].title ? params[i].title : '')}`,
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
                            reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                            type: constants.NOTIFICATION_TYPE.assign_new_goal,
                            data: {
                                type: constants.NOTIFICATION_TYPE.assign_new_goal,
                                title: 'New goal assigned',
                                message: `${(params.title ? params.title : '')}`,
                                goal_id: teamGoalRes.id,
                                senderEmplyeeData: employeeData,
                                //title: (params[i].title?params[i].title: ''),                            
                            },
                        }
                        await notificationModel.create(notificationObj);

                        let employeeNotify = await employeeModel.findOne({
                            where: { id: params.employee_ids[j], }
                        })

                        // send push notification
                        let notificationData = <any> {
                            title: 'New goal assigned',
                            body: `${(params.title?params.title: '')}`,
                            data: {
                                type: constants.NOTIFICATION_TYPE.assign_new_goal,
                                title: 'New goal assigned',
                                message: `${(params.title ? params.title : '')}`,
                                goal_id: teamGoalRes.id,
                                senderEmplyeeData: employeeData,
                                //title: (params[i].title?params[i].title: ''),                            
                            },
                        }
                        await helperFunction.sendFcmNotification([employeeNotify.device_token], notificationData);
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

       
       
        let rows = await helperFunction.convertPromiseToObject(   await teamGoalModel.findAll({
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
        )

        for(let goal of rows){

            let totalGoalMeasure=parseFloat(goal.enter_measure);
            let goalAssignCount=goal.team_goal_assigns.length;
            for(let goal_asssign of goal.team_goal_assigns){
                goal_asssign.completionAverageValue=parseFloat(goal_asssign.complete_measure);
                //goal_asssign.completionAveragePercentage=((parseFloat(goal_asssign.complete_measure)*100)/totalGoalMeasure).toFixed(2);
            }

            let comepletedGoalMeasureValue=goal.team_goal_assigns.reduce((result:number,teamGoalAssign:any)=>result+parseFloat(teamGoalAssign.completionAverageValue),0);
            //let comepletedGoalMeasurePercentage=goal.team_goal_assigns.reduce((result:number,teamGoalAssign:any)=>result+parseFloat(teamGoalAssign.completionAveragePercentage),0);
            // goal.completionTeamAverageValue=(comepletedGoalMeasureValue/goalAssignCount).toFixed(2);
            // goal.completionTeamAveragePercentage=((comepletedGoalMeasureValue*100)/(totalGoalMeasure*goalAssignCount)).toFixed(2)+"%";
            goal.completionTeamAverageValue=(comepletedGoalMeasureValue).toFixed(2);
            goal.completionTeamAveragePercentage=((comepletedGoalMeasureValue*100)/(totalGoalMeasure)).toFixed(2)+"%";
        }

        return { count, rows}
    }

    /*
    * function to view goal details as manager
    */
    public async viewGoalDetailsAsManager (params: any, user: any) {

        teamGoalModel.hasMany(teamGoalAssignModel,{ foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
        teamGoalAssignModel.hasOne(employeeModel,{foreignKey: "id", sourceKey: "employee_id", targetKey: "id"});
        teamGoalModel.hasMany(employeeModel,{ foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });

    
        let goalDetailsAsManager=  await teamGoalModel.findOne({
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

        return goalDetailsAsManager

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
                    attributes: ['id','goal_id','team_goal_assign_id',['description','employee_comment'], 'manager_comment', 'complete_measure', 'total_complete_measure', 'status','createdAt', 'updatedAt'],
                    required: false,
                    where: { status: constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.requested, },
                    order: [["createdAt", "DESC"]]
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
        }));
        
        let employeeData = await helperFunction.convertPromiseToObject(await employeeModel.findOne({
            where: { id: user.uid }
        }));

        let pendingGoalApprovalRequest = await teamGoalAssignCompletionByEmployeeModel.findOne({
            where: {
                goal_id: params.goal_id,
                team_goal_assign_id: params.team_goal_assign_id,
                status:constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.requested,
            }
        });

        if (pendingGoalApprovalRequest) {
            throw new Error(constants.MESSAGES.team_goal_complete_request_pending);
        }

        delete employeeData.password

        //if (getGoalData.enter_measure >= ( parseInt(compeleteData.complete_measure)+ parseInt(params.complete_measure) ) ) {
            let createObj = <any> {
                team_goal_assign_id: params.team_goal_assign_id,
                goal_id: params.goal_id,
                description: params.description,
                complete_measure: params.complete_measure,
                total_complete_measure: compeleteData.complete_measure,
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
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                type: constants.NOTIFICATION_TYPE.goal_complete_request,
                data: {
                    type: constants.NOTIFICATION_TYPE.goal_complete_request,
                    // title: 'Goal Submitted',
                    // message: `Goal - ${getGoalData.title} submitted by ${employeeData.name}`,
                    title: `${employeeData.name} submitted the goal`,
                    message: `${getGoalData.title}`,
                    goal_id: params.goal_id,
                    team_goal_assign_id: params.team_goal_assign_id,
                    senderEmplyeeData: employeeData,
                    //title: (params[i].title?params[i].title: ''),                            
                },
            }
            await notificationModel.create(notificationReq);


            let managerData = await employeeModel.findOne({
                where: { id: getGoalData.manager_id }
            })

            // let employeeData = await employeeModel.findOne({
            //     where: { id: getGoalData.manager_id }
            // })

            // send push notification
            let notificationData = <any> {
                title: `${employeeData.name} submitted the goal`,
                body: `${getGoalData.title}`,
                data: {
                    type: constants.NOTIFICATION_TYPE.goal_complete_request,
                    title: `${employeeData.name} submitted the goal`,
                    message: `${getGoalData.title}`,
                    goal_id: params.goal_id,
                    team_goal_assign_id: params.team_goal_assign_id,
                    senderEmplyeeData: employeeData,
                    //title: (params[i].title?params[i].title: ''),                            
                },
            }
            await helperFunction.sendFcmNotification([managerData.device_token], notificationData);

            return teamGoalAssignRequestRes;
        // } else {
        //     throw new Error(constants.MESSAGES.invalid_measure);
        //  }
     
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
                            attributes: ['id','goal_id','team_goal_assign_id',['description','employee_comment'], 'manager_comment', 'complete_measure', 'total_complete_measure', 'status','createdAt', 'updatedAt'],
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

        let getGoalData = await helperFunction.convertPromiseToObject(await teamGoalModel.findOne({
            where: { id: params.goal_id }
        }));

        let teamGoalAssignCompletionByEmployeeObj = <any>{
            status: parseInt(params.status),
            manager_comment:params.manager_comment || null,
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

            let managerData = await employeeModel.findOne({
                where: { id: user.uid }
            })

            delete managerData.password

    
            if (parseInt(params.status) == constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.approved) {
               
                // add goal approve notification
                let notificationObj = <any>{
                    type_id: params.goal_id,
                    sender_id: user.uid,
                    reciever_id: getEmployeeId.employee_id,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: constants.NOTIFICATION_TYPE.goal_accept,
                    data: {
                        type: constants.NOTIFICATION_TYPE.goal_accept,
                        title: 'Goal Accepted',
                        // message: `Your manager has accepted your goal - ${getGoalData.title}`,
                        message: `${getGoalData.title}`,
                        goal_id: params.goal_id,
                        team_goal_assign_id: params.team_goal_assign_id,
                        senderEmplyeeData: managerData,
                        //title: (params[i].title?params[i].title: ''),                            
                    },
                }
                await notificationModel.create(notificationObj);
    
                // send push notification
                let notificationData = <any>{
                    title: 'Goal Accepted',
                    body: `${getGoalData.title}`,
                    data: {
                        type: constants.NOTIFICATION_TYPE.goal_accept,
                        title: 'Goal Accepted',
                        message: `${getGoalData.title}`,
                        goal_id: params.goal_id,
                        team_goal_assign_id: params.team_goal_assign_id,
                        senderEmplyeeData: managerData,
                        //title: (params[i].title?params[i].title: ''),                            
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
                await  teamGoalAssignModel.update(teamGoalAssignObj, {
                    where: { id: params.team_goal_assign_id }
                })

                await teamGoalAssignCompletionByEmployeeModel.update({
                    total_complete_measure: parseInt(getEmployeeId.complete_measure) + parseInt(getGoalCompleteData.complete_measure),
                }, {
                    where: { id: params.team_goal_assign_completion_by_employee_id }
                });

                return true;
            } else {
                // add goal reject notification
                let notificationObj = <any>{
                    type_id: params.goal_id,
                    sender_id: user.uid,
                    reciever_id: getEmployeeId.employee_id,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: constants.NOTIFICATION_TYPE.goal_reject,
                    data: {
                        type: constants.NOTIFICATION_TYPE.goal_reject,
                        title: 'Goal Rejected',
                        message: `${getGoalData.title}`,
                        goal_id: params.goal_id,
                        team_goal_assign_id: params.team_goal_assign_id,
                        senderEmplyeeData: managerData,
                        //title: (params[i].title?params[i].title: ''),                            
                    },
                }
                await notificationModel.create(notificationObj);
    
                // send push notification
                let notificationData = <any>{
                    title: 'Goal Rejected',
                    body: `${getGoalData.title}`,
                    data: {
                        type: constants.NOTIFICATION_TYPE.goal_reject,
                        title: 'Goal Rejected',
                        message: `${getGoalData.title}`,
                        goal_id: params.goal_id,
                        team_goal_assign_id: params.team_goal_assign_id,
                        senderEmplyeeData: managerData,
                        //title: (params[i].title?params[i].title: ''),                            
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
        let quantitativeStatsOfGoals= await helperFunction.convertPromiseToObject(await teamGoalAssignModel.findAll({
            where: { employee_id: user.uid },
            //attributes: ['id', 'goal_id', 'employee_id', 'complete_measure'],
            include: [
                {
                    model: teamGoalModel,
                    required: true,
                    //attributes: ['id', 'title', 'enter_measure']
                }
            ]
        }))

        // quantitativeStatsOfGoals = quantitativeStatsOfGoals.map((goal: any) => {
        //     return <any>{
        //         id: goal.id,
        //         goal_id: goal.goal_id,
        //         employee_id: goal.employee_id,
        //         title: goal.team_goal.title,
        //         quantitative_stats: `${parseFloat(goal.complete_measure)}/${parseFloat(goal.team_goal.enter_measure)}`,
        //         quantitative_stats_percent: (parseFloat(goal.complete_measure)/parseFloat(goal.team_goal.enter_measure))*100,
        //     }
        // })

        let quantitativeStats = [];

        for (let goal of quantitativeStatsOfGoals) {
            quantitativeStats.push({
                ...goal,
                quantitative_stats: `${parseFloat(goal.complete_measure)}/${parseFloat(goal.team_goal.enter_measure)}`,
                quantitative_stats_percent: (parseFloat(goal.complete_measure)/parseFloat(goal.team_goal.enter_measure))*100,

            })
        }



        return {quantitativeStats};

    }

    /*
 * function to get Quantitative Stats of goals as manager
 */
    public async getQuantitativeStatsOfGoalsAsManager(params: any, user: any) {

        let employeeData = await employeeModel.findOne({
            where: { id: user.uid, is_manager: 1 }
        })
        if (!employeeData) throw new Error(constants.MESSAGES.not_manager)
            
        teamGoalAssignModel.hasOne(teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
        let quantitativeStatsOfGoals = await helperFunction.convertPromiseToObject(await teamGoalAssignModel.findAll({
            where: { employee_id: parseInt(params.employee_id)},
            include: [
                {
                    model: teamGoalModel,
                    required: true,
                }
            ]
        }))

        let quantitativeStats = [];

        for (let goal of quantitativeStatsOfGoals) {
            quantitativeStats.push({
                ...goal,
                quantitative_stats: `${parseFloat(goal.complete_measure)}/${parseFloat(goal.team_goal.enter_measure)}`,
                quantitative_stats_percent: (parseFloat(goal.complete_measure) / parseFloat(goal.team_goal.enter_measure)) * 100,

            })
        }
        return { quantitativeStats };

    }

    /*
    * function to view goal details as employee
    */
    public async viewGoalDetailsAsEmployee(params: any, user: any) {

        teamGoalModel.hasMany(teamGoalAssignModel, { foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
        teamGoalAssignModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
        
        let goalDetailsAsEmployee= await helperFunction.convertPromiseToObject( await teamGoalModel.findOne({
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

        let teamGoalAssignCompletion = await helperFunction.convertPromiseToObject(
            await teamGoalAssignCompletionByEmployeeModel.findAll({
                attributes: ['id','goal_id','team_goal_assign_id',['description','employee_comment'], 'manager_comment', 'complete_measure', 'total_complete_measure', 'status','createdAt', 'updatedAt'],
                where: {
                    goal_id: params.goal_id,
                    team_goal_assign_id: goalDetailsAsEmployee.team_goal_assigns[0].id,
                    status:[constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.approved,constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.rejected],
                },
                order: [["createdAt", "DESC"]],
            })
        )

        goalDetailsAsEmployee.team_goal_assigns[0].team_goal_assign_completion_by_employees = teamGoalAssignCompletion;

        goalDetailsAsEmployee.team_goal_assigns[0].complete_measure_percent = (parseFloat(goalDetailsAsEmployee.team_goal_assigns[0].complete_measure) / parseFloat(goalDetailsAsEmployee.enter_measure)) * 100;
            
        return goalDetailsAsEmployee;
    
    }


    /*
    * function to view goal details as employee
    */
    public async viewGoalAssignCompletionAsManager(params: any, user: any) {

        teamGoalModel.hasMany(teamGoalAssignModel, { foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
        teamGoalAssignModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });

        let goalDetailsAsEmployee = await helperFunction.convertPromiseToObject(await teamGoalModel.findOne({
            where: { id: params.goal_id },
            include: [
                {
                    model: teamGoalAssignModel,
                    where: { id: params.team_goal_assign_id, },
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

        let teamGoalAssignCompletion = await helperFunction.convertPromiseToObject(
            await teamGoalAssignCompletionByEmployeeModel.findAll({
                where: {
                    goal_id: params.goal_id,
                    team_goal_assign_id: goalDetailsAsEmployee.team_goal_assigns[0].id,
                },
                order: [["createdAt", "DESC"]],
            })
        )

        goalDetailsAsEmployee.team_goal_assigns[0].team_goal_assign_completion_by_employees = teamGoalAssignCompletion;

        goalDetailsAsEmployee.team_goal_assigns[0].complete_measure_percent = (parseFloat(goalDetailsAsEmployee.team_goal_assigns[0].complete_measure) / parseFloat(goalDetailsAsEmployee.enter_measure)) * 100;

        return goalDetailsAsEmployee;

        // let teamGoalAssignCompletion = await helperFunction.convertPromiseToObject(
        //     await teamGoalAssignCompletionByEmployeeModel.findAll({
        //         where: {
        //             goal_id: params.goal_id,
        //             team_goal_assign_id: params.team_goal_assign_id,
        //         }
        //     })
        // )

        // return teamGoalAssignCompletion;

    }

    public async getGoalCompletionAverageAsManager(params: any, user: any){
        teamGoalModel.hasMany(teamGoalAssignModel,{ foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
        teamGoalAssignModel.hasOne(employeeModel,{foreignKey: "id", sourceKey: "employee_id", targetKey: "id"});
        teamGoalModel.hasMany(employeeModel,{ foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });

        let whereCondition=<any>{
            manager_id: user.uid,
        }

        if(params.goal_id){
            whereCondition=<any>{
                id: params.goal_id 
            }
        }
    
        let goals= await helperFunction.convertPromiseToObject(  
            await teamGoalModel.findAll({
                attributes:['id','manager_id','title','select_measure','enter_measure'],
                where: whereCondition,
                include: [
                    {
                        model: teamGoalAssignModel,
                    }
                ],
                order: [["createdAt", "DESC"]]
                
            })
        )

        for(let goal of goals){

            let totalGoalMeasure=parseFloat(goal.enter_measure);
            let goalAssignCount=goal.team_goal_assigns.length;
            for(let goal_asssign of goal.team_goal_assigns){
                goal_asssign.completionAverageValue=parseFloat(goal_asssign.complete_measure);
                //goal_asssign.completionAveragePercentage=((parseFloat(goal_asssign.complete_measure)*100)/totalGoalMeasure).toFixed(2);
            }

            let comepletedGoalMeasureValue=goal.team_goal_assigns.reduce((result:number,teamGoalAssign:any)=>result+parseFloat(teamGoalAssign.completionAverageValue),0);
            //let comepletedGoalMeasurePercentage=goal.team_goal_assigns.reduce((result:number,teamGoalAssign:any)=>result+parseFloat(teamGoalAssign.completionAveragePercentage),0);
            // goal.completionTeamAverageValue=(comepletedGoalMeasureValue/goalAssignCount).toFixed(2);
            // goal.completionTeamAveragePercentage=((comepletedGoalMeasureValue*100)/(totalGoalMeasure*goalAssignCount)).toFixed(2)+"%";

            goal.completionTeamAverageValue=(comepletedGoalMeasureValue).toFixed(2);
            goal.completionTeamAveragePercentage=((comepletedGoalMeasureValue*100)/(totalGoalMeasure)).toFixed(2)+"%";


            delete goal.team_goal_assigns;

        }

        
        return goals

    }

    public async toggleGoalAsPrimary(params:any,user:any){       

        let teamGoalAssign= await teamGoalAssignModel.findByPk(parseInt(params.team_goal_assign_id));
        
        if(teamGoalAssign){
            if(teamGoalAssign.employee_id==user.uid){

                if(teamGoalAssign.is_primary==constants.PRIMARY_GOAL.no){
                    let primaryGoalCount=await teamGoalAssignModel.count({
                        where:{
                            employee_id:parseInt(user.uid),
                            is_primary:constants.PRIMARY_GOAL.yes
                        }
                    })

                    if(primaryGoalCount<4){
                        teamGoalAssign.is_primary=constants.PRIMARY_GOAL.yes;
                    }else{
                        throw new Error(constants.MESSAGES.only_four_primary_goals_are_allowed);
                    }

                }else{
                    teamGoalAssign.is_primary=constants.PRIMARY_GOAL.no;
                }

                teamGoalAssign.save();            

                return true;
            }else{
                throw new Error(constants.MESSAGES.goal_not_assigned);
            }
        }else{
            throw new Error(constants.MESSAGES.goal_assign_not_found);
        }

        
    }

    public async markGoalsAsPrimary(params:any,user:any){  
        
        let primaryGoals=params.goals.filter((goal)=>goal.is_primary==constants.PRIMARY_GOAL.yes);

        if(primaryGoals.length==4){

            let checkIfGoalAssignExist=await helperFunction.convertPromiseToObject(
                await teamGoalAssignModel.count({
                    where:{
                        id:primaryGoals.map((goal)=>goal.team_goal_assign_id),
                        employee_id:user.uid,
                    }
                })
            )
        
            if(checkIfGoalAssignExist==4){
                
                let updatedGoals=await teamGoalAssignModel.update(
                    {
                        is_primary:constants.PRIMARY_GOAL.yes,
                    },
                    {
                        where:{
                            id:primaryGoals.map((goal)=>goal.team_goal_assign_id),
                            employee_id:user.uid,
                        }
                    }
                )

                await teamGoalAssignModel.update(
                    {
                        is_primary:constants.PRIMARY_GOAL.no,
                    },
                    {
                        where:{
                            id:{
                                [Op.notIn]:primaryGoals.map((goal)=>goal.team_goal_assign_id)
                            },
                            employee_id:user.uid,
                        }
                    }
                )

                return {
                    updateCount:updatedGoals[0]
                };
                
            }else{
                throw new Error(constants.MESSAGES.four_goal_assign_not_found);
            }
        }else{
            throw new Error(constants.MESSAGES.only_four_primary_goals_are_allowed);
        }

    }

    


}