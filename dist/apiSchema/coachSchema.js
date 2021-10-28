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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionHistoryDetails = exports.listSessionHistory = exports.cancelSession = exports.getAcceptedSessions = exports.rejectSessionRequest = exports.acceptSessionRequest = exports.getSessionRequests = exports.deleteSlot = exports.getSlot = exports.getSlots = exports.addSlot = exports.clearChat = exports.updateEmployerDeviceToken = exports.markNotificationsAsViewed = exports.sendChatDisconnectNotification = exports.sendChatNotification = exports.getChatSessionIdandToken = exports.checkChatSession = exports.dropChatSession = exports.createChatSession = exports.editProfile = exports.resetPassword = exports.forgotPassword = exports.login = void 0;
const joi_1 = __importDefault(require("joi"));
const constants = __importStar(require("../constants"));
exports.login = joi_1.default.object({
    username: joi_1.default.string()
        .regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i)
        .required()
        .messages({
        "string.pattern.base": constants.MESSAGES.invalid_email
    }),
    password: joi_1.default.string().min(8)
        .max(15)
        .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
        .required()
        .messages({
        "string.min": constants.CUSTOM_JOI_MESSAGE.password_msg.min,
        "string.max": constants.CUSTOM_JOI_MESSAGE.password_msg.max,
        "string.base": constants.CUSTOM_JOI_MESSAGE.password_msg.base,
        "string.empty": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
        "any.required": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
        "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.password_msg.pattern
    }),
    device_token: joi_1.default.string().optional()
});
exports.forgotPassword = joi_1.default.object({
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required()
        .messages({
        "string.pattern.base": constants.MESSAGES.invalid_email
    }),
    user_role: joi_1.default.string().regex(new RegExp("^(?=.*[1-5])")).required(),
});
exports.resetPassword = joi_1.default.object({
    password: joi_1.default.string().min(8)
        .max(15)
        .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
        .required()
        .messages({
        "string.min": constants.CUSTOM_JOI_MESSAGE.password_msg.min,
        "string.max": constants.CUSTOM_JOI_MESSAGE.password_msg.max,
        "string.base": constants.CUSTOM_JOI_MESSAGE.password_msg.base,
        "string.empty": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
        "any.required": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
        "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.password_msg.pattern
    })
});
exports.editProfile = joi_1.default.object({
    name: joi_1.default.string().optional(),
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).optional(),
    password: joi_1.default.string().min(8).optional()
        .max(15)
        .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
        // .required()
        .messages({
        "string.min": constants.CUSTOM_JOI_MESSAGE.password_msg.min,
        "string.max": constants.CUSTOM_JOI_MESSAGE.password_msg.max,
        "string.base": constants.CUSTOM_JOI_MESSAGE.password_msg.base,
        "string.empty": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
        "any.required": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
        "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.password_msg.pattern
    }),
    country_code: joi_1.default.string().optional(),
    phone_number: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    image: joi_1.default.string().optional(),
    fileName: joi_1.default.string().optional()
});
exports.createChatSession = joi_1.default.object({
    chat_room_id: joi_1.default.string().required()
});
exports.dropChatSession = joi_1.default.object({
    chat_room_id: joi_1.default.string().required()
});
exports.checkChatSession = joi_1.default.object({
    chat_room_id: joi_1.default.string().required()
});
exports.getChatSessionIdandToken = joi_1.default.object({
    chat_room_id: joi_1.default.string().required()
});
exports.sendChatNotification = joi_1.default.object({
    chat_room_id: joi_1.default.string().required(),
    chat_type: joi_1.default.string().trim().valid('text', 'audio', 'video').required(),
    message: joi_1.default.string(),
    session_id: joi_1.default.string(),
    token: joi_1.default.string(),
});
exports.sendChatDisconnectNotification = joi_1.default.object({
    chat_room_id: joi_1.default.string().required(),
    chat_type: joi_1.default.string().trim().valid('audio', 'video').required(),
    disconnect_type: joi_1.default.number(),
    session_id: joi_1.default.string(),
    token: joi_1.default.string(),
});
exports.markNotificationsAsViewed = joi_1.default.object({
    type: joi_1.default.string().optional(),
    chat_room_id: joi_1.default.number().optional(),
});
exports.updateEmployerDeviceToken = joi_1.default.object({
    device_token: joi_1.default.string().required()
});
exports.clearChat = joi_1.default.object({
    chat_room_id: joi_1.default.number().required()
});
exports.addSlot = joi_1.default.object({
    date: joi_1.default.string().required(),
    // start_time: Joi.string().required(),
    // end_time: Joi.string().required(),
    slots: joi_1.default.array().items(joi_1.default.object().keys({
        start_time: joi_1.default.string().required(),
        end_time: joi_1.default.string().required(),
    })).required(),
    type: joi_1.default.number().required(),
    day: joi_1.default.number().optional(),
    custom_date: joi_1.default.string().optional(),
    custom_dates: joi_1.default.array().optional(),
});
exports.getSlots = joi_1.default.object({
    filter_key: joi_1.default.string().valid("Daily", "Weekly", "Monthly", "Yearly").allow(null, '').optional(),
    date: joi_1.default.string().allow(null, '').optional(),
    day: joi_1.default.string().allow(null, '').optional(),
    week: joi_1.default.string().allow(null, '').optional(),
    month: joi_1.default.string().allow(null, '').optional(),
    year: joi_1.default.string().allow(null, '').optional(),
});
exports.getSlot = joi_1.default.object({
    slot_id: joi_1.default.number().required(),
});
exports.deleteSlot = joi_1.default.object({
    type: joi_1.default.number().required(),
    group_type: joi_1.default.number().optional(),
    slot_id: joi_1.default.number().optional(),
    slot_date_group_id: joi_1.default.string().optional(),
    slot_time_group_id: joi_1.default.string().optional(),
    current_date: joi_1.default.string().optional(),
});
exports.getSessionRequests = joi_1.default.object({
    is_pagination: joi_1.default.number().optional(),
    limit: joi_1.default.number().optional(),
    offset: joi_1.default.number().optional(),
});
exports.acceptSessionRequest = joi_1.default.object({
    session_id: joi_1.default.number().required(),
});
exports.rejectSessionRequest = joi_1.default.object({
    session_id: joi_1.default.number().required(),
});
exports.getAcceptedSessions = joi_1.default.object({
    is_pagination: joi_1.default.number().optional(),
    limit: joi_1.default.number().optional(),
    offset: joi_1.default.number().optional(),
});
exports.cancelSession = joi_1.default.object({
    session_id: joi_1.default.number().required(),
    cancel_reason: joi_1.default.string().required(),
});
exports.listSessionHistory = joi_1.default.object({
    is_pagination: joi_1.default.number().optional(),
    limit: joi_1.default.number().optional(),
    offset: joi_1.default.number().optional(),
});
exports.getSessionHistoryDetails = joi_1.default.object({
    session_id: joi_1.default.number().required(),
});
//# sourceMappingURL=coachSchema.js.map