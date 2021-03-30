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
const employeeRoute = express_1.default.Router();
const authController = new authController_1.AuthController();
const employeeController = new employeeController_1.EmployeeController();
const goalController = new goalController_1.GoalController();
const chatController = new chatController_1.ChatController();
const qualitativeMeasurementController = new qualitativeMeasurementController_1.QualitativeMeasurementController();
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
employeeRoute.post("/updateProfile", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.updateProfile), authController.updateProfile);
/* upload file route for employee */
employeeRoute.post("/uploadFile", tokenValidator.validateEmployeeToken, multerParser_1.upload.single('file'), authController.uploadFile);
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
// QualitativeMeasurement routes
/* add qualitative measurement for employee */
employeeRoute.post("/addQualitativeMeasurement", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.addQualitativeMeasurement), qualitativeMeasurementController.addQualitativeMeasurement);
/* get qualitative measurement for employee */
employeeRoute.get("/getQualitativeMeasurement", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateQueryParams(employeeSchema.getQualitativeMeasurement), qualitativeMeasurementController.getQualitativeMeasurement);
/* get qualitative measurement comment for employee */
employeeRoute.get("/getQuantitativeMeasurementCommentList", validators.trimmer, tokenValidator.validateEmployeeToken, qualitativeMeasurementController.getQuantitativeMeasurementCommentList);
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
employeeRoute.get("/getVideoChatSessionIdandToken/:chat_room_id", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateParams(employeeSchema.getVideoChatSessionIdandToken), chatController.getVideoChatSessionIdandToken);
/* send video chat notification*/
employeeRoute.post("/sendVideoChatNotification", validators.trimmer, tokenValidator.validateEmployeeToken, joiSchemaValidation.validateBody(employeeSchema.sendVideoChatNotification), chatController.sendVideoChatNotification);
module.exports = employeeRoute;
//# sourceMappingURL=employeeRoute.js.map