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
    /**
    * update energy of the employee
    * @param req :[]
    * @param res
    */
    updateEnergyCheck(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.updateEnergyCheck(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
   * view energy of the team members
   * @param req :[]
   * @param res
   */
    viewEnergyCheckTeamMembers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.viewEnergyCheckTeamMembers(req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * feel about job today
    * @param req :[]
    * @param res
    */
    feelAboutJobToday(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.feelAboutJobToday(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * update device token
    * @param req :[]
    * @param res
    */
    updateEmployeeDeviceToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.updateEmployeeDeviceToken(req.body, req.user);
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
    clearEmployeeDeviceToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.clearEmployeeDeviceToken(req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * get current manager
    * @param req :[]
    * @param res
    */
    getCurrentManager(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.getCurrentManager(req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * get employee details to show employee detail on dashbord as team member view
    * @param req :[]
    * @param res
    */
    getEmployeeDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.getEmployeeDetails(req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * view energy of employee on dashbord as team member view
    * @param req :[]
    * @param res
    */
    viewEmployeeEnergy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.viewEmployeeEnergy(req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * to view thought of the day employee on dashbord as team member view
    * @param req :[]
    * @param res
    */
    viewThoughtOfTheDay(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.viewThoughtOfTheDay(req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * to view feel About Job Today on dashbord as team member view
    * @param req :[]
    * @param res
    */
    viewFeelAboutJobToday(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.viewFeelAboutJobToday(req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
   * to view thought of the day from admin on dashbord as team member view
   * @param req :[]
   * @param res
   */
    viewThoughtOfTheDayFromAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.viewThoughtOfTheDayFromAdmin(req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
   * to get coach list
   * @param req :[]
   * @param res
   */
    getCoachList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.getCoachList(req.user, req.query);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.getSlots(req.query);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.getSlot(req.query);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    createSessionRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.createSessionRequest(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getSessions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.getSessions(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    cancelSession(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.cancelSession(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    listSessionHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.listSessionHistory(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getSessionHistoryDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.getSessionHistoryDetails(req.params);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    rateCoachSession(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.rateCoachSession(req.body);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
   * to contact admin
   * @param req :[]
   * @param res
   */
    contactUs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.contactUs(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
  * to get notifiaction
  * @param req :[]
  * @param res
  */
    getNotifications(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.getNotifications(req.params, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
*  to get unseen notification count
* @param req :[]
* @param res
*/
    getUnseenNotificationCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.getUnseenNotificationCount(req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
 * to mark as viewed notification
 * @param req :[]
 * @param res
 */
    markNotificationsAsViewed(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.markNotificationsAsViewed(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
* to refer Friend
* @param req :[]
* @param res
*/
    referFriend(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.referFriend(req.body);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
* to feedback
* @param req :[]
* @param res
*/
    feedback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.feedback(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
* list library video
* @param req :[body data]
* @param res : [library data object]
*/
    listVideo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.listVideo(req.query);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
  * get Employee CV
  * @param req :[body data]
  * @param res : [data object]
  */
    shareEmployeeCV(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.shareEmployeeCV(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
  * get Employee CV
  * @param req :[body data]
  * @param res : [data object]
  */
    getEmployeeCV(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.getEmployeeCV(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
  * get Goal Submit Reminders
  * @param req :[body data]
  * @param res : [data object]
  */
    getGoalSubmitReminders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employeeServices.getGoalSubmitReminders(req.params, req.user);
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