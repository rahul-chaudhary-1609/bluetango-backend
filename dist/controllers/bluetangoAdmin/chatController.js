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
exports.ChatController = void 0;
const chatService_1 = require("../../services/bluetangoAdmin/chatService");
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
//Instantiates a Home services  
const chatServices = new chatService_1.ChatServices();
class ChatController {
    constructor() { }
    /**
    * get chat room id
    * @param req :[]
    * @param res
    */
    getChatRoomId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield chatServices.getChatRoomId(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * get chat list
    * @param req :[]
    * @param res
    */
    getChatList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield chatServices.getChatList(req.query, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
    * send chat notification
    * @param req :[]
    * @param res
    */
    sendChatNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield chatServices.sendChatNotification(req.body, req.user);
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chatController.js.map