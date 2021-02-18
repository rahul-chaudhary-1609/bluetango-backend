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
                        }
                    }
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
            if (params.search_string) {
                var whereCondition = {
                    name: { [Op.iLike]: `%${params.search_string}%` }
                };
            }
            let count = yield teamGoal_1.teamGoalModel.count({
                where: { manager_id: user.uid }
            });
            let rows = yield teamGoal_1.teamGoalModel.findAll({
                where: { manager_id: user.uid },
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
   * function to view goal as employee
   */
    viewGoalAsEmployee(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(params);
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            teamGoalAssign_1.teamGoalAssignModel.hasOne(teamGoal_1.teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
            teamGoalAssign_1.teamGoalAssignModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            teamGoal_1.teamGoalModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
            teamGoalAssign_1.teamGoalAssignModel.hasMany(teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel, { foreignKey: "team_goal_assign_id", sourceKey: "id", targetKey: "team_goal_assign_id" });
            return yield teamGoalAssign_1.teamGoalAssignModel.findAndCountAll({
                where: { employee_id: user.uid },
                include: [
                    {
                        model: teamGoal_1.teamGoalModel,
                        required: true,
                        include: [
                            {
                                model: employee_1.employeeModel,
                                required: true,
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
            let compeleteData = yield helperFunction.convertPromiseToObject(yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.findAll({
                where: { team_goal_assign_id: params.team_goal_assign_id },
                attributes: [[Sequelize.fn('sum', Sequelize.col('complete_measure')), 'total_complete'],
                ],
            }));
            if (getGoalData.enter_measure >= (parseInt(compeleteData[0].total_complete) + parseInt(params.complete_measure))) {
                let createObj = {
                    team_goal_assign_id: params.team_goal_assign_id,
                    goal_id: params.goal_id,
                    description: params.description,
                    complete_measure: params.complete_measure
                };
                return yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.create(createObj);
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
                status: params.status
            };
            yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.update(teamGoalAssignCompletionByEmployeeObj, {
                where: { id: params.team_goal_assign_completion_by_employee_id }
            });
            if (parseInt(params.status) == constants.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS.approve) {
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
                return true;
            }
        });
    }
}
exports.GoalServices = GoalServices;
//# sourceMappingURL=goalServices.js.map