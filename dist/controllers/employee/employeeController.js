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
exports.EmployeeController = void 0;
const employeeServices_1 = require("../../services/employee/employeeServices");
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
//Instantiates a Home services  
const employeeServices = new employeeServices_1.EmployeeServices();
class EmployeeController {
    constructor() { }
    /**
    * getListOfTeamMemberByManagerId
    * @param req :[]
    * @param res
    */
    getListOfTeamMemberByManagerId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.getListOfTeamMemberByManagerId(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * viewDetailsEmployee
    * @param req :[]
    * @param res
    */
    viewDetailsEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.viewDetailsEmployee(req.query);
                if (responseFromService) {
                    appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
                }
                else {
                    appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * searchTeamMember
    * @param req :[]
    * @param res
    */
    searchTeamMember(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.searchTeamMember(req.query, req.user);
                if (responseFromService) {
                    appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
                }
                else {
                    appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * add thought of the day
    * @param req :[]
    * @param res
    */
    thoughtOfTheDay(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.thoughtOfTheDay(req.body, req.user);
                if (responseFromService) {
                    appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
                }
                else {
                    appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
   * add thought of the day
   * @param req :[]
   * @param res
   */
    getEmoji(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.getEmoji();
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=employeeController.js.map