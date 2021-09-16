import express from "express";
import * as adminSchema from '../apiSchema/adminSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";

import * as AdminController from "../controllers/admin/index";
import * as multer from '../middleware/multerParser';
import * as validators from "../middleware/validators";
import * as helperFunction from "../utils/helperFunction";
import { upload } from "../middleware/multerParser"

const adminRoute = express.Router();

const loginController = new AdminController.LoginController();
const employersController = new AdminController.EmployersController();
const coachController = new AdminController.CoachController();


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
adminRoute.post("/addEditCoach",joiSchemaValidation.validateBody(adminSchema.addEditCoach), tokenValidator.validateAdminToken, employersController.addEditCoach);

/* get coach list */
adminRoute.get("/getCoachList", tokenValidator.validateAdminToken,  employersController.getCoachList);

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
adminRoute.post("/uploadFile", tokenValidator.validateAdminToken, upload.single('file'), employersController.uploadFile);

/* add new video into library */
adminRoute.post("/addVideo", tokenValidator.validateAdminToken, employersController.addVideo);

/* edit library management */
adminRoute.put("/editVideo", tokenValidator.validateAdminToken, employersController.editVideo);

/* list library management */
adminRoute.get("/listVideo", tokenValidator.validateAdminToken, employersController.listVideo);

/* library management details */
adminRoute.get("/detailsVideo", tokenValidator.validateAdminToken, employersController.detailsVideo);

/* add new news/article */
adminRoute.post("/addArticle", tokenValidator.validateAdminToken, employersController.addArticle);

/* update news/article */
adminRoute.put("/updateArticle", tokenValidator.validateAdminToken, employersController.updateArticle);

/* edit library management */
adminRoute.put("/deleteArticle", tokenValidator.validateAdminToken, employersController.editArticle);

/* list library management */
adminRoute.get("/listArticle", tokenValidator.validateAdminToken, employersController.listArticle);

/* library management details */
adminRoute.get("/detailsArticle", tokenValidator.validateAdminToken, employersController.detailsArticle);

/* add new advisor */
adminRoute.post("/addAdvisor", tokenValidator.validateAdminToken, employersController.addAdvisor);

/* update advisor */
adminRoute.put("/updateAdvisor", tokenValidator.validateAdminToken, employersController.updateAdvisor);

/* list advisor */
adminRoute.get("/listAdvisor", tokenValidator.validateAdminToken, employersController.listAdvisor);

/* delete advisor */
adminRoute.put("/deleteAdvisor", tokenValidator.validateAdminToken, employersController.deleteAdvisor);

/* advisor details */
adminRoute.get("/detailsAdvisor", tokenValidator.validateAdminToken, employersController.detailsAdvisor);

/* list Feedback */
adminRoute.get("/listFeedback", joiSchemaValidation.validateQueryParams(adminSchema.listFeedback), tokenValidator.validateAdminToken, employersController.listFeedback);

/* get Feedback Details */
adminRoute.get("/getFeedbackDetails", joiSchemaValidation.validateQueryParams(adminSchema.getFeedbackDetails), tokenValidator.validateAdminToken, employersController.getFeedbackDetails);


//new coach API's

/* add new advisor */
adminRoute.post("/addEditCoachSpecializationCategories", tokenValidator.validateAdminToken,joiSchemaValidation.validateBody(adminSchema.addEditCoachSpecializationCategories), coachController.addEditCoachSpecializationCategories);


export = adminRoute;