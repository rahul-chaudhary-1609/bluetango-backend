import express from "express";
import * as adminSchema from '../apiSchema/adminSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";

import * as AdminController from "../controllers/admin/index";
import * as multer from '../middleware/multerParser';

const adminRoute = express.Router();

const loginController = new AdminController.LoginController();
const employersController = new AdminController.EmployersController();


/* add new admin route for admin */
adminRoute.post("/addNewAdmin", joiSchemaValidation.validateBody(adminSchema.addNewAdmin), loginController.addNewAdmin);

/* login route for admin login */
adminRoute.post("/login", joiSchemaValidation.validateBody(adminSchema.login), loginController.login);

/* forget pass route for admin */
adminRoute.post("/forgotPassword", joiSchemaValidation.validateBody(adminSchema.forgetPassword), loginController.forgetPassword);

/* reset pass route for admin */
adminRoute.post("/resetPassword", joiSchemaValidation.validateBody(adminSchema.resetPassword), loginController.resetPassword);

/* change pass route for admin */
adminRoute.post("/changePassword", joiSchemaValidation.validateBody(adminSchema.changePassword), tokenValidator.validateAdminToken, loginController.changePassword);

/* logout route for admin logout */
adminRoute.get("/logout", tokenValidator.validateAdminToken, loginController.logout);

/* add or edit employers route for employers */
adminRoute.post("/addEditEmployers", joiSchemaValidation.validateBody(adminSchema.addEditEmployers), tokenValidator.validateAdminToken, employersController.addEditEmployers);

/* get employers list route for employers */
adminRoute.get("/getEmployersList", joiSchemaValidation.validateQueryParams(adminSchema.getEmployersList), tokenValidator.validateAdminToken, employersController.getEmployersList);


export = adminRoute;