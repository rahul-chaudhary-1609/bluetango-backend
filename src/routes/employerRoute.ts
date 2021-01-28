import express from "express";
import * as employerSchema from '../apiSchema/employerSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";
import * as validators from "../middleware/validators";

import * as EmployerController from "../controllers/employer";

const employerRoute = express.Router();

const authController = new EmployerController.AuthController();
const managementController = new EmployerController.EmployeeController();

/* login route for employer login */
employerRoute.post("/login",validators.trimmer, joiSchemaValidation.validateBody(employerSchema.login), authController.login);

/* add or edit employers route for employers */
employerRoute.post("/addEditEmployee", joiSchemaValidation.validateBody(employerSchema.addEditEmployee), tokenValidator.validateEmployerToken, managementController.addEditEmployee);

/* get employers list route for employers */
employerRoute.get("/getEmployeeList", joiSchemaValidation.validateQueryParams(employerSchema.getEmployeeList), tokenValidator.validateEmployerToken, managementController.getEmployeeList);

export = employerRoute;