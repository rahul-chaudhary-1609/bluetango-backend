import express from "express";
import * as employeeSchema from '../apiSchema/employeeSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";
import * as validators from "../middleware/validators";

import { AuthController } from "../controllers/employee/authController";

const employeeRoute = express.Router();

const authController = new AuthController();

/* login route for employee login */
employeeRoute.post("/login",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.login), authController.login);

/* forget pass route for employee */
employeeRoute.post("/forgotPassword",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.forgotPassword), authController.forgotPassword);

/* reset pass route for employee */
employeeRoute.post("/resetPassword",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.resetPassword), tokenValidator.validateForgotPasswordToken, authController.resetPassword);

/* get my profile route for employee */
employeeRoute.get("/getMyProfile", validators.trimmer, tokenValidator.validateEmployeeToken, authController.getMyProfile);

/* update profile route for employee */
employeeRoute.post("/updateProfile", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.updateProfile), authController.updateProfile);


export = employeeRoute;