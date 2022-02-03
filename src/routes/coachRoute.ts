import express from "express";
import * as coachSchema from '../apiSchema/coachSchema';
import * as joiSchemaValidation from '../middleware/joiSchemaValidation';
import * as tokenValidator from "../middleware/tokenValidator";
import * as validators from "../middleware/validators";
import { upload } from "../middleware/multerParser"

import { AuthController } from "../controllers/coach/authController";
import { ChatController } from "../controllers/coach/chatController";
import { CoachController } from "../controllers/coach/coachController";


const coachRoute = express.Router();

const authController = new AuthController();
const chatController = new ChatController();
const coachController = new CoachController();


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

/* clear Chat*/
coachRoute.delete("/clearChat", validators.trimmer, tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.clearChat), chatController.clearChat);

/* contact us for employee */
coachRoute.get("/getNotifications", validators.trimmer, tokenValidator.validateCoachToken, chatController.getNotifications);

/* to get unseen notification count */
coachRoute.get("/getUnseenNotificationCount", validators.trimmer, tokenValidator.validateCoachToken, chatController.getUnseenNotificationCount);

/* contact us for employee */
coachRoute.put("/markNotificationsAsViewed", validators.trimmer, tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.markNotificationsAsViewed), chatController.markNotificationsAsViewed);


/* upload media files */
coachRoute.post("/uploadFile", tokenValidator.validateCoachToken, upload.single('file'), authController.uploadFile);

/* add Slot */
coachRoute.post("/addEditSlot",tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.addEditSlot), coachController.addEditSlot);

/* get Slots */
coachRoute.get("/getSlots",tokenValidator.validateCoachToken, joiSchemaValidation.validateQueryParams(coachSchema.getSlots), coachController.getSlots);

/*get Slot */
coachRoute.get("/getSlot",tokenValidator.validateCoachToken, joiSchemaValidation.validateQueryParams(coachSchema.getSlot), coachController.getSlot);

/* delete Slot */
coachRoute.delete("/deleteSlot",tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.deleteSlot), coachController.deleteSlot);

/* get Session Requests */
coachRoute.get("/getSessionRequests",tokenValidator.validateCoachToken, joiSchemaValidation.validateQueryParams(coachSchema.getSessionRequests), coachController.getSessionRequests);

/* accept Session Request */
coachRoute.put("/acceptSessionRequest",tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.acceptSessionRequest), coachController.acceptSessionRequest);

/* reject Session Request */
coachRoute.put("/rejectSessionRequest",tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.rejectSessionRequest), coachController.rejectSessionRequest);

/* get Accepted Sessions */
coachRoute.get("/getAcceptedSessions",tokenValidator.validateCoachToken, joiSchemaValidation.validateQueryParams(coachSchema.getAcceptedSessions), coachController.getAcceptedSessions);

/* cancel Session */
coachRoute.put("/cancelSession",tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.cancelSession), coachController.cancelSession);

/* list Session History */
coachRoute.get("/listSessionHistory",tokenValidator.validateCoachToken, joiSchemaValidation.validateQueryParams(coachSchema.listSessionHistory), coachController.listSessionHistory);

/* get Session History Details */
coachRoute.get("/getSessionHistoryDetails/:session_id",tokenValidator.validateCoachToken, joiSchemaValidation.validateParams(coachSchema.getSessionHistoryDetails), coachController.getSessionHistoryDetails);

/* update Zoom Meeting Duration */
coachRoute.put("/updateZoomMeetingDuration",tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.updateZoomMeetingDuration), coachController.updateZoomMeetingDuration);

/* end Zoom Meeting */
coachRoute.put("/endZoomMeeting",tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.endZoomMeeting), coachController.endZoomMeeting);
/* get static content */
coachRoute.get("/getStaticContent", tokenValidator.validateCoachToken, authController.getStaticContent);
/* get Bios */
coachRoute.get("/getBios", tokenValidator.validateCoachToken, authController.getBios);
/* get chat room id */
coachRoute.get("/getChatRoomId", validators.trimmer, tokenValidator.validateCoachToken, joiSchemaValidation.validateQueryParams(coachSchema.getChatRoomId), chatController.getChatRoomId);
/* update Slots availability */
coachRoute.post("/updateSlotAvailability",tokenValidator.validateCoachToken, joiSchemaValidation.validateBody(coachSchema.updateSlotAvailability), coachController.updateSlotAvailability);
export = coachRoute;