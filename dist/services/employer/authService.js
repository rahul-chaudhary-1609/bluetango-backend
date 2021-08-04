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
const models_1 = require("../../models");
const paymentManagement_1 = require("../../models/paymentManagement");
const schedule = require('node-schedule');
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
            let existingUser = yield models_1.employersModel.findOne({
                where: {
                    email: params.username.toLowerCase(),
                },
                order: [["createdAt", "DESC"]]
            });
            if (!lodash_1.default.isEmpty(existingUser) && existingUser.status == 0) {
                throw new Error(constants.MESSAGES.deactivate_account);
            }
            else if (!lodash_1.default.isEmpty(existingUser) && existingUser.status == 2) {
                throw new Error(constants.MESSAGES.delete_account);
            }
            else if (!lodash_1.default.isEmpty(existingUser)) {
                existingUser = yield helperFunction.convertPromiseToObject(existingUser);
                let comparePassword = yield appUtils.comparePassword(params.password, existingUser.password);
                if (comparePassword) {
                    let updateObj = {};
                    delete existingUser.password;
                    delete existingUser.reset_pass_otp;
                    existingUser.isFirstTimeLogin = false;
                    if (existingUser.first_time_login == 1) {
                        existingUser.isFirstTimeLogin = true;
                        updateObj = Object.assign(Object.assign({}, updateObj), { first_time_login_datetime: new Date() });
                    }
                    if (existingUser.free_trial_status == constants.EMPLOYER_FREE_TRIAL_STATUS.on_going && existingUser.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.free) {
                        let expiryDate = new Date(existingUser.free_trial_start_datetime);
                        expiryDate.setDate(expiryDate.getDate() + 14);
                        if ((new Date()) > expiryDate) {
                            updateObj = Object.assign(Object.assign({}, updateObj), { subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan });
                        }
                    }
                    if (existingUser.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.paid) {
                        let plan = yield paymentManagement_1.paymentManagementModel.findOne({
                            where: {
                                employer_id: parseInt(existingUser.id),
                                status: constants.EMPLOYER_SUBSCRIPTION_PLAN_STATUS.active,
                            }
                        });
                        if (plan) {
                            if ((new Date()) > (new Date(plan.expiry_date))) {
                                updateObj = Object.assign(Object.assign({}, updateObj), { subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan });
                                plan.status = constants.EMPLOYER_SUBSCRIPTION_PLAN_STATUS.exhausted;
                                plan.save();
                            }
                        }
                        else {
                            updateObj = Object.assign(Object.assign({}, updateObj), { subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan });
                        }
                    }
                    let token = yield tokenResponse.employerTokenResponse(existingUser);
                    yield models_1.employersModel.update(updateObj, {
                        where: {
                            email: params.username.toLowerCase(),
                        }
                    });
                    existingUser.industry_info = yield helperFunction.convertPromiseToObject(yield models_1.industryTypeModel.findByPk(existingUser.industry_type));
                    existingUser.no_of_employee = yield helperFunction.convertPromiseToObject(yield models_1.employeeModel.count({
                        where: {
                            current_employer_id: parseInt(existingUser.id),
                            status: [constants.STATUS.active, constants.STATUS.inactive],
                        }
                    }));
                    existingUser.token = token.token;
                    existingUser.free_trial_expiry_date = null;
                    if (existingUser.free_trial_start_datetime) {
                        let free_trial_expiry_date = new Date(existingUser.free_trial_start_datetime);
                        free_trial_expiry_date.setDate(free_trial_expiry_date.getDate() + constants.EMPLOYER_FREE_TRIAL_DURATION);
                        existingUser.free_trial_expiry_date = free_trial_expiry_date;
                    }
                    return existingUser;
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
    /*
    * function to set new pass
    */
    resetPassword(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = {
                password: yield appUtils.bcryptPassword(params.password)
            };
            console.log("User", user);
            console.log("update", update);
            const qry = {
                where: {
                    id: user.uid
                }
            };
            if (user.user_role == constants.USER_ROLE.employer) {
                update.first_time_reset_password = 0;
                update.first_time_login = 0;
                yield models_1.employersModel.update(update, qry);
                return yield helperFunction.convertPromiseToObject(yield models_1.employersModel.findOne({
                    where: {
                        id: parseInt(user.uid)
                    }
                }));
            }
            else {
                throw new Error(constants.MESSAGES.user_not_found);
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
            const qry = {
                where: {
                    email: params.email.toLowerCase(),
                    status: { [Op.ne]: 2 }
                }
            };
            if (params.user_role == constants.USER_ROLE.employer) {
                existingUser = yield models_1.employersModel.findOne(qry);
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
 * function to update device token
 */
    updateEmployerDeviceToken(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.employersModel.update({
                device_token: params.device_token
            }, {
                where: { id: user.uid },
                returning: true
            });
        });
    }
    /*
 * function to clear device token
 */
    clearEmployerDeviceToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.employersModel.update({
                device_token: null,
            }, {
                where: { id: user.uid },
                returning: true
            });
        });
    }
    //     /*
    //     e005JBg1RamqXfRccvlXoH:APA91bH_05rZB3PS8JRhzqJTf4ocQ6CW0V3UBw_QUzYbOqiOvHWOud6YfALazkXo50gM6zX2xKT1vsw83MO9TvOe8oD8oHjD_p_mqwYaGgwXpYqi-Aeuw9TsF1Ig4BUTpTzQhRhrFYHN
    // * function to schedule job
    // */
    //     public async scheduleJob(user: any) {
    //         let dev ="e005JBg1RamqXfRccvlXoH:APA91bH_05rZB3PS8JRhzqJTf4ocQ6CW0V3UBw_QUzYbOqiOvHWOud6YfALazkXo50gM6zX2xKT1vsw83MO9TvOe8oD8oHjD_p_mqwYaGgwXpYqi-Aeuw9TsF1Ig4BUTpTzQhRhrFYHN"
    //         const startTime = new Date(Date.now() + 5000);
    //         const endTime = new Date(startTime.getTime() + 25000);
    //         const job = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/5 * * * * *' }, async function () {
    //             console.log('Time for tea!');
    //             let notificationData = <any>{
    //                 title: 'Reminder Free Trial Expiration',
    //                 body: `Your free trial of 14 days is going to expire in`,
    //                 data: {
    //                     type: constants.NOTIFICATION_TYPE.expiration_of_free_trial,
    //                     title: 'Reminder Free Trial Expiration',
    //                     message: `Your free trial of 14 days is going to expire in `,
    //                 },
    //             }
    //             await helperFunction.sendFcmNotification([dev], notificationData);
    //         });
    //         return true;
    //     }
    /*
    * function to change password
    */
    changePassword(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let getEmployerData = yield helperFunction.convertPromiseToObject(yield models_1.employersModel.findOne({
                where: { id: user.uid }
            }));
            let comparePassword = yield appUtils.comparePassword(params.old_password, getEmployerData.password);
            if (comparePassword) {
                let update = {
                    'password': yield appUtils.bcryptPassword(params.new_password)
                };
                return yield models_1.employersModel.update(update, {
                    where: { id: user.uid }
                });
            }
            else {
                throw new Error(constants.MESSAGES.invalid_old_password);
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
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map