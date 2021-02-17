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
const lodash_1 = __importDefault(require("lodash"));
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
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
                    params.password = yield appUtils.bcryptPassword(params.password);
                    return yield models_1.employersModel.create(params);
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
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            var whereCond = {};
            if (params.industry_type) {
                whereCond = {
                    industry_type: params.industry_type
                };
            }
            else if (params.searchKey) {
                whereCond = {
                    name: { [Op.iLike]: `%${params.searchKey}%` }
                };
            }
            return yield models_1.employersModel.findAndCountAll({
                where: whereCond,
                limit: limit,
                offset: offset,
                order: [["createdAt", "DESC"]]
            });
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
    dashboardAnalytics(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {};
            let idArr = [];
            where.admin_id = user.uid;
            where.status = 1;
            const employers = yield models_1.employersModel.findAndCountAll({ where: where, raw: true });
            for (let i = 0; i < employers.rows.length; i++) {
                idArr.push(employers.rows[i].id);
            }
            let criteria = {
                current_employer_id: { [Op.in]: idArr }
            };
            const employees = yield models_1.employeeModel.count({ where: criteria });
            if (employers) {
                return { employers: employers.count, employees };
            }
            else {
                throw new Error(constants.MESSAGES.employer_notFound);
            }
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
            if (params.employerName) {
                employer = {
                    name: { [Op.iLike]: `%${params.employerName}%` },
                    status: 1
                };
            }
            if (params.departmentName) {
                department = {
                    name: { [Op.iLike]: `%${params.departmentName}%` }
                };
            }
            if (params.searchKey) {
                whereCond = {
                    name: { [Op.iLike]: `%${params.searchKey}%` },
                    status: 1
                };
            }
            else {
                whereCond.status = 1;
            }
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
                order: [["createdAt", "DESC"]]
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
                let status = [1, 2, 3];
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
}
exports.EmployersService = EmployersService;
//# sourceMappingURL=employersService.js.map