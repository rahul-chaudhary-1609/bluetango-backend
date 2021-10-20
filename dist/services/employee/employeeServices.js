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
const constants = __importStar(require("../../constants"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const employee_1 = require("../../models/employee");
const admin_1 = require("../../models/admin");
const employers_1 = require("../../models/employers");
const department_1 = require("../../models/department");
const managerTeamMember_1 = require("../../models/managerTeamMember");
const teamGoalAssign_1 = require("../../models/teamGoalAssign");
const qualitativeMeasurement_1 = require("../../models/qualitativeMeasurement");
const teamGoal_1 = require("../../models/teamGoal");
const emoji_1 = require("../../models/emoji");
const coachManagement_1 = require("../../models/coachManagement");
const contactUs_1 = require("../../models/contactUs");
const notification_1 = require("../../models/notification");
const feedback_1 = require("../../models/feedback");
const authService_1 = require("./authService");
const libraryManagement_1 = require("../../models/libraryManagement");
const multerParser_1 = require("../../middleware/multerParser");
const attributeRatings_1 = require("../../models/attributeRatings");
const employeeRanks_1 = require("../../models/employeeRanks");
const coachSpecializationCategories_1 = require("../../models/coachSpecializationCategories");
const employeeCoachSession_1 = require("../../models/employeeCoachSession");
const coachSchedule_1 = require("../../models/coachSchedule");
const moment = require("moment");
const path = __importStar(require("path"));
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
const PDFDocument = require('pdfkit');
const fs = require('fs');
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
                        required: true,
                        attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'energy_last_updated', 'profile_pic_url'],
                        where: { status: 1 },
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
            for (let obj of teamMembersData.rows) {
                if (obj.employee) {
                    obj.isEmployeeEnergyUpdatedInLast24Hour = true;
                    const timeDiff = Math.floor(((new Date()).getTime() - (new Date(obj.employee.energy_last_updated)).getTime()) / 1000);
                    if (timeDiff > 86400)
                        obj.isEmployeeEnergyUpdatedInLast24Hour = false;
                }
            }
            let date = new Date();
            date.setMonth(date.getMonth() - 3);
            //let dateCheck = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
            let dateCheck = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            for (let i = 0; i < teamMembersData.rows.length; i++) {
                let rateCheck = yield helperFunction.convertPromiseToObject(yield attributeRatings_1.attributeRatingModel.findOne({
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
            employee_1.employeeModel.hasOne(department_1.departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
            let employeeDetails = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                where: { id: params.id },
                include: [
                    {
                        model: department_1.departmentModel,
                        required: true
                    },
                    {
                        model: teamGoalAssign_1.teamGoalAssignModel,
                        separate: true,
                        required: false,
                        include: [
                            {
                                model: teamGoal_1.teamGoalModel,
                                required: false
                            }
                        ]
                    },
                ],
                attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'profile_pic_url', 'current_department_id']
            }));
            let qualitativeMeasurement = yield helperFunction.convertPromiseToObject(yield qualitativeMeasurement_1.qualitativeMeasurementModel.findAll({
                where: { employee_id: params.id },
                attributes: ["id", "manager_id", "employee_id", "createdAt", "updatedAt",
                    ["initiative", "Initiative"], ["initiative_desc", "Initiative_desc"],
                    ["ability_to_delegate", "Ability to Delegate"], ["ability_to_delegate_desc", "Ability to Delegate_desc"],
                    ["clear_Communication", "Clear Communication"], ["clear_Communication_desc", "Clear Communication_desc"],
                    //    ["self_awareness_of_strengths_and_weaknesses", "Self-awareness of strengths and weaknesses"], ["self_awareness_of_strengths_and_weaknesses_desc", "Self-awareness of strengths and weaknesses_desc"],
                    ["agile_thinking", "Agile Thinking"], ["agile_thinking_desc", "Agile Thinking_desc"],
                    //    ["influence", "Influence"], ["influence_desc", "Influence_desc"],
                    ["empathy", "Empathy"], ["empathy_desc", "Empathy_desc"],
                ],
                order: [["updatedAt", "DESC"]],
                limit: 1
            }));
            if (qualitativeMeasurement.length != 0) //throw new Error(constants.MESSAGES.no_qualitative_measure);
             {
                let startDate = new Date(qualitativeMeasurement[0].createdAt);
                let endDate = new Date(qualitativeMeasurement[0].createdAt);
                endDate.setMonth(startDate.getMonth() + 3);
                let result = {
                    id: qualitativeMeasurement[0].id,
                    manager_id: qualitativeMeasurement[0].manager_id,
                    employee_id: qualitativeMeasurement[0].employee_id,
                    startDate,
                    endDate,
                    createdAt: qualitativeMeasurement[0].createdAt,
                    updatedAt: qualitativeMeasurement[0].updatedAt,
                    qualitativeMeasures: [],
                };
                for (let key in qualitativeMeasurement[0]) {
                    if ([
                        "Initiative",
                        "Ability to Delegate",
                        "Clear Communication",
                        //    "Self-awareness of strengths and weaknesses",
                        "Agile Thinking",
                        //    "Influence",
                        "Empathy",
                    ].includes(key)) {
                        result.qualitativeMeasures.push({
                            label: key,
                            rating: qualitativeMeasurement[0][key],
                            desc: qualitativeMeasurement[0][`${key}_desc`]
                        });
                    }
                }
                employeeDetails.qualitativeMeasurementDetails = result;
            }
            attributeRatings_1.attributeRatingModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            employeeDetails.attributeRatings = yield helperFunction.convertPromiseToObject(yield attributeRatings_1.attributeRatingModel.findOne({
                where: { employee_id: params.id },
                include: [
                    {
                        model: employee_1.employeeModel,
                        required: true,
                        attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                    }
                ],
                order: [["updatedAt", "DESC"]],
                limit: 1
            }));
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
            let teamMembersData = yield helperFunction.convertPromiseToObject(yield managerTeamMember_1.managerTeamMemberModel.findAndCountAll({
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
                        attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'energy_last_updated', 'profile_pic_url'],
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
            for (let obj of teamMembersData.rows) {
                obj.isEmployeeEnergyUpdatedInLast24Hour = true;
                const timeDiff = Math.floor(((new Date()).getTime() - (new Date(obj.employee.energy_last_updated)).getTime()) / 1000);
                if (timeDiff > 86400)
                    obj.isEmployeeEnergyUpdatedInLast24Hour = false;
            }
            return teamMembersData;
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
            return yield emoji_1.emojiModel.findAll({
                order: [["id"]]
            });
        });
    }
    /*
   * function to add thought of the day
   */
    updateEnergyCheck(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield employee_1.employeeModel.update({
                energy_id: params.energy_id,
                energy_last_updated: new Date(),
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
    /*
* function to clear device token
*/
    clearEmployeeDeviceToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield employee_1.employeeModel.update({
                device_token: null,
            }, {
                where: { id: user.uid },
                returning: true
            });
        });
    }
    /*
 * function to get current manager
 */
    getCurrentManager(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentManager = yield helperFunction.convertPromiseToObject(yield managerTeamMember_1.managerTeamMemberModel.findOne({
                where: { team_member_id: user.uid },
            }));
            return currentManager;
        });
    }
    /*
    * function to get employee details to show employee detail on dashbord as team member view
    */
    getEmployeeDetails(user) {
        return __awaiter(this, void 0, void 0, function* () {
            employee_1.employeeModel.hasOne(department_1.departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
            employee_1.employeeModel.hasOne(managerTeamMember_1.managerTeamMemberModel, { foreignKey: "team_member_id", sourceKey: "id", targetKey: "team_member_id" });
            managerTeamMember_1.managerTeamMemberModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
            let employee = yield employee_1.employeeModel.findOne({
                attributes: ['id', 'name', 'employee_code', 'profile_pic_url'],
                where: {
                    id: user.uid
                },
                include: [
                    {
                        model: department_1.departmentModel,
                        required: false,
                        attributes: ['name']
                    },
                    {
                        model: managerTeamMember_1.managerTeamMemberModel,
                        required: false,
                        attributes: ['manager_id'],
                        include: [
                            {
                                model: employee_1.employeeModel,
                                required: false,
                                attributes: ['name'],
                            }
                        ]
                    }
                ],
            });
            return yield helperFunction.convertPromiseToObject(employee);
        });
    }
    /*
    * function to view energy of employee on dashbord as team member view
    */
    viewEmployeeEnergy(user) {
        return __awaiter(this, void 0, void 0, function* () {
            employee_1.employeeModel.hasOne(emoji_1.emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
            let employeeEnergy = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                attributes: ['id', 'name', 'energy_last_updated'],
                where: {
                    id: user.uid
                },
                include: [
                    {
                        model: emoji_1.emojiModel,
                        required: false,
                        attributes: ['id', 'image_url', 'caption']
                    },
                ],
            }));
            employeeEnergy.isUpdateAvailable = false;
            const timeDiff = Math.floor(((new Date()).getTime() - (new Date(employeeEnergy.energy_last_updated)).getTime()) / 1000);
            if (timeDiff > 86400)
                employeeEnergy.isUpdateAvailable = true;
            return employeeEnergy;
        });
    }
    /*
    * function to view thought of the day employee on dashbord as team member view
    */
    viewThoughtOfTheDay(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let employeeThoughtOfTheDay = yield employee_1.employeeModel.findOne({
                attributes: ['id', 'thought_of_the_day'],
                where: {
                    id: user.uid
                },
            });
            return yield helperFunction.convertPromiseToObject(employeeThoughtOfTheDay);
        });
    }
    /*
    * function to view feel About Job Today on dashbord as team member view
    */
    viewFeelAboutJobToday(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let employeeFeelAboutJobToday = yield employee_1.employeeModel.findOne({
                attributes: ['id', 'job_emoji_id', 'job_comments'],
                where: {
                    id: user.uid
                },
            });
            return yield helperFunction.convertPromiseToObject(employeeFeelAboutJobToday);
        });
    }
    /*
    * function to view thought of the day from admin on dashbord as team member view
    */
    viewThoughtOfTheDayFromAdmin(user) {
        return __awaiter(this, void 0, void 0, function* () {
            employee_1.employeeModel.hasOne(employers_1.employersModel, { foreignKey: "id", sourceKey: "current_employer_id", targetKey: "id" });
            employers_1.employersModel.hasOne(admin_1.adminModel, { foreignKey: "id", sourceKey: "admin_id", targetKey: "id" });
            let employeeFeelAboutJobTodayFromAdmin = yield employee_1.employeeModel.findOne({
                attributes: ['id'],
                where: {
                    id: user.uid
                },
                include: [
                    {
                        model: employers_1.employersModel,
                        required: false,
                        attributes: ['id', 'thought_of_the_day'],
                        include: [
                            {
                                model: admin_1.adminModel,
                                required: false,
                                attributes: ['id', 'thought_of_the_day']
                            },
                        ],
                    },
                ],
            });
            return yield helperFunction.convertPromiseToObject(employeeFeelAboutJobTodayFromAdmin);
        });
    }
    /*
   * function to get coach list
   */
    getCoachList(user, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let employee = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findByPk(parseInt(user.uid)));
            let where = {};
            if (params.searchKey) {
                let coachSpecializationCategories = yield helperFunction.convertPromiseToObject(yield coachSpecializationCategories_1.coachSpecializationCategoriesModel.findAll({
                    where: {
                        name: {
                            [Op.iLike]: `%${params.searchKey}%`
                        }
                    }
                }));
                if (coachSpecializationCategories.length > 0) {
                    let coachSpecializationCategoryIds = coachSpecializationCategories.map(coachSpecializationCategory => coachSpecializationCategory.id);
                    if (coachSpecializationCategoryIds) {
                        where["coach_specialization_category_ids"] = {
                            [Op.contains]: coachSpecializationCategoryIds || [],
                        };
                    }
                    else {
                        throw new Error(constants.MESSAGES.no_coach_with_specialization_category);
                    }
                }
                else {
                    // where["coach_specialization_category_ids"] = { 
                    //     [Op.contains]: null,
                    // }
                    throw new Error(constants.MESSAGES.no_coach_with_specialization_category);
                }
            }
            if (employee) {
                where["employee_rank_ids"] = {
                    [Op.contains]: [employee.employee_rank_id]
                };
            }
            where["status"] = constants.STATUS.active;
            let query = {
                where: where,
                attributes: ["id", "name", 'description', "email", "phone_number", ['image', 'profile_pic_url'], "coach_specialization_category_ids", "employee_rank_ids", "coach_charge"],
                order: [["id", "DESC"]]
            };
            if (params.sortBy) {
                if (params.sortBy == 1) {
                    query.order = [["createdAt", "DESC"]];
                }
                else if (params.sortBy == 2) {
                    query.order = [["createdAt", "ASC"]];
                }
                else if (params.sortBy == 4) {
                    query.order = [["coach_charge", "DESC"]];
                }
                else if (params.sortBy == 5) {
                    query.order = [["coach_charge", "ASC"]];
                }
            }
            let coachList = yield helperFunction.convertPromiseToObject(yield coachManagement_1.coachManagementModel.findAndCountAll(query));
            for (let coach of coachList.rows) {
                coach.coach_specialization_categories = yield helperFunction.convertPromiseToObject(yield coachSpecializationCategories_1.coachSpecializationCategoriesModel.findAll({
                    where: {
                        id: {
                            [Op.in]: coach.coach_specialization_category_ids || [],
                        },
                        status: constants.STATUS.active,
                    }
                }));
                coach.employee_ranks = yield helperFunction.convertPromiseToObject(yield employeeRanks_1.employeeRanksModel.findAll({
                    where: {
                        id: {
                            [Op.in]: coach.employee_rank_ids || [],
                        },
                        status: constants.STATUS.active,
                    }
                }));
                coach.total_completed_sessions = yield employeeCoachSession_1.employeeCoachSessionsModel.count({
                    where: {
                        coach_id: coach.id,
                    }
                });
                let totalRating = yield employeeCoachSession_1.employeeCoachSessionsModel.sum('coach_rating', {
                    where: {
                        coach_id: coach.id,
                    }
                });
                let slotsWhere = {
                    coach_id: coach.id,
                    status: constants.COACH_SCHEDULE_STATUS.available,
                };
                if (params.filterBy) {
                    if (params.filterBy == 1) {
                        slotsWhere = Object.assign(Object.assign({}, slotsWhere), { date: {
                                [Op.gte]: moment(new Date()).format("YYYY-MM-DD"),
                            } });
                    }
                    else if (params.filterBy == 2) {
                        slotsWhere = Object.assign(Object.assign({}, slotsWhere), { date: moment(new Date()).format("YYYY-MM-DD") });
                    }
                    else if (params.filterBy == 3 && params.date) {
                        slotsWhere = Object.assign(Object.assign({}, slotsWhere), { date: params.date });
                    }
                    else {
                        slotsWhere = Object.assign(Object.assign({}, slotsWhere), { date: moment(new Date()).format("YYYY-MM-DD") });
                    }
                }
                else {
                    slotsWhere = Object.assign(Object.assign({}, slotsWhere), { date: moment(new Date()).format("YYYY-MM-DD") });
                }
                coach.available_slots = yield helperFunction.convertPromiseToObject(yield coachSchedule_1.coachScheduleModel.findAll({
                    attributes: ['id', 'date', 'start_time', 'end_time'],
                    where: slotsWhere,
                    order: [["date", "ASC"], ["start_time", "ASC"], ["end_time", "ASC"]]
                }));
                coach.average_rating = parseInt(totalRating) / coach.total_completed_sessions;
                coach.average_rating = coach.average_rating || 0;
                delete coach.coach_specialization_category_ids;
                delete coach.employee_rank_ids;
            }
            coachList.rows = coachList.rows.filter(coach => { var _a; return ((_a = coach.available_slots) === null || _a === void 0 ? void 0 : _a.length) > 0; });
            coachList.count = coachList.rows.length;
            if (!params.sortBy || params.sortBy == 3) {
                coachList.rows.sort((a, b) => b.average_rating - a.average_rating);
            }
            if (params.sortBy && params.sortBy == 6) {
                coachList.rows.forEach((row) => {
                    var _a;
                    (_a = row.available_slots) === null || _a === void 0 ? void 0 : _a.forEach((slot) => {
                        Object.keys(slot).forEach((key) => {
                            if (key == "start_time") {
                                slot[key] = slot[key].replace(/:/g, "");
                            }
                        });
                    });
                });
                // console.log("coachList",coachList.rows.forEach((row,index)=>{
                //     console.log(`available_slot${index}`,row.available_slots)
                // }))
                coachList.rows.sort((a, b) => { var _a, _b; return ((_a = a.available_slots[0]) === null || _a === void 0 ? void 0 : _a.start_time) - ((_b = b.available_slots[0]) === null || _b === void 0 ? void 0 : _b.start_time); });
                coachList.rows.forEach((row) => {
                    var _a;
                    (_a = row.available_slots) === null || _a === void 0 ? void 0 : _a.forEach((slot) => {
                        Object.keys(slot).forEach((key) => {
                            if (key == "start_time") {
                                slot[key] = moment(slot[key], "HHmmss").format("HH:mm:ss");
                            }
                        });
                    });
                });
                // console.log("coachList",coachList.rows.forEach((row,index)=>{
                //     console.log(`available_slot${index}`,row.available_slots)
                // }))
            }
            if (params.is_pagination && params.is_pagination == constants.IS_PAGINATION.yes) {
                let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
                coachList.rows = coachList.rows.slice(offset, offset + limit);
            }
            return coachList;
        });
    }
    getSlots(params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("params", params);
            let where = {
                coach_id: params.coach_id,
                status: {
                    [Op.notIn]: [constants.COACH_SCHEDULE_STATUS.passed]
                }
            };
            let start_date = new Date();
            let end_date = new Date();
            if (params.filter_key) {
                if (params.filter_key == "Daily") {
                    where = Object.assign(Object.assign({}, where), { date: moment(new Date()).format("YYYY-MM-DD") });
                }
                else if (params.filter_key == "Weekly") {
                    start_date = helperFunction.getMonday(start_date);
                    end_date = helperFunction.getMonday(start_date);
                    end_date.setDate(start_date.getDate() + 6);
                    where = Object.assign(Object.assign({}, where), { date: {
                            [Op.between]: [
                                moment(start_date).format("YYYY-MM-DD"),
                                moment(end_date).format("YYYY-MM-DD")
                            ]
                        } });
                }
                else if (params.filter_key == "Monthly") {
                    start_date.setDate(1);
                    end_date.setMonth(start_date.getMonth() + 1);
                    end_date.setDate(1);
                    end_date.setDate(end_date.getDate() - 1);
                    where = Object.assign(Object.assign({}, where), { date: {
                            [Op.between]: [
                                moment(start_date).format("YYYY-MM-DD"),
                                moment(end_date).format("YYYY-MM-DD")
                            ]
                        } });
                }
                else if (params.filter_key == "Yearly") {
                    start_date.setDate(1);
                    start_date.setMonth(0);
                    end_date.setDate(1);
                    end_date.setMonth(0);
                    end_date.setFullYear(end_date.getFullYear() + 1);
                    end_date.setDate(end_date.getDate() - 1);
                    where = Object.assign(Object.assign({}, where), { date: {
                            [Op.between]: [
                                moment(start_date).format("YYYY-MM-DD"),
                                moment(end_date).format("YYYY-MM-DD")
                            ]
                        } });
                }
            }
            else if ((params.day && params.month && params.year) || params.date) {
                where = Object.assign(Object.assign({}, where), { date: params.date || `${params.year}-${params.month}-${params.day}` });
            }
            else if (params.week && params.year) {
                where = {
                    [Op.and]: [
                        Object.assign({}, where),
                        Sequelize.where(Sequelize.fn("date_part", "year", Sequelize.col("date")), "=", params.year),
                        Sequelize.where(Sequelize.fn("date_part", "week", Sequelize.col("date")), "=", params.week),
                    ]
                };
            }
            else if (params.month && params.year) {
                where = {
                    [Op.and]: [
                        Object.assign({}, where),
                        Sequelize.where(Sequelize.fn("date_part", "year", Sequelize.col("date")), "=", params.year),
                        Sequelize.where(Sequelize.fn("date_part", "month", Sequelize.col("date")), "=", params.month),
                    ]
                };
            }
            else if (params.year) {
                where = {
                    [Op.and]: [
                        Object.assign({}, where),
                        Sequelize.where(Sequelize.fn("date_part", "year", Sequelize.col("date")), "=", params.year),
                    ]
                };
            }
            else {
                start_date.setDate(1);
                end_date.setMonth(start_date.getMonth() + 1);
                end_date.setDate(1);
                end_date.setDate(end_date.getDate() - 1);
                where = Object.assign(Object.assign({}, where), { date: {
                        [Op.between]: [
                            moment(start_date).format("YYYY-MM-DD"),
                            moment(end_date).format("YYYY-MM-DD")
                        ]
                    } });
            }
            return yield helperFunction.convertPromiseToObject(yield coachSchedule_1.coachScheduleModel.findAndCountAll({
                where,
                order: [["date", "ASC"], ["start_time", "ASC"]]
            }));
        });
    }
    getSlot(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let schedule = yield helperFunction.convertPromiseToObject(yield coachSchedule_1.coachScheduleModel.findByPk(parseInt(params.slot_id)));
            if (!schedule)
                throw new Error(constants.MESSAGES.no_coach_schedule);
            return schedule;
        });
    }
    createSessionRequest(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let employee = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findByPk(parseInt(user.uid)));
            let employeeSessionCount = yield employeeCoachSession_1.employeeCoachSessionsModel.count({
                where: {
                    employee_id: user.uid,
                    type: constants.EMPLOYEE_COACH_SESSION_TYPE.free,
                    status: {
                        [Op.in]: [
                            constants.EMPLOYEE_COACH_SESSION_STATUS.pending,
                            constants.EMPLOYEE_COACH_SESSION_STATUS.accepted,
                            constants.EMPLOYEE_COACH_SESSION_STATUS.completed
                        ]
                    }
                }
            });
            let employeeCoachSessionObj = {
                coach_id: params.coach_id,
                employee_id: user.uid,
                employee_rank_id: employee.employee_rank_id,
                coach_specialization_category_id: params.coach_specialization_category_id,
                date: params.date,
                start_time: params.start_time,
                end_time: params.end_time || null,
                type: employeeSessionCount < 2 ? constants.EMPLOYEE_COACH_SESSION_TYPE.free : constants.EMPLOYEE_COACH_SESSION_TYPE.paid,
                query: params.query,
            };
            return yield helperFunction.convertPromiseToObject(yield employeeCoachSession_1.employeeCoachSessionsModel.create(employeeCoachSessionObj));
        });
    }
    /*
  * function to contact admin
  */
    contactUs(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let employee = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                where: {
                    id: user.uid,
                }
            }));
            let contactObj = {
                //employer_id: employee.current_employer_id,
                employee_id: user.uid,
                message: params.message,
                status: constants.STATUS.active,
            };
            return yield contactUs_1.contactUsModel.create(contactObj);
        });
    }
    /*
* function to get notification
*/
    getNotifications(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let notifications = yield helperFunction.convertPromiseToObject(yield notification_1.notificationModel.findAndCountAll({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: {
                        [Op.notIn]: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                            constants.NOTIFICATION_TYPE.message,
                            constants.NOTIFICATION_TYPE.group_chat,
                            constants.NOTIFICATION_TYPE.goal_submit_reminder,
                        ]
                    },
                    status: [0, 1]
                },
                order: [["createdAt", "DESC"]]
            }));
            yield notification_1.notificationModel.update({
                status: 0,
            }, {
                where: {
                    status: 1,
                    type: {
                        [Op.notIn]: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                            constants.NOTIFICATION_TYPE.message,
                            constants.NOTIFICATION_TYPE.group_chat,
                            constants.NOTIFICATION_TYPE.goal_submit_reminder,
                        ]
                    },
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                }
            });
            return notifications;
        });
    }
    /*
* function to get unseen notification count
*/
    getUnseenNotificationCount(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                all: yield notification_1.notificationModel.count({
                    where: {
                        reciever_id: user.uid,
                        reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                        type: {
                            [Op.notIn]: [
                                constants.NOTIFICATION_TYPE.achievement_post,
                                constants.NOTIFICATION_TYPE.message,
                                constants.NOTIFICATION_TYPE.group_chat,
                                constants.NOTIFICATION_TYPE.goal_submit_reminder,
                            ]
                        },
                        status: 1,
                    }
                }),
                achievement: yield notification_1.notificationModel.count({
                    where: {
                        reciever_id: user.uid,
                        reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                        type: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                            constants.NOTIFICATION_TYPE.achievement_like,
                            constants.NOTIFICATION_TYPE.achievement_highfive,
                            constants.NOTIFICATION_TYPE.achievement_comment,
                        ],
                        status: 1,
                    }
                }),
                achievement_post_only: yield notification_1.notificationModel.count({
                    where: {
                        reciever_id: user.uid,
                        reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                        type: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                        ],
                        status: 1,
                    }
                }),
                chat: yield notification_1.notificationModel.count({
                    where: {
                        reciever_id: user.uid,
                        reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                        type: [
                            constants.NOTIFICATION_TYPE.message,
                            constants.NOTIFICATION_TYPE.audio_chat,
                            constants.NOTIFICATION_TYPE.video_chat,
                            constants.NOTIFICATION_TYPE.audio_chat_missed,
                            constants.NOTIFICATION_TYPE.video_chat_missed,
                            constants.NOTIFICATION_TYPE.chat_disconnect,
                        ],
                        status: 1,
                    }
                }),
                chat_message_only: (yield helperFunction.convertPromiseToObject(yield notification_1.notificationModel.count({
                    where: {
                        reciever_id: user.uid,
                        reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                        type: [
                            constants.NOTIFICATION_TYPE.message,
                            constants.NOTIFICATION_TYPE.group_chat,
                        ],
                        status: 1,
                    },
                    group: ['type_id']
                }))).length,
                goal: yield notification_1.notificationModel.count({
                    where: {
                        reciever_id: user.uid,
                        reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                        type: [
                            constants.NOTIFICATION_TYPE.assign_new_goal,
                            constants.NOTIFICATION_TYPE.goal_complete_request,
                            constants.NOTIFICATION_TYPE.goal_accept,
                            constants.NOTIFICATION_TYPE.goal_reject,
                        ],
                        status: 1,
                    }
                }),
                rating: yield notification_1.notificationModel.count({
                    where: {
                        reciever_id: user.uid,
                        reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                        type: [
                            constants.NOTIFICATION_TYPE.rating
                        ],
                        status: 1,
                    }
                })
            };
        });
    }
    /*
* function to mark as viewed notification
*/
    markNotificationsAsViewed(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let whereCondition = null;
            if (params && params.type) {
                if (params.type == "achievement") {
                    whereCondition = Object.assign(Object.assign({}, whereCondition), { type: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                            constants.NOTIFICATION_TYPE.achievement_like,
                            constants.NOTIFICATION_TYPE.achievement_highfive,
                            constants.NOTIFICATION_TYPE.achievement_comment,
                        ] });
                }
                else if (params.type == "achievement_post_only") {
                    whereCondition = Object.assign(Object.assign({}, whereCondition), { type: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                        ] });
                }
                else if (params.type == "chat") {
                    whereCondition = Object.assign(Object.assign({}, whereCondition), { type: [
                            constants.NOTIFICATION_TYPE.message,
                            constants.NOTIFICATION_TYPE.audio_chat,
                            constants.NOTIFICATION_TYPE.video_chat,
                            constants.NOTIFICATION_TYPE.audio_chat_missed,
                            constants.NOTIFICATION_TYPE.video_chat_missed,
                            constants.NOTIFICATION_TYPE.chat_disconnect,
                        ] });
                }
                else if (params.type == "chat_message_only") {
                    if (!params.chat_room_id)
                        throw new Error(constants.MESSAGES.chat_room_required);
                    whereCondition = Object.assign(Object.assign({}, whereCondition), { type: [
                            constants.NOTIFICATION_TYPE.message,
                            constants.NOTIFICATION_TYPE.group_chat,
                        ], type_id: parseInt(params.chat_room_id) });
                }
                else if (params.type == "goal") {
                    whereCondition = Object.assign(Object.assign({}, whereCondition), { type: [
                            constants.NOTIFICATION_TYPE.assign_new_goal,
                            constants.NOTIFICATION_TYPE.goal_complete_request,
                            constants.NOTIFICATION_TYPE.goal_accept,
                            constants.NOTIFICATION_TYPE.goal_reject,
                        ] });
                }
                else if (params.type == "rating") {
                    whereCondition = Object.assign(Object.assign({}, whereCondition), { type: [
                            constants.NOTIFICATION_TYPE.rating
                        ] });
                }
            }
            else {
                whereCondition = Object.assign(Object.assign({}, whereCondition), { type: {
                        [Op.notIn]: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                            constants.NOTIFICATION_TYPE.message,
                            constants.NOTIFICATION_TYPE.goal_submit_reminder,
                        ]
                    } });
            }
            let notification = yield helperFunction.convertPromiseToObject(yield notification_1.notificationModel.update({
                status: 0,
            }, {
                where: Object.assign(Object.assign({}, whereCondition), { status: 1, reciever_id: user.uid, reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee })
            }));
            return notification;
        });
    }
    /**
     * function to refer a friend
     * @param params
     * @param user
     */
    referFriend(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailParams = {};
            mailParams.to = params.email;
            mailParams.html = `Hi  ${params.name}
                <br> Please download the app by clicking on link below and use your credentials for login into the app :
                <br><br><b> Android URL</b>: ${process.env.EMPLOYEE_ANDROID_URL}
                <br><b> IOS URL</b>: ${process.env.EMPLOYEE_IOS_URL}
                <br><b> Web URL</b>: ${process.env.EMPLOYEE_IOS_URL} <br>
                `;
            mailParams.subject = "BluXinga Friend Referral";
            yield helperFunction.sendEmail(mailParams);
            return true;
        });
    }
    /**
     * function to feedback
     * @param params
     * @param user
     */
    feedback(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let feedbackObj = {
                user_id: parseInt(user.uid),
                rating: parseInt(params.rating),
                message: params.message || null,
                feedback_type: constants.FEEDBACK_TYPE.employee,
            };
            return yield helperFunction.convertPromiseToObject(yield feedback_1.feedbackModel.create(feedbackObj));
        });
    }
    /**
*
* @param {} params pass all parameters from request
*/
    listVideo(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let videos = yield helperFunction.convertPromiseToObject(yield libraryManagement_1.libraryManagementModel.findAndCountAll({
                where: { status: 1 },
                limit: limit,
                offset: offset,
                order: [["id", "DESC"]]
            }));
            let thumbnailList = [
                "https://bluexinga-dev.s3.amazonaws.com/other/1626778872396_%20employee-training-programs-that-work.jpg",
                "https://bluexinga-dev.s3.amazonaws.com/other/1626778915570_%20corporate-training.jpg",
                "https://bluexinga-dev.s3.amazonaws.com/other/1626778937655_%20images%20%283%29.jpg",
                "https://bluexinga-dev.s3.amazonaws.com/other/1626778960089_%20the-value-of-employee-training.jpg",
                "https://bluexinga-dev.s3.amazonaws.com/other/1626779024160_%205a0965f54a5b3.jpg",
            ];
            let index = 0;
            videos.rows = videos.rows.map((video) => {
                if (index > 4)
                    index = 0;
                return Object.assign(Object.assign({}, video), { thumbnail_url: video.thumbnail_url || thumbnailList[index++] });
            });
            return videos;
        });
    }
    generateHTML(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let { employee, folderPath, fileNames } = params;
            if (employee.employee_rank) {
                employee.employee_rank = employee.employee_rank.name;
            }
            let htmlHeader = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset='utf-8'>
                <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                <title>${employee.name}</title>
                <meta name='viewport' content='width=device-width, initial-scale=1'>
                
            </head>`;
            let htmlBody = `<body>
                <h1 style="text-align: center;">${employee.name} CV</h1>
                <table style="padding:0px 10px 10px 10px;">`;
            for (let key in employee) {
                htmlBody += `<tr style="text-align: left;">
                    <th style="opacity: 0.9;">${key.split("_").map((ele) => {
                    if (ele == "of" || ele == "in")
                        return ele;
                    else
                        return ele.charAt(0).toUpperCase() + ele.slice(1);
                }).join(" ")}</th>
                    <td style="opacity: 0.8;">:</td>
                    <td style="opacity: 0.8;">${key == 'profile_pic_url' ? `<img src='${employee[key]}' />` : employee[key]}</td>
                </tr>`;
            }
            let htmlFooter = `</table></body>
            </html>`;
            fs.writeFileSync(folderPath + fileNames[0], htmlHeader + htmlBody + htmlFooter);
        });
    }
    shareEmployeeCV(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            employee_1.employeeModel.hasOne(employeeRanks_1.employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });
            let employee = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                where: {
                    id: user.uid,
                },
                include: [
                    {
                        model: employeeRanks_1.employeeRanksModel,
                        required: false,
                        attributes: ["id", "name"]
                    },
                ]
            }));
            let folderPath = `./src/upload`;
            let fileNames = [
                `/${employee.name.split(" ").join("_")}_${employee.id}.html`,
                `/${employee.name.split(" ").join("_")}_${employee.id}.pdf`,
            ];
            fileNames.forEach((fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fs.existsSync(folderPath + fileName)) {
                    yield multerParser_1.deleteFile(fileName);
                }
            }));
            yield this.generateHTML({ employee, folderPath, fileNames });
            const puppeteer = require('puppeteer');
            const hb = require('handlebars');
            const invoicePath = path.resolve(folderPath + fileNames[0]);
            const res = fs.readFileSync(invoicePath, 'utf8');
            //console.log("res",res)
            let data = {};
            const template = hb.compile(res, { strict: true });
            const result = template(data);
            const html = result;
            let launchOptions = {};
            if (require("os").platform() == 'linux') {
                launchOptions = {
                    executablePath: '/usr/bin/chromium-browser',
                    args: ["--no-sandbox"]
                };
            }
            const browser = yield puppeteer.launch(launchOptions);
            const page = yield browser.newPage();
            yield page.setContent(html);
            yield page.pdf({ path: folderPath + fileNames[1], format: 'A4' });
            yield browser.close();
            let attachment = fs.readFileSync(folderPath + fileNames[1]).toString('base64');
            let mailOptions = {
                to: params.to_email,
                subject: params.subject || `${employee.name} CV`,
                html: params.message && params.message || `PFA`,
                attachments: [
                    {
                        content: attachment,
                        filename: fileNames[1].slice(1),
                        type: "application/pdf",
                        disposition: "attachment"
                    }
                ]
            };
            yield helperFunction.sendEmail(mailOptions);
            fileNames.forEach((fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fs.existsSync(folderPath + fileName)) {
                    yield multerParser_1.deleteFile(fileName);
                }
            }));
            return true;
        });
    }
    getEmployeeCV(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            employee_1.employeeModel.hasOne(employeeRanks_1.employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });
            let employee = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                where: {
                    id: user.uid,
                },
                include: [
                    {
                        model: employeeRanks_1.employeeRanksModel,
                        required: false,
                        attributes: ["id", "name"]
                    },
                ]
            }));
            let folderPath = `./src/upload`;
            let fileNames = [
                `/${employee.name.split(" ").join("_")}_${employee.id}.html`,
                `/${employee.name.split(" ").join("_")}_${employee.id}.docx`,
            ];
            fileNames.forEach((fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fs.existsSync(folderPath + fileName)) {
                    yield multerParser_1.deleteFile(fileName);
                }
            }));
            yield this.generateHTML({ employee, folderPath, fileNames });
            const util = require('util');
            const exec = util.promisify(require('child_process').exec);
            let panDocCMD = `pandoc -f html ${folderPath + fileNames[0]} -o ${folderPath + fileNames[1]}`;
            console.log("pandoc ", yield exec(panDocCMD));
            let fileParams = {
                path: path.join(__dirname, `../../../${folderPath}${fileNames[1]}`),
                originalname: fileNames[1],
                mimetype: `application/pdfapplication/vnd.openxmlformats-officedocument.wordprocessingml.document`
            };
            let docURL = yield helperFunction.uploadFile(fileParams, "thumbnails");
            console.log("fileParams", fileParams);
            fileNames.forEach((fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fs.existsSync(folderPath + fileName)) {
                    yield multerParser_1.deleteFile(fileName);
                }
            }));
            return docURL;
        });
    }
    /*
* function to get notification
*/
    getGoalSubmitReminders(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let goalSubmitReminders = yield helperFunction.convertPromiseToObject(yield notification_1.notificationModel.findAndCountAll({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: [
                        constants.NOTIFICATION_TYPE.goal_submit_reminder,
                    ],
                    status: 1,
                },
                order: [["createdAt", "DESC"]]
            }));
            yield notification_1.notificationModel.update({
                status: 0,
            }, {
                where: {
                    status: 1,
                    type: [
                        constants.NOTIFICATION_TYPE.goal_submit_reminder,
                    ],
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                }
            });
            for (let goalSubmitReminder of goalSubmitReminders.rows) {
                delete goalSubmitReminder.data.senderEmplyeeData;
            }
            return goalSubmitReminders;
        });
    }
}
exports.EmployeeServices = EmployeeServices;
//# sourceMappingURL=employeeServices.js.map