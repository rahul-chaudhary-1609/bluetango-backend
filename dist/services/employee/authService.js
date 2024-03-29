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
exports.AuthService = void 0;
const lodash_1 = __importDefault(require("lodash"));
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const tokenResponse = __importStar(require("../../utils/tokenResponse"));
const employee_1 = require("../../models/employee");
const admin_1 = require("../../models/admin");
const employers_1 = require("../../models/employers");
const department_1 = require("../../models/department");
const managerTeamMember_1 = require("../../models/managerTeamMember");
const coachManagement_1 = require("../../models/coachManagement");
const employeeRanks_1 = require("../../models/employeeRanks");
const emoji_1 = require("../../models/emoji");
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
class AuthService {
    constructor() { }
    /**
    * login function
    @param {} params pass all parameters from request
    */
    login(params) {
        return __awaiter(this, void 0, void 0, function* () {
            employee_1.employeeModel.hasOne(department_1.departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
            employee_1.employeeModel.hasOne(employers_1.employersModel, { foreignKey: "id", sourceKey: "current_employer_id", targetKey: "id" });
            employee_1.employeeModel.hasOne(employeeRanks_1.employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });
            let existingUser = yield employee_1.employeeModel.findOne({
                where: {
                    email: params.username.toLowerCase()
                },
                include: [
                    {
                        model: department_1.departmentModel,
                        required: false,
                    },
                    {
                        model: employers_1.employersModel,
                        required: false,
                        attributes: ['id', 'name', 'email', 'status', 'subscription_type', 'free_trial_status']
                    },
                ],
                order: [["createdAt", "DESC"]]
            });
            if (!lodash_1.default.isEmpty(existingUser) && existingUser.status == 0) {
                throw new Error(constants.MESSAGES.deactivate_account);
            }
            else if (!lodash_1.default.isEmpty(existingUser) && existingUser.status == 2) {
                throw new Error(constants.MESSAGES.delete_account);
            }
            if (!lodash_1.default.isEmpty(existingUser) && existingUser.employer.status == 0) {
                throw new Error(constants.MESSAGES.deactivate_employer_account);
            }
            else if (!lodash_1.default.isEmpty(existingUser) && existingUser.employer.status == 2) {
                throw new Error(constants.MESSAGES.delete_employer_account);
            }
            else if (!lodash_1.default.isEmpty(existingUser) && existingUser.employer.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan && existingUser.employer.free_trial_status == constants.EMPLOYER_FREE_TRIAL_STATUS.over) {
                throw new Error(constants.MESSAGES.employee_employer_have_no_plan);
            }
            else if (!lodash_1.default.isEmpty(existingUser)) {
                existingUser = yield helperFunction.convertPromiseToObject(existingUser);
                let comparePassword = yield appUtils.comparePassword(params.password, existingUser.password);
                if (comparePassword) {
                    delete existingUser.password;
                    let token = yield tokenResponse.employeeTokenResponse(existingUser);
                    let reqdata = {
                        uid: existingUser.id
                    };
                    let profileData = yield this.getMyProfile(reqdata);
                    profileData.token = token.token;
                    if (params.device_token) {
                        yield employee_1.employeeModel.update({
                            device_token: params.device_token
                        }, { where: { id: existingUser.id } });
                    }
                    return profileData;
                }
                else {
                    throw new Error(constants.MESSAGES.invalid_password);
                }
            }
            else {
                throw new Error(constants.MESSAGES.invalid_email);
            }
        });
    }
    /**
    * reset password function to add the data
    * @param {*} params pass all parameters from request
    */
    forgotPassword(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var existingUser;
            const qry = { where: {
                    email: params.email.toLowerCase(),
                    status: { [Op.ne]: 2 }
                } };
            if (params.user_role == constants.USER_ROLE.sub_admin || params.user_role == constants.USER_ROLE.super_admin) {
                existingUser = yield admin_1.adminModel.findOne(qry);
            }
            else if (params.user_role == constants.USER_ROLE.employee) {
                existingUser = yield employee_1.employeeModel.findOne(qry);
            }
            else if (params.user_role == constants.USER_ROLE.employer) {
                existingUser = yield employers_1.employersModel.findOne(qry);
            }
            else {
                throw new Error(constants.MESSAGES.user_not_found);
            }
            if (!lodash_1.default.isEmpty(existingUser)) {
                // params.country_code = existingUser.country_code;
                let token = yield tokenResponse.forgotPasswordTokenResponse(existingUser, params.user_role);
                const mailParams = {};
                mailParams.to = params.email;
                mailParams.html = `Hi ${existingUser.name}
                <br> Click on the link below to reset your password
                <br> ${process.env.WEB_HOST_URL}?token=${token.token}
                <br> Please Note: For security purposes, this link expires in ${process.env.FORGOT_PASSWORD_LINK_EXPIRE_IN_MINUTES} Hours.
                `;
                mailParams.subject = "Reset Password Request";
                yield helperFunction.sendEmail(mailParams);
                return true;
            }
            else {
                throw new Error(constants.MESSAGES.user_not_found);
            }
        });
    }
    /*
    * function to set new pass
    */
    resetPassword(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = {
                password: yield appUtils.bcryptPassword(params.password)
            };
            const qry = {
                where: {
                    id: user.uid
                }
            };
            if (user.user_role == constants.USER_ROLE.sub_admin || user.user_role == constants.USER_ROLE.super_admin) {
                return yield admin_1.adminModel.update(update, qry);
            }
            else if (user.user_role == constants.USER_ROLE.employee) {
                update.first_time_login = 0;
                update.first_time_reset_password = 0;
                return yield employee_1.employeeModel.update(update, qry);
            }
            else if (user.user_role == constants.USER_ROLE.employer) {
                return yield employers_1.employersModel.update(update, qry);
            }
            else if (user.user_role == constants.USER_ROLE.coach) {
                return yield coachManagement_1.coachManagementModel.update(update, qry);
            }
            else {
                throw new Error(constants.MESSAGES.user_not_found);
            }
        });
    }
    /*
    * function to set new pass
    */
    getMyProfile(params) {
        return __awaiter(this, void 0, void 0, function* () {
            employee_1.employeeModel.hasOne(department_1.departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
            employee_1.employeeModel.hasOne(employers_1.employersModel, { foreignKey: "id", sourceKey: "current_employer_id", targetKey: "id" });
            employee_1.employeeModel.hasOne(managerTeamMember_1.managerTeamMemberModel, { foreignKey: "team_member_id", sourceKey: "id", targetKey: "team_member_id" });
            employee_1.employeeModel.hasOne(employeeRanks_1.employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });
            managerTeamMember_1.managerTeamMemberModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
            employers_1.employersModel.hasOne(admin_1.adminModel, { foreignKey: "id", sourceKey: "admin_id", targetKey: "id" });
            let existingUser = yield employee_1.employeeModel.findOne({
                where: {
                    id: params.uid
                },
                include: [
                    {
                        model: employeeRanks_1.employeeRanksModel,
                        required: false,
                        attributes: ["id", "name"]
                    },
                    {
                        model: department_1.departmentModel,
                        required: false,
                        attributes: ['id', 'name']
                    },
                    {
                        model: emoji_1.emojiModel,
                        required: false,
                        as: 'energy_emoji_data',
                        attributes: ['id', 'image_url', 'caption']
                    },
                    {
                        model: emoji_1.emojiModel,
                        required: false,
                        as: 'job_emoji_data',
                        attributes: ['id', 'image_url', 'caption']
                    },
                    {
                        model: employers_1.employersModel,
                        required: false,
                        attributes: ['id', 'name', 'email'],
                        include: [{
                                model: admin_1.adminModel,
                                required: false,
                                attributes: ['id', 'thought_of_the_day']
                            }]
                    },
                    {
                        model: managerTeamMember_1.managerTeamMemberModel,
                        required: false,
                        attributes: ['id', 'manager_id'],
                        include: [{
                                model: employee_1.employeeModel,
                                required: false,
                                attributes: ['id', 'name', 'email', 'profile_pic_url']
                            }]
                    }
                ],
            });
            existingUser = yield helperFunction.convertPromiseToObject(existingUser);
            delete existingUser.password;
            return existingUser;
        });
    }
    /*
   * function to update profile
   */
    updateProfile(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            //params.first_time_login = 0;
            return yield employee_1.employeeModel.update(params, {
                where: { id: user.uid }
            });
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
    /*
    * function to change password
    */
    changePassword(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let getEmployeeData = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                where: { id: user.uid }
            }));
            console.log(params, getEmployeeData);
            let comparePassword = yield appUtils.comparePassword(params.old_password, getEmployeeData.password);
            if (comparePassword) {
                let update = {
                    'password': yield appUtils.bcryptPassword(params.new_password)
                };
                return yield employee_1.employeeModel.update(update, {
                    where: { id: user.uid }
                });
            }
            else {
                throw new Error(constants.MESSAGES.invalid_old_password);
            }
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map