"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalServices = void 0;
const lodash_1 = __importDefault(require("lodash"));
const constants = __importStar(require("../../constants"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const employee_1 = require("../../models/employee");
const teamGoal_1 = require("../../models/teamGoal");
const teamGoalAssign_1 = require("../../models/teamGoalAssign");
const teamGoalAssignCompletionByEmployee_1 = require("../../models/teamGoalAssignCompletionByEmployee");
const notification_1 = require("../../models/notification");
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
class GoalServices {
    constructor() { }
    /*
    * function to add goal
    */
    addGoal(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let employeeData = yield employee_1.employeeModel.findOne({
                where: { id: user.uid, is_manager: 1 }
            });
            if (employeeData) {
                for (let i = 0; i < params.length; i++) {
                    let teamGoalObj = {
                        manager_id: user.uid,
                        title: (params[i].title ? params[i].title : ''),
                        description: (params[i].description ? params[i].description : ''),
                        start_date: params[i].start_date,
                        end_date: params[i].end_date,
                        select_measure: params[i].select_measure,
                        enter_measure: params[i].enter_measure
                    };
                    let teamGoaRes = yield teamGoal_1.teamGoalModel.create(teamGoalObj);
                    for (let j = 0; j < (params[i].employee_ids).length; j++) {
                        let teamGoalAssignObj = {
                            goal_id: teamGoaRes.id,
                            employee_id: params[i].employee_ids[j]
                        };
                        yield teamGoalAssign_1.teamGoalAssignModel.create(teamGoalAssignObj);
                        delete employeeData.password;
                        // add notification for employee
                        let notificationObj = {
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
                            },
                        };
                        yield notification_1.notificationModel.create(notificationObj);
                        let employeeNotify = yield employee_1.employeeModel.findOne({
                            where: { id: params[i].employee_ids[j], }
                        });
                        //send push notification
                        let notificationData = {
                            title: 'New goal assigned',
                            body: `${(params[i].title ? params[i].title : '')}`,
                            data: {
                                type: constants.NOTIFICATION_TYPE.assign_new_goal,
                                title: 'New goal assigned',
                                message: `${(params[i].title ? params[i].title : '')}`,
                                goal_id: teamGoaRes.id,
                                senderEmplyeeData: employeeData,
                            },
                        };
                        yield helperFunction.sendFcmNotification([employeeNotify.device_token], notificationData);
                    }
                }
                return true;
            }
            else {
                throw new Error(constants.MESSAGES.goal_management_check);
            }
        });
    }
    /*
    * function to edit goal
    */
    editGoal(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let employeeData = yield employee_1.employeeModel.findOne({
                where: { id: user.uid, is_manager: 1 }
            });
            if (employeeData) {
                let teamGoalObj = {
                    manager_id: user.uid,
                    title: (params.title ? params.title : ''),
                    description: (params.description ? params.description : ''),
                    start_date: (params.start_date ? params.start_date : ''),
                    end_date: (params.end_date ? params.end_date : ''),
                    select_measure: (params.select_measure ? params.select_measure : ''),
                    enter_measure: (params.enter_measure ? params.enter_measure : '')
                };
                let teamGoalRes = yield teamGoal_1.teamGoalModel.update(teamGoalObj, {
                    where: { id: params.id, manager_id: user.uid }
                });
                if (teamGoalRes) {
                    yield teamGoalAssign_1.teamGoalAssignModel.destroy({
                        where: {
                            goal_id: params.id,
                            employee_id: {
                                [Op.notIn]: params.employee_ids
                            }
                        }
                    });
                    for (let j = 0; j < (params.employee_ids).length; j++) {
                        let goalAssignData = yield teamGoalAssign_1.teamGoalAssignModel.findOne({
                            where: {
                                goal_id: params.id,
                                employee_id: params.employee_ids[j]
                            }
                        });
                        if (lodash_1.default.isEmpty(goalAssignData)) {
                            let teamGoalAssignObj = {
                                goal_id: params.id,
                                employee_id: params.employee_ids[j]
                            };
                            yield teamGoalAssign_1.teamGoalAssignModel.create(teamGoalAssignObj);
                            // add notification for employee
                            let notificationObj = {
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
                                },
                            };
                            yield notification_1.notificationModel.create(notificationObj);
                            let employeeNotify = yield employee_1.employeeModel.findOne({
                                where: { id: params.employee_ids[j], }
                            });
                            // send push notification
                            let notificationData = {
                                title: 'New goal assigned',
                                body: `${(params.title ? params.title : '')}`,
                                data: {
                                    type: constants.NOTIFICATION_TYPE.assign_new_goal,
                                    title: 'New goal assigned',
                                    message: `${(params.title ? params.title : '')}`,
                                    goal_id: teamGoalRes.id,
                                    senderEmplyeeData: employeeData,
                                },
                            };
                            yield helperFunction.sendFcmNotification([employeeNotify.device_token], notificationData);
                        }
                    }
                    return true;
                }
            }
            else {
                throw new Error(constants.MESSAGES.goal_management_check);
            }
        });
    }
    /*
    * function to view goal
    */
    viewGoalAsManager(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(params);
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            teamGoal_1.teamGoalModel.hasMany(teamGoalAssign_1.teamGoalAssignModel, { foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
            teamGoalAssign_1.teamGoalAssignModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            teamGoal_1.teamGoalModel.hasMany(employee_1.employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
            var count, whereCondition;
            if (params.search_string) {
                whereCondition = {
                    name: { [Op.iLike]: `%${params.search_string}%` }
                };
                count = yield teamGoal_1.teamGoalModel.count({
                    where: { manager_id: user.uid },
                    include: [
                        {
                            model: employee_1.employeeModel,
                            required: false,
                        },
                        {
                            model: teamGoalAssign_1.teamGoalAssignModel,
                            required: true,
                            include: [
                                {
                                    model: employee_1.employeeModel,
                                    where: whereCondition,
                                    required: true,
                                }
                            ]
                        }
                    ],
                });
            }
            else {
                count = yield teamGoal_1.teamGoalModel.count({
                    where: { manager_id: user.uid }
                });
            }
            let rows = yield helperFunction.convertPromiseToObject(yield teamGoal_1.teamGoalModel.findAll({
                where: { manager_id: user.uid },
                include: [
                    {
                        model: employee_1.employeeModel,
                        required: false,
                        attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                    },
                    {
                        model: teamGoalAssign_1.teamGoalAssignModel,
                        required: false,
                        include: [
                            {
                                model: employee_1.employeeModel,
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
            }));
            for (let goal of rows) {
                let totalGoalMeasure = parseFloat(goal.enter_measure);
                let goalAssignCount = goal.team_goal_assigns.length;
                for (let goal_asssign of goal.team_goal_assigns) {
                    goal_asssign.completionAverageValue = parseFloat(goal_asssign.complete_measure);
                    //goal_asssign.completionAveragePercentage=((parseFloat(goal_asssign.complete_measure)*100)/totalGoalMeasure).toFixed(2);
                }
                let comepletedGoalMeasureValue = goal.team_goal_assigns.reduce((result, teamGoalAssign) => result + parseFloat(teamGoalAssign.completionAverageValue), 0);
                //let comepletedGoalMeasurePercentage=goal.team_goal_assigns.reduce((result:number,teamGoalAssign:any)=>result+parseFloat(teamGoalAssign.completionAveragePercentage),0);
                // goal.completionTeamAverageValue=(comepletedGoalMeasureValue/goalAssignCount).toFixed(2);
                // goal.completionTeamAveragePercentage=((comepletedGoalMeasureValue*100)/(totalGoalMeasure*goalAssignCount)).toFixed(2)+"%";
                goal.completionTeamAverageValue = (comepletedGoalMeasureValue).toFixed(2);
                goal.completionTeamAveragePercentage = ((comepletedGoalMeasureValue * 100) / (totalGoalMeasure)).toFixed(2) + "%";
            }
            return { count, rows };
        });
    }
    /*
    * function to view goal details as manager
    */
    viewGoalDetailsAsManager(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            teamGoal_1.teamGoalModel.hasMany(teamGoalAssign_1.teamGoalAssignModel, { foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
            teamGoalAssign_1.teamGoalAssignModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            teamGoal_1.teamGoalModel.hasMany(employee_1.employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
            let goalDetailsAsManager = yield teamGoal_1.teamGoalModel.findOne({
                where: { manager_id: user.uid, id: params.goal_id },
                include: [
                    {
                        model: employee_1.employeeModel,
                        required: true,
                        attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                    },
                    {
                        model: teamGoalAssign_1.teamGoalAssignModel,
                        include: [
                            {
                                model: employee_1.employeeModel,
                                required: true,
                                attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                            }
                        ]
                    }
                ],
                order: [["createdAt", "DESC"]]
            });
            return goalDetailsAsManager;
        });
    }
    /*
   * function to view goal as employee
   */
    viewGoalAsEmployee(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            teamGoalAssign_1.teamGoalAssignModel.hasOne(teamGoal_1.teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
            teamGoalAssign_1.teamGoalAssignModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            teamGoal_1.teamGoalModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
            teamGoalAssign_1.teamGoalAssignModel.hasMany(teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel, { foreignKey: "team_goal_assign_id", sourceKey: "id", targetKey: "team_goal_assign_id" });
            let count = yield teamGoalAssign_1.teamGoalAssignModel.count({
                where: { employee_id: user.uid }
            });
            let rows = yield teamGoalAssign_1.teamGoalAssignModel.findAll({
                where: { employee_id: user.uid },
                include: [
                    {
                        model: teamGoal_1.teamGoalModel,
                        required: false,
                        include: [
                            {
                                model: employee_1.employeeModel,
                                required: false,
                                attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                            }
                        ]
                    },
                    {
                        model: teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel,
                        attributes: ['id', 'goal_id', 'team_goal_assign_id', ['description', 'employee_comment'], 'manager_comment', 'complete_measure', 'total_complete_measure', 'status', 'createdAt', 'updatedAt'],
                        required: false,
                        where: { status: constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.requested, },
                        order: [["createdAt", "DESC"]]
                    }
                ],
                limit: limit,
                offset: offset,
                order: [["createdAt", "DESC"]]
            });
            return { count, rows };
        });
    }
    /*
    * function to delete goal
    */
    deleteGoal(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let deleteTeamGoalRes = yield teamGoal_1.teamGoalModel.destroy({
                where: { id: params.id, manager_id: user.uid }
            });
            if (deleteTeamGoalRes) {
                return yield teamGoalAssign_1.teamGoalAssignModel.destroy({
                    where: { goal_id: params.id }
                });
            }
            else {
                throw new Error(constants.MESSAGES.bad_request);
            }
        });
    }
    /*
   * function to submit goal for employee
   */
    submitGoalAsEmployee(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let getGoalData = yield helperFunction.convertPromiseToObject(yield teamGoal_1.teamGoalModel.findOne({
                where: { id: params.goal_id }
            }));
            let compeleteData = yield helperFunction.convertPromiseToObject(yield teamGoalAssign_1.teamGoalAssignModel.findOne({
                where: { id: params.team_goal_assign_id }
            }));
            let employeeData = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                where: { id: user.uid }
            }));
            let pendingGoalApprovalRequest = yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.findOne({
                where: {
                    goal_id: params.goal_id,
                    team_goal_assign_id: params.team_goal_assign_id,
                    status: constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.requested,
                }
            });
            if (pendingGoalApprovalRequest) {
                throw new Error(constants.MESSAGES.team_goal_complete_request_pending);
            }
            delete employeeData.password;
            //if (getGoalData.enter_measure >= ( parseInt(compeleteData.complete_measure)+ parseInt(params.complete_measure) ) ) {
            let createObj = {
                team_goal_assign_id: params.team_goal_assign_id,
                goal_id: params.goal_id,
                description: params.description,
                complete_measure: params.complete_measure,
                total_complete_measure: compeleteData.complete_measure,
                status: constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.requested
            };
            let teamGoalAssignRequestRes = yield helperFunction.convertPromiseToObject(yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.create(createObj));
            // notification add
            let notificationReq = {
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
                },
            };
            yield notification_1.notificationModel.create(notificationReq);
            let managerData = yield employee_1.employeeModel.findOne({
                where: { id: getGoalData.manager_id }
            });
            // let employeeData = await employeeModel.findOne({
            //     where: { id: getGoalData.manager_id }
            // })
            // send push notification
            let notificationData = {
                title: `${employeeData.name} submitted the goal`,
                body: `${getGoalData.title}`,
                data: {
                    type: constants.NOTIFICATION_TYPE.goal_complete_request,
                    title: `${employeeData.name} submitted the goal`,
                    message: `${getGoalData.title}`,
                    goal_id: params.goal_id,
                    team_goal_assign_id: params.team_goal_assign_id,
                    senderEmplyeeData: employeeData,
                },
            };
            yield helperFunction.sendFcmNotification([managerData.device_token], notificationData);
            return teamGoalAssignRequestRes;
            // } else {
            //     throw new Error(constants.MESSAGES.invalid_measure);
            //  }
        });
    }
    /*
    * function to get goal request as manager
    */
    getGoalCompletedRequestAsManager(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // teamGoalModel.hasMany(teamGoalAssignCompletionByEmployeeModel,{ foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
            // teamGoalAssignCompletionByEmployeeModel.hasOne(teamGoalAssignModel, { foreignKey: "id", sourceKey: "team_goal_assign_id", targetKey: "id" });
            teamGoal_1.teamGoalModel.hasMany(teamGoalAssign_1.teamGoalAssignModel, { foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
            teamGoalAssign_1.teamGoalAssignModel.hasMany(teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel, { foreignKey: "team_goal_assign_id", sourceKey: "id", targetKey: "team_goal_assign_id" });
            teamGoalAssign_1.teamGoalAssignModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            return yield teamGoal_1.teamGoalModel.findAndCountAll({
                where: { manager_id: user.uid },
                include: [
                    {
                        model: teamGoalAssign_1.teamGoalAssignModel,
                        required: true,
                        include: [
                            {
                                model: teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel,
                                attributes: ['id', 'goal_id', 'team_goal_assign_id', ['description', 'employee_comment'], 'manager_comment', 'complete_measure', 'total_complete_measure', 'status', 'createdAt', 'updatedAt'],
                                where: { status: constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.requested },
                                required: true,
                            },
                            {
                                model: employee_1.employeeModel,
                                required: true,
                                attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                            }
                        ]
                    }
                ]
            });
        });
    }
    /*
   * function to goal accept reject as manager
   */
    goalAcceptRejectAsManager(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let getGoalData = yield helperFunction.convertPromiseToObject(yield teamGoal_1.teamGoalModel.findOne({
                where: { id: params.goal_id }
            }));
            let teamGoalAssignCompletionByEmployeeObj = {
                status: parseInt(params.status),
                manager_comment: params.manager_comment || null,
            };
            let teamGoalAssignCompletionByEmployeeCheck = yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.findOne({
                where: {
                    goal_id: params.goal_id,
                    team_goal_assign_id: params.team_goal_assign_id,
                    id: params.team_goal_assign_completion_by_employee_id,
                    status: constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.requested
                }
            });
            if (teamGoalAssignCompletionByEmployeeCheck) {
                yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.update(teamGoalAssignCompletionByEmployeeObj, {
                    where: { id: params.team_goal_assign_completion_by_employee_id }
                });
                var getEmployeeId = yield teamGoalAssign_1.teamGoalAssignModel.findOne({
                    where: { id: params.team_goal_assign_id }
                });
                let employeeData = yield employee_1.employeeModel.findOne({
                    where: { id: getEmployeeId.employee_id }
                });
                let managerData = yield employee_1.employeeModel.findOne({
                    where: { id: user.uid }
                });
                delete managerData.password;
                if (parseInt(params.status) == constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.approved) {
                    // add goal approve notification
                    let notificationObj = {
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
                        },
                    };
                    yield notification_1.notificationModel.create(notificationObj);
                    // send push notification
                    let notificationData = {
                        title: 'Goal Accepted',
                        body: `${getGoalData.title}`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.goal_accept,
                            title: 'Goal Accepted',
                            message: `${getGoalData.title}`,
                            goal_id: params.goal_id,
                            team_goal_assign_id: params.team_goal_assign_id,
                            senderEmplyeeData: managerData,
                        },
                    };
                    yield helperFunction.sendFcmNotification([employeeData.device_token], notificationData);
                    let getGoalCompleteData = yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.findOne({
                        where: { id: params.team_goal_assign_completion_by_employee_id }
                    });
                    let teamGoalAssignObj = {
                        status: 1,
                        complete_measure: parseInt(getEmployeeId.complete_measure) + parseInt(getGoalCompleteData.complete_measure)
                    };
                    yield teamGoalAssign_1.teamGoalAssignModel.update(teamGoalAssignObj, {
                        where: { id: params.team_goal_assign_id }
                    });
                    yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.update({
                        total_complete_measure: parseInt(getEmployeeId.complete_measure) + parseInt(getGoalCompleteData.complete_measure),
                    }, {
                        where: { id: params.team_goal_assign_completion_by_employee_id }
                    });
                    return true;
                }
                else {
                    // add goal reject notification
                    let notificationObj = {
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
                        },
                    };
                    yield notification_1.notificationModel.create(notificationObj);
                    // send push notification
                    let notificationData = {
                        title: 'Goal Rejected',
                        body: `${getGoalData.title}`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.goal_reject,
                            title: 'Goal Rejected',
                            message: `${getGoalData.title}`,
                            goal_id: params.goal_id,
                            team_goal_assign_id: params.team_goal_assign_id,
                            senderEmplyeeData: managerData,
                        },
                    };
                    yield helperFunction.sendFcmNotification([employeeData.device_token], notificationData);
                    return true;
                }
            }
            else {
                throw new Error(constants.MESSAGES.bad_request);
            }
        });
    }
    /*
 * function to get Quantitative Stats of goals
 */
    getQuantitativeStatsOfGoals(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            teamGoalAssign_1.teamGoalAssignModel.hasOne(teamGoal_1.teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
            let quantitativeStatsOfGoals = yield helperFunction.convertPromiseToObject(yield teamGoalAssign_1.teamGoalAssignModel.findAll({
                where: { employee_id: user.uid },
                //attributes: ['id', 'goal_id', 'employee_id', 'complete_measure'],
                include: [
                    {
                        model: teamGoal_1.teamGoalModel,
                        required: true,
                    }
                ]
            }));
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
                quantitativeStats.push(Object.assign(Object.assign({}, goal), { quantitative_stats: `${parseFloat(goal.complete_measure)}/${parseFloat(goal.team_goal.enter_measure)}`, quantitative_stats_percent: (parseFloat(goal.complete_measure) / parseFloat(goal.team_goal.enter_measure)) * 100 }));
            }
            return { quantitativeStats };
        });
    }
    /*
 * function to get Quantitative Stats of goals as manager
 */
    getQuantitativeStatsOfGoalsAsManager(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let employeeData = yield employee_1.employeeModel.findOne({
                where: { id: user.uid, is_manager: 1 }
            });
            if (!employeeData)
                throw new Error(constants.MESSAGES.not_manager);
            teamGoalAssign_1.teamGoalAssignModel.hasOne(teamGoal_1.teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
            let quantitativeStatsOfGoals = yield helperFunction.convertPromiseToObject(yield teamGoalAssign_1.teamGoalAssignModel.findAll({
                where: { employee_id: parseInt(params.employee_id) },
                include: [
                    {
                        model: teamGoal_1.teamGoalModel,
                        required: true,
                    }
                ]
            }));
            let quantitativeStats = [];
            for (let goal of quantitativeStatsOfGoals) {
                quantitativeStats.push(Object.assign(Object.assign({}, goal), { quantitative_stats: `${parseFloat(goal.complete_measure)}/${parseFloat(goal.team_goal.enter_measure)}`, quantitative_stats_percent: (parseFloat(goal.complete_measure) / parseFloat(goal.team_goal.enter_measure)) * 100 }));
            }
            return { quantitativeStats };
        });
    }
    /*
    * function to view goal details as employee
    */
    viewGoalDetailsAsEmployee(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            teamGoal_1.teamGoalModel.hasMany(teamGoalAssign_1.teamGoalAssignModel, { foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
            teamGoalAssign_1.teamGoalAssignModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            let goalDetailsAsEmployee = yield helperFunction.convertPromiseToObject(yield teamGoal_1.teamGoalModel.findOne({
                where: { id: params.goal_id },
                include: [
                    {
                        model: teamGoalAssign_1.teamGoalAssignModel,
                        where: { employee_id: user.uid },
                        include: [
                            {
                                model: employee_1.employeeModel,
                                required: true,
                                attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                            }
                        ]
                    }
                ],
                order: [["createdAt", "DESC"]]
            }));
            let teamGoalAssignCompletion = yield helperFunction.convertPromiseToObject(yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.findAll({
                attributes: ['id', 'goal_id', 'team_goal_assign_id', ['description', 'employee_comment'], 'manager_comment', 'complete_measure', 'total_complete_measure', 'status', 'createdAt', 'updatedAt'],
                where: {
                    goal_id: params.goal_id,
                    team_goal_assign_id: goalDetailsAsEmployee.team_goal_assigns[0].id,
                    status: [constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.approved, constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.rejected],
                },
                order: [["createdAt", "DESC"]],
            }));
            goalDetailsAsEmployee.team_goal_assigns[0].team_goal_assign_completion_by_employees = teamGoalAssignCompletion;
            goalDetailsAsEmployee.team_goal_assigns[0].complete_measure_percent = (parseFloat(goalDetailsAsEmployee.team_goal_assigns[0].complete_measure) / parseFloat(goalDetailsAsEmployee.enter_measure)) * 100;
            return goalDetailsAsEmployee;
        });
    }
    /*
    * function to view goal details as employee
    */
    viewGoalAssignCompletionAsManager(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            teamGoal_1.teamGoalModel.hasMany(teamGoalAssign_1.teamGoalAssignModel, { foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
            teamGoalAssign_1.teamGoalAssignModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            let goalDetailsAsEmployee = yield helperFunction.convertPromiseToObject(yield teamGoal_1.teamGoalModel.findOne({
                where: { id: params.goal_id },
                include: [
                    {
                        model: teamGoalAssign_1.teamGoalAssignModel,
                        where: { id: params.team_goal_assign_id, },
                        include: [
                            {
                                model: employee_1.employeeModel,
                                required: true,
                                attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                            }
                        ]
                    }
                ],
                order: [["createdAt", "DESC"]]
            }));
            let teamGoalAssignCompletion = yield helperFunction.convertPromiseToObject(yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.findAll({
                where: {
                    goal_id: params.goal_id,
                    team_goal_assign_id: goalDetailsAsEmployee.team_goal_assigns[0].id,
                },
                order: [["createdAt", "DESC"]],
            }));
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
        });
    }
    getGoalCompletionAverageAsManager(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            teamGoal_1.teamGoalModel.hasMany(teamGoalAssign_1.teamGoalAssignModel, { foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
            teamGoalAssign_1.teamGoalAssignModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            teamGoal_1.teamGoalModel.hasMany(employee_1.employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
            let whereCondition = {
                manager_id: user.uid,
            };
            if (params.goal_id) {
                whereCondition = {
                    id: params.goal_id
                };
            }
            let goals = yield helperFunction.convertPromiseToObject(yield teamGoal_1.teamGoalModel.findAll({
                attributes: ['id', 'manager_id', 'title', 'select_measure', 'enter_measure'],
                where: whereCondition,
                include: [
                    {
                        model: teamGoalAssign_1.teamGoalAssignModel,
                    }
                ],
                order: [["createdAt", "DESC"]]
            }));
            for (let goal of goals) {
                let totalGoalMeasure = parseFloat(goal.enter_measure);
                let goalAssignCount = goal.team_goal_assigns.length;
                for (let goal_asssign of goal.team_goal_assigns) {
                    goal_asssign.completionAverageValue = parseFloat(goal_asssign.complete_measure);
                    //goal_asssign.completionAveragePercentage=((parseFloat(goal_asssign.complete_measure)*100)/totalGoalMeasure).toFixed(2);
                }
                let comepletedGoalMeasureValue = goal.team_goal_assigns.reduce((result, teamGoalAssign) => result + parseFloat(teamGoalAssign.completionAverageValue), 0);
                //let comepletedGoalMeasurePercentage=goal.team_goal_assigns.reduce((result:number,teamGoalAssign:any)=>result+parseFloat(teamGoalAssign.completionAveragePercentage),0);
                // goal.completionTeamAverageValue=(comepletedGoalMeasureValue/goalAssignCount).toFixed(2);
                // goal.completionTeamAveragePercentage=((comepletedGoalMeasureValue*100)/(totalGoalMeasure*goalAssignCount)).toFixed(2)+"%";
                goal.completionTeamAverageValue = (comepletedGoalMeasureValue).toFixed(2);
                goal.completionTeamAveragePercentage = ((comepletedGoalMeasureValue * 100) / (totalGoalMeasure)).toFixed(2) + "%";
                delete goal.team_goal_assigns;
            }
            return goals;
        });
    }
    toggleGoalAsPrimary(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let teamGoalAssign = yield teamGoalAssign_1.teamGoalAssignModel.findByPk(parseInt(params.team_goal_assign_id));
            if (teamGoalAssign) {
                if (teamGoalAssign.employee_id == user.uid) {
                    if (teamGoalAssign.is_primary == constants.PRIMARY_GOAL.no) {
                        let primaryGoalCount = yield teamGoalAssign_1.teamGoalAssignModel.count({
                            where: {
                                employee_id: parseInt(user.uid),
                                is_primary: constants.PRIMARY_GOAL.yes
                            }
                        });
                        if (primaryGoalCount < 4) {
                            teamGoalAssign.is_primary = constants.PRIMARY_GOAL.yes;
                        }
                        else {
                            throw new Error(constants.MESSAGES.only_four_primary_goals_are_allowed);
                        }
                    }
                    else {
                        teamGoalAssign.is_primary = constants.PRIMARY_GOAL.no;
                    }
                    teamGoalAssign.save();
                    return true;
                }
                else {
                    throw new Error(constants.MESSAGES.goal_not_assigned);
                }
            }
            else {
                throw new Error(constants.MESSAGES.goal_assign_not_found);
            }
        });
    }
    markGoalsAsPrimary(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let primaryGoals = params.goals.filter((goal) => goal.is_primary == constants.PRIMARY_GOAL.yes);
            if (primaryGoals.length == 4) {
                let checkIfGoalAssignExist = yield helperFunction.convertPromiseToObject(yield teamGoalAssign_1.teamGoalAssignModel.count({
                    where: {
                        id: primaryGoals.map((goal) => goal.team_goal_assign_id),
                        employee_id: user.uid,
                    }
                }));
                if (checkIfGoalAssignExist == 4) {
                    let updatedGoals = yield teamGoalAssign_1.teamGoalAssignModel.update({
                        is_primary: constants.PRIMARY_GOAL.yes,
                    }, {
                        where: {
                            id: primaryGoals.map((goal) => goal.team_goal_assign_id),
                            employee_id: user.uid,
                        }
                    });
                    yield teamGoalAssign_1.teamGoalAssignModel.update({
                        is_primary: constants.PRIMARY_GOAL.no,
                    }, {
                        where: {
                            id: {
                                [Op.notIn]: primaryGoals.map((goal) => goal.team_goal_assign_id)
                            },
                            employee_id: user.uid,
                        }
                    });
                    return {
                        updateCount: updatedGoals[0]
                    };
                }
                else {
                    throw new Error(constants.MESSAGES.four_goal_assign_not_found);
                }
            }
            else {
                throw new Error(constants.MESSAGES.only_four_primary_goals_are_allowed);
            }
        });
    }
}
exports.GoalServices = GoalServices;
//# sourceMappingURL=goalServices.js.map