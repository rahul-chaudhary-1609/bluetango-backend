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
exports.SessionManagementController = void 0;
const index_1 = require("../../services/bluetangoAdmin/index");
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
//Instantiates a Home services  
const sessionManagement = new index_1.SessionManagementService();
class SessionManagementController {
    constructor() { }
    /**
      * get Session List
      * @param req :
      * @param res
      */
    getSessionList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield sessionManagement.getSessionList(req.query);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.fetch_success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
      * get Session details
      * @param req :
      * @param res
      */
    getSessionDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield sessionManagement.getSessionDetail(req.query);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.session_details_fetched);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
  * perform action on sessions
  * @param req :
  * @param res
  */
    performAction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield sessionManagement.performAction(req.body, req.user);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.action_success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
  * get Availabile Coaches
  * @param req :
  * @param res
  */
    getAvailabileCoaches(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield sessionManagement.getAvailabileCoaches(req.query);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.available_coaches_fetched);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
}
exports.SessionManagementController = SessionManagementController;
//# sourceMappingURL=sessionManagementController.js.map