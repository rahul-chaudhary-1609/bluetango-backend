import express from "express";
import * as coachSchema from '../apiSchema/coachSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";
import * as validators from "../middleware/validators";

import { AuthController } from "../controllers/coach/authController";


const coachRoute = express.Router();

const authController = new AuthController();


// auth API
/* login route for employee login */
coachRoute.post("/login", validators.trimmer, joiSchemaValidation.validateBody(coachSchema.login), authController.login);

/* reset pass route for all */
coachRoute.post("/resetPassword", validators.trimmer, joiSchemaValidation.validateBody(coachSchema.resetPassword), tokenValidator.validateCoachToken, authController.resetPassword);

/* forget pass route for employee */
coachRoute.post("/forgotPassword", validators.trimmer, joiSchemaValidation.validateBody(coachSchema.forgotPassword), authController.forgotPassword);

/* forget pass route for employee */
coachRoute.get("/getProfile", tokenValidator.validateCoachToken,  authController.getProfile);

/* forget pass route for employee */
coachRoute.put("/editProfile", validators.trimmer, tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.editProfile), authController.editProfile);

export = coachRoute;