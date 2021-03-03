import express from "express";
import * as adminSchema from '../apiSchema/adminSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";

import * as AdminController from "../controllers/admin/index";
import * as multer from '../middleware/multerParser';
import * as validators from "../middleware/validators";

const adminRoute = express.Router();

const loginController = new AdminController.LoginController();
const employersController = new AdminController.EmployersController();


/* add new admin route for admin */
adminRoute.post("/addNewAdmin", validators.trimmer, joiSchemaValidation.validateBody(adminSchema.addNewAdmin), loginController.addNewAdmin);

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

/* add coach */
adminRoute.post("/addEditCoach",joiSchemaValidation.validateBody(adminSchema.addEditCoach), tokenValidator.validateAdminToken, employersController.addEditCoach);

/* get coach list */
adminRoute.get("/getCoachList", tokenValidator.validateAdminToken, employersController.getCoachList);


export = adminRoute;