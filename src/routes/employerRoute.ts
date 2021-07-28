import express from "express";
import * as employerSchema from '../apiSchema/employerSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";
import * as validators from "../middleware/validators";
import { upload } from "../middleware/multerParser";

import * as EmployerController from "../controllers/employer";

const employerRoute = express.Router();

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
employerRoute.post("/addEditEmployee", joiSchemaValidation.validateBody(employerSchema.addEditEmployee), tokenValidator.validateEmployerToken,tokenValidator.checkEmployerHaveActivePlan, managementController.addEditEmployee);

/* get employers list route for employers */
employerRoute.get("/getManagerList", tokenValidator.validateEmployerToken, tokenValidator.checkEmployerHaveActivePlan, joiSchemaValidation.validateQueryParams(employerSchema.getManagerList),  managementController.getManagerList);

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
employerRoute.get("/viewEmployeeDetails/:employee_id", tokenValidator.validateEmployerToken, tokenValidator.checkEmployerHaveActivePlan,joiSchemaValidation.validateParams(employerSchema.viewEmployeeDetails),  managementController.viewEmployeeDetails);


/* delete Employee */
employerRoute.delete("/deleteEmployee/:employee_id", tokenValidator.validateEmployerToken, tokenValidator.checkEmployerHaveActivePlan,joiSchemaValidation.validateParams(employerSchema.deleteEmployee), managementController.deleteEmployee);

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
employerRoute.post("/payment", tokenValidator.validateEmployerToken,  paymentController.payment);

/* payment success */
employerRoute.get("/paymentSuccess", paymentController.paymentSuccess);

/* payment failed */
employerRoute.get("/paymentFailed", paymentController.paymentFailed);

/* payment */
employerRoute.get("/getBraintreeClientToken", tokenValidator.validateEmployerToken, paymentController.getBraintreeClientToken);

/* payment failed */
employerRoute.post("/uploadFile", tokenValidator.validateEmployerToken, upload.single('file'), authController.uploadFile);



export = employerRoute;