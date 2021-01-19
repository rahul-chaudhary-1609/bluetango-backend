import express from "express";
import * as adminSchema from '../apiSchema/adminSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as adminTokenValidator from "../middleware/adminTokenValidator";

import { AuthController } from "../controllers/employee/authController";

const employeeRoute = express.Router();

const authController = new AuthController();

/* login route for employee login */
employeeRoute.post("/login", joiSchemaValidation.validateBody(adminSchema.login), authController.login);



export = employeeRoute;