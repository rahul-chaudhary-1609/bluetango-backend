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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployersService = void 0;
const models_1 = require("../../models");
const subscriptionManagement_1 = require("../../models/subscriptionManagement");
const paymentManagement_1 = require("../../models/paymentManagement");
const coachManagement_1 = require("../../models/coachManagement");
const contactUs_1 = require("../../models/contactUs");
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const feedback_1 = require("../../models/feedback");
const managerTeamMember_1 = require("../../models/managerTeamMember");
const libraryManagement_1 = require("../../models/libraryManagement");
const articleManagement_1 = require("../../models/articleManagement");
const advisorManagement_1 = require("../../models/advisorManagement");
const employeeRanks_1 = require("../../models/employeeRanks");
const multerParser_1 = require("../../middleware/multerParser");
const path = __importStar(require("path"));
const coachSpecializationCategories_1 = require("../../models/coachSpecializationCategories");
const employeeCoachSession_1 = require("../../models/employeeCoachSession");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
const excel = require("exceljs");
const moment = require("moment");
class EmployersService {
    constructor() { }
    /**
    * get employers industry type list
    @param {} params pass all parameters from request
    */
    getIndustryTypeList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.industryTypeModel.findAndCountAll({
                where: {},
                order: [["name", "ASC"]]
            });
        });
    }
    /**
    * add edit employers function
    @param {} params pass all parameters from request
    */
    addEditEmployers(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            params.email = params.email.toLowerCase();
            let isEmail = yield appUtils.CheckEmail(params);
            const qry = { where: {} };
            if (isEmail) {
                qry.where = {
                    email: params.email,
                    status: { [Op.in]: [0, 1] }
                };
            }
            let existingUser = null;
            if (params.id) {
                existingUser = yield models_1.employersModel.findOne({
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
                existingUser = yield models_1.employersModel.findOne({
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
            params.admin_id = user.uid;
            if (!existingUser) {
                if (params.id) {
                    delete params.password;
                    let updateData = yield models_1.employersModel.update(params, {
                        where: { id: params.id }
                    });
                    if (updateData) {
                        return yield models_1.employersModel.findOne({
                            where: { id: params.id }
                        });
                    }
                    else {
                        return false;
                    }
                }
                else {
                    // if (!params.password) {
                    //     throw new Error(constants.MESSAGES.password_not_provided)
                    // }
                    // const password = params.password
                    const password = yield helperFunction.generaePassword();
                    params.password = yield appUtils.bcryptPassword(password);
                    //params.first_time_login_datetime = new Date();
                    const employer = yield models_1.employersModel.create(params);
                    const mailParams = {};
                    mailParams.to = params.email;
                    mailParams.html = `Hi  ${params.name}
                <br> Please download the app by clicking on link below and use the given credentials for login into the app :
                <br><br><b> Android URL</b>: ${process.env.EMPLOYER_ANDROID_URL}
                <br><b> IOS URL</b>: ${process.env.EMPLOYER_IOS_URL} <br>
                <br><b> Web URL</b>: ${process.env.EMPLOYER_WEB_URL} <br>
                <br> username : ${params.email}
                <br> password : ${password}
                `;
                    mailParams.subject = "Employer Login Credentials";
                    yield helperFunction.sendEmail(mailParams);
                    return employer;
                }
            }
            else {
                throw new Error(constants.MESSAGES.email_phone_already_registered);
            }
        });
    }
    /**
    * get employers list function
    @param {} params pass all parameters from request
    */
    getEmployersList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            models_1.employersModel.hasMany(models_1.employeeModel, { foreignKey: "current_employer_id" });
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let whereCond = {};
            if (params.searchKey) {
                whereCond["name"] = { [Op.iLike]: `%${params.searchKey}%` };
            }
            if (params.industry_type) {
                whereCond["industry_type"] = params.industry_type;
            }
            whereCond["status"] = { [Op.or]: [0, 1] };
            if (params.isPagination === "false") {
                return yield models_1.employersModel.findAndCountAll({
                    where: { status: 1 },
                    attributes: ["id", "name"],
                    order: [["name", "ASC"]]
                });
            }
            const employer = yield models_1.employersModel.findAll({
                include: [
                    {
                        model: models_1.employeeModel,
                        required: false,
                        separate: true,
                        attributes: ["id"],
                        where: {
                            status: [0, 1]
                        }
                    }
                ],
                where: whereCond,
                limit: limit,
                offset: offset,
                order: [["id", "DESC"]]
            });
            const countEmployer = yield models_1.employersModel.count({ where: whereCond });
            return { employer, count: countEmployer };
        });
    }
    /**
    * change employers status: activate/deactivate/delete
    @param {} params pass all parameters from request
    */
    changeEmployerStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = { where: { id: params.employerId } };
            let accountExists = yield models_1.employersModel.findOne(query);
            if (accountExists) {
                let updates = {};
                if (params.actionType == "activate") {
                    if (accountExists && accountExists.status == 1)
                        throw new Error(constants.MESSAGES.already_activated);
                    updates.status = 1;
                }
                else if (params.actionType == "deactivate") {
                    if (accountExists && accountExists.status == 0)
                        throw new Error(constants.MESSAGES.already_deactivated);
                    updates.status = 0;
                }
                else if (params.actionType == "delete") {
                    if (accountExists && accountExists.status == 2)
                        throw new Error(constants.MESSAGES.already_deleted);
                    updates.status = 2;
                }
                else {
                    throw new Error(constants.MESSAGES.invalid_action);
                }
                yield models_1.employersModel.update(updates, query);
            }
            else {
                throw new Error(constants.MESSAGES.invalid_employer);
            }
        });
    }
    /**
    * get dashboard analytics count
    @param {} params pass all parameters from request
    */
    dashboardAnalytics(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // let rawQuery = ""
            // let employees;
            // // let admin_id = params.admin_id
            // rawQuery = `SELECT * FROM "employers" AS "employers" 
            //     WHERE "employers"."status" = 1 AND
            //      "employers"."createdAt" BETWEEN date '${params.from}'
            //      AND date '${params.to}'
            //       `
            // let employers =await helperFunction.convertPromiseToObject(
            //     await sequelize.query(rawQuery, {
            //         raw: true
            //     })
            // )
            // let employerCount = employers[0] ? employers[0].length : 0
            // rawQuery = `SELECT * FROM "employee" AS "employees" 
            // WHERE "employees"."status" = 1 AND
            //  "employees"."createdAt" BETWEEN date '${params.from}'
            //  AND date '${params.to}'`
            // employees =await helperFunction.convertPromiseToObject(
            //     await sequelize.query(rawQuery, {
            //         raw: true
            //     })
            // )
            // let employeeCount = employees[0] ? employees[0].length : 0
            // rawQuery = `SELECT * FROM "coach_management" AS "coaches" 
            // WHERE "coaches"."status" = 1 AND
            //  "coaches"."createdAt" BETWEEN date '${params.from}'
            //  AND date '${params.to}'`
            // let coaches =await helperFunction.convertPromiseToObject(
            //     await sequelize.query(rawQuery, {
            //         raw: true
            //     })
            // )
            // let coachCount = coaches[0] ? coaches[0].length : 0
            let where = {
                [Op.and]: [
                    {
                        status: constants.STATUS.active,
                    },
                    Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '>=', params.from),
                    Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '<=', params.to),
                ]
            };
            let employerCount = yield models_1.employersModel.count({ where });
            let employeeCount = yield models_1.employeeModel.count({ where });
            let coachCount = yield coachManagement_1.coachManagementModel.count({ where });
            where = {
                [Op.and]: [
                    {
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    },
                    Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '>=', params.from),
                    Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '<=', params.to),
                ]
            };
            let totalCompletedSession = yield employeeCoachSession_1.employeeCoachSessionsModel.count({ where });
            let totalEarningBySession = yield employeeCoachSession_1.employeeCoachSessionsModel.sum('amount', { where });
            where = {
                [Op.and]: [
                    {
                        status: {
                            [Op.notIn]: [
                                constants.EMPLOYEE_COACH_SESSION_STATUS.cancelled,
                                constants.EMPLOYEE_COACH_SESSION_STATUS.rejected
                            ]
                        }
                    },
                    Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '>=', params.from),
                    Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '<=', params.to),
                ]
            };
            let totalScheduledSession = yield employeeCoachSession_1.employeeCoachSessionsModel.count({ where });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(coachManagement_1.coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" });
            let topFiveSessionTaker = yield helperFunction.convertPromiseToObject(yield employeeCoachSession_1.employeeCoachSessionsModel.findAll({
                attributes: [
                    'coach_id',
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'sessionCount'],
                ],
                where,
                group: ['"employee_coach_sessions.coach_id"'],
                order: [[Sequelize.fn('COUNT', Sequelize.col('id')), "DESC"]],
                limit: 5,
            }));
            for (let coach of topFiveSessionTaker) {
                coach.coach = yield helperFunction.convertPromiseToObject(yield coachManagement_1.coachManagementModel.findOne({
                    attributes: ["id", "name", "email"],
                    where: {
                        id: coach.coach_id,
                    }
                }));
            }
            return {
                employers: employerCount,
                employees: employeeCount,
                coaches: coachCount,
                totalCompletedSession,
                totalEarningBySession,
                totalScheduledSession,
                topFiveSessionTaker
            };
        });
    }
    /**
    * get employers list function
    @param {} params pass all parameters from request
    */
    getEmployeeList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            models_1.employeeModel.belongsTo(models_1.employersModel, { foreignKey: "current_employer_id" });
            models_1.employeeModel.belongsTo(models_1.departmentModel, { foreignKey: "current_department_id" });
            models_1.employeeModel.belongsTo(employeeRanks_1.employeeRanksModel, { foreignKey: "employee_rank_id" });
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let whereCond = {};
            let employer = {};
            let department = {};
            let employeeRank = {};
            if (params.employerName) {
                employer = {
                    name: { [Op.iLike]: `%${params.employerName}%` },
                    status: { [Op.or]: [0, 1] }
                };
            }
            if (params.departmentName) {
                department = {
                    name: { [Op.iLike]: `%${params.departmentName}%` }
                };
            }
            if (params.employeeRankName) {
                employeeRank = {
                    name: { [Op.iLike]: `%${params.employeeRankName}%` },
                };
            }
            if (params.searchKey) {
                whereCond = {
                    name: { [Op.iLike]: `%${params.searchKey}%` },
                };
            }
            whereCond["status"] = { [Op.or]: [0, 1] };
            let employees = yield helperFunction.convertPromiseToObject(yield models_1.employeeModel.findAndCountAll({
                where: whereCond,
                include: [
                    {
                        model: models_1.employersModel,
                        where: employer,
                        required: true,
                        attributes: ["id", "name"]
                    },
                    {
                        model: models_1.departmentModel,
                        where: department,
                        required: true,
                        attributes: ["id", "name"]
                    },
                    {
                        model: employeeRanks_1.employeeRanksModel,
                        where: employeeRank,
                        required: true,
                        attributes: ["id", "name"]
                    }
                ],
                limit: limit,
                offset: offset,
                order: [["id", "DESC"]]
            }));
            for (let employee of employees.rows) {
                employee.total_completed_session = 5;
            }
            return employees;
        });
    }
    /**
    * change employee status: activate/deactivate/delete
    @param {} params pass all parameters from request
    */
    changeEmployeeStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = { where: { id: params.employeeId } };
            let accountExists = yield models_1.employeeModel.findOne(query);
            if (accountExists) {
                let updates = {};
                if (params.actionType == "activate") {
                    if (accountExists && accountExists.status == 1)
                        throw new Error(constants.MESSAGES.already_activated);
                    updates.status = 1;
                }
                else if (params.actionType == "deactivate") {
                    if (accountExists && accountExists.status == 0)
                        throw new Error(constants.MESSAGES.already_deactivated);
                    updates.status = 0;
                }
                else if (params.actionType == "delete") {
                    if (accountExists && accountExists.status == 2)
                        throw new Error(constants.MESSAGES.already_deleted);
                    updates.status = 2;
                }
                else {
                    throw new Error(constants.MESSAGES.invalid_action);
                }
                yield models_1.employeeModel.update(updates, query);
            }
            else {
                throw new Error(constants.MESSAGES.invalid_employee);
            }
        });
    }
    /**
   * edit employee details
   @param {} params pass all parameters from request
   */
    editEmployeeDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {};
            if (params.employerId) {
                query = { where: { id: params.employerId } };
                let employerExists = yield models_1.employersModel.findOne(query);
                if (!employerExists) {
                    throw new Error(constants.MESSAGES.invalid_employer);
                }
                params.current_employer_id = employerExists.id;
            }
            if (params.departmentId) {
                query = { where: { id: params.departmentId } };
                let departmentExists = yield models_1.departmentModel.findOne(query);
                if (!departmentExists) {
                    throw new Error(constants.MESSAGES.invalid_department);
                }
                params.current_department_id = departmentExists.id;
            }
            if (params.employeeRankId) {
                query = { where: { id: params.employeeRankId } };
                let employeeRankExists = yield employeeRanks_1.employeeRanksModel.findOne(query);
                if (!employeeRankExists) {
                    throw new Error(constants.MESSAGES.invalid_employee_rank);
                }
                params.employee_rank_id = employeeRankExists.id;
            }
            if (params.status) {
                let status = [0, 1, 2];
                if (!status.includes(JSON.parse(params.status))) {
                    throw new Error(constants.MESSAGES.invalid_action);
                }
            }
            const updateEmployee = yield models_1.employeeModel.update(params, { where: { id: params.id }, raw: true, returning: true });
            if (updateEmployee[0] == 0) {
                throw new Error(constants.MESSAGES.invalid_employee);
            }
            return updateEmployee;
        });
    }
    /**
     *
     * @param {} params pass all parameters from request
     */
    addSubscriptionPlan(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.description && !Array.isArray(params.description)) {
                params.description = JSON.parse(`[${params.description}]`);
            }
            return yield subscriptionManagement_1.subscriptionManagementModel.create(params);
        });
    }
    /**
     *
     * @param {} params pass all parameters from request
     */
    updateSubscriptionPlan(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.description && !Array.isArray(params.description)) {
                params.description = JSON.parse(`[${params.description}]`);
            }
            const plans = yield subscriptionManagement_1.subscriptionManagementModel.update(params, { where: { id: params.id }, returning: true });
            if (plans && plans[1][0]) {
                return plans[1][0];
            }
            else {
                throw new Error(constants.MESSAGES.plan_notFound);
            }
        });
    }
    /**
     *
     * @param {} params pass all parameters from request
     */
    viewSubscriptionPlan(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let where = {};
            if (params.status) {
                where.status = params.status;
            }
            else {
                where.status = 1;
                where = {
                    status: { [Op.or]: [0, 1] }
                };
            }
            return yield subscriptionManagement_1.subscriptionManagementModel.findAndCountAll({
                where: where,
                limit: limit,
                offset: offset,
                order: [["id", "DESC"]]
            });
        });
    }
    /**
    *
    * @param {} params pass all parameters from request
    */
    viewPaymentList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            paymentManagement_1.paymentManagementModel.belongsTo(models_1.employersModel, { foreignKey: "employer_id" });
            paymentManagement_1.paymentManagementModel.belongsTo(subscriptionManagement_1.subscriptionManagementModel, { foreignKey: "plan_id" });
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let where = {};
            let whereCond = {};
            if (params.searchKey) {
                where = {
                    name: { [Op.iLike]: `%${params.searchKey}%` }
                };
            }
            whereCond.status = 1;
            //whereCond.admin_id = params.admin_id
            return yield paymentManagement_1.paymentManagementModel.findAndCountAll({
                where: whereCond,
                include: [
                    {
                        model: models_1.employersModel,
                        required: true,
                        where: where,
                        attributes: ["id", "name"]
                    },
                    {
                        model: subscriptionManagement_1.subscriptionManagementModel,
                        required: true,
                        attributes: ["id", "plan_name"]
                    }
                ],
                attributes: ["id", "expiry_date"],
                limit: limit,
                offset: offset
            });
        });
    }
    /**
     *
     * @param {} params pass all parameters from request
     */
    viewPaymentDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            paymentManagement_1.paymentManagementModel.belongsTo(models_1.employersModel, { foreignKey: "employer_id" });
            models_1.employersModel.hasMany(models_1.employeeModel, { foreignKey: "current_employer_id" });
            paymentManagement_1.paymentManagementModel.belongsTo(subscriptionManagement_1.subscriptionManagementModel, { foreignKey: "plan_id" });
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let where = {};
            let whereCond = {};
            if (params.searchKey) {
                where = {
                    name: { [Op.iLike]: `%${params.searchKey}%` }
                };
            }
            //whereCond.status = 1
            whereCond.id = params.id;
            // whereCond.admin_id = params.admin_id
            return yield paymentManagement_1.paymentManagementModel.findOne({
                where: whereCond,
                include: [
                    {
                        model: models_1.employersModel,
                        required: false,
                        where: where,
                        include: [{
                                model: models_1.employeeModel,
                                required: false,
                                separate: true,
                                attributes: ["id", "name"],
                                where: {
                                    status: [0, 1]
                                }
                            }]
                    },
                    {
                        model: subscriptionManagement_1.subscriptionManagementModel,
                        required: false,
                        attributes: ["id", "plan_name"]
                    }
                ],
                limit: limit,
                offset: offset
            });
        });
    }
    /**
    *
    * @param {} params pass all parameters from request
    */
    exportCsv(params) {
        return __awaiter(this, void 0, void 0, function* () {
            paymentManagement_1.paymentManagementModel.belongsTo(models_1.employersModel, { foreignKey: "employer_id" });
            paymentManagement_1.paymentManagementModel.belongsTo(subscriptionManagement_1.subscriptionManagementModel, { foreignKey: "plan_id" });
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let where = {};
            let whereCond = {};
            if (params.searchKey) {
                where = {
                    name: { [Op.iLike]: `%${params.searchKey}%` }
                };
            }
            whereCond.status = 1;
            //whereCond.admin_id = params.admin_id
            return yield paymentManagement_1.paymentManagementModel.findAndCountAll({
                where: whereCond,
                include: [
                    {
                        model: models_1.employersModel,
                        required: true,
                        where: where,
                        attributes: ["name"]
                    },
                    {
                        model: subscriptionManagement_1.subscriptionManagementModel,
                        required: true,
                        attributes: ["id", "plan_name"]
                    }
                ],
                attributes: ["id", "expiry_date"],
                // limit: limit,
                // offset: offset,
                raw: true
            });
        });
    }
    /*
    * @param {} params pass all parameters from request
    */
    employerDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            models_1.employersModel.hasMany(models_1.employeeModel, { foreignKey: "current_employer_id" });
            //employersModel.belongsTo(industryTypeModel, { foreignKey: "industry_type", as: "Industry_type" })
            // employersModel.hasOne(industryTypeModel, { foreignKey: "id", sourceKey: "industry_type", targetKey: "id" })
            let where = {};
            where.id = params.employerId;
            const employer = yield models_1.employersModel.findOne({
                where: where,
                include: [
                    {
                        model: models_1.employeeModel,
                        required: false,
                        separate: true,
                        attributes: ["id"],
                        where: {
                            status: [0, 1]
                        }
                    }
                    // {
                    //     model: industryTypeModel,
                    //     required: false,
                    //     attributes: ["id", "name"]
                    // }
                ]
            });
            if (employer) {
                const industry = yield models_1.industryTypeModel.findOne({ where: { id: employer.industry_type } });
                //employer.industry_name = industry.name            
                return { employer, industry };
            }
            else {
                throw new Error(constants.MESSAGES.employer_notFound);
            }
        });
    }
    /**
    * add/ update coach management
    @param {} params pass all parameters from request
    */
    addEditCoach(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            params.email = params.email.toLowerCase();
            let isEmail = yield appUtils.CheckEmail(params);
            const qry = { where: {} };
            if (isEmail) {
                qry.where = {
                    email: params.username,
                    status: { [Op.in]: [0, 1] }
                };
            }
            let existingUser = null;
            if (params.id) {
                existingUser = yield coachManagement_1.coachManagementModel.findOne({
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
                        },
                        app_id: constants.COACH_APP_ID.BX,
                    }
                });
            }
            else {
                existingUser = yield coachManagement_1.coachManagementModel.findOne({
                    where: {
                        [Op.or]: [
                            { email: params.email },
                            { phone_number: params.phone_number },
                        ],
                        status: {
                            [Op.in]: [0, 1]
                        },
                        app_id: constants.COACH_APP_ID.BX,
                    }
                });
            }
            console.log("existingUser", existingUser);
            params.admin_id = user.uid;
            if (!existingUser) {
                if (params.id) {
                    delete params.password;
                    let updateData = yield coachManagement_1.coachManagementModel.update(params, {
                        where: { id: params.id }
                    });
                    if (updateData) {
                        return yield coachManagement_1.coachManagementModel.findOne({
                            where: { id: params.id }
                        });
                    }
                    else {
                        return false;
                    }
                }
                else {
                    // if (!params.password) {
                    //     throw new Error(constants.MESSAGES.password_not_provided)
                    // }
                    // const password = params.password
                    const password = yield helperFunction.generaePassword();
                    params.password = yield appUtils.bcryptPassword(password);
                    const coach = yield helperFunction.convertPromiseToObject(yield coachManagement_1.coachManagementModel.create(params));
                    const mailParams = {};
                    mailParams.to = params.email;
                    mailParams.html = `Hi  ${params.name}
                <br> Please download the app by clicking on link below and use the given credentials for login into the app :
                <br><br><b> Android URL</b>: ${process.env.COACH_ANDROID_URL}
                <br><b> IOS URL</b>: ${process.env.COACH_IOS_URL} <br>
                <br> username : ${params.email}
                <br> password : ${password}
                <br> Check your details here:
                <br><table style="padding:0px 10px 10px 10px;">
                `;
                    delete coach.password;
                    coach.coach_specialization_categories = yield helperFunction.convertPromiseToObject(yield coachSpecializationCategories_1.coachSpecializationCategoriesModel.findAll({
                        where: {
                            id: {
                                [Op.in]: coach.coach_specialization_category_ids || [],
                            },
                            status: constants.STATUS.active,
                        },
                        attributes: ['name']
                    }));
                    coach.coach_specialization_categories = coach.coach_specialization_categories.map(category => category.name).join(', ');
                    delete coach.coach_specialization_category_ids;
                    coach.employee_ranks = yield helperFunction.convertPromiseToObject(yield employeeRanks_1.employeeRanksModel.findAll({
                        where: {
                            id: {
                                [Op.in]: coach.employee_rank_ids || [],
                            },
                            status: constants.STATUS.active,
                        },
                        attributes: ['name']
                    }));
                    coach.employee_ranks = coach.employee_ranks.map(rank => rank.name).join(', ');
                    coach.fees_per_session = coach.coach_charge;
                    delete coach.id;
                    delete coach.admin_id;
                    delete coach.device_token;
                    delete coach.first_time_login;
                    delete coach.first_time_login_datetime;
                    delete coach.first_time_reset_password;
                    delete coach.fileName;
                    delete coach.status;
                    delete coach.coach_charge;
                    delete coach.employee_rank_ids;
                    delete coach.updatedAt;
                    delete coach.createdAt;
                    for (let key in coach) {
                        mailParams.html += `<tr style="text-align: left;">
                            <th style="opacity: 0.9;">${key.split("_").map((ele) => {
                            if (ele == "of" || ele == "in")
                                return ele;
                            else
                                return ele.charAt(0).toUpperCase() + ele.slice(1);
                        }).join(" ")}</th>
                            <td style="opacity: 0.8;">:</td>
                            <td style="opacity: 0.8;">${key == 'image' ? `<img src='${coach[key]}' />` : coach[key]}</td>
                        </tr>`;
                    }
                    mailParams.html += `</table>`;
                    mailParams.subject = "Coach Login Credentials";
                    yield helperFunction.sendEmail(mailParams);
                    return coach;
                }
            }
            else {
                throw new Error(constants.MESSAGES.email_phone_already_registered);
            }
        });
    }
    /**
   *
   * @param {} params pass all parameters from request
   */
    getCoachList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let where = {
                app_id: constants.COACH_APP_ID.BX,
            };
            if (params.searchKey) {
                where["name"] = { [Op.iLike]: `%${params.searchKey}%` };
            }
            if (params.coach_specialization_category_id) {
                where["coach_specialization_category_ids"] = {
                    [Op.contains]: [params.coach_specialization_category_id]
                };
            }
            if (params.employee_rank_id) {
                where["employee_rank_ids"] = {
                    [Op.contains]: [params.employee_rank_id]
                };
            }
            where["status"] = constants.STATUS.active;
            let coachList = yield helperFunction.convertPromiseToObject(yield coachManagement_1.coachManagementModel.findAndCountAll({
                where: where,
                attributes: ["id", "name", "email", "phone_number", "coach_specialization_category_ids", "employee_rank_ids", "coach_charge", "status", "app_id", "social_media_handles", "website", "document_url"],
                order: [["id", "DESC"]]
            }));
            let c = 0;
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
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    }
                });
                let totalRating = yield employeeCoachSession_1.employeeCoachSessionsModel.sum('coach_rating', {
                    where: {
                        coach_id: coach.id,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                        coach_rating: {
                            [Op.gte]: 1
                        }
                    }
                });
                coach.rating_count = yield employeeCoachSession_1.employeeCoachSessionsModel.count({
                    where: {
                        coach_id: coach.id,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                        coach_rating: {
                            [Op.gte]: 1
                        }
                    }
                });
                coach.average_rating = 0;
                if (coach.rating_count > 0) {
                    coach.average_rating = parseFloat((parseInt(totalRating) / coach.rating_count).toFixed(0));
                }
                delete coach.coach_specialization_category_ids;
                delete coach.employee_rank_ids;
            }
            if (params.rating) {
                let coachListFilteredByRating = coachList.rows.filter((coach) => coach.average_rating == params.rating);
                coachList.rows = [...coachListFilteredByRating];
                coachList.count = coachListFilteredByRating.length;
            }
            coachList.rows = coachList.rows.slice(offset, offset + limit);
            return coachList;
        });
    }
    /**
  *
  * @param {} params pass all parameters from request
  */
    getCoachDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {
                id: params.coachId,
                status: [0, 1]
            };
            const coach = yield helperFunction.convertPromiseToObject(yield coachManagement_1.coachManagementModel.findOne({
                where: where,
                attributes: ["id", "name", "email", "phone_number", "country_code", "description", "image", "fileName", "coach_specialization_category_ids", "employee_rank_ids", "coach_charge", "status", "app_id", "social_media_handles", "website", "document_url", "documentFileName"],
            }));
            if (coach) {
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
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    }
                });
                let totalRating = yield employeeCoachSession_1.employeeCoachSessionsModel.sum('coach_rating', {
                    where: {
                        coach_id: coach.id,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                        coach_rating: {
                            [Op.gte]: 1
                        }
                    }
                });
                coach.rating_count = yield employeeCoachSession_1.employeeCoachSessionsModel.count({
                    where: {
                        coach_id: coach.id,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                        coach_rating: {
                            [Op.gte]: 1
                        }
                    }
                });
                let totalSessions = yield employeeCoachSession_1.employeeCoachSessionsModel.findAndCountAll({
                    where: {
                        coach_id: coach.id,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    }
                });
                let freeSessionsCount = [...new Set(totalSessions.rows.filter(ele => ele.type == 1).map(obj => obj.employee_id))];
                let paidSessionsCount = [...new Set(totalSessions.rows.filter(ele => ele.type == 2).map(obj => obj.employee_id))];
                coach.average_rating = 0;
                coach.conversionRate = (paidSessionsCount.length / freeSessionsCount.length);
                if (coach.rating_count > 0) {
                    coach.average_rating = parseFloat((parseInt(totalRating) / coach.rating_count).toFixed(0));
                }
                delete coach.coach_specialization_category_ids;
                delete coach.employee_rank_ids;
                return coach;
            }
            else {
                throw new Error(constants.MESSAGES.coach_not_found);
            }
        });
    }
    /**
  *
  * @param {} params pass all parameters from request
  */
    deleteCoach(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {
                id: params.coachId
            };
            let update = {
                status: 2
            };
            const coach = yield coachManagement_1.coachManagementModel.update(update, { where: where, returning: true });
            if (coach && coach[1][0]) {
                return coach;
            }
            else {
                throw new Error(constants.MESSAGES.coach_not_found);
            }
        });
    }
    /**
  *
  * @param {} params pass all parameters from request
  */
    getContactUsList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            contactUs_1.contactUsModel.belongsTo(models_1.employersModel, { foreignKey: "employer_id" });
            contactUs_1.contactUsModel.belongsTo(models_1.employeeModel, { foreignKey: "employee_id" });
            return yield contactUs_1.contactUsModel.findAndCountAll({
                include: [
                    {
                        model: models_1.employersModel,
                        required: false,
                        attributes: ["id", "name"]
                    },
                    {
                        model: models_1.employeeModel,
                        required: false,
                        attributes: ["id", "name"]
                    }
                ],
                limit: limit,
                offset: offset,
                order: [["createdAt", "DESC"]]
            });
        });
    }
    /**
  *
  * @param {} params pass all parameters from request
  */
    getContactUsDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {
                id: params.constactId
            };
            contactUs_1.contactUsModel.belongsTo(models_1.employersModel, { foreignKey: "employer_id" });
            contactUs_1.contactUsModel.belongsTo(models_1.employeeModel, { foreignKey: "employee_id" });
            return yield contactUs_1.contactUsModel.findOne({
                where: where,
                include: [
                    {
                        model: models_1.employersModel,
                        required: false,
                        attributes: ["id", "name"]
                    },
                    {
                        model: models_1.employeeModel,
                        required: false,
                        attributes: ["id", "name"]
                    }
                ]
            });
        });
    }
    /**
 *
 * @param {} params pass all parameters from request
 */
    sendEmailAndNotification(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {};
            where.status = 1;
            let receiver = {};
            if (params.receiver == "employer") {
                receiver = yield models_1.employersModel.findAll({ where: where });
            }
            else if (params.receiver == "employee") {
                receiver = yield models_1.employeeModel.findAll({ where: where });
            }
            let toMails = [];
            let tokens = [];
            receiver.forEach(rec => {
                toMails.push(rec.email);
                if (rec.device_token !== null) {
                    tokens.push(rec.device_token);
                }
            });
            if (params.notification_type == 0) {
                yield this.sendBulkEmail(toMails, params.message);
            }
            else if (params.notification_type == 1) {
                yield this.sendBulkNotification(tokens, params.message);
            }
            else if (params.notification_type == 2) {
                yield this.sendBulkEmail(toMails, params.message);
                yield this.sendBulkNotification(tokens, params.message);
            }
        });
    }
    sendBulkEmail(toMails, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailParams = {};
            mailParams.to = toMails;
            mailParams.subject = "Email notification from admin";
            mailParams.html = `${message}`;
            return yield helperFunction.sendEmail(mailParams);
        });
    }
    sendBulkNotification(tokens, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let notificationData = {
                title: 'In-App notification from admin',
                body: `${message}`,
                data: {}
            };
            return yield helperFunction.sendFcmNotification(tokens, notificationData);
        });
    }
    /*
    * @param {} params pass all parameters from request
    */
    employeeDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            models_1.employeeModel.belongsTo(models_1.employersModel, { foreignKey: "current_employer_id" });
            models_1.employeeModel.belongsTo(models_1.departmentModel, { foreignKey: "current_department_id" });
            models_1.employeeModel.belongsTo(employeeRanks_1.employeeRanksModel, { foreignKey: "employee_rank_id" });
            models_1.employeeModel.hasOne(managerTeamMember_1.managerTeamMemberModel, { foreignKey: "team_member_id", sourceKey: "id", targetKey: "team_member_id" });
            managerTeamMember_1.managerTeamMemberModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
            let where = {};
            where.id = params.employeeId;
            const employee = yield helperFunction.convertPromiseToObject(yield models_1.employeeModel.findOne({
                where: where,
                include: [
                    {
                        model: models_1.employersModel,
                        required: false,
                        attributes: ["id", "name"]
                    },
                    {
                        model: models_1.departmentModel,
                        required: false,
                        attributes: ["id", "name"]
                    },
                    {
                        model: employeeRanks_1.employeeRanksModel,
                        required: false,
                        attributes: ["id", "name"]
                    },
                    {
                        model: managerTeamMember_1.managerTeamMemberModel,
                        required: false,
                        include: [{
                                model: models_1.employeeModel,
                                required: false,
                                attributes: ["id", "name"]
                            }]
                        //attributes: ["id","name"]
                    }
                ]
            }));
            if (employee) {
                employee.total_completed_session = 5;
                return employee;
            }
            else {
                throw new Error(constants.MESSAGES.employee_notFound);
            }
        });
    }
    /**
    *
    * @param {} params pass all parameters from request
    */
    getDepartmentList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.departmentModel.findAll({});
        });
    }
    /**
    *
    * @param {} params pass all parameters from request
    */
    subscriptionDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionManagement_1.subscriptionManagementModel.findOne({ where: { id: params.subscriptionId } });
        });
    }
    /**
    * change employee status: activate/deactivate/delete
    @param {} params pass all parameters from request
    */
    changeSubsPlanStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {};
            query.id = params.subscriptionId;
            let accountExists = yield subscriptionManagement_1.subscriptionManagementModel.findOne({ where: query });
            //console.log('accExist - - - ', accountExists)
            if (accountExists) {
                let updates = {};
                if (params.actionType == "activate") {
                    if (accountExists && accountExists.status == 1)
                        throw new Error(constants.MESSAGES.already_activated);
                    updates.status = 1;
                }
                else if (params.actionType == "deactivate") {
                    if (accountExists && accountExists.status == 0)
                        throw new Error(constants.MESSAGES.already_deactivated);
                    updates.status = 0;
                }
                else if (params.actionType == "delete") {
                    if (accountExists && accountExists.status == 2)
                        throw new Error(constants.MESSAGES.already_deleted);
                    updates.status = 2;
                }
                else {
                    throw new Error(constants.MESSAGES.invalid_action);
                }
                const subscription = yield subscriptionManagement_1.subscriptionManagementModel.update(updates, { where: query, returning: true });
                console.log('subscription - - ', subscription);
                return subscription[1][0];
            }
            else {
                throw new Error(constants.MESSAGES.invalid_plan);
            }
        });
    }
    /**
   *
   * @param {} params pass all parameters from request
   */
    getSubAdminList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let where = {};
            if (params.searchKey) {
                where["name"] = { [Op.iLike]: `%${params.searchKey}%` };
            }
            where["status"] = 1;
            where["admin_role"] = 2;
            return yield models_1.adminModel.findAndCountAll({
                where: where,
                attributes: ["id", "name", "email", "phone_number", "country_code"],
                limit: limit,
                offset: offset,
                order: [["id", "DESC"]]
            });
        });
    }
    /**
  *
  * @param {} params pass all parameters from request
  */
    subAdminDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {};
            where["status"] = 1;
            where["admin_role"] = 2;
            where["id"] = params.subAdminId;
            const subAdmin = yield models_1.adminModel.findOne({
                where: where,
            });
            if (subAdmin) {
                return subAdmin;
            }
            else {
                throw new Error(constants.MESSAGES.subAdmin_not_found);
            }
        });
    }
    /*
   * function to upload file
   */
    uploadFile(params, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield helperFunction.uploadFile(params, folderName);
        });
    }
    createThumbnail(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                ffmpeg({ source: params.video })
                    .on('filenames', (filenames) => {
                    console.log("Created file names", filenames);
                })
                    .on('end', () => {
                    console.log("File Created");
                    resolve(1);
                })
                    .on('error', (err) => {
                    console.log("Error", err);
                    reject(err);
                })
                    .takeScreenshots({
                    filename: params.filename,
                    timemarks: [5],
                    folder: params.folderUploadPath,
                }, '.');
            });
        });
    }
    /**
  *
  * @param {} params pass all parameters from request
  */
    addVideo(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let folderUploadPath = `src/upload`;
            let filename = `${params.title.split(" ")[0]}.png`;
            //'https://bluexinga-dev.s3.amazonaws.com/other/1627306681317_+Pdfs+to+AWS+S3+Bucket+with+NodeJs%2C+AWS-SDK%2C+and+express-fileupload._360P.mp4'
            yield this.createThumbnail(Object.assign(Object.assign({}, params), { filename, folderUploadPath }));
            let fileParams = {
                path: path.join(__dirname, `../../../${folderUploadPath}/${filename}`),
                originalname: filename,
                mimetype: `image/png`
            };
            console.log("fileParams", fileParams);
            params.thumbnail_url = yield helperFunction.uploadFile(fileParams, "thumbnails");
            yield multerParser_1.deleteFile(filename);
            console.log("params", params);
            return yield libraryManagement_1.libraryManagementModel.create(params);
        });
    }
    /**
  *
  * @param {} params pass all parameters from request
  */
    editVideo(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const library = yield libraryManagement_1.libraryManagementModel.update(params, { where: { id: params.id }, returning: true });
            if (library && library[1][0]) {
                return library[1][0];
            }
            else {
                throw new Error(constants.MESSAGES.invalid_library);
            }
        });
    }
    /**
 *
 * @param {} params pass all parameters from request
 */
    listVideo(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            return yield libraryManagement_1.libraryManagementModel.findAndCountAll({
                where: { status: 1 },
                limit: limit,
                offset: offset,
                order: [["id", "DESC"]]
            });
        });
    }
    /**
 *
 * @param {} params pass all parameters from request
 */
    detailsVideo(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {};
            where.id = params.id;
            where.status = 1;
            const library = yield libraryManagement_1.libraryManagementModel.findOne({
                where: where
            });
            if (library) {
                return library;
            }
            else {
                throw new Error(constants.MESSAGES.invalid_library);
            }
        });
    }
    /**
  *
  * @param {} params pass all parameters from request
  */
    addArticle(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield articleManagement_1.articleManagementModel.create(params);
        });
    }
    /**
    *
    * @param {} params pass all parameters from request
    */
    updateArticle(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {};
            where.id = params.id;
            const article = yield articleManagement_1.articleManagementModel.update(params, { where: where, returning: true });
            if (article && article[1][0]) {
                return article[1][0];
            }
            else {
                throw new Error(constants.MESSAGES.invalid_article);
            }
        });
    }
    /**
    *
    * @param {} params pass all parameters from request
    */
    editArticle(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let ids = JSON.parse(params.id);
            let update = {};
            update.status = 2;
            let where = {};
            where.id = params.id;
            const article = yield articleManagement_1.articleManagementModel.update({ status: 2 }, { where: { id: ids }, returning: true });
            if (article && article[1][0]) {
                return article[1];
            }
            else {
                throw new Error(constants.MESSAGES.invalid_article);
            }
        });
    }
    /**
    *
    * @param {} params pass all parameters from request
    */
    listArticle(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            return yield articleManagement_1.articleManagementModel.findAndCountAll({
                where: { status: 1 },
                limit: limit,
                offset: offset,
                order: [["id", "DESC"]]
            });
        });
    }
    /**
    *
    * @param {} params pass all parameters from request
    */
    detailsArticle(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {};
            where.id = params.id;
            where.status = 1;
            const article = yield articleManagement_1.articleManagementModel.findOne({
                where: where
            });
            if (article) {
                return article;
            }
            else {
                throw new Error(constants.MESSAGES.invalid_article);
            }
        });
    }
    /**
  *
  * @param {} params pass all parameters from request
  */
    addAdvisor(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield advisorManagement_1.advisorManagementModel.create(params);
        });
    }
    /**
    *
    * @param {} params pass all parameters from request
    */
    updateAdvisor(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {};
            where.id = params.id;
            const advisor = yield advisorManagement_1.advisorManagementModel.update(params, { where: where, returning: true });
            if (advisor && advisor[1][0]) {
                return advisor[1][0];
            }
            else {
                throw new Error(constants.MESSAGES.invalid_advisor);
            }
        });
    }
    /**
    *
    * @param {} params pass all parameters from request
    */
    listAdvisor(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            return yield advisorManagement_1.advisorManagementModel.findAndCountAll({
                where: { status: 1 },
                limit: limit,
                offset: offset,
                order: [["id", "DESC"]]
            });
        });
    }
    /**
    *
    * @param {} params pass all parameters from request
    */
    deleteAdvisor(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let ids = JSON.parse(params.id);
            let update = {};
            update.status = 2;
            let where = {};
            where.id = { [Op.in]: params.id };
            const advisor = yield advisorManagement_1.advisorManagementModel.update({ status: 2 }, { where: { id: ids }, returning: true });
            if (advisor && advisor[1][0]) {
                return advisor[1];
            }
            else {
                throw new Error(constants.MESSAGES.invalid_advisor);
            }
        });
    }
    /**
    *
    * @param {} params pass all parameters from request
    */
    detailsAdvisor(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {};
            where.id = params.id;
            where.status = 1;
            const article = yield advisorManagement_1.advisorManagementModel.findOne({
                where: where
            });
            if (article) {
                return article;
            }
            else {
                throw new Error(constants.MESSAGES.invalid_advisor);
            }
        });
    }
    findAdminById(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {};
            where.id = params.uid;
            where.status = 2;
            return yield models_1.adminModel.findOne({ where: where });
        });
    }
    /**
    *
    * @param {} params pass all parameters from request
    */
    listFeedback(params) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let whereCondintion = {
                status: [constants.STATUS.active, constants.STATUS.inactive],
            };
            if (params.feedbackType) {
                whereCondintion = Object.assign(Object.assign({}, whereCondintion), { feedback_type: params.feedbackType });
            }
            // if(params.searchKey){
            //     whereCondintion={
            //         ...whereCondintion,
            //         message:{
            //             [Op.iLike]:`%${params.searchKey}%`,
            //         }
            //     }
            // }  
            let feedbacks = yield helperFunction.convertPromiseToObject(yield feedback_1.feedbackModel.findAndCountAll({
                where: whereCondintion,
                limit: limit,
                offset: offset,
                order: [["id", "DESC"]]
            }));
            if (feedbacks.count > 0) {
                let filteredFeedbacks = [];
                for (let feedback of feedbacks.rows) {
                    if (feedback.feedback_type == constants.FEEDBACK_TYPE.employee) {
                        feedback.user = yield helperFunction.convertPromiseToObject(yield models_1.employeeModel.findOne({
                            where: {
                                id: feedback.user_id
                            },
                            attributes: ['id', 'name', 'email', 'phone_number']
                        }));
                    }
                    else if (feedback.feedback_type == constants.FEEDBACK_TYPE.employer) {
                        feedback.user = yield helperFunction.convertPromiseToObject(yield models_1.employersModel.findOne({
                            where: {
                                id: feedback.user_id
                            },
                            attributes: ['id', 'name', 'email', 'phone_number']
                        }));
                    }
                    else if (feedback.feedback_type == constants.FEEDBACK_TYPE.coach) {
                        feedback.user = yield helperFunction.convertPromiseToObject(yield coachManagement_1.coachManagementModel.findOne({
                            where: {
                                id: feedback.user_id
                            },
                            attributes: ['id', 'name', 'email', 'phone_number']
                        }));
                    }
                    else {
                        feedback.user = null;
                    }
                    if (params.searchKey && params.searchKey.trim() != "") {
                        if (((_a = feedback.message) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(params.searchKey.toLowerCase())) || ((_b = feedback.user) === null || _b === void 0 ? void 0 : _b.name.toLowerCase().includes(params.searchKey.toLowerCase())) || ((_c = feedback.user) === null || _c === void 0 ? void 0 : _c.email.toLowerCase().includes(params.searchKey.toLowerCase()))) {
                            filteredFeedbacks.push(feedback);
                        }
                    }
                }
                if (params.searchKey && params.searchKey.trim() != "") {
                    feedbacks.count = filteredFeedbacks.length;
                    feedbacks.rows = filteredFeedbacks;
                }
            }
            if (feedbacks.count == 0)
                throw new Error(constants.MESSAGES.no_feedback);
            return feedbacks;
        });
    }
    /**
    *
    * @param {} params pass all parameters from request
    */
    getFeedbackDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let feedback = yield helperFunction.convertPromiseToObject(yield feedback_1.feedbackModel.findOne({
                where: {
                    id: params.feedback_id
                }
            }));
            if (feedback) {
                if (feedback.feedback_type == constants.FEEDBACK_TYPE.employee) {
                    feedback.user = yield helperFunction.convertPromiseToObject(yield models_1.employeeModel.findOne({
                        where: {
                            id: feedback.user_id
                        },
                        attributes: ['id', 'name', 'email', 'phone_number']
                    }));
                }
                else if (feedback.feedback_type == constants.FEEDBACK_TYPE.employer) {
                    feedback.user = yield helperFunction.convertPromiseToObject(yield models_1.employersModel.findOne({
                        where: {
                            id: feedback.user_id
                        },
                        attributes: ['id', 'name', 'email', 'phone_number']
                    }));
                }
                else if (feedback.feedback_type == constants.FEEDBACK_TYPE.coach) {
                    feedback.user = yield helperFunction.convertPromiseToObject(yield coachManagement_1.coachManagementModel.findOne({
                        where: {
                            id: feedback.user_id
                        },
                        attributes: ['id', 'name', 'email', 'phone_number']
                    }));
                }
                else {
                    feedback.user = null;
                }
            }
            else {
                throw new Error(constants.MESSAGES.no_feedback);
            }
            return feedback;
        });
    }
    /**
    * uploadThoughts
    */
    uploadThoughts(params, file) {
        return __awaiter(this, void 0, void 0, function* () {
            let thoughts = {
                "A": "day",
                "B": "thought"
            };
            let sheetData = yield appUtils.UploadExcelToJson(file.path, 1, thoughts);
            yield models_1.thoughtsModel.destroy({
                truncate: true,
                force: true
            });
            yield models_1.thoughtsModel.bulkCreate(sheetData);
            yield multerParser_1.deleteFile(file.filename);
            return true;
        });
    }
    /**
    * download thoughts
    */
    downloadThoughts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let worksheet;
            let Columns = [
                { header: "Day", key: "day", width: 20 },
                { header: "Thought of the Day", key: "thought", width: 20 }
            ];
            let excelData = yield models_1.thoughtsModel.findAll({
                attributes: ["day", "thought"]
            });
            let workbook = new excel.Workbook();
            worksheet = workbook.addWorksheet('thoughts');
            worksheet.columns = Columns;
            let fName = "thoughts";
            worksheet.addRows(excelData);
            let filename = `${fName}-${moment().format('YYYYMMDD-HHmmss')}.xlsx`;
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=" + filename);
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        });
    }
}
exports.EmployersService = EmployersService;
//# sourceMappingURL=employersService.js.map