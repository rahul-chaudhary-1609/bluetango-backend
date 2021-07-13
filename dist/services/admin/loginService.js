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
exports.LoginService = void 0;
const admin_1 = require("../../models/admin");
const lodash_1 = __importDefault(require("lodash"));
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
const tokenResponse = __importStar(require("../../utils/tokenResponse"));
const selectQueryService = __importStar(require("../../queryService/selectQueryService"));
const updateQueryService = __importStar(require("../../queryService/updateQueryService"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
class LoginService {
    constructor() { }
    /**
    * login function
    @param {} params pass all parameters from request
    */
    login(params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("login", params);
            params.email = params.username;
            var isEmail = yield appUtils.CheckEmail(params);
            const qry = { where: {} };
            if (isEmail) {
                qry.where = {
                    email: params.username.toLowerCase(),
                    status: { [Op.in]: [0, 1] }
                };
            }
            qry.raw = true;
            qry.attributes = ['id', 'name', 'email', 'password', 'admin_role'];
            qry.order = [["createdAt", "DESC"]];
            let existingUser = yield admin_1.adminModel.findOne(qry);
            if (!lodash_1.default.isEmpty(existingUser)) {
                let comparePassword = yield appUtils.comparePassword(params.password, existingUser.password);
                if (comparePassword) {
                    delete existingUser.password;
                    let token = yield tokenResponse.adminTokenResponse(existingUser);
                    existingUser.token = token.token;
                    let update = {
                        'token': token.token,
                        'model': admin_1.adminModel
                    };
                    let condition = {
                        id: existingUser.id
                    };
                    yield updateQueryService.updateData(update, condition);
                    return existingUser;
                }
                else {
                    throw new Error(constants.MESSAGES.invalid_password);
                }
            }
            else {
                throw new Error(constants.MESSAGES.invalid_credentials);
            }
        });
    }
    /**
    * add sub admin function
    @param {} params pass all parameters from request
    */
    addNewAdmin(params) {
        return __awaiter(this, void 0, void 0, function* () {
            //if(params.passkey === process.env.ADMIN_PASSKEY) {
            console.log('params - - -', params);
            const qry = { where: {} };
            qry.where = {
                email: params.email,
                status: { [Op.in]: [0, 1] }
            };
            qry.raw = true;
            let existingUser = yield admin_1.adminModel.findOne(qry);
            console.log('existingUser - - - ', existingUser);
            if (lodash_1.default.isEmpty(existingUser)) {
                let comparePassword = params.password === params.confirmPassword;
                if (comparePassword) {
                    delete params.confirmPassword;
                    params.email = params.email.toLowerCase();
                    params.password = yield appUtils.bcryptPassword(params.password);
                    params.id = yield this.getSerailId();
                    //params.admin_role = (params.id == 1)?1:2;
                    params.admin_role = constants.USER_ROLE.sub_admin;
                    let newAdmin = yield admin_1.adminModel.create(params);
                    let adminData = newAdmin.get({ plain: true });
                    console.log('adminData - - -', adminData);
                    delete adminData.password;
                    let token = yield tokenResponse.adminTokenResponse(newAdmin);
                    adminData.token = token.token;
                    let update = {
                        'token': token.token,
                        'model': admin_1.adminModel
                    };
                    let condition = {
                        id: adminData.id
                    };
                    yield updateQueryService.updateData(update, condition);
                    delete adminData.reset_pass_otp;
                    delete adminData.reset_pass_expiry;
                    return adminData;
                }
                else {
                    throw new Error(constants.MESSAGES.password_miss_match);
                }
            }
            else {
                throw new Error(constants.MESSAGES.acc_already_exists);
            }
            // } else {
            //     throw new Error(constants.MESSAGES.invalid_passkey);
            // }
        });
    }
    /**
     * edit sub admin function
     * @param {*} params pass all parameters from request
     */
    editSubAdmin(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {
                id: params.subAdminId
            };
            let update = {
                name: params.name,
                permissions: params.permissions,
                country_code: params.country_code,
                phone_number: params.phone_number,
                status: params.status
            };
            const subAdmin = yield admin_1.adminModel.update(update, { where: where, raw: true, returning: true });
            if (subAdmin && subAdmin[1][0]) {
                return subAdmin[1][0];
            }
            else {
                throw new Error(constants.MESSAGES.invalid_subAdmin);
            }
        });
    }
    getSerailId() {
        return __awaiter(this, void 0, void 0, function* () {
            let lastRecord = yield admin_1.adminModel.findAll({
                limit: 1,
                order: [['createdAt', 'DESC']]
            });
            if (lastRecord && lastRecord.length > 0) {
                return lastRecord[0].id + 1;
            }
            else {
                return 1;
            }
        });
    }
    /**
     * reset password function to add the data
     * @param {*} params pass all parameters from request
     */
    forgetPassword(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let userData, reset_pass_otp = {}, reset_pass_expiry;
            const qry = { where: {} };
            if (!lodash_1.default.isEmpty(params)) {
                qry.where.email = params.email;
                qry.where.status = { [Op.ne]: 2 };
                qry.raw = true;
                let existingUser = yield admin_1.adminModel.findOne(qry);
                if (!lodash_1.default.isEmpty(existingUser)) {
                    // params.country_code = existingUser.country_code;
                    let otp = yield appUtils.gererateOtp();
                    const mailParams = {};
                    mailParams.to = params.email;
                    mailParams.toName = existingUser.name;
                    mailParams.templateName = "reset_password_request";
                    mailParams.subject = "Reset Password Request";
                    mailParams.templateData = {
                        subject: "Reset Password Request",
                        name: existingUser.name,
                        resetLink: `${process.env.WEB_HOST_URL + 'admin-panel/auth/reset-password'}?email=${params.email}&otp=${otp}`
                    };
                    if (!lodash_1.default.isEmpty(otp)) {
                        reset_pass_otp = otp;
                        reset_pass_expiry = Math.floor(Date.now());
                        userData = yield admin_1.adminModel.update({ reset_pass_otp, reset_pass_expiry }, { where: { id: existingUser.id } });
                        // await helperFunction.sendEmail(mailParams);
                        return { otp };
                    }
                }
                else {
                    throw new Error(constants.MESSAGES.user_not_found);
                }
            }
        });
    }
    /**
    * resend otp function to resend otp to the user
    * @param {*} params pass all parameters from request
    */
    // public async resendOtp(params: any) {
    //     let userUpdate = <any>{};
    //     const query = <any>{ where: {} };
    //     if (!_.isEmpty(params)) {
    //         query.where.userID = params.uid;
    //     }
    //     let user = await adminModel.findOne(query);
    //     let userdata = JSON.parse(JSON.stringify(user))
    //     if (_.isEmpty(userdata)) {
    //         throw new Error(constants.MESSAGES.user_not_found);
    //     } else {
    //         let otp = await this.sendOtpViaMail(params);
    //         if (!_.isEmpty(otp)) {
    //             let update = <any>{};
    //             update.reset_pass_token['otp'] = otp;
    //             update.reset_pass_token['otp_expire'] = appUtils.currentUnixTimeStamp();
    //             userUpdate = adminModel.update(update, query);
    //             var token = await tokenResponse.tokenResponse(params.uid);
    //             return token;
    //         }
    //     }
    // }
    /*
    * function to set new pass by verifying otp
    */
    resetPassword(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = { where: {} };
                if (!lodash_1.default.isEmpty(params)) {
                    query.where.email = params.email;
                    query.where.status = { [Op.ne]: 2 };
                }
                let user = yield selectQueryService.selectData(admin_1.adminModel, query);
                let userdata = JSON.parse(JSON.stringify(user));
                if (lodash_1.default.isEmpty(userdata)) {
                    throw new Error(constants.MESSAGES.user_not_found);
                }
                else {
                    if (userdata && userdata.reset_pass_otp) {
                        let time = appUtils.calcluateOtpTime(userdata.reset_pass_expiry);
                        if (userdata.reset_pass_otp != params.otp) {
                            throw new Error(constants.MESSAGES.invalid_otp);
                        }
                        else if (appUtils.currentUnixTimeStamp() - time > constants.otp_expiry_time) {
                            throw new Error(constants.MESSAGES.expire_otp);
                        }
                        else if (params.password !== params.confirmPassword) {
                            throw new Error(constants.MESSAGES.password_miss_match);
                        }
                        else {
                            params.password = yield appUtils.bcryptPassword(params.password);
                            let update = {
                                'password': params.password,
                                'reset_pass_otp': null,
                                'reset_pass_expiry': null,
                                'model': admin_1.adminModel
                            };
                            let condition = {
                                id: userdata.id
                            };
                            yield updateQueryService.updateData(update, condition);
                            // return userdata;
                        }
                    }
                    else {
                        throw new Error(constants.MESSAGES.invalid_otp);
                    }
                }
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    changePassword(params, users) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { where: {} };
            if (!lodash_1.default.isEmpty(params)) {
                query.where.id = users.uid;
                query.where.status = { [Op.ne]: 2 };
            }
            let user = yield selectQueryService.selectData(admin_1.adminModel, query);
            let userdata = JSON.parse(JSON.stringify(user));
            if (lodash_1.default.isEmpty(userdata)) {
                throw new Error(constants.MESSAGES.user_not_found);
            }
            else {
                const match = yield bcrypt_1.default.compare(params.oldPassword, userdata.password);
                if (params.password !== params.confirmPassword) {
                    throw new Error(constants.MESSAGES.password_miss_match);
                }
                else if (!match) {
                    throw new Error(constants.MESSAGES.invalid_password);
                }
                else {
                    params.password = yield appUtils.bcryptPassword(params.password);
                    let update = {
                        'password': params.password,
                        'model': admin_1.adminModel
                    };
                    let condition = {
                        id: userdata.id
                    };
                    yield updateQueryService.updateData(update, condition);
                }
            }
        });
    }
    logout(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let update = {
                    'token': null,
                    'model': admin_1.adminModel
                };
                let condition = {
                    id: user.uid
                };
                return yield updateQueryService.updateData(update, condition);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.LoginService = LoginService;
//# sourceMappingURL=loginService.js.map