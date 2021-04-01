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
const multerParser_1 = require("../../middleware/multerParser");
const json2csv = require('json2csv').parse;
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
                    return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employer_add_update);
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
                req.query.admin_id = req.user.uid;
                const responseObject = yield employersService.dashboardAnalytics(req.query);
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
                req.query.admin_id = req.user.uid;
                const responseFromService = yield employersService.getEmployeeList(req.query);
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employee_list);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
       * change employee status
       * @param req :[get data]
       * @param res : [employere data]
       */
    changeEmployeeStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield employersService.changeEmployeeStatus(req.query);
                return appUtils.successResponse(res, {}, constants.MESSAGES.status_updated);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
       * change employee status
       * @param req :[get data]
       * @param res : [employere data]
       */
    editEmployeeDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateEmployee = yield employersService.editEmployeeDetails(req.body);
                return appUtils.successResponse(res, updateEmployee[1][0], constants.MESSAGES.employee_update);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
       * add subscription plan
       * @param req :[subscription plan details]
       * @param res : [subscription plans]
       */
    addSubscriptionPlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptionPlan = yield employersService.addSubscriptionPlan(req.body);
                return appUtils.successResponse(res, subscriptionPlan, constants.MESSAGES.subscription_plan_add);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
       * update subscription plan
       * @param req :[subscription plan details]
       * @param res : [subscription plans]
       */
    updateSubscriptionPlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptionPlan = yield employersService.updateSubscriptionPlan(req.body);
                return appUtils.successResponse(res, subscriptionPlan, constants.MESSAGES.subscription_plan_update);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
       * view subscription plan
       * @param req :[]
       * @param res : [subscription plans]
       */
    viewSubscriptionPlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptionPlan = yield employersService.viewSubscriptionPlan(req.query);
                return appUtils.successResponse(res, subscriptionPlan, constants.MESSAGES.subscription_plan_fetch);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
       * view payment list
       * @param req :[]
       * @param res : [payment list]
       */
    viewPaymentList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const paymentList = yield employersService.viewPaymentList(req.query);
                return appUtils.successResponse(res, paymentList, constants.MESSAGES.payment_list_fetch);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
       * view payment details
       * @param req :[]
       * @param res : [payment list]
       */
    viewPaymentDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const paymentDetails = yield employersService.viewPaymentDetails(req.query);
                return appUtils.successResponse(res, paymentDetails, constants.MESSAGES.payment_detail_fetch);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
       * export csv for payment list
       * @param req :[]
       * @param res : [csv file]
       */
    exportCsv(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const result = yield employersService.exportCsv(req.query);
                // let result = await employersService.exportCsv(req.query);
                // const csvString = json2csv(result)
                // res.setHeader('Content-disposition', 'attachment; filename=paymentList.csv');
                // res.set('Content-Type', 'text/csv');
                // res.status(200).send(csvString);
                //return res.csv("paymenrList.csv",results)
                return appUtils.successResponse(res, result, constants.MESSAGES.json_format_csv);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * employer detail employee
    * @param req :[Body data]
    * @param res : [employers data object]
    */
    employerDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const employer = yield employersService.employerDetails(req.query);
                if (employer) {
                    return appUtils.successResponse(res, employer, constants.MESSAGES.employer_details_fetched);
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
* add edit coach
* @param req :[Body data]
* @param res : [coach data object]
*/
    addEditCoach(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield employersService.addEditCoach(req.body, req.user);
                if (responseFromService) {
                    return appUtils.successResponse(res, responseFromService, constants.MESSAGES.coach_add_update);
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
   * get coach list
   * @param req :[query params]
   * @param res : [coach list]
   */
    getCoachList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('req - - - ', req.permissions)
                // if (req.permissions.includes('coach') || req.user.user_role == constants.USER_ROLE.super_admin) {
                req.query.admin_id = req.user.uid;
                const coach = yield employersService.getCoachList(req.query);
                if (coach) {
                    return appUtils.successResponse(res, coach, constants.MESSAGES.coach_list_fetched);
                }
                else {
                    appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
                }
                // } else {
                //     throw new Error("You don't have permission to access this module")
                // }
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
  * get coach details
  * @param req :[query params]
  * @param res : [coach list]
  */
    getCoachDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const coach = yield employersService.getCoachDetails(req.query);
                if (coach) {
                    return appUtils.successResponse(res, coach, constants.MESSAGES.coach_details_fetched);
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
  * delete coach
  * @param req :[query params]
  * @param res : [coach list]
  */
    deleteCoach(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const coach = yield employersService.deleteCoach(req.query);
                if (coach) {
                    return appUtils.successResponse(res, {}, constants.MESSAGES.coach_deleted);
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
  * get contactus list
  * @param req :[query params]
  * @param res : [contactus list]
  */
    getCotactUsList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const contactUS = yield employersService.getCotactUsList(req.query);
                if (contactUS) {
                    return appUtils.successResponse(res, contactUS, constants.MESSAGES.contact_list_fetched);
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
  * get contactus details
  * @param req :[query params]
  * @param res : [contactus list]
  */
    getCotactUsDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const contactUS = yield employersService.getCotactUsDetails(req.query);
                if (contactUS) {
                    return appUtils.successResponse(res, contactUS, constants.MESSAGES.contact_details_fetched);
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
 * send email and push notification
 * @param req :[query params]
 * @param res : [contactus list]
 */
    sendEmailAndNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.admin_id = req.user.uid;
                const email_notification = yield employersService.sendEmailAndNotification(req.body);
                //if (email_notification) {
                return appUtils.successResponse(res, {}, constants.MESSAGES.email_notification_sent);
                //} else {
                //  appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
                // }
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    /**
    * employer detail employee
    * @param req :[Body data]
    * @param res : [employers data object]
    */
    employeeDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const employer = yield employersService.employeeDetails(req.query);
                if (employer) {
                    return appUtils.successResponse(res, employer, constants.MESSAGES.employee_details_fetched);
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
    * department list
    * @param req :[Body data]
    * @param res : [department data object]
    */
    getDepartmentList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const department = yield employersService.getDepartmentList(req.query);
                if (department) {
                    return appUtils.successResponse(res, department, constants.MESSAGES.department_list_fetched);
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
    * subscription detail api
    * @param req :[Body data]
    * @param res : [subscription data object]
    */
    subscriptionDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const employer = yield employersService.subscriptionDetails(req.query);
                if (employer) {
                    return appUtils.successResponse(res, employer, constants.MESSAGES.employee_details_fetched);
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
   * change subscription status api
   * @param req :[query data]
   * @param res : [subscription data object]
   */
    changeSubsPlanStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const subscription = yield employersService.changeSubsPlanStatus(req.query);
                if (subscription) {
                    return appUtils.successResponse(res, subscription, constants.MESSAGES.subscription_status_updated);
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
   * get subscription list api
   * @param req :[query data]
   * @param res : [subAdmin data object]
   */
    getSubAdminList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const subAdmin = yield employersService.getSubAdminList(req.query);
                if (subAdmin) {
                    return appUtils.successResponse(res, subAdmin, constants.MESSAGES.subAdmin_fetched);
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
   * get subscription details api
   * @param req :[query data]
   * @param res : [subAdmin data object]
   */
    subAdminDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const subAdmin = yield employersService.subAdminDetails(req.query);
                if (subAdmin) {
                    return appUtils.successResponse(res, subAdmin, constants.MESSAGES.subAdmin_details_fetched);
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
    * update profile
    * @param req :[]
    * @param res
    */
    uploadFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let folderName = "admin_video_files";
                const responseFromService = yield employersService.uploadFile(req.file, folderName);
                yield multerParser_1.deleteFile(req.file.filename);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
  * add new video into library
  * @param req :[body data]
  * @param res : [library data object]
  */
    addVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.admin_id = req.user.uid;
                const libraryVideo = yield employersService.addVideo(req.body);
                if (libraryVideo) {
                    return appUtils.successResponse(res, libraryVideo, constants.MESSAGES.library_video_added);
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
  * edit video into library
  * @param req :[body data]
  * @param res : [library data object]
  */
    editVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.admin_id = req.user.uid;
                const libraryVideo = yield employersService.editVideo(req.body);
                if (libraryVideo) {
                    return appUtils.successResponse(res, libraryVideo, constants.MESSAGES.library_video_updated);
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
  * list library video
  * @param req :[body data]
  * @param res : [library data object]
  */
    listVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const libraryVideo = yield employersService.listVideo(req.query);
                if (libraryVideo) {
                    return appUtils.successResponse(res, libraryVideo, constants.MESSAGES.library_video_fetched);
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
  * list library video
  * @param req :[body data]
  * @param res : [library data object]
  */
    detailsVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const libraryVideo = yield employersService.detailsVideo(req.query);
                if (libraryVideo) {
                    return appUtils.successResponse(res, libraryVideo, constants.MESSAGES.library_video_fetched);
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
 * add new video into library
 * @param req :[body data]
 * @param res : [library data object]
 */
    addArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.admin_id = req.user.uid;
                const article = yield employersService.addArticle(req.body);
                if (article) {
                    return appUtils.successResponse(res, article, constants.MESSAGES.article_added);
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
 * update news/article
 * @param req :[body data]
 * @param res : [library data object]
 */
    updateArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.admin_id = req.user.uid;
                const article = yield employersService.updateArticle(req.body);
                if (article) {
                    return appUtils.successResponse(res, article, constants.MESSAGES.article_updated);
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
    * edit video into library
    * @param req :[body data]
    * @param res : [library data object]
    */
    editArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.admin_id = req.user.uid;
                const article = yield employersService.editArticle(req.body);
                if (article) {
                    return appUtils.successResponse(res, article, constants.MESSAGES.article_updated);
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
    * list library video
    * @param req :[body data]
    * @param res : [library data object]
    */
    listArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const article = yield employersService.listArticle(req.query);
                if (article) {
                    return appUtils.successResponse(res, article, constants.MESSAGES.article_fetched);
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
    * list library video
    * @param req :[body data]
    * @param res : [library data object]
    */
    detailsArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const article = yield employersService.detailsArticle(req.query);
                if (article) {
                    return appUtils.successResponse(res, article, constants.MESSAGES.article_details_fetched);
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
  * add new video into library
  * @param req :[body data]
  * @param res : [library data object]
  */
    addAdvisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.admin_id = req.user.uid;
                const advisor = yield employersService.addAdvisor(req.body);
                if (advisor) {
                    return appUtils.successResponse(res, advisor, constants.MESSAGES.advisor_added);
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
 * update news/article
 * @param req :[body data]
 * @param res : [library data object]
 */
    updateAdvisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.admin_id = req.user.uid;
                const advisor = yield employersService.updateAdvisor(req.body);
                if (advisor) {
                    return appUtils.successResponse(res, advisor, constants.MESSAGES.advisor_updated);
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
    * list library video
    * @param req :[body data]
    * @param res : [library data object]
    */
    listAdvisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const advisor = yield employersService.listAdvisor(req.query);
                if (advisor) {
                    return appUtils.successResponse(res, advisor, constants.MESSAGES.advisor_fetched);
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
   * edit video into library
   * @param req :[body data]
   * @param res : [library data object]
   */
    deleteAdvisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.admin_id = req.user.uid;
                const article = yield employersService.deleteAdvisor(req.body);
                if (article) {
                    return appUtils.successResponse(res, article, constants.MESSAGES.advisor_updated);
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
    * details advisor video
    * @param req :[body data]
    * @param res : [library data object]
    */
    detailsAdvisor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query.admin_id = req.user.uid;
                const advisor = yield employersService.detailsAdvisor(req.query);
                if (advisor) {
                    return appUtils.successResponse(res, advisor, constants.MESSAGES.advisor_details_fetched);
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
}
exports.EmployersController = EmployersController;
//# sourceMappingURL=employers.js.map