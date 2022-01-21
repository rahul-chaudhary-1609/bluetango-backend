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
const authService_1 = require("../../services/coach/authService");
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
const multerParser_1 = require("../../middleware/multerParser");
//Instantiates a coach auth services  
const authService = new authService_1.AuthService();
class AuthController {
    constructor() { }
    /**
    * login
    * @param req :[email, password]
    * @param res
    */
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.login(req.body);
                appUtils.successResponse(res, responseFromService, (responseFromService.is_both) ? constants.MESSAGES.select_appId : constants.MESSAGES.login_success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * forgot password
    * @param req :[email]
    * @param res
    */
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.forgotPassword(req.body);
                appUtils.successResponse(res, responseFromService, (responseFromService["is_both"]) ? constants.MESSAGES.select_appId : constants.MESSAGES.forget_pass_otp);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
    * reset password
    * @param req :[password]
    * @param res
    */
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.resetPassword(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.reset_pass_success);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
    * get  profile
    * @param req
    * @param res
    */
    getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.getProfile(req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
    * edit profile
    * @param req
    * @param res
    */
    editProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.editProfile(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
  * update device token
  * @param req :[]
  * @param res
  */
    updateEmployerDeviceToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.updateEmployerDeviceToken(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
   * clear device token
   * @param req :[]
   * @param res
   */
    clearEmployerDeviceToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.clearEmployerDeviceToken(req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
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
                let folderName = "admin_video_files";
                const responseFromService = yield authService.uploadFile(req.file, folderName);
                yield multerParser_1.deleteFile(req.file.filename);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
     * get static content
     * @param req :
     * @param res
     */
    getStaticContent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.getStaticContent(req.query);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.fetch_success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
        * get all coach bios
        * @param req :
        * @param res
        */
    getBios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield authService.getBios(req.query);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.fetch_success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map