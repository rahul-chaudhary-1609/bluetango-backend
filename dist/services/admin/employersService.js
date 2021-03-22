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
exports.EmployersService = void 0;
const models_1 = require("../../models");
const subscriptionManagement_1 = require("../../models/subscriptionManagement");
const paymentManagement_1 = require("../../models/paymentManagement");
const coachManagement_1 = require("../../models/coachManagement");
const contactUs_1 = require("../../models/contactUs");
const lodash_1 = __importDefault(require("lodash"));
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const connection_1 = require("../../connection");
const managerTeamMember_1 = require("../../models/managerTeamMember");
const libraryManagement_1 = require("../../models/libraryManagement");
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
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
            var isEmail = yield appUtils.CheckEmail(params);
            const qry = { where: {} };
            if (isEmail) {
                qry.where = {
                    email: params.username,
                    status: { [Op.in]: [0, 1] }
                };
            }
            var existingUser;
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
            if (lodash_1.default.isEmpty(existingUser)) {
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
                    if (!params.password) {
                        throw new Error(constants.MESSAGES.password_not_provided);
                    }
                    const password = params.password;
                    params.password = yield appUtils.bcryptPassword(params.password);
                    const employer = yield models_1.employersModel.create(params);
                    const mailParams = {};
                    mailParams.to = params.email;
                    mailParams.html = `Hi  ${params.name}
                <br> Please download the app by clicking on link below and use the given credentials for login into the app :
                <br><br><b> Android URL</b>: ${process.env.EMPLOYER_ANDROID_URL}
                <br><b> IOS URL</b>: ${process.env.EMPLOYER_IOS_URL} <br>
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
            var whereCond = {};
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
                include: [{ model: models_1.employeeModel, required: false, attributes: ["id"] }],
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
            let rawQuery = "";
            let where = {};
            let employees;
            // let admin_id = params.admin_id
            rawQuery = `SELECT * FROM "employers" AS "employers" 
            WHERE "employers"."status" = 1 AND
             "employers"."createdAt" BETWEEN date '${params.from}'
             AND date '${params.to}'
              `;
            let employers = yield connection_1.sequelize.query(rawQuery, {
                raw: true
            });
            let employerCount = employers[0] ? employers[0].length : 0;
            rawQuery = `SELECT * FROM "employee" AS "employees" 
        WHERE "employees"."status" = 1 AND
         "employees"."createdAt" BETWEEN date '${params.from}'
         AND date '${params.to}'`;
            employees = yield connection_1.sequelize.query(rawQuery, {
                raw: true
            });
            let employeeCount = employees[0] ? employees[0].length : 0;
            return { employers: employerCount, employees: employeeCount };
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
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            var whereCond = {};
            var employer = {};
            var department = {};
            // let where = {
            //     admin_id: params.admin_id
            // }
            //var employerId = []
            //const employers = await employersModel.findAndCountAll({ where: where, raw: true })
            // for (let i = 0; i < employers.rows.length; i++) {
            //     employerId.push(employers.rows[i].id)
            // }
            // whereCond = {
            //     current_employer_id: { [Op.in]: employerId },
            //     status: 1
            // }
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
            if (params.searchKey) {
                whereCond = {
                    //current_employer_id: { [Op.in]: employerId },
                    name: { [Op.iLike]: `%${params.searchKey}%` },
                };
            }
            whereCond["status"] = { [Op.or]: [0, 1] };
            return yield models_1.employeeModel.findAndCountAll({
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
                    }
                ],
                limit: limit,
                offset: offset,
                order: [["id", "DESC"]]
            });
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
            return yield subscriptionManagement_1.subscriptionManagementModel.create(params);
        });
    }
    /**
     *
     * @param {} params pass all parameters from request
     */
    updateSubscriptionPlan(params) {
        return __awaiter(this, void 0, void 0, function* () {
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
                        where: where,
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
                include: [{
                        model: models_1.employersModel,
                        required: false,
                        where: where,
                        include: [{
                                model: models_1.employeeModel,
                                required: false,
                                attributes: ["id", "name"]
                            }]
                    }],
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
                        where: where,
                        attributes: ["id", "plan_name"]
                    }
                ],
                attributes: ["id", "expiry_date"],
                limit: limit,
                offset: offset,
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
            let where = {};
            where.id = params.employerId;
            const employer = yield models_1.employersModel.findOne({
                where: where,
                include: [{ model: models_1.employeeModel, required: false, attributes: ["id"] }]
            });
            if (employer) {
                return employer;
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
            var isEmail = yield appUtils.CheckEmail(params);
            const qry = { where: {} };
            if (isEmail) {
                qry.where = {
                    email: params.username,
                    status: { [Op.in]: [0, 1] }
                };
            }
            var existingUser;
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
                        }
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
                        }
                    }
                });
            }
            params.admin_id = user.uid;
            if (lodash_1.default.isEmpty(existingUser)) {
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
                    if (!params.password) {
                        throw new Error(constants.MESSAGES.password_not_provided);
                    }
                    const password = params.password;
                    params.password = yield appUtils.bcryptPassword(params.password);
                    const coach = yield coachManagement_1.coachManagementModel.create(params);
                    const mailParams = {};
                    mailParams.to = params.email;
                    mailParams.html = `Hi  ${params.name}
                <br> Please download the app by clicking on link below and use the given credentials for login into the app :
                <br><br><b> Android URL</b>: ${process.env.COACH_ANDROID_URL}
                <br><b> IOS URL</b>: ${process.env.COACH_IOS_URL} <br>
                <br> username : ${params.email}
                <br> password : ${password}
                `;
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
            let where = {};
            if (params.searchKey) {
                where["name"] = { [Op.iLike]: `%${params.searchKey}%` };
            }
            where["status"] = 1;
            return yield coachManagement_1.coachManagementModel.findAndCountAll({
                where: where,
                attributes: ["id", "name", "email", "phone_number"],
                limit: limit,
                offset: offset
            });
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
                status: 1
            };
            const coach = yield coachManagement_1.coachManagementModel.findOne({
                where: where,
                attributes: ["id", "name", "email", "phone_number", "country_code", "description"],
            });
            if (coach) {
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
    getCotactUsList(params) {
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
                ]
            });
        });
    }
    /**
  *
  * @param {} params pass all parameters from request
  */
    getCotactUsDetails(params) {
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
            let receiver = {};
            if (params.receiver == "employer") {
                receiver = yield models_1.employersModel.findAll({});
            }
            else if (params.receiver == "employee") {
                receiver = yield models_1.employeeModel.findAll({});
            }
            let toMails = [];
            let tokens = [];
            receiver.forEach(rec => {
                toMails.push(rec.email);
                tokens.push(rec.device_token);
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
            models_1.employeeModel.hasOne(managerTeamMember_1.managerTeamMemberModel, { foreignKey: "team_member_id", sourceKey: "id", targetKey: "team_member_id" });
            managerTeamMember_1.managerTeamMemberModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
            let where = {};
            where.id = params.employeeId;
            const employee = yield models_1.employeeModel.findOne({
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
            });
            if (employee) {
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
    /**
  *
  * @param {} params pass all parameters from request
  */
    addVideo(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield libraryManagement_1.libraryManagementModel.create(params);
        });
    }
}
exports.EmployersService = EmployersService;
//# sourceMappingURL=employersService.js.map