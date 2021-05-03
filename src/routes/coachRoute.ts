import express from "express";
import * as employeeSchema from '../apiSchema/employeeSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";
import * as validators from "../middleware/validators";

import { AuthController } from "../controllers/coach/authController";


const coachRoute = express.Router();

const authController = new AuthController();


// auth API
/* login route for employee login */
coachRoute.post("/login", validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.login), authController.login);


export = coachRoute;