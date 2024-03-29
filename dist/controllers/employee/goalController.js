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
exports.GoalController = void 0;
const goalServices_1 = require("../../services/employee/goalServices");
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
//Instantiates a Home services  
const goalServices = new goalServices_1.GoalServices();
class GoalController {
    constructor() { }
    /**
    * add goal
    * @param req :[]
    * @param res
    */
    addGoal(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // req.body.goal_details = JSON.parse(req.body.goal_details);
                const responseFromService = yield goalServices.addGoal(req.body.goal_details, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * edit goal
    * @param req :[]
    * @param res
    */
    editGoal(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.employee_ids = JSON.parse(req.body.employee_ids);
                const responseFromService = yield goalServices.editGoal(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * view goal as manager
    * @param req :[]
    * @param res
    */
    viewGoalAsManager(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield goalServices.viewGoalAsManager(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * view goal details as manager
    * @param req :[]
    * @param res
    */
    viewGoalDetailsAsManager(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield goalServices.viewGoalDetailsAsManager(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
* view goal details as manager
* @param req :[]
* @param res
*/
    viewGoalAssignCompletionAsManager(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield goalServices.viewGoalAssignCompletionAsManager(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
   * get goal request as manager
   * @param req :[]
   * @param res
   */
    getGoalCompletedRequestAsManager(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield goalServices.getGoalCompletedRequestAsManager(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
   * goal accept reject as manager
   * @param req :[]
   * @param res
   */
    goalAcceptRejectAsManager(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield goalServices.goalAcceptRejectAsManager(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
   * view goal as employee
   * @param req :[]
   * @param res
   */
    viewGoalAsEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield goalServices.viewGoalAsEmployee(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
   * delete goal
   * @param req :[]
   * @param res
   */
    deleteGoal(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield goalServices.deleteGoal(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * submitGoalAsEmployee
    * @param req :[]
    * @param res
    */
    submitGoalAsEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield goalServices.submitGoalAsEmployee(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * get Quantitative Stats of goals
    * @param req :[]
    * @param res
    */
    getQuantitativeStatsOfGoals(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield goalServices.getQuantitativeStatsOfGoals(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * get Quantitative Stats of goals as manager
    * @param req :[]
    * @param res
    */
    getQuantitativeStatsOfGoalsAsManager(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield goalServices.getQuantitativeStatsOfGoalsAsManager(req.params, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * view goal details as employee
    * @param req :[]
    * @param res
    */
    viewGoalDetailsAsEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield goalServices.viewGoalDetailsAsEmployee(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
   * get Goal Completion Average As Manager
   * @param req :[]
   * @param res
   */
    getGoalCompletionAverageAsManager(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield goalServices.getGoalCompletionAverageAsManager(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
 * toggle Goal As Primary
 * @param req :[body data]
 * @param res : [data object]
 */
    toggleGoalAsPrimary(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield goalServices.toggleGoalAsPrimary(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
* mark Goal As Primary
* @param req :[body data]
* @param res : [data object]
*/
    markGoalsAsPrimary(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield goalServices.markGoalsAsPrimary(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.GoalController = GoalController;
//# sourceMappingURL=goalController.js.map