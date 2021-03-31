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
exports.EmployeeServices = void 0;
const lodash_1 = __importDefault(require("lodash"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const employee_1 = require("../../models/employee");
const managerTeamMember_1 = require("../../models/managerTeamMember");
const teamGoalAssign_1 = require("../../models/teamGoalAssign");
const qualitativeMeasurement_1 = require("../../models/qualitativeMeasurement");
const teamGoal_1 = require("../../models/teamGoal");
const emoji_1 = require("../../models/emoji");
const authService_1 = require("./authService");
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
const authService = new authService_1.AuthService();
class EmployeeServices {
    constructor() { }
    /*
    * function to get list of team members
    */
    getListOfTeamMemberByManagerId(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            managerTeamMember_1.managerTeamMemberModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
            employee_1.employeeModel.hasOne(emoji_1.emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
            let teamMembersData = yield helperFunction.convertPromiseToObject(yield managerTeamMember_1.managerTeamMemberModel.findAndCountAll({
                where: { manager_id: user.uid },
                include: [
                    {
                        model: employee_1.employeeModel,
                        required: false,
                        attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'profile_pic_url'],
                        include: [
                            {
                                model: emoji_1.emojiModel,
                                required: false,
                                attributes: ['image_url', 'caption'],
                            }
                        ]
                    }
                ],
                limit: limit,
                offset: offset,
                order: [["createdAt", "DESC"]]
            }));
            let date = new Date();
            date.setMonth(date.getMonth() - 3);
            //let dateCheck = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
            let dateCheck = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            for (let i = 0; i < teamMembersData.rows.length; i++) {
                let rateCheck = yield helperFunction.convertPromiseToObject(yield qualitativeMeasurement_1.qualitativeMeasurementModel.findOne({
                    where: {
                        manager_id: user.uid,
                        employee_id: teamMembersData.rows[i].team_member_id,
                        updatedAt: { [Op.gte]: dateCheck }
                    }
                }));
                if (lodash_1.default.isEmpty(rateCheck)) {
                    teamMembersData.rows[i].rate_valid = 1;
                }
                else {
                    teamMembersData.rows[i].rate_valid_after_date = rateCheck.createdAt;
                    teamMembersData.rows[i].rate_valid = 0;
                }
            }
            return teamMembersData;
        });
    }
    /*
    * function to get details of employee
    */
    viewDetailsEmployee(params) {
        return __awaiter(this, void 0, void 0, function* () {
            employee_1.employeeModel.hasMany(teamGoalAssign_1.teamGoalAssignModel, { foreignKey: "employee_id", sourceKey: "id", targetKey: "employee_id" });
            teamGoalAssign_1.teamGoalAssignModel.hasOne(teamGoal_1.teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
            let employeeDetails = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                where: { id: params.id },
                include: [
                    {
                        model: teamGoalAssign_1.teamGoalAssignModel,
                        required: false,
                        include: [
                            {
                                model: teamGoal_1.teamGoalModel,
                                required: false
                            }
                        ]
                    }
                ],
                attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'profile_pic_url']
            }));
            let qualitativeMeasurementDetails = yield qualitativeMeasurement_1.qualitativeMeasurementModel.findOne({
                where: { employee_id: params.id },
                group: 'employee_id',
                attributes: [
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
            });
            employeeDetails.qualitativeMeasurementDetails = qualitativeMeasurementDetails;
            return employeeDetails;
        });
    }
    /*
    * function to get details of employee
    */
    searchTeamMember(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            managerTeamMember_1.managerTeamMemberModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
            employee_1.employeeModel.hasOne(emoji_1.emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
            return yield managerTeamMember_1.managerTeamMemberModel.findAndCountAll({
                where: { manager_id: user.uid },
                include: [
                    {
                        model: employee_1.employeeModel,
                        required: true,
                        where: {
                            [Op.or]: [
                                { name: { [Op.iLike]: `%${params.search_string}%` } },
                                { phone_number: { [Op.iLike]: `%${params.search_string}%` } },
                                { email: { [Op.iLike]: `%${params.search_string}%` } }
                            ]
                        },
                        attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'profile_pic_url'],
                        include: [
                            {
                                model: emoji_1.emojiModel,
                                required: false,
                                attributes: ['image_url', 'caption'],
                            }
                        ]
                    }
                ],
                limit: limit,
                offset: offset,
                order: [["createdAt", "DESC"]]
            });
        });
    }
    /*
    * function to add thought of the day
    */
    thoughtOfTheDay(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield employee_1.employeeModel.update({
                thought_of_the_day: params.thought_of_the_day
            }, {
                where: { id: user.uid }
            });
            return employee_1.employeeModel.findOne({
                where: { id: user.uid }
            });
        });
    }
    /*
    * function to add thought of the day
    */
    getEmoji() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield emoji_1.emojiModel.findAll();
        });
    }
    /*
   * function to add thought of the day
   */
    updateEnergyCheck(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield employee_1.employeeModel.update({
                energy_id: params.energy_id
            }, {
                where: { id: user.uid }
            });
            return authService.getMyProfile(user);
        });
    }
    /*
    * function to view energy check
    */
    viewEnergyCheckTeamMembers(user) {
        return __awaiter(this, void 0, void 0, function* () {
            managerTeamMember_1.managerTeamMemberModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
            employee_1.employeeModel.hasOne(emoji_1.emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
            return yield managerTeamMember_1.managerTeamMemberModel.findAll({
                where: { manager_id: user.uid },
                include: [
                    {
                        model: employee_1.employeeModel,
                        required: false,
                        attributes: ['id', 'name', 'energy_id'],
                        include: [
                            {
                                model: emoji_1.emojiModel,
                                required: false,
                                attributes: ['image_url', 'caption'],
                            }
                        ]
                    }
                ]
            });
        });
    }
    /*
   * feel about job today
   */
    feelAboutJobToday(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield employee_1.employeeModel.update(params, {
                where: { id: user.uid }
            });
        });
    }
    /*
   * function to update device token
   */
    updateEmployeeDeviceToken(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield employee_1.employeeModel.update({
                device_token: params.device_token
            }, {
                where: { id: user.uid }
            });
            return authService.getMyProfile(user);
        });
    }
}
exports.EmployeeServices = EmployeeServices;
//# sourceMappingURL=employeeServices.js.map