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
const notification_1 = require("../../models/notification");
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
                    status: { [Op.in]: [0, 1] }
                }
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
                    delete existingUser.password;
                    delete existingUser.reset_pass_otp;
                    existingUser.isFirstTimeLogin = false;
                    if (existingUser.first_time_login == 1) {
                        existingUser.isFirstTimeLogin = true;
                        yield models_1.employersModel.update({
                            first_time_login_datetime: new Date(),
                        }, {
                            where: {
                                email: params.username.toLowerCase(),
                            }
                        });
                        this.scheduleFreeTrialExpirationNotificationJob(existingUser);
                    }
                    let token = yield tokenResponse.employerTokenResponse(existingUser);
                    existingUser.token = token.token;
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
    * function to schedule notification for free trial expiration
    */
    scheduleFreeTrialExpirationNotificationJob(existingUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let trial_expiry_date = new Date(existingUser.first_time_login_datetime);
            trial_expiry_date.setDate(trial_expiry_date.getDate() + 14);
            let startTime = new Date((new Date(existingUser.first_time_login_datetime)).setDate(trial_expiry_date.getDate() + 11));
            let endTime = new Date((new Date(existingUser.first_time_login_datetime)).setDate(trial_expiry_date.getDate() + 14));
            const job = schedule.scheduleJob({ start: startTime, end: endTime, rule: '* * */24 * * *' }, function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const timeDiff = Math.floor((trial_expiry_date.getTime() - (new Date()).getTime()) / 1000);
                    //add notification 
                    let notificationObj = {
                        type_id: existingUser.id,
                        sender_id: existingUser.id,
                        reciever_id: existingUser.id,
                        type: constants.NOTIFICATION_TYPE.expiration_of_free_trial,
                        data: {
                            type: constants.NOTIFICATION_TYPE.expiration_of_free_trial,
                            title: 'Reminder Free Trial Expiration',
                            message: `Your free trial of 14 days is going to expire in ${Math.floor(timeDiff / 3600)} hour(s)`,
                            existingUser
                        },
                    };
                    yield notification_1.notificationModel.create(notificationObj);
                    //send push notification
                    let notificationData = {
                        title: 'Reminder Free Trial Expiration',
                        body: `Your free trial of 14 days is going to expire in ${Math.floor(timeDiff / 3600)} hour(s)`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.expiration_of_free_trial,
                            title: 'Reminder Free Trial Expiration',
                            message: `Your free trial of 14 days is going to expire in ${Math.floor(timeDiff / 3600)} hour(s)`,
                            existingUser
                        },
                    };
                    yield helperFunction.sendFcmNotification([existingUser.device_token], notificationData);
                });
            });
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
                return yield models_1.employersModel.update(update, qry);
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
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map