"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const employeeSchema = __importStar(require("../apiSchema/employeeSchema"));
const joiSchemaValidation = __importStar(require("../middleware/joiSchemaValidation"));
const tokenValidator = __importStar(require("../middleware/tokenValidator"));
const validators = __importStar(require("../middleware/validators"));
const multerParser_1 = require("../middleware/multerParser");
const authController_1 = require("../controllers/employee/authController");
const employeeController_1 = require("../controllers/employee/employeeController");
const goalController_1 = require("../controllers/employee/goalController");
const chatController_1 = require("../controllers/employee/chatController");
const qualitativeMeasurementController_1 = require("../controllers/employee/qualitativeMeasurementController");
const achievementController_1 = require("../controllers/employee/achievementController");
const employeeRoute = express_1.default.Router();
const authController = new authController_1.AuthController();
const employeeController = new employeeController_1.EmployeeController();
const goalController = new goalController_1.GoalController();
const chatController = new chatController_1.ChatController();
const qualitativeMeasurementController = new qualitativeMeasurementController_1.QualitativeMeasurementController();
const achievementController = new achievementController_1.AchievementController();
// auth API
/* login route for employee login */
employeeRoute.post("/login", validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.login), authController.login);
/* forget pass route for employee */
employeeRoute.post("/forgotPassword", validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.forgotPassword), authController.forgotPassword);
/* reset pass route for all */
employeeRoute.post("/resetPassword", validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.resetPassword), tokenValidator.validateForgotPasswordToken, authController.resetPassword);
/* change pass route for employee */
employeeRoute.post("/changePassword", validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.changePassword), tokenValidator.validateEmployeeToken, authController.changePassword);
/* reset pass route for employee */
employeeRoute.post("/employeeResetPassword", validators.trimmer, joiSchemaValidation.validateBody(employeeSchema.resetPassword), tokenValidator.validateEmployeeToken, authController.employeeResetPassword);
/* get my profile route for employee */
employeeRoute.get("/getMyProfile", validators.trimmer, tokenValidator.validateEmployeeToken, authController.getMyProfile);
/* update profile route for employee */
employeeRoute.post("/updateProfile", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.updateProfile), authController.updateProfile);
/* upload file route for employee */
employeeRoute.post("/uploadFile", tokenValidator.validateEmployeeToken, multerParser_1.upload.single('file'), authController.uploadFile);
// employee API
/* get my profile route for employee */
employeeRoute.get("/getListOfTeamMemberByManagerId", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.limitOffsetValidate), employeeController.getListOfTeamMemberByManagerId);
/* get Employee Count Group By Energy */
employeeRoute.get("/getEmployeeCountGroupByEnergy", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.getEmployeeCountGroupByEnergy);
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
/* view goal details for manager */
employeeRoute.get("/viewGoalAssignCompletionAsManager", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.viewGoalAssignCompletionAsManager), goalController.viewGoalAssignCompletionAsManager);
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
/* update device token */
employeeRoute.put("/clearEmployeeDeviceToken", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.clearEmployeeDeviceToken);
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
/* to get Quantitative Stats of goals on dashbord as manager view*/
employeeRoute.get("/getQuantitativeStatsOfGoalsAsManager/:employee_id", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateParams(employeeSchema.getQuantitativeStatsOfGoalsAsManager), goalController.getQuantitativeStatsOfGoalsAsManager);
/* view goal details for employee */
employeeRoute.get("/viewGoalDetailsAsEmployee", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.viewGoalDetailsAsEmployee), goalController.viewGoalDetailsAsEmployee);
// QualitativeMeasurement routes
/* add qualitative measurement for employee */
employeeRoute.post("/addQualitativeMeasurement", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.addQualitativeMeasurement), qualitativeMeasurementController.addQualitativeMeasurement);
/* add Attribute Ratings */
employeeRoute.post("/addAttributeRatings", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.addAttributeRatings), qualitativeMeasurementController.addAttributeRatings);
/* add Attribute Ratings */
employeeRoute.get("/getAttributeRatings", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getAttributeRatings), qualitativeMeasurementController.getAttributeRatings);
/* get qualitative measurement for employee */
employeeRoute.get("/getQualitativeMeasurement", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getQualitativeMeasurement), qualitativeMeasurementController.getQualitativeMeasurement);
/* get AttributeList */
employeeRoute.get("/getAttributeList", validators.trimmer, tokenValidator.validateEmployeeToken, qualitativeMeasurementController.getAttributeList);
/* get Attribute by id*/
employeeRoute.get("/getAttribute/:attribute_id", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateParams(employeeSchema.getAttributes), qualitativeMeasurementController.getAttributeList);
/* get qualitative measurement for employee */
employeeRoute.get("/getQualitativeMeasurementDetails", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getQualitativeMeasurementDetails), qualitativeMeasurementController.getQualitativeMeasurementDetails);
/* get qualitative measurement comment for employee */
employeeRoute.get("/getQuantitativeMeasurementCommentList", validators.trimmer, tokenValidator.validateEmployeeToken, qualitativeMeasurementController.getQuantitativeMeasurementCommentList);
/* get Coach Specialization Category List */
employeeRoute.get("/getCoachSpecializationCategoryList", tokenValidator.validateEmployeeToken, employeeController.getCoachSpecializationCategoryList);
/* get coach list */
employeeRoute.get("/getCoachList", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.getCoachList);
/* get Slots */
employeeRoute.get("/getSlots", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getSlots), employeeController.getSlots);
/*get Slot */
employeeRoute.get("/getSlot", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getSlot), employeeController.getSlot);
/* create Session Request */
employeeRoute.post("/createSessionRequest", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.createSessionRequest), employeeController.createSessionRequest);
/* get Sessions */
employeeRoute.get("/getSessions", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getSessions), employeeController.getSessions);
/* cancel Session */
employeeRoute.put("/cancelSession", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.cancelSession), employeeController.cancelSession);
/* get Not Rated Sessions */
employeeRoute.get("/getNotRatedSessions", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getNotRatedSessions), employeeController.getNotRatedSessions);
/* list Session History */
employeeRoute.get("/listSessionHistory", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.listSessionHistory), employeeController.listSessionHistory);
/* get Session History Details */
employeeRoute.get("/getSessionHistoryDetails/:session_id", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateParams(employeeSchema.getSessionHistoryDetails), employeeController.getSessionHistoryDetails);
/* rate Coach Session */
employeeRoute.post("/rateCoachSession", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.rateCoachSession), employeeController.rateCoachSession);
/*skip Rate Session */
employeeRoute.put("/skipRateSession", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.skipRateSession), employeeController.skipRateSession);
/* contact us for employee */
employeeRoute.post("/contactUs", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.contactUs), employeeController.contactUs);
/* contact us for employee */
employeeRoute.get("/getNotifications", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.getNotifications);
/* to get unseen notification count */
employeeRoute.get("/getUnseenNotificationCount", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.getUnseenNotificationCount);
/* contact us for employee */
employeeRoute.put("/markNotificationsAsViewed", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.markNotificationsAsViewed), employeeController.markNotificationsAsViewed);
/* refer friend for employee */
employeeRoute.post("/referFriend", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.referFriend), employeeController.referFriend);
/* feedback from employee */
employeeRoute.post("/feedback", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.feedback), employeeController.feedback);
/* list library management */
employeeRoute.get("/listVideo", tokenValidator.validateEmployeeToken, employeeController.listVideo);
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
employeeRoute.get("/getChatSessionIdandToken/:chat_room_id", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateParams(employeeSchema.getChatSessionIdandToken), chatController.getChatSessionIdandToken);
/* create video chat session*/
employeeRoute.delete("/dropChatSession", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.dropChatSession), chatController.dropChatSession);
/* create video chat session*/
employeeRoute.get("/checkChatSession/:chat_room_id", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateParams(employeeSchema.checkChatSession), chatController.checkChatSession);
/* send video/audio chat notification*/
employeeRoute.post("/sendChatNotification", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.sendChatNotification), chatController.sendChatNotification);
/* send disconnect video/audio chat notification*/
employeeRoute.post("/sendChatDisconnectNotification", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.sendChatDisconnectNotification), chatController.sendChatDisconnectNotification);
/* clear Chat*/
employeeRoute.delete("/clearChat", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.clearChat), chatController.clearChat);
//achievement API's
/* get achievements */
employeeRoute.get("/getAchievements", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getAchievements), achievementController.getAchievements);
/* get achievement by id */
employeeRoute.get("/getAchievementById/:achievement_id", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateParams(employeeSchema.getAchievementById), achievementController.getAchievementById);
/* create achievement */
employeeRoute.post("/createUpdateAchievement", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.createUpdateAchievement), achievementController.createUpdateAchievement);
/* like dislike achievement */
employeeRoute.put("/likeDislikeAchievement", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.likeDislikeAchievement), achievementController.likeDislikeAchievement);
/* like dislike achievement */
employeeRoute.put("/highFiveAchievement", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.highFiveAchievement), achievementController.highFiveAchievement);
/* add edit comment achievement */
employeeRoute.post("/addEditCommentAchievement", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.addEditCommentAchievement), achievementController.addEditCommentAchievement);
/* get achievement comments*/
employeeRoute.get("/getAchievementComments/:achievement_id", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateParams(employeeSchema.getAchievementComments), achievementController.getAchievementComments);
/* delete achievement*/
employeeRoute.delete("/deleteAchievement/:achievement_id", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateParams(employeeSchema.deleteAchievement), achievementController.deleteAchievement);
/* delete achievement comment*/
employeeRoute.delete("/deleteAchievementComment/:achievement_comment_id", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateParams(employeeSchema.deleteAchievementComment), achievementController.deleteAchievementComment);
/* get achievement likes list*/
employeeRoute.get("/getAchievementLikesList/:achievement_id", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateParams(employeeSchema.getAchievementLikesList), achievementController.getAchievementLikesList);
/* get achievement high fives list*/
employeeRoute.get("/getAchievementHighFivesList/:achievement_id", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateParams(employeeSchema.getAchievementHighFivesList), achievementController.getAchievementHighFivesList);
/* get Goal Completion Average As Manager*/
employeeRoute.get("/getGoalCompletionAverageAsManager", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getGoalCompletionAverageAsManager), goalController.getGoalCompletionAverageAsManager);
/* share Employee CV*/
employeeRoute.post("/shareEmployeeCV", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.shareEmployeeCV), employeeController.shareEmployeeCV);
/* get Employee CV*/
employeeRoute.get("/getEmployeeCV", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.getEmployeeCV), employeeController.getEmployeeCV);
/* /get Goal Submit Reminders */
employeeRoute.get("/getGoalSubmitReminders", validators.trimmer, tokenValidator.validateEmployeeToken, employeeController.getGoalSubmitReminders);
/* toggle Goal As Primary */
employeeRoute.put("/toggleGoalAsPrimary", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.toggleGoalAsPrimary), goalController.toggleGoalAsPrimary);
/* mark Goals As Primary */
employeeRoute.put("/markGoalsAsPrimary", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.markGoalsAsPrimary), goalController.markGoalsAsPrimary);
/* /get thought */
employeeRoute.get("/getThought", tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getThought), employeeController.getThought);
module.exports = employeeRoute;
//# sourceMappingURL=employeeRoute.js.map