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
exports.CoachController = void 0;
const coachService_1 = require("../../services/admin/coachService");
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
//Instantiates a Home services  
const coachService = new coachService_1.CoachService();
class CoachController {
    constructor() { }
    addEditCoachSpecializationCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.addEditCoachSpecializationCategories(req.body);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    listCoachSpecializationCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.listCoachSpecializationCategories(req.query);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    getCoachSpecializationCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.getCoachSpecializationCategory(req.query);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    deleteCoachSpecializationCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.deleteCoachSpecializationCategory(req.body);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.delete_success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    addEditEmployeeRank(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.addEditEmployeeRank(req.body);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    listEmployeeRanks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.listEmployeeRanks(req.query);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    getEmployeeRank(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.getEmployeeRank(req.query);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    deleteEmployeeRank(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.deleteEmployeeRank(req.body);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.delete_success);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
}
exports.CoachController = CoachController;
//# sourceMappingURL=coach.js.map