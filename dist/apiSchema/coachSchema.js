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
exports.updateEmployerDeviceToken = exports.sendChatDisconnectNotification = exports.sendChatNotification = exports.getChatSessionIdandToken = exports.checkChatSession = exports.dropChatSession = exports.createChatSession = exports.editProfile = exports.resetPassword = exports.forgotPassword = exports.login = void 0;
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
exports.updateEmployerDeviceToken = joi_1.default.object({
    device_token: joi_1.default.string().required()
});
//# sourceMappingURL=coachSchema.js.map