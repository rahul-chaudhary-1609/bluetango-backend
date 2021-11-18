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
const coachManagement_1 = require("../../models/coachManagement");
const employeeRanks_1 = require("../../models/employeeRanks");
const coachSpecializationCategories_1 = require("../../models/coachSpecializationCategories");
const employeeCoachSession_1 = require("../../models/employeeCoachSession");
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
            let existingUser = yield coachManagement_1.coachManagementModel.findOne({
                where: {
                    email: params.username.toLowerCase()
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
                    delete existingUser.password;
                    let token = yield tokenResponse.coachTokenResponse(existingUser);
                    let reqData = {
                        uid: existingUser.id,
                    };
                    let profileData = yield this.getProfile(reqData);
                    profileData.token = token.token;
                    if (params.device_token) {
                        yield coachManagement_1.coachManagementModel.update({
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
            const qry = {
                where: {
                    email: params.email.toLowerCase(),
                    status: { [Op.ne]: 2 }
                }
            };
            if (params.user_role == constants.USER_ROLE.coach) {
                existingUser = yield coachManagement_1.coachManagementModel.findOne(qry);
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
            if (user.user_role == constants.USER_ROLE.coach) {
                update.first_time_reset_password = 0;
                update.first_time_login = 0;
                return yield coachManagement_1.coachManagementModel.update(update, qry);
            }
            else {
                throw new Error(constants.MESSAGES.user_not_found);
            }
        });
    }
    /*
    * function to get profile
    */
    getProfile(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let coach = yield helperFunction.convertPromiseToObject(yield coachManagement_1.coachManagementModel.findOne({
                where: {
                    id: parseInt(user.uid),
                    status: { [Op.ne]: 2 }
                }
            }));
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
                coach.average_rating = parseInt(totalRating) / coach.rating_count;
            }
            delete coach.coach_specialization_category_ids;
            delete coach.employee_rank_ids;
            delete coach.password;
            return coach;
        });
    }
    /*
    * function to get profile
    */
    editProfile(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let profile = yield coachManagement_1.coachManagementModel.findOne({
                where: {
                    id: parseInt(user.uid),
                    status: { [Op.ne]: 2 }
                }
            });
            let currentProfile = yield helperFunction.convertPromiseToObject(profile);
            profile.name = params.name || currentProfile.name;
            profile.email = params.email || currentProfile.email;
            profile.password = params.password ? yield appUtils.bcryptPassword(params.password) : currentProfile.password;
            profile.country_code = params.country_code || currentProfile.country_code;
            profile.phone_number = params.phone_number || currentProfile.phone_number;
            profile.description = params.description || currentProfile.description;
            profile.image = params.image || currentProfile.image;
            profile.fileName = params.fileName || currentProfile.fileName;
            profile.save();
            return profile;
        });
    }
    /*
* function to update device token
*/
    updateEmployerDeviceToken(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield coachManagement_1.coachManagementModel.update({
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
            return yield coachManagement_1.coachManagementModel.update({
                device_token: null,
            }, {
                where: { id: user.uid },
                returning: true
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
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map