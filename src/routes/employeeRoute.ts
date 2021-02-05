import express from "express";
import * as employeeSchema from '../apiSchema/employeeSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";
import * as validators from "../middleware/validators";
import { upload } from "../middleware/multerParser";

import { AuthController } from "../controllers/employee/authController";
import { EmployeeController } from "../controllers/employee/employeeController";
import { GoalController } from "../controllers/employee/goalController";

const employeeRoute = express.Router();

const authController = new AuthController();
const employeeController = new EmployeeController();
const goalController = new GoalController();

/* login route for employee login */
employeeRoute.post("/login",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.login), authController.login);

/* forget pass route for employee */
employeeRoute.post("/forgotPassword",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.forgotPassword), authController.forgotPassword);

/* reset pass route for all */
employeeRoute.post("/resetPassword",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.resetPassword), tokenValidator.validateForgotPasswordToken, authController.resetPassword);

/* reset pass route for employee */
employeeRoute.post("/employeeResetPassword",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.resetPassword), tokenValidator.validateEmployeeToken, authController.employeeResetPassword);

/* get my profile route for employee */
employeeRoute.get("/getMyProfile", validators.trimmer, tokenValidator.validateEmployeeToken, authController.getMyProfile);

/* update profile route for employee */
employeeRoute.post("/updateProfile", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.updateProfile), authController.updateProfile);

/* upload file route for employee */
employeeRoute.post("/uploadFile", tokenValidator.validateEmployeeToken, upload.single('file'), authController.uploadFile);

/* get my profile route for employee */
employeeRoute.get("/getListOfTeamMemberByManagerId", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getListOfTeamMemberByManagerId), employeeController.getListOfTeamMemberByManagerId);

/* view details route for employee */
employeeRoute.get("/viewDetailsEmployee", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.viewDetailsEmployee), employeeController.viewDetailsEmployee);

/* search team meber for manager */
employeeRoute.get("/searchTeamMember", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.searchTeamMember), employeeController.searchTeamMember);

/* add goal for manager */
employeeRoute.post("/addGoal", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.addGoal), goalController.addGoal);

/* edit goal for manager */
employeeRoute.post("/editGoal", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.editGoal), goalController.editGoal);

/* view goal for manager */
employeeRoute.get("/viewGoal", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.getListOfTeamMemberByManagerId), goalController.viewGoal);

/* delete goal for manager */
employeeRoute.delete("/deleteGoal", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.viewDetailsEmployee), goalController.deleteGoal);

export = employeeRoute;