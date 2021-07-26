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
const coachSchema = __importStar(require("../apiSchema/coachSchema"));
const joiSchemaValidation = __importStar(require("../middleware/joiSchemaValidation"));
const tokenValidator = __importStar(require("../middleware/tokenValidator"));
const validators = __importStar(require("../middleware/validators"));
const multerParser_1 = require("../middleware/multerParser");
const authController_1 = require("../controllers/coach/authController");
const chatController_1 = require("../controllers/coach/chatController");
const coachRoute = express_1.default.Router();
const authController = new authController_1.AuthController();
const chatController = new chatController_1.ChatController();
// auth API
/* login route for employee login */
coachRoute.post("/login", validators.trimmer, joiSchemaValidation.validateBody(coachSchema.login), authController.login);
/* reset pass route for all */
coachRoute.post("/resetPassword", validators.trimmer, joiSchemaValidation.validateBody(coachSchema.resetPassword), tokenValidator.validateCoachToken, authController.resetPassword);
/* forget pass route for employee */
coachRoute.post("/forgotPassword", validators.trimmer, joiSchemaValidation.validateBody(coachSchema.forgotPassword), authController.forgotPassword);
/* forget pass route for employee */
coachRoute.get("/getProfile", tokenValidator.validateCoachToken, authController.getProfile);
/* forget pass route for employee */
coachRoute.put("/editProfile", validators.trimmer, tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.editProfile), authController.editProfile);
/* update employer device token */
coachRoute.put("/updateEmployerDeviceToken", joiSchemaValidation.validateBody(coachSchema.updateEmployerDeviceToken), tokenValidator.validateCoachToken, authController.updateEmployerDeviceToken);
/* clear employer device token */
coachRoute.put("/clearEmployerDeviceToken", tokenValidator.validateCoachToken, authController.clearEmployerDeviceToken);
// Chat routes
/* get chat list */
coachRoute.get("/getChatList", validators.trimmer, tokenValidator.validateCoachToken, chatController.getChatList);
/* create video chat session*/
coachRoute.post("/createChatSession", validators.trimmer, tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.createChatSession), chatController.createChatSession);
/* get video chat session id and token */
coachRoute.get("/getChatSessionIdandToken/:chat_room_id", validators.trimmer, tokenValidator.validateCoachToken, joiSchemaValidation.validateParams(coachSchema.getChatSessionIdandToken), chatController.getChatSessionIdandToken);
/* create video chat session*/
coachRoute.delete("/dropChatSession", validators.trimmer, tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.dropChatSession), chatController.dropChatSession);
/* create video chat session*/
coachRoute.get("/checkChatSession/:chat_room_id", validators.trimmer, tokenValidator.validateCoachToken, joiSchemaValidation.validateParams(coachSchema.checkChatSession), chatController.checkChatSession);
/* send video/audio chat notification*/
coachRoute.post("/sendChatNotification", validators.trimmer, tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.sendChatNotification), chatController.sendChatNotification);
/* send disconnect video/audio chat notification*/
coachRoute.post("/sendChatDisconnectNotification", validators.trimmer, tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.sendChatDisconnectNotification), chatController.sendChatDisconnectNotification);
/* contact us for employee */
coachRoute.get("/getNotifications", validators.trimmer, tokenValidator.validateCoachToken, chatController.getNotifications);
/* to get unseen notification count */
coachRoute.get("/getUnseenNotificationCount", validators.trimmer, tokenValidator.validateCoachToken, chatController.getUnseenNotificationCount);
/* contact us for employee */
coachRoute.put("/markNotificationsAsViewed", validators.trimmer, tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.markNotificationsAsViewed), chatController.markNotificationsAsViewed);
/* upload media files */
coachRoute.post("/uploadFile", tokenValidator.validateCoachToken, multerParser_1.upload.single('file'), authController.uploadFile);
module.exports = coachRoute;
//# sourceMappingURL=coachRoute.js.map