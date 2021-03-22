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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const adminSchema = __importStar(require("../apiSchema/adminSchema"));
const joiSchemaValidation = __importStar(require("../middleware/joiSchemaValidation"));
const tokenValidator = __importStar(require("../middleware/tokenValidator"));
const AdminController = __importStar(require("../controllers/admin/index"));
const validators = __importStar(require("../middleware/validators"));
const multerParser_1 = require("../middleware/multerParser");
const adminRoute = express_1.default.Router();
const loginController = new AdminController.LoginController();
const employersController = new AdminController.EmployersController();
/* add subAdmin */
adminRoute.post("/addSubAdmin", validators.trimmer, joiSchemaValidation.validateBody(adminSchema.addNewAdmin), tokenValidator.validateAdminToken, loginController.addNewAdmin);
/* update subAdmin */
adminRoute.put("/editSubAdmin", validators.trimmer, tokenValidator.validateAdminToken, loginController.editSubAdmin);
/* get subAdmin list */
adminRoute.get("/subAdminList", tokenValidator.validateAdminToken, employersController.getSubAdminList);
/* get subAdmin details */
adminRoute.get("/subAdminDetails", tokenValidator.validateAdminToken, employersController.subAdminDetails);
/* login route for admin login */
adminRoute.post("/login", validators.trimmer, joiSchemaValidation.validateBody(adminSchema.login), loginController.login);
/* forget pass route for admin */
adminRoute.post("/forgotPassword", joiSchemaValidation.validateBody(adminSchema.forgetPassword), loginController.forgetPassword);
/* reset pass route for admin */
adminRoute.post("/resetPassword", joiSchemaValidation.validateBody(adminSchema.resetPassword), loginController.resetPassword);
/* change pass route for admin */
adminRoute.post("/changePassword", joiSchemaValidation.validateBody(adminSchema.changePassword), tokenValidator.validateAdminToken, loginController.changePassword);
/* logout route for admin logout */
adminRoute.get("/logout", tokenValidator.validateAdminToken, loginController.logout);
/* add or edit employers route for employers */
adminRoute.post("/addEditEmployers", joiSchemaValidation.validateBody(adminSchema.addEditEmployers), tokenValidator.validateAdminToken, employersController.addEditEmployers);
/* get employers list route for employers */
adminRoute.get("/getIndustryTypeList", tokenValidator.validateAdminToken, employersController.getIndustryTypeList);
/* get employers list route for employers */
adminRoute.get("/getEmployersList", joiSchemaValidation.validateQueryParams(adminSchema.getEmployersList), tokenValidator.validateAdminToken, employersController.getEmployersList);
/* change employer status activate/deactivate/delete */
adminRoute.put("/changeEmployerStatus", tokenValidator.validateAdminToken, employersController.changeEmployerStatus);
/*  get dashboard analytics */
adminRoute.get("/dashboardAnalytics", tokenValidator.validateAdminToken, employersController.dashboardAnalytics);
/* add thought of the day for employer */
adminRoute.get("/getEmployeeList", tokenValidator.validateAdminToken, employersController.getEmployeeList);
/* change employee status activate/deactivate/delete */
adminRoute.put("/changeEmployeeStatus", tokenValidator.validateAdminToken, employersController.changeEmployeeStatus);
/* edit employee details */
adminRoute.put("/editEmployeeDetails", tokenValidator.validateAdminToken, employersController.editEmployeeDetails);
/* add subscription plan */
adminRoute.post("/addSubscriptionPlan", joiSchemaValidation.validateBody(adminSchema.addSubscriptionPlan), tokenValidator.validateAdminToken, employersController.addSubscriptionPlan);
/* edit subscription plan */
adminRoute.put("/updateSubscriptionPlan", joiSchemaValidation.validateBody(adminSchema.updateSubscriptionPlan), tokenValidator.validateAdminToken, employersController.updateSubscriptionPlan);
/* view subscription plan */
adminRoute.get("/viewSubscriptionPlan", tokenValidator.validateAdminToken, employersController.viewSubscriptionPlan);
/* view payment list */
adminRoute.get("/viewPaymentList", tokenValidator.validateAdminToken, employersController.viewPaymentList);
/* view payment details */
adminRoute.get("/viewPaymentDetails", tokenValidator.validateAdminToken, employersController.viewPaymentDetails);
/* export csv */
adminRoute.get("/exportCsv", tokenValidator.validateAdminToken, employersController.exportCsv);
/* view employer details */
adminRoute.get("/employerDetails", tokenValidator.validateAdminToken, employersController.employerDetails);
/* add/edit coach */
adminRoute.post("/addEditCoach", joiSchemaValidation.validateBody(adminSchema.addEditCoach), tokenValidator.validateAdminToken, employersController.addEditCoach);
/* get coach list */
adminRoute.get("/getCoachList", tokenValidator.validateAdminToken, employersController.getCoachList);
/* get coach details */
adminRoute.get("/getCoachDetails", tokenValidator.validateAdminToken, employersController.getCoachDetails);
/* delete coach */
adminRoute.put("/deleteCoach", tokenValidator.validateAdminToken, employersController.deleteCoach);
/* view contact us list */
adminRoute.get("/getCotactUsList", tokenValidator.validateAdminToken, employersController.getCotactUsList);
/* view contact us list */
adminRoute.get("/getCotactUsDetails", tokenValidator.validateAdminToken, employersController.getCotactUsDetails);
/* send email and push notification */
adminRoute.post("/sendEmailAndNotification", tokenValidator.validateAdminToken, employersController.sendEmailAndNotification);
/* view employee details */
adminRoute.get("/employeeDetails", tokenValidator.validateAdminToken, employersController.employeeDetails);
/* view Department list */
adminRoute.get("/getDepartmentList", tokenValidator.validateAdminToken, employersController.getDepartmentList);
/* view subscription details */
adminRoute.get("/subscriptionDetails", tokenValidator.validateAdminToken, employersController.subscriptionDetails);
/* change subscription plan status activate/deactivate/delete */
adminRoute.put("/changeSubsPlanStatus", tokenValidator.validateAdminToken, employersController.changeSubsPlanStatus);
/* upload media files */
adminRoute.post("/uploadFile", tokenValidator.validateAdminToken, multerParser_1.upload.single('file'), employersController.uploadFile);
/* add new video into library */
adminRoute.post("/addVideo", tokenValidator.validateAdminToken, employersController.addVideo);
/* edit library management */
adminRoute.put("/editVideo", tokenValidator.validateAdminToken, employersController.editVideo);
/* list library management */
adminRoute.get("/listVideo", tokenValidator.validateAdminToken, employersController.listVideo);
/* library management details */
adminRoute.get("/detailsVideo", tokenValidator.validateAdminToken, employersController.detailsVideo);
module.exports = adminRoute;
//# sourceMappingURL=adminRoute.js.map