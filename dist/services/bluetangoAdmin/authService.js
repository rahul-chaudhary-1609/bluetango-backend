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
exports.AuthService = void 0;
const admin_1 = require("../../models/admin");
const models_1 = require("../../models");
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
const tokenResponse = __importStar(require("../../utils/tokenResponse"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const queryService = __importStar(require("../../queryService/bluetangoAdmin/queryService"));
const generator = require('generate-password');
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
models_1.bluetangoAdminModel.belongsTo(models_1.bluetangoAdminRolesModel, { foreignKey: 'role_id', targetKey: 'id' });
class AuthService {
    constructor() { }
    /**
    * login function
    @param {} params pass all parameters from request
    */
    login(params) {
        return __awaiter(this, void 0, void 0, function* () {
            params.email = params.email.toLowerCase();
            let query = {
                attributes: ['id', 'name', 'email', 'password', 'country_code', 'phone_number', 'admin_role', 'status', 'permissions', 'social_media_handles', 'profile_pic_url'],
                where: {
                    email: params.email,
                    status: {
                        [Op.ne]: constants.STATUS.deleted
                    }
                }
            };
            query.raw = true;
            let admin = yield queryService.selectOne(models_1.bluetangoAdminModel, query);
            if (admin) {
                let comparePassword = yield appUtils.comparePassword(params.password, admin.password);
                if (comparePassword) {
                    if (admin.status == constants.STATUS.active) {
                        delete admin.password;
                        let token = yield tokenResponse.bluetangoAdminTokenResponse(admin);
                        admin.token = token;
                        return admin;
                    }
                    else {
                        throw new Error(constants.MESSAGES.deactivate_account);
                    }
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
    addAdmin(Params) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = yield queryService.selectOne(models_1.bluetangoAdminRolesModel, { where: { role_name: Params.role_name } });
            if (role) {
                throw new Error(constants.MESSAGES.role_already_exist);
            }
            let newRole = yield queryService.addData(models_1.bluetangoAdminRolesModel, Params);
            let AlreadyExistAdmins = [];
            let created = [];
            for (let params of Params.admins) {
                params.email = params.email.toLowerCase();
                let query = {
                    where: {
                        email: params.email,
                        status: {
                            [Op.in]: [constants.STATUS.active, constants.STATUS.inactive]
                        }
                    }
                };
                let admin = yield queryService.selectOne(models_1.bluetangoAdminModel, query);
                if (!admin) {
                    params.role_id = newRole.id;
                    let password = yield helperFunction.generaePassword();
                    params.admin_role = constants.USER_ROLE.sub_admin;
                    params.password = yield appUtils.bcryptPassword(password);
                    let newAdmin = yield queryService.addData(models_1.bluetangoAdminModel, params);
                    newAdmin = newAdmin.get({ plain: true });
                    let token = yield tokenResponse.bluetangoAdminTokenResponse(newAdmin);
                    newAdmin.token = token;
                    delete newAdmin.password;
                    delete newAdmin.reset_pass_otp;
                    delete newAdmin.reset_pass_expiry;
                    const mailParams = {};
                    mailParams.to = params.email;
                    mailParams.html = `Hi  ${params.name}
                <br>Use the given credentials for login into the admin pannel :
                
                <br><b> Web URL</b>: ${process.env.BLUETANGO_WEB_URL} <br>
                <br> email : ${params.email}
                <br> password : ${password}
                `;
                    mailParams.subject = "Subadmin Login Credentials";
                    mailParams.name = "BlueTango";
                    yield helperFunction.sendEmail(mailParams);
                    created.push(newAdmin);
                }
                else {
                    AlreadyExistAdmins.push(params);
                }
            }
            return { newly_created: created, Already_exist_admins: AlreadyExistAdmins };
        });
    }
    getProfile(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                attributes: ['id', 'name', 'email', 'country_code', 'phone_number', 'admin_role', 'status', 'permissions', 'social_media_handles', 'thought_of_the_day', 'profile_pic_url', 'createdAt', 'updatedAt'],
                where: {
                    id: user.uid,
                }
            };
            let admin = yield queryService.selectOne(models_1.bluetangoAdminModel, query);
            return admin;
        });
    }
    /**
    * add sub admin function
    @param {} params pass all parameters from request
    */
    updateProfile(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            params.email = params.email.toLowerCase();
            let query = {
                where: {
                    email: params.email,
                    status: {
                        [Op.in]: [constants.STATUS.active, constants.STATUS.inactive]
                    },
                    id: {
                        [Op.ne]: user.uid,
                    }
                }
            };
            let admin = yield queryService.selectOne(models_1.bluetangoAdminModel, query);
            if (!admin) {
                params.model = models_1.bluetangoAdminModel;
                query = {
                    where: {
                        id: user.uid,
                    },
                    returning: true,
                    raw: true,
                };
                let updatedAdmin = yield queryService.updateData(params, query);
                return updatedAdmin;
            }
            else {
                throw new Error(constants.MESSAGES.email_already_registered);
            }
        });
    }
    /*
    * function to set new pass
    */
    changePassword(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                where: {
                    id: user.uid,
                }
            };
            let admin = yield queryService.selectOne(models_1.bluetangoAdminModel, query);
            let comparePassword = yield appUtils.comparePassword(params.old_password, admin.password);
            if (comparePassword) {
                params.password = yield appUtils.bcryptPassword(params.new_password);
                params.model = models_1.bluetangoAdminModel;
                yield queryService.updateData(params, query);
                return true;
            }
            else {
                throw new Error(constants.MESSAGES.invalid_old_password);
            }
        });
    }
    /**
    * reset password function to add the data
    * @param {*} params pass all parameters from request
    */
    forgotPassword(params) {
        return __awaiter(this, void 0, void 0, function* () {
            params.email = params.email.toLowerCase();
            let query = {
                where: {
                    email: params.email,
                    status: { [Op.ne]: constants.STATUS.deleted }
                }
            };
            query.raw = true;
            let admin = yield queryService.selectOne(models_1.bluetangoAdminModel, query);
            if (admin) {
                let token = yield tokenResponse.bluetangoForgotPasswordTokenResponse(admin);
                const mailParams = {};
                mailParams.to = params.email;
                mailParams.html = `Hi ${admin.name}
                <br> Click on the link below to reset your password
                <br> ${process.env.BLUETANGO_RESET_PASS_URL}?token=${token.token}
                <br> Please Note: For security purposes, this link expires in ${process.env.FORGOT_PASSWORD_LINK_EXPIRE_IN_MINUTES} Hours.
                `;
                mailParams.subject = "Reset Password Request";
                mailParams.name = "BlueTango";
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
            params.password = yield appUtils.bcryptPassword(params.password);
            params.model = models_1.bluetangoAdminModel;
            let query = {
                where: {
                    id: user.uid
                }
            };
            yield queryService.updateData(params, query);
            return true;
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
    logout(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let update = {
                    'token': null,
                    'model': admin_1.adminModel
                };
                let query = {
                    where: {
                        id: user.uid
                    }
                };
                return yield queryService.updateData(update, query);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    deleteAdmin(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                where: {
                    id: params.admin_id
                }
            };
            const coach = yield queryService.deleteData(models_1.bluetangoAdminModel, query);
            return coach;
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map