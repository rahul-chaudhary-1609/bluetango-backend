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
exports.AuthController = void 0;
const authService_1 = require("../../services/bluetangoAdmin/authService");
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
const multerParser_1 = require("../../middleware/multerParser");
//Instantiates a Home services  
const authService = new authService_1.AuthService();
class AuthController {
    constructor() { }
    /**
    * login
    * @param req :[email, password]
    * @param res
    */
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.login(req.body);
                const msg = constants.MESSAGES.login_success;
                appUtils.successResponse(res, responseFromService, msg);
            }
            catch (error) {
                console.log(error);
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * add sub admin
    * @param req :[name, email, password, confirmPassword]
    * @param res
    */
    addAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // if(req.user.user_role != constants.USER_ROLE.super_admin) {
                //     throw new Error(constants.MESSAGES.invalid_admin)
                // }
                const responseFromService = yield authService.addAdmin(req.body);
                const msg = constants.MESSAGES.subAdmin_added;
                appUtils.successResponse(res, responseFromService, msg);
            }
            catch (error) {
                console.log(error);
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.getProfile(req.user);
                const msg = constants.MESSAGES.success;
                appUtils.successResponse(res, responseFromService, msg);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.updateProfile(req.body, req.user);
                const msg = constants.MESSAGES.update_user_details;
                appUtils.successResponse(res, responseFromService, msg);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.changePassword(req.body, req.user);
                const msg = constants.MESSAGES.password_change_success;
                appUtils.successResponse(res, responseFromService, msg);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.forgotPassword(req.body);
                const msg = constants.MESSAGES.forget_pass_otp;
                appUtils.successResponse(res, responseFromService, msg);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.resetPassword(req.body, req.user);
                const msg = constants.MESSAGES.reset_pass_success;
                appUtils.successResponse(res, responseFromService, msg);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
   * update profile
   * @param req :[]
   * @param res
   */
    uploadFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.uploadFile(req.file, req.body.folderName);
                yield multerParser_1.deleteFile(req.file.filename);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * logout
    * @param req
    * @param res
    */
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.logout(req.body, req.user);
                const msg = constants.MESSAGES.logout_success;
                appUtils.successResponse(res, {}, msg);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map