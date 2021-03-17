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
var Op = Sequelize.Op;
class EmployeeManagement {
    constructor() { }
    /**
    * add edit employee function
    @param {} params pass all parameters from request
    */
    addEditEmployee(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
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
                                    where: { id: params.id }
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
    * get employee list function
    @param {} params pass all parameters from request
    */
    getEmployeeList(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.departmentId) {
                let departmentExists = yield models_1.departmentModel.findOne({ where: { id: params.departmentId } });
                if (!departmentExists)
                    throw new Error(constants.MESSAGES.invalid_department);
            }
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let whereCond = {};
            whereCond.current_employer_id = user.uid;
            if (params.departmentId) {
                whereCond = Object.assign(Object.assign({}, whereCond), { current_department_id: params.current_department_id });
            }
            return yield models_1.employeeModel.findAndCountAll({
                where: whereCond,
                limit: limit,
                offset: offset,
                order: [["createdAt", "DESC"]]
            });
        });
    }
}
exports.EmployeeManagement = EmployeeManagement;
//# sourceMappingURL=managementService.js.map