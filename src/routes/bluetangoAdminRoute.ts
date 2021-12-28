import express from "express";
import * as adminSchema from '../apiSchema/bluetangoAdminSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";

import * as AdminController from "../controllers/bluetangoAdmin/authController";
import * as multer from '../middleware/multerParser';
import * as validators from "../middleware/validators";
import * as helperFunction from "../utils/helperFunction";
import { upload } from "../middleware/multerParser"
import * as BluetangoController from "../controllers/bluetangoAdmin/index";
import * as CoachController from "../controllers/bluetangoAdmin/coachController";

const bluetangoAdminRoute = express.Router();

const authController = new AdminController.AuthController();
const biosController = new BluetangoController.BiosController();
const coachController= new CoachController.CoachController();

/* add subAdmin */
bluetangoAdminRoute.post("/addAdmin", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.addAdmin), authController.addAdmin);

/* login route for admin login */
bluetangoAdminRoute.post("/login", joiSchemaValidation.validateBody(adminSchema.login), authController.login);

/* get profile */
bluetangoAdminRoute.get("/getProfile", tokenValidator.validateBluetangoAdminToken, authController.getProfile);

/* update profile */
bluetangoAdminRoute.put("/updateProfile", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.updateProfile), authController.updateProfile);

/* add subAdmin */
bluetangoAdminRoute.put("/changePassword", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.changePassword), authController.changePassword);

/* forget pass route for admin */
bluetangoAdminRoute.post("/forgotPassword", joiSchemaValidation.validateBody(adminSchema.forgetPassword), authController.forgetPassword);

/* reset pass route for admin */
bluetangoAdminRoute.post("/resetPassword", tokenValidator.validateBluetangoForgotPasswordToken, joiSchemaValidation.validateBody(adminSchema.resetPassword), authController.resetPassword);

/* upload file route for employee */
bluetangoAdminRoute.post("/uploadFile", tokenValidator.validateBluetangoAdminToken, upload.single('file'), authController.uploadFile);

/* logout route for admin logout */
bluetangoAdminRoute.get("/logout", tokenValidator.validateBluetangoAdminToken, authController.logout);

/*  get dashboard */
bluetangoAdminRoute.get("/dashboard", tokenValidator.validateBluetangoAdminToken, coachController.dashboard);

/* get coach list */
bluetangoAdminRoute.get("/getCoachList", tokenValidator.validateBluetangoAdminToken,  coachController.getCoachList);

/*  add Bios */
bluetangoAdminRoute.post("/addBios", upload.single('image'), joiSchemaValidation.validateBody(adminSchema.addBios), tokenValidator.validateBluetangoAdminToken, biosController.addBios);
/* update Bios */
bluetangoAdminRoute.put("/updateBios", upload.single('image'), joiSchemaValidation.validateBody(adminSchema.updateBios), tokenValidator.validateBluetangoAdminToken, biosController.updateBios);
/* delete Bios */
bluetangoAdminRoute.delete("/deleteBios/:id", tokenValidator.validateBluetangoAdminToken, biosController.deleteBios);
/* get Bios */
bluetangoAdminRoute.get("/getBios",tokenValidator.validateBluetangoAdminToken, biosController.getBios);
export = bluetangoAdminRoute;