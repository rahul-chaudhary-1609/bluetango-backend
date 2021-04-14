import express from "express";
import * as employeeSchema from '../apiSchema/employeeSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";
import * as validators from "../middleware/validators";
import { upload } from "../middleware/multerParser";

import { AuthController } from "../controllers/employee/authController";
import { EmployeeController } from "../controllers/employee/employeeController";
import { GoalController } from "../controllers/employee/goalController";
import { ChatController } from "../controllers/employee/chatController";
import { QualitativeMeasurementController } from "../controllers/employee/qualitativeMeasurementController";
import { AchievementController } from "../controllers/employee/achievementController";

const employeeRoute = express.Router();

const authController = new AuthController();
const employeeController = new EmployeeController();
const goalController = new GoalController();
const chatController = new ChatController();
const qualitativeMeasurementController = new QualitativeMeasurementController();
const achievementController = new AchievementController();

// auth API
/* login route for employee login */
employeeRoute.post("/login",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.login), authController.login);

/* forget pass route for employee */
employeeRoute.post("/forgotPassword",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.forgotPassword), authController.forgotPassword);

/* reset pass route for all */
employeeRoute.post("/resetPassword",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.resetPassword), tokenValidator.validateForgotPasswordToken, authController.resetPassword);

/* change pass route for employee */
employeeRoute.post("/changePassword",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.changePassword), tokenValidator.validateEmployeeToken, authController.changePassword);

/* reset pass route for employee */
employeeRoute.post("/employeeResetPassword",validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.resetPassword), tokenValidator.validateEmployeeToken, authController.employeeResetPassword);

/* get my profile route for employee */
employeeRoute.get("/getMyProfile", validators.trimmer, tokenValidator.validateEmployeeToken, authController.getMyProfile);

/* update profile route for employee */
employeeRoute.post("/updateProfile", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.updateProfile), authController.updateProfile);

/* upload file route for employee */
employeeRoute.post("/uploadFile", tokenValidator.validateEmployeeToken, upload.single('file'), authController.uploadFile);


// employee API
/* get my profile route for employee */
employeeRoute.get("/getListOfTeamMemberByManagerId", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.limitOffsetValidate), employeeController.getListOfTeamMemberByManagerId);

/* view details route for employee */
employeeRoute.get("/viewDetailsEmployee", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.viewDetailsEmployee), employeeController.viewDetailsEmployee);

/* search team meber for manager */
employeeRoute.get("/searchTeamMember", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.searchTeamMember), employeeController.searchTeamMember);

/* add goal for manager */
employeeRoute.post("/addGoal", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.addGoal), goalController.addGoal);

/* edit goal for manager */
employeeRoute.post("/editGoal", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.editGoal), goalController.editGoal);

/* view goal for manager */
employeeRoute.get("/viewGoalAsManager", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.viewGoalAsManager), goalController.viewGoalAsManager);

/* view goal details for manager */
employeeRoute.get("/viewGoalDetailsAsManager", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.viewGoalDetailsAsManager), goalController.viewGoalDetailsAsManager);

/* delete goal for manager */
employeeRoute.delete("/deleteGoal", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.viewDetailsEmployee), goalController.deleteGoal);

/* get goal request for manager */
employeeRoute.get("/getGoalCompletedRequestAsManager", validators.trimmer, tokenValidator.validateEmployeeToken, goalController.getGoalCompletedRequestAsManager);

/* get goal request for manager */
employeeRoute.post("/goalAcceptRejectAsManager", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.goalAcceptRejectAsManager), goalController.goalAcceptRejectAsManager);

/* submit goal for employee */
employeeRoute.post("/submitGoalAsEmployee", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.submitGoalAsEmployee), goalController.submitGoalAsEmployee);

/* view goal for employee */
employeeRoute.get("/viewGoalAsEmployee", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.limitOffsetValidate), goalController.viewGoalAsEmployee);

/* add thought of the day */
employeeRoute.post("/thoughtOfTheDay", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.thoughtOfTheDay), employeeController.thoughtOfTheDay);

/* view goal for employee */
employeeRoute.get("/getEmoji", tokenValidator.validateEmployeeToken, employeeController.getEmoji);

/* update energy of the employee */
employeeRoute.post("/updateEnergyCheck", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.updateEnergyCheck), employeeController.updateEnergyCheck);

/* View energy check of the team member */
employeeRoute.get("/viewEnergyCheckTeamMembers", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.viewEnergyCheckTeamMembers);

/* feel about job today */
employeeRoute.post("/feelAboutJobToday", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.feelAboutJobToday), employeeController.feelAboutJobToday);

/* update device token */
employeeRoute.put("/updateEmployeeDeviceToken", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.updateEmployeeDeviceToken);

/* get current manager */
employeeRoute.get("/getCurrentManager", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.getCurrentManager);

/* get employee details to show employee detail on dashbord as team member view */
employeeRoute.get("/getEmployeeDetails", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.getEmployeeDetails);

/* view energy of employee on dashbord as team member view */
employeeRoute.get("/viewEmployeeEnergy", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.viewEmployeeEnergy);

/* to view thought of the day employee on dashbord as team member view */
employeeRoute.get("/viewThoughtOfTheDay", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.viewThoughtOfTheDay);

/* to view feel About Job Today on dashbord as team member view */
employeeRoute.get("/viewFeelAboutJobToday", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.viewFeelAboutJobToday);

/* to view thought of the day from admin on dashbord as team member view */
employeeRoute.get("/viewThoughtOfTheDayFromAdmin", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.viewThoughtOfTheDayFromAdmin);



/* to get Quantitative Stats of goals on dashbord as team member view*/
employeeRoute.get("/getQuantitativeStatsOfGoals", validators.trimmer, tokenValidator.validateEmployeeToken, goalController.getQuantitativeStatsOfGoals);

/* view goal details for employee */
employeeRoute.get("/viewGoalDetailsAsEmployee", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.viewGoalDetailsAsEmployee), goalController.viewGoalDetailsAsEmployee);




// QualitativeMeasurement routes

/* add qualitative measurement for employee */
employeeRoute.post("/addQualitativeMeasurement", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.addQualitativeMeasurement), qualitativeMeasurementController.addQualitativeMeasurement);

/* get qualitative measurement for employee */
employeeRoute.get("/getQualitativeMeasurement", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getQualitativeMeasurement), qualitativeMeasurementController.getQualitativeMeasurement);

/* get qualitative measurement for employee */
employeeRoute.get("/getQualitativeMeasurementDetails", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getQualitativeMeasurementDetails), qualitativeMeasurementController.getQualitativeMeasurementDetails);


/* get qualitative measurement comment for employee */
employeeRoute.get("/getQuantitativeMeasurementCommentList", validators.trimmer, tokenValidator.validateEmployeeToken, qualitativeMeasurementController.getQuantitativeMeasurementCommentList);


/* get coach list */
employeeRoute.get("/getCoachList", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.getCoachList);


/* contact us for employee */
employeeRoute.post("/contactUs", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.contactUs), employeeController.contactUs);


// Chat routes
/* get chat for employee */
employeeRoute.get("/getChatPopUpListAsEmployee", validators.trimmer, tokenValidator.validateEmployeeToken, chatController.getChatPopUpListAsEmployee);

/* get chat room id */
employeeRoute.get("/getChatRoomId", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getChatRoomId), chatController.getChatRoomId);

/* get chat list */
employeeRoute.get("/getChatList", validators.trimmer, tokenValidator.validateEmployeeToken, chatController.getChatList);

/* create video chat session*/
employeeRoute.post("/createChatSession", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.createChatSession), chatController.createChatSession);

/* get video chat session id and token */
employeeRoute.get("/getChatSessionIdandToken/:chat_room_id", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateParams(employeeSchema.getChatSessionIdandToken),chatController.getChatSessionIdandToken);

/* create video chat session*/
employeeRoute.delete("/dropChatSession", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.dropChatSession), chatController.dropChatSession);

/* create video chat session*/
employeeRoute.get("/checkChatSession/:chat_room_id", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateParams(employeeSchema.checkChatSession), chatController.checkChatSession);

/* send video/audio chat notification*/
employeeRoute.post("/sendChatNotification", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.sendChatNotification), chatController.sendChatNotification);

/* send disconnect video/audio chat notification*/
employeeRoute.post("/sendChatDisconnectNotification", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.sendChatDisconnectNotification), chatController.sendChatDisconnectNotification);


//achievement API's
/* get achievements */
employeeRoute.get("/getAchievement", validators.trimmer, tokenValidator.validateEmployeeToken, achievementController.getAchievement);


export = employeeRoute;