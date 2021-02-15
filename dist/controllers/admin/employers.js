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
exports.EmployersController = void 0;
const employersService_1 = require("../../services/admin/employersService");
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
//Instantiates a Home services  
const employersService = new employersService_1.EmployersService();
class EmployersController {
    constructor() { }
    /**
    * get employer industry type list
    * @param req :[get data]
    * @param res : [data]
    */
    getIndustryTypeList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employersService.getIndustryTypeList(req.query);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.industry_list);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * add edit employer
    * @param req :[Body data]
    * @param res : [employers data object]
    */
    addEditEmployers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employersService.addEditEmployers(req.body, req.user);
                if (responseFromService) {
                    return appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
                }
                else {
                    appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
                }
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * get employer list
    * @param req :[get data]
    * @param res : [employers data]
    */
    getEmployersList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employersService.getEmployersList(req.query);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employers_list);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * change employer status
    * @param req :[get data]
    * @param res : [employers data]
    */
    changeEmployerStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield employersService.changeEmployerStatus(req.query);
                return appUtils.successResponse(res, {}, constants.MESSAGES.status_updated);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * get dashboard analytics
    * @param req :[get data]
    * @param res : [employers employees count]
    */
    dashboardAnalytics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseObject = yield employersService.dashboardAnalytics(req.user);
                return appUtils.successResponse(res, responseObject, constants.MESSAGES.dashboardAnalyticsCount);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
   * get employee list
   * @param req :[get data]
   * @param res : [employee data]
   */
    getEmployeeList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employersService.getEmployeeList(req.query);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employee_list);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
}
exports.EmployersController = EmployersController;
//# sourceMappingURL=employers.js.map