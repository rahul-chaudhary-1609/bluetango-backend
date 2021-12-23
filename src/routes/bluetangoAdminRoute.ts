import express from "express";
import * as adminSchema from '../apiSchema/bluetangoAdminSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";

import * as AdminController from "../controllers/bluetangoAdmin/authController";
import * as multer from '../middleware/multerParser';
import * as validators from "../middleware/validators";
import * as helperFunction from "../utils/helperFunction";
import { upload } from "../middleware/multerParser"

const bluetangoAdminRoute = express.Router();

const authController = new AdminController.AuthController();


/* add subAdmin */
bluetangoAdminRoute.post("/addAdmin",tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.addAdmin), authController.addAdmin);

/* login route for admin login */
bluetangoAdminRoute.post("/login", joiSchemaValidation.validateBody(adminSchema.login), authController.login);

/* forget pass route for admin */
bluetangoAdminRoute.post("/forgotPassword", joiSchemaValidation.validateBody(adminSchema.forgetPassword), authController.forgetPassword);

/* reset pass route for admin */
bluetangoAdminRoute.post("/resetPassword",tokenValidator.validateBluetangoForgotPasswordToken, joiSchemaValidation.validateBody(adminSchema.resetPassword), authController.resetPassword);

/* upload file route for employee */
bluetangoAdminRoute.post("/uploadFile", tokenValidator.validateBluetangoAdminToken, upload.single('file'), authController.uploadFile);

/* logout route for admin logout */
bluetangoAdminRoute.get("/logout", tokenValidator.validateBluetangoAdminToken, authController.logout);


export = bluetangoAdminRoute;