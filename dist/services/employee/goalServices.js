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
                        // add notification for employee
                        let notificationObj = {
                            type_id: teamGoaRes.id,
                            sender_id: user.uid,
                            reciever_id: params[i].employee_ids[j],
                            type: constants.NOTIFICATION_TYPE.assign_new_goal
                        };
                        yield notification_1.notificationModel.create(notificationObj);
                        // send push notification
                        // let notificationData = <any> {
                        //     title: 'Assign new goal',
                        //     body: `Your manager assign a new goal- ${(params[i].title?params[i].title: '')}`,
                        //     data: {
                        //         goal_id: teamGoaRes.id,
                        //         title: (params[i].title?params[i].title: '')
                        //          type: ADD_GOAL
                        //     },                        
                        // }
                        // await helperFunction.sendFcmNotification( [employeeData.device_token], notificationData);
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
                                type: constants.NOTIFICATION_TYPE.assign_new_goal
                            };
                            yield notification_1.notificationModel.create(notificationObj);
                            // send push notification
                            // let notificationData = <any> {
                            //     title: 'Assign new goal',
                            //     body: `Your manager assign a new goal- ${(params[i].title?params[i].title: '')}`,
                            //     data: {
                            //         goal_id: teamGoaRes.id,
                            //         title: (params[i].title?params[i].title: '')
                            //          type: ADD_GOAL
                            //     },                        
                            // }
                            // await helperFunction.sendFcmNotification( [employeeData.device_token], notificationData);
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
            let rows = yield teamGoal_1.teamGoalModel.findAll({
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
            });
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
            return yield teamGoal_1.teamGoalModel.findOne({
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
                        required: false
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
            if (getGoalData.enter_measure >= (parseInt(compeleteData.complete_measure) + parseInt(params.complete_measure))) {
                let createObj = {
                    team_goal_assign_id: params.team_goal_assign_id,
                    goal_id: params.goal_id,
                    description: params.description,
                    complete_measure: params.complete_measure
                };
                let teamGoalAssignRequestRes = yield helperFunction.convertPromiseToObject(yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.create(createObj));
                // notification add
                let notificationReq = {
                    type_id: params.goal_id,
                    team_goal_assign_id: params.team_goal_assign_id,
                    team_goal_assign_completion_by_employee_id: teamGoalAssignRequestRes.id,
                    sender_id: user.uid,
                    reciever_id: getGoalData.manager_id,
                    type: constants.NOTIFICATION_TYPE.goal_complete_request
                };
                yield notification_1.notificationModel.create(notificationReq);
                // send push notification
                // let notificationData = <any> {
                //     title: 'Accept your goal',
                //     body: `Your manager accept your goal`,
                //     data: {
                //         goal_id: params.goal_id,
                //          type: ACCEPT_GOAL_REQUEST
                //     },                        
                // }
                // await helperFunction.sendFcmNotification( [employeeData.device_token], notificationData);
                return teamGoalAssignRequestRes;
            }
            else {
                throw new Error(constants.MESSAGES.invalid_measure);
            }
        });
    }
    /*
    * function to get goal request as manager
    */
    getGoalCompletedRequestAsManager(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            teamGoal_1.teamGoalModel.hasMany(teamGoalAssign_1.teamGoalAssignModel, { foreignKey: "goal_id", sourceKey: "id", targetKey: "goal_id" });
            teamGoalAssign_1.teamGoalAssignModel.hasOne(teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel, { foreignKey: "team_goal_assign_id", sourceKey: "id", targetKey: "team_goal_assign_id" });
            teamGoalAssign_1.teamGoalAssignModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            return yield teamGoal_1.teamGoalModel.findAndCountAll({
                where: { manager_id: user.uid },
                include: [
                    {
                        model: teamGoalAssign_1.teamGoalAssignModel,
                        required: true,
                        include: [
                            {
                                model: employee_1.employeeModel,
                                required: true,
                                attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                            },
                            {
                                model: teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel,
                                where: { status: constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.requested },
                                required: true
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
            let teamGoalAssignCompletionByEmployeeObj = {
                status: parseInt(params.status)
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
                if (parseInt(params.status) == constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.approve) {
                    // add goal approve notification
                    let notificationObj = {
                        type_id: params.goal_id,
                        sender_id: user.uid,
                        reciever_id: getEmployeeId.employee_id,
                        type: constants.NOTIFICATION_TYPE.goal_accept
                    };
                    yield notification_1.notificationModel.create(notificationObj);
                    // send push notification
                    // let notificationData = <any> {
                    //     title: 'Accept your goal',
                    //     body: `Your manager accept your goal`,
                    //     data: {
                    //         goal_id: params.goal_id,
                    //          type: ACCEPT_GOAL_REQUEST
                    //     },                        
                    // }
                    // await helperFunction.sendFcmNotification( [employeeData.device_token], notificationData);
                    let getGoalCompleteData = yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.findOne({
                        where: { id: params.team_goal_assign_completion_by_employee_id }
                    });
                    let teamGoalAssignObj = {
                        status: 1,
                        complete_measure: getGoalCompleteData.complete_measure
                    };
                    return teamGoalAssign_1.teamGoalAssignModel.update(teamGoalAssignObj, {
                        where: { id: params.team_goal_assign_id }
                    });
                }
                else {
                    // add goal reject notification
                    let notificationObj = {
                        type_id: params.goal_id,
                        sender_id: user.uid,
                        reciever_id: getEmployeeId.employee_id,
                        type: constants.NOTIFICATION_TYPE.goal_reject
                    };
                    yield notification_1.notificationModel.create(notificationObj);
                    // send push notification
                    // let notificationData = <any> {
                    //     title: 'Reject your goal',
                    //     body: `Your manager accept your goal`,
                    //     data: {
                    //         goal_id: params.goal_id,
                    //          type: REJECT_GOAL_REQUEST
                    //     },                        
                    // }
                    // await helperFunction.sendFcmNotification( [employeeData.device_token], notificationData);
                    return true;
                }
            }
            else {
                throw new Error(constants.MESSAGES.bad_request);
            }
        });
    }
}
exports.GoalServices = GoalServices;
//# sourceMappingURL=goalServices.js.map