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
import * as ChatController from "../controllers/bluetangoAdmin/chatController";

const bluetangoAdminRoute = express.Router();

const authController = new AdminController.AuthController();
const biosController = new BluetangoController.BiosController();
const coachController = new CoachController.CoachController();
const chatController = new ChatController.ChatController();
const staticContentController = new BluetangoController.StaticContentController();
const SessionManagementController = new BluetangoController.SessionManagementController();
/* add Admin */
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
bluetangoAdminRoute.get("/getCoachList", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateQueryParams(adminSchema.getCoachList), coachController.getCoachList);

/* add coach*/
bluetangoAdminRoute.post("/addCoach", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.addCoach), coachController.addCoach);

/* edit coach*/
bluetangoAdminRoute.put("/editCoach", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.editCoach), coachController.editCoach);

/* get coach deatils */
bluetangoAdminRoute.get("/getCoachDetails", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateQueryParams(adminSchema.getCoachDetails), coachController.getCoachDetails);

/* delete Coach*/
bluetangoAdminRoute.delete("/deleteCoach/:coach_id", tokenValidator.validateBluetangoAdminToken, coachController.deleteCoach);

/* block Unblock Coach*/
bluetangoAdminRoute.put("/blockUnblockCoach", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.blockUnblockCoach), coachController.blockUnblockCoach);

/* list Coach Specialization Categories*/
bluetangoAdminRoute.get("/listCoachSpecializationCategories", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateQueryParams(adminSchema.listCoachSpecializationCategories), coachController.listCoachSpecializationCategories);

/* list Employee Ranks*/
bluetangoAdminRoute.get("/listEmployeeRanks", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateQueryParams(adminSchema.listEmployeeRanks), coachController.listEmployeeRanks);

/* get chat room id */
bluetangoAdminRoute.get("/getChatRoomId", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateQueryParams(adminSchema.getChatRoomId), chatController.getChatRoomId);

/* get chat list */
bluetangoAdminRoute.get("/getChatList", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateQueryParams(adminSchema.getChatList), chatController.getChatList);

/* send video/audio chat notification*/
bluetangoAdminRoute.post("/sendChatNotification", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.sendChatNotification), chatController.sendChatNotification);


/*  add Bios */
bluetangoAdminRoute.post("/addBios", joiSchemaValidation.validateBody(adminSchema.addBios), tokenValidator.validateBluetangoAdminToken, biosController.addBios);
/* update Bios */
bluetangoAdminRoute.put("/updateBios", joiSchemaValidation.validateBody(adminSchema.updateBios), tokenValidator.validateBluetangoAdminToken, biosController.updateBios);
/* delete Bios */
bluetangoAdminRoute.delete("/deleteBios/:id", tokenValidator.validateBluetangoAdminToken, biosController.deleteBios);
/* get Bios */
bluetangoAdminRoute.get("/getBios", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateQueryParams(adminSchema.getBios), biosController.getBios);
/* add static content */
bluetangoAdminRoute.put("/addStaticContent", joiSchemaValidation.validateBody(adminSchema.updateStaticContent), tokenValidator.validateBluetangoAdminToken, staticContentController.addStaticContent);
/* get static content */
bluetangoAdminRoute.get("/getStaticContent", tokenValidator.validateBluetangoAdminToken, staticContentController.getStaticContent);
/* get session List view */
bluetangoAdminRoute.get("/getSessionList", tokenValidator.validateBluetangoAdminToken, SessionManagementController.getSessionList);
/* get session detailed view */
bluetangoAdminRoute.get("/getSessionDetail", tokenValidator.validateBluetangoAdminToken, SessionManagementController.getSessionDetail);
/*perform action on sessions */
bluetangoAdminRoute.put("/performAction", joiSchemaValidation.validateBody(adminSchema.performAction), tokenValidator.validateBluetangoAdminToken, SessionManagementController.performAction);
/* get session detailed view */
bluetangoAdminRoute.get("/getAvailabileCoaches", tokenValidator.validateBluetangoAdminToken, SessionManagementController.getAvailabileCoaches);
/* delete Admin */
bluetangoAdminRoute.delete("/deleteAdmin/:admin_id", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateParams(adminSchema.deleteAdmin), authController.deleteAdmin);
/* role view */
bluetangoAdminRoute.get("/viewRoleDetails", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateQueryParams(adminSchema.viewRoleDetails), authController.viewRoleDetails);
/* delete Admin */
bluetangoAdminRoute.delete("/deleteRole/:role_id", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateParams(adminSchema.deleteRole), authController.deleteRole);
/* update admin and role Admin */
bluetangoAdminRoute.put("/updateAdminAndRole", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.updateAdminAndRole), authController.updateAdminAndRole);
/* update role status */
bluetangoAdminRoute.put("/updateAdminAndRoleStatus", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.updateAdminAndRoleStatus), authController.updateAdminAndRoleStatus);
/* get roles And Admins */
bluetangoAdminRoute.get("/getrolesAndAdmins", tokenValidator.validateBluetangoAdminToken, joiSchemaValidation.validateBody(adminSchema.getrolesAndAdmins), authController.getrolesAndAdmins);
/* get Bio detail */
bluetangoAdminRoute.get("/getBiosDetails", tokenValidator.validateBluetangoAdminToken,joiSchemaValidation.validateQueryParams(adminSchema.getCoachBiosDetails), biosController.getBiosDetails);

export = bluetangoAdminRoute;