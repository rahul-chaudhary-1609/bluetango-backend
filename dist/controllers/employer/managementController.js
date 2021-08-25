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
const employer_1 = require("../../services/employer");
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
//Instantiates a Home services  
const employeeService = new employer_1.EmployeeManagement();
class EmployeeController {
    constructor() { }
    /**
    * add edit employee
    * @param req :[Body data]
    * @param res : [employers data object]
    */
    addEditEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeService.addEditEmployee(req.body, req.user);
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
  * get manager list
  * @param req :[get data]
  * @param res : [employers data]
  */
    getManagerList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeService.getManagerList(req.query, req.user);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * get employee list
    * @param req :[get data]
    * @param res : [employers data]
    */
    getEmployeeList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeService.getEmployeeList(req.query, req.user);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employers_list);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
   * get department list
   * @param req :[get data]
   * @param res : [employers data]
   */
    getDepartmentList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeService.getDepartmentList();
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * view Employee Details
    * @param req :[get data]
    * @param res : [employee data]
    */
    viewEmployeeDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeService.viewEmployeeDetails(req.params, req.user);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * delete employee
    * @param req :[get data]
    * @param res : [employee data]
    */
    deleteEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeService.deleteEmployee(req.params, req.user);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employee_deleted);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * delete employee
    * @param req :[get data]
    * @param res : [employee data]
    */
    updateManager(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeService.updateManager(req.body, req.user);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employee_deleted);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * add Edit Attributes
    * @param req :[get data]
    * @param res : [employee data]
    */
    addEditAttributes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeService.addEditAttributes(req.body, req.user);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * get Attributes
    * @param req :[get data]
    * @param res : [employee data]
    */
    getAttributes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeService.getAttributes(req.user);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * get Attribute Details
    * @param req :[get data]
    * @param res : [employee data]
    */
    getAttributeDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeService.getAttributeDetails(req.params, req.user);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * delete Attribute
    * @param req :[get data]
    * @param res : [employee data]
    */
    deleteAttribute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeService.deleteAttribute(req.params, req.user);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * toggle Attribute Status
    * @param req :[get data]
    * @param res : [employee data]
    */
    toggleAttributeStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeService.toggleAttributeStatus(req.params, req.user);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
}
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=managementController.js.map