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
const employerSchema = __importStar(require("../apiSchema/employerSchema"));
const joiSchemaValidation = __importStar(require("../middleware/joiSchemaValidation"));
const tokenValidator = __importStar(require("../middleware/tokenValidator"));
const validators = __importStar(require("../middleware/validators"));
const multerParser_1 = require("../middleware/multerParser");
const EmployerController = __importStar(require("../controllers/employer"));
const employerRoute = express_1.default.Router();
const authController = new EmployerController.AuthController();
const managementController = new EmployerController.EmployeeController();
const employerController = new EmployerController.EmployerController();
const paymentController = new EmployerController.PaymentController();
/* login route for employer login */
employerRoute.post("/login", validators.trimmer, joiSchemaValidation.validateBody(employerSchema.login), authController.login);
/* forget pass route for employee */
employerRoute.post("/forgotPassword", validators.trimmer, joiSchemaValidation.validateBody(employerSchema.forgotPassword), authController.forgotPassword);
/* reset pass route for employer */
employerRoute.post("/resetPassword", validators.trimmer, joiSchemaValidation.validateBody(employerSchema.resetPassword), tokenValidator.validateEmployerToken, authController.resetPassword);
/* change pass route for employee */
employerRoute.post("/changePassword", validators.trimmer, joiSchemaValidation.validateBody(employerSchema.changePassword), tokenValidator.validateEmployerToken, authController.changePassword);
/* add or edit employers route for employers */
employerRoute.post("/addEditEmployee", joiSchemaValidation.validateBody(employerSchema.addEditEmployee), tokenValidator.validateEmployerToken, tokenValidator.checkEmployerHaveActivePlan, managementController.addEditEmployee);
/* get employers list route for employers */
employerRoute.get("/getManagerList", tokenValidator.validateEmployerToken, tokenValidator.checkEmployerHaveActivePlan, joiSchemaValidation.validateQueryParams(employerSchema.getManagerList), managementController.getManagerList);
/* get employers list route for employers */
employerRoute.get("/getDepartmentList", tokenValidator.validateEmployerToken, tokenValidator.checkEmployerHaveActivePlan, managementController.getDepartmentList);
/* get employers list route for employers */
employerRoute.get("/getEmployeeList", joiSchemaValidation.validateQueryParams(employerSchema.getEmployeeList), tokenValidator.validateEmployerToken, tokenValidator.checkEmployerHaveActivePlan, managementController.getEmployeeList);
/* update employer device token */
employerRoute.put("/updateEmployerDeviceToken", joiSchemaValidation.validateBody(employerSchema.updateEmployerDeviceToken), tokenValidator.validateEmployerToken, authController.updateEmployerDeviceToken);
/* clear employer device token */
employerRoute.put("/clearEmployerDeviceToken", tokenValidator.validateEmployerToken, authController.clearEmployerDeviceToken);
/* start Free Trial */
employerRoute.get("/startFreeTrial", tokenValidator.validateEmployerToken, employerController.startFreeTrial);
/* get Subscription Plan List */
employerRoute.get("/getSubscriptionPlanList", tokenValidator.validateEmployerToken, employerController.getSubscriptionPlanList);
/* buy Plan*/
employerRoute.post("/buyPlan", tokenValidator.validateEmployerToken, joiSchemaValidation.validateBody(employerSchema.buyPlan), employerController.buyPlan);
/* view Employee Details */
employerRoute.get("/viewEmployeeDetails/:employee_id", tokenValidator.validateEmployerToken, tokenValidator.checkEmployerHaveActivePlan, joiSchemaValidation.validateParams(employerSchema.viewEmployeeDetails), managementController.viewEmployeeDetails);
/* delete Employee */
employerRoute.delete("/deleteEmployee/:employee_id", tokenValidator.validateEmployerToken, tokenValidator.checkEmployerHaveActivePlan, joiSchemaValidation.validateParams(employerSchema.deleteEmployee), managementController.deleteEmployee);
/* update Employee manager */
employerRoute.put("/updateManager", tokenValidator.validateEmployerToken, tokenValidator.checkEmployerHaveActivePlan, joiSchemaValidation.validateBody(employerSchema.updateManager), managementController.updateManager);
/* route to get profile */
employerRoute.get("/getProfile", tokenValidator.validateEmployerToken, employerController.getProfile);
/* edit profile */
employerRoute.put("/editProfile", validators.trimmer, tokenValidator.validateEmployerToken, joiSchemaValidation.validateBody(employerSchema.editProfile), employerController.editProfile);
/* view Current Plan Details */
employerRoute.get("/mySubscription", validators.trimmer, tokenValidator.validateEmployerToken, employerController.mySubscription);
/* cancel Plan*/
employerRoute.post("/cancelPlan", tokenValidator.validateEmployerToken, joiSchemaValidation.validateBody(employerSchema.cancelPlan), employerController.cancelPlan);
/* view all payments */
employerRoute.get("/myPayments", validators.trimmer, tokenValidator.validateEmployerToken, employerController.myPayments);
/* contact us for employee */
employerRoute.post("/contactUs", validators.trimmer, tokenValidator.validateEmployerToken, joiSchemaValidation.validateBody(employerSchema.contactUs), employerController.contactUs);
/* contact us for employee */
employerRoute.get("/getNotifications", validators.trimmer, tokenValidator.validateEmployerToken, employerController.getNotifications);
/* to get unseen notification count */
employerRoute.get("/getUnseenNotificationCount", validators.trimmer, tokenValidator.validateEmployerToken, employerController.getUnseenNotificationCount);
/* payment */
employerRoute.post("/payment", tokenValidator.validateEmployerToken, paymentController.payment);
/* payment success */
employerRoute.get("/paymentSuccess", paymentController.paymentSuccess);
/* payment failed */
employerRoute.get("/paymentFailed", paymentController.paymentFailed);
/* payment */
employerRoute.get("/getBraintreeClientToken", tokenValidator.validateEmployerToken, paymentController.getBraintreeClientToken);
/* payment failed */
employerRoute.post("/uploadFile", tokenValidator.validateEmployerToken, multerParser_1.upload.single('file'), authController.uploadFile);
/* add Edit Attributes */
employerRoute.post("/addAttributes", tokenValidator.validateEmployerToken, joiSchemaValidation.validateBody(employerSchema.addAttributes), managementController.addAttributes);
/* get Attributes */
employerRoute.get("/getAttributes", tokenValidator.validateEmployerToken, managementController.getAttributes);
/* get Attribute details */
employerRoute.get("/getAttributeDetails/:attribute_id", tokenValidator.validateEmployerToken, joiSchemaValidation.validateParams(employerSchema.getAttributeDetails), managementController.getAttributeDetails);
/* delete Attribute */
employerRoute.delete("/deleteAttribute/:attribute_id", tokenValidator.validateEmployerToken, joiSchemaValidation.validateParams(employerSchema.deleteAttribute), managementController.deleteAttribute);
/* toggle Attribute Status */
employerRoute.put("/toggleAttributeStatus/:attribute_id", tokenValidator.validateEmployerToken, joiSchemaValidation.validateParams(employerSchema.toggleAttributeStatus), managementController.toggleAttributeStatus);
module.exports = employerRoute;
//# sourceMappingURL=employerRoute.js.map