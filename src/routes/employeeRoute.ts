import express from "express";
import * as employeeSchema from '../apiSchema/employeeSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as adminTokenValidator from "../middleware/adminTokenValidator";

import { AuthController } from "../controllers/employee/authController";

const employeeRoute = express.Router();

const authController = new AuthController();

/* login route for employee login */
employeeRoute.post("/login", joiSchemaValidation.validateBody(employeeSchema.login), authController.login);

/* forget pass route for employee */
employeeRoute.post("/forgotPassword", joiSchemaValidation.validateBody(employeeSchema.forgotPassword), authController.forgotPassword);

/* reset pass route for employee */
employeeRoute.post("/resetPassword", joiSchemaValidation.validateBody(employeeSchema.resetPassword), adminTokenValidator.validateForgotPasswordToken, authController.resetPassword);


export = employeeRoute;