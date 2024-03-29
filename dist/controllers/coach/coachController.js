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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoachController = void 0;
const coachService_1 = require("../../services/coach/coachService");
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
//Instantiates a chat services  
const coachService = new coachService_1.CoachService();
class CoachController {
    constructor() { }
    /**
    * get chat list
    * @param req :[]
    * @param res
    */
    addEditSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.addEditSlot(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.getSlots(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.getSlot(req.query);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    deleteSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.deleteSlot(req.body);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getSessionRequests(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.getSessionRequests(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    acceptSessionRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.acceptSessionRequest(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    rejectSessionRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.rejectSessionRequest(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getAcceptedSessions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.getAcceptedSessions(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    cancelSession(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.cancelSession(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    listSessionHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.listSessionHistory(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getSessionHistoryDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.getSessionHistoryDetails(req.params);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    updateZoomMeetingDuration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.updateZoomMeetingDuration(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    endZoomMeeting(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.endZoomMeeting(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
   * updateSlotAvailability
   * @param req :[]
   * @param res
   */
    updateSlotAvailability(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.updateSlotAvailability(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getUnseenChatNotificationCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield coachService.getUnseenChatNotificationCount(req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.CoachController = CoachController;
//# sourceMappingURL=coachController.js.map