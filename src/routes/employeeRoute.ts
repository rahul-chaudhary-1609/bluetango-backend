import express from "express";
import * as employeeSchema from '../apiSchema/employeeSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";
import * as validators from "../middleware/validators";
import { upload } from "../middleware/multerParser";

import { AuthController } from "../controllers/employee/authController";
import { EmployeeController } from "../controllers/employee/employeeController";
import { GoalController } from "../controllers/employee/goalController";
import { QualitativeMeasurementController } from "../controllers/employee/qualitativeMeasurementController";

const employeeRoute = express.Router();

const authController = new AuthController();
const employeeController = new EmployeeController();
const goalController = new GoalController();
const qualitativeMeasurementController  = new QualitativeMeasurementController();

// auth API
/* login route for employee login */
employeeRoute.post("/login",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.login), authController.login);

/* forget pass route for employee */
employeeRoute.post("/forgotPassword",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.forgotPassword), authController.forgotPassword);

/* reset pass route for all */
employeeRoute.post("/resetPassword",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.resetPassword), tokenValidator.validateForgotPasswordToken, authController.resetPassword);

/* change pass route for employee */
employeeRoute.post("/changePassword",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.changePassword), tokenValidator.validateEmployeeToken, authController.changePassword);

/* reset pass route for employee */
employeeRoute.post("/employeeResetPassword",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.resetPassword), tokenValidator.validateEmployeeToken, authController.employeeResetPassword);

/* get my profile route for employee */
employeeRoute.get("/getMyProfile", validators.trimmer, tokenValidator.validateEmployeeToken, authController.getMyProfile);

/* update profile route for employee */
employeeRoute.post("/updateProfile", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.updateProfile), authController.updateProfile);

/* upload file route for employee */
employeeRoute.post("/uploadFile", tokenValidator.validateEmployeeToken, upload.single('file'), authController.uploadFile);


// employee API
/* get my profile route for employee */
employeeRoute.get("/getListOfTeamMemberByManagerId", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.limitOffsetValidate), employeeController.getListOfTeamMemberByManagerId);

/* view details route for employee */
employeeRoute.get("/viewDetailsEmployee", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.viewDetailsEmployee), employeeController.viewDetailsEmployee);

/* search team meber for manager */
employeeRoute.get("/searchTeamMember", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.searchTeamMember), employeeController.searchTeamMember);

/* add goal for manager */
employeeRoute.post("/addGoal", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.addGoal), goalController.addGoal);

/* edit goal for manager */
employeeRoute.post("/editGoal", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.editGoal), goalController.editGoal);

/* view goal for manager */
employeeRoute.get("/viewGoalAsManager", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.viewGoalAsManager), goalController.viewGoalAsManager);

/* view goal details for manager */
employeeRoute.get("/viewGoalDetailsAsManager", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.viewGoalDetailsAsManager), goalController.viewGoalDetailsAsManager);

/* delete goal for manager */
employeeRoute.delete("/deleteGoal", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.viewDetailsEmployee), goalController.deleteGoal);

/* get goal request for manager */
employeeRoute.get("/getGoalCompletedRequestAsManager", validators.trimmer, tokenValidator.validateEmployeeToken, goalController.getGoalCompletedRequestAsManager);

/* get goal request for manager */
employeeRoute.post("/goalAcceptRejectAsManager", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.goalAcceptRejectAsManager), goalController.goalAcceptRejectAsManager);

/* submit goal for employee */
employeeRoute.post("/submitGoalAsEmployee", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.submitGoalAsEmployee), goalController.submitGoalAsEmployee);

/* view goal for employee */
employeeRoute.get("/viewGoalAsEmployee", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.limitOffsetValidate), goalController.viewGoalAsEmployee);

/* add thought of the day */
employeeRoute.post("/thoughtOfTheDay", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.thoughtOfTheDay), employeeController.thoughtOfTheDay);

/* view goal for employee */
employeeRoute.get("/getEmoji", tokenValidator.validateEmployeeToken, employeeController.getEmoji);

/* update energy of the employee */
employeeRoute.post("/updateEnergyCheck", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.updateEnergyCheck), employeeController.updateEnergyCheck);

/* View energy check of the team member */
employeeRoute.get("/viewEnergyCheckTeamMembers", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.viewEnergyCheckTeamMembers);

/* feel about job today */
employeeRoute.post("/feelAboutJobToday", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.feelAboutJobToday), employeeController.feelAboutJobToday);




// QualitativeMeasurement routes

/* add qualitative measurement for employee */
employeeRoute.post("/addQualitativeMeasurement", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.addQualitativeMeasurement), qualitativeMeasurementController.addQualitativeMeasurement);

/* get qualitative measurement for employee */
employeeRoute.get("/getQualitativeMeasurement", validators.trimmer, tokenValidator.validateEmployeeToken,joiSchemaValidation.validateQueryParams(employeeSchema.getQualitativeMeasurement), qualitativeMeasurementController.getQualitativeMeasurement);

/* get qualitative measurement comment for employee */
employeeRoute.get("/getQuantitativeMeasurementCommentList", validators.trimmer, tokenValidator.validateEmployeeToken, qualitativeMeasurementController.getQuantitativeMeasurementCommentList);


export = employeeRoute;