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
exports.EmployeeManagement = void 0;
const models_1 = require("../../models");
const lodash_1 = __importDefault(require("lodash"));
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const Sequelize = require('sequelize');
const managerTeamMember_1 = require("../../models/managerTeamMember");
const teamGoal_1 = require("../../models/teamGoal");
const qualitativeMeasurement_1 = require("../../models/qualitativeMeasurement");
const teamGoalAssign_1 = require("../../models/teamGoalAssign");
var Op = Sequelize.Op;
class EmployeeManagement {
    constructor() { }
    /**
     * to check whether user have any active plan or not
     */
    haveActivePlan(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let employer = yield helperFunction.convertPromiseToObject(yield models_1.employersModel.findByPk(parseInt(user.uid)));
            if (employer.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.free || employer.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.paid)
                return false;
            if (employer.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan)
                return true;
        });
    }
    /**
    * add edit employee function
    @param {} params pass all parameters from request
    */
    addEditEmployee(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.haveActivePlan(user) && !(process.env.DEV_MODE == "ON"))
                throw new Error(constants.MESSAGES.employer_no_plan);
            params.email = (params.email).toLowerCase();
            // check employee is exist or not
            if (params.manager_id == '0') {
                let checkEmployeeFirst = yield models_1.employeeModel.findOne();
                if (!lodash_1.default.isEmpty(checkEmployeeFirst)) {
                    throw new Error(constants.MESSAGES.manager_id_required);
                }
            }
            if (params.current_department_id) {
                let departmentExists = yield models_1.departmentModel.findOne({ where: { id: params.current_department_id } });
                if (!departmentExists)
                    throw new Error(constants.MESSAGES.invalid_department);
            }
            var existingUser;
            if (params.id) {
                existingUser = yield models_1.employeeModel.findOne({
                    where: {
                        [Op.or]: [
                            { email: params.email },
                            { phone_number: params.phone_number },
                        ],
                        status: {
                            [Op.in]: [0, 1]
                        },
                        id: {
                            [Op.ne]: params.id
                        }
                    }
                });
            }
            else {
                existingUser = yield models_1.employeeModel.findOne({
                    where: {
                        [Op.or]: [
                            { email: params.email },
                            { phone_number: params.phone_number },
                        ],
                        status: {
                            [Op.in]: [0, 1]
                        }
                    }
                });
            }
            params.current_employer_id = user.uid;
            if (lodash_1.default.isEmpty(existingUser)) {
                if (params.id) {
                    delete params.password;
                    let updateData = yield models_1.employeeModel.update(params, {
                        where: { id: params.id }
                    });
                    if (updateData) {
                        let managerData = yield helperFunction.convertPromiseToObject(yield managerTeamMember_1.managerTeamMemberModel.findOne({
                            where: { team_member_id: params.id }
                        }));
                        if (managerData) {
                            if (managerData.manager_id != parseInt(params.manager_id)) {
                                yield managerTeamMember_1.managerTeamMemberModel.update({
                                    manager_id: params.manager_id
                                }, {
                                    where: { team_member_id: params.id }
                                });
                            }
                        }
                        else {
                            let teamMemberObj = {
                                team_member_id: params.id,
                                manager_id: params.manager_id
                            };
                            console.log(teamMemberObj);
                            yield managerTeamMember_1.managerTeamMemberModel.create(teamMemberObj);
                        }
                        // update employee as manager
                        let employeeUpdate = {
                            is_manager: 1
                        };
                        yield models_1.employeeModel.update(employeeUpdate, {
                            where: { id: params.manager_id }
                        });
                        return yield models_1.employeeModel.findOne({
                            where: { id: params.id }
                        });
                    }
                    else {
                        return false;
                    }
                }
                else {
                    params.password = yield appUtils.bcryptPassword(params.password);
                    let employeeRes = yield models_1.employeeModel.create(params);
                    let employeeUpdate = {
                        is_manager: 1
                    };
                    yield models_1.employeeModel.update(employeeUpdate, {
                        where: { id: params.manager_id }
                    });
                    let teamMemberObj = {
                        team_member_id: employeeRes.id,
                        manager_id: params.manager_id
                    };
                    yield managerTeamMember_1.managerTeamMemberModel.create(teamMemberObj);
                    return employeeRes;
                }
            }
            else {
                throw new Error(constants.MESSAGES.email_phone_already_registered);
            }
        });
    }
    /**
     * get managers list
     */
    getManagerList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield helperFunction.convertPromiseToObject(yield models_1.employeeModel.findAll({
                attributes: ['id', 'name', 'is_manager'],
                where: {
                    is_manager: 1,
                    status: constants.STATUS.active
                }
            }));
        });
    }
    /**
    * get employee list function
    @param {} params pass all parameters from request
    */
    getEmployeeList(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.haveActivePlan(user) && !(process.env.DEV_MODE == "ON"))
                throw new Error(constants.MESSAGES.employer_no_plan);
            models_1.employeeModel.hasOne(models_1.departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
            if (params.departmentId) {
                let departmentExists = yield models_1.departmentModel.findOne({ where: { id: parseInt(params.departmentId) } });
                if (!departmentExists)
                    throw new Error(constants.MESSAGES.invalid_department);
            }
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let whereCond = {
                status: [constants.STATUS.active, constants.STATUS.inactive]
            };
            whereCond.current_employer_id = user.uid;
            if (params.departmentId) {
                whereCond = Object.assign(Object.assign({}, whereCond), { current_department_id: parseInt(params.departmentId) });
            }
            if (params.searchKey) {
                let searchKey = params.searchKey;
                whereCond = Object.assign(Object.assign({}, whereCond), { [Op.or]: [
                        { name: { [Op.iLike]: `%${searchKey}%` } },
                        { email: { [Op.iLike]: `%${searchKey}%` } },
                        { phone_number: { [Op.iLike]: `%${searchKey}%` } }
                    ] });
            }
            return yield models_1.employeeModel.findAndCountAll({
                attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url', 'current_department_id', 'is_manager'],
                where: whereCond,
                include: [
                    {
                        model: models_1.departmentModel,
                        attributes: ['id', 'name'],
                        required: true,
                    }
                ],
                limit: limit,
                offset: offset,
                order: [["createdAt", "DESC"]]
            });
        });
    }
    /**
     * funtion to get department list
     */
    getDepartmentList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield helperFunction.convertPromiseToObject(yield models_1.departmentModel.findAndCountAll({
                where: {
                    status: constants.STATUS.active
                }
            }));
        });
    }
    /**
     * function to View employee details
     */
    viewEmployeeDetails(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.haveActivePlan(user) && !(process.env.DEV_MODE == "ON"))
                throw new Error(constants.MESSAGES.employer_no_plan);
            models_1.employeeModel.hasOne(models_1.departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
            let employeeDetails = yield helperFunction.convertPromiseToObject(yield models_1.employeeModel.findOne({
                //attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url', 'current_department_id', 'is_manager'],
                where: {
                    id: parseInt(params.employee_id),
                    status: [constants.STATUS.active, constants.STATUS.inactive]
                },
                include: [
                    {
                        model: models_1.departmentModel,
                        attributes: ['id', 'name'],
                        required: true,
                    }
                ],
            }));
            delete employeeDetails.password;
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
            let goalStats = [];
            for (let goal of quantitativeStatsOfGoals) {
                goalStats.push(Object.assign(Object.assign({}, goal), { quantitative_stats: `${parseFloat(goal.complete_measure)}/${parseFloat(goal.team_goal.enter_measure)}`, quantitative_stats_percent: (parseFloat(goal.complete_measure) / parseFloat(goal.team_goal.enter_measure)) * 100 }));
            }
            let qualitativeMeasurement = yield helperFunction.convertPromiseToObject(yield qualitativeMeasurement_1.qualitativeMeasurementModel.findAll({
                where: { employee_id: parseInt(params.employee_id) },
                attributes: ["id", "manager_id", "employee_id", "createdAt", "updatedAt",
                    ["initiative", "Initiative"], ["initiative_desc", "Initiative_desc"],
                    ["ability_to_delegate", "Ability to Delegate"], ["ability_to_delegate_desc", "Ability to Delegate_desc"],
                    ["clear_Communication", "Clear Communication"], ["clear_Communication_desc", "Clear Communication_desc"],
                    // ["self_awareness_of_strengths_and_weaknesses", "Self-awareness of strengths and weaknesses"], ["self_awareness_of_strengths_and_weaknesses_desc", "Self-awareness of strengths and weaknesses_desc"],
                    ["agile_thinking", "Agile Thinking"], ["agile_thinking_desc", "Agile Thinking_desc"],
                    // ["influence", "Influence"], ["influence_desc", "Influence_desc"],
                    ["empathy", "Empathy"], ["empathy_desc", "Empathy_desc"],
                ],
                order: [["updatedAt", "DESC"]],
                limit: 1
            }));
            if (qualitativeMeasurement.length === 0)
                throw new Error(constants.MESSAGES.no_qualitative_measure);
            let qualitativeMeasurements = {
                id: qualitativeMeasurement[0].id,
                manager_id: qualitativeMeasurement[0].manager_id,
                employee_id: qualitativeMeasurement[0].employee_id,
                createdAt: qualitativeMeasurement[0].createdAt,
                updatedAt: qualitativeMeasurement[0].updatedAt,
                qualitativeMeasures: [],
            };
            for (let key in qualitativeMeasurement[0]) {
                if ([
                    "Initiative",
                    "Ability to Delegate",
                    "Clear Communication",
                    // "Self-awareness of strengths and weaknesses",
                    "Agile Thinking",
                    // "Influence",
                    "Empathy",
                ].includes(key)) {
                    qualitativeMeasurements.qualitativeMeasures.push({
                        label: key,
                        rating: qualitativeMeasurement[0][key],
                        desc: qualitativeMeasurement[0][`${key}_desc`]
                    });
                }
            }
            return { employeeDetails, goalStats, qualitativeMeasurements };
        });
    }
    /**
     * function to delete an employee
     */
    deleteEmployee(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.haveActivePlan(user) && !(process.env.DEV_MODE == "ON"))
                throw new Error(constants.MESSAGES.employer_no_plan);
            let employee = yield models_1.employeeModel.findOne({
                where: {
                    id: parseInt(params.employee_id),
                    status: [constants.STATUS.active, constants.STATUS.inactive]
                }
            });
            if (employee) {
                employee.status = constants.STATUS.deleted;
                employee.save();
            }
            else {
                throw new Error(constants.MESSAGES.employee_notFound);
            }
            return true;
        });
    }
}
exports.EmployeeManagement = EmployeeManagement;
//# sourceMappingURL=managementService.js.map