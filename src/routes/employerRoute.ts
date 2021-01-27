import express from "express";
import * as employerSchema from '../apiSchema/employerSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";
import * as validators from "../middleware/validators";

import * as EmployerController from "../controllers/employer";

const employerRoute = express.Router();

const authController = new EmployerController.AuthController();

/* login route for employer login */
employerRoute.post("/login",validators.trimmer, joiSchemaValidation.validateBody(employerSchema.login), authController.login);

export = employerRoute;