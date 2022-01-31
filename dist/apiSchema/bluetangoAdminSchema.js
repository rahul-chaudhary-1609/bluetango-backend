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
exports.getCoachBiosDetails = exports.getrolesAndAdmins = exports.updateAdminAndRoleStatus = exports.updateAdminAndRole = exports.deleteRole = exports.viewRoleDetails = exports.deleteAdmin = exports.sendChatNotification = exports.getChatList = exports.getChatRoomId = exports.listEmployeeRanks = exports.listCoachSpecializationCategories = exports.blockUnblockCoach = exports.deleteCoach = exports.getCoachDetails = exports.getCoachList = exports.editCoach = exports.addCoach = exports.performAction = exports.updateStaticContent = exports.changePassword = exports.updateProfile = exports.updateBios = exports.addBios = exports.resetPassword = exports.forgetPassword = exports.addAdmin = exports.login = void 0;
const joi_1 = __importDefault(require("joi"));
const constants = __importStar(require("../constants"));
exports.login = joi_1.default.object({
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
    password: joi_1.default.string().min(8)
        .max(15)
        // .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
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
exports.addAdmin = joi_1.default.object({
    admins: joi_1.default.array().items({
        email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
        name: joi_1.default.string().required(),
    }),
    role_name: joi_1.default.string().required(),
    module_wise_permissions: joi_1.default.array().items({ module: joi_1.default.string().required().valid('Dashboard', 'Coach Administration', 'Administration Management', 'Static Content', 'Session Content'), permissions: joi_1.default.array().required() }).required(),
});
exports.forgetPassword = joi_1.default.object({
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
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
exports.addBios = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    coach_id: joi_1.default.number().required(),
    image: joi_1.default.string().required()
});
exports.updateBios = joi_1.default.object({
    id: joi_1.default.number().required(),
    name: joi_1.default.string(),
    description: joi_1.default.string(),
    image: joi_1.default.string()
});
exports.updateProfile = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
    profile_pic_url: joi_1.default.string().allow("", null).optional(),
    social_media_handles: joi_1.default.object().allow(null).optional(),
});
exports.changePassword = joi_1.default.object({
    old_password: joi_1.default.string().min(8)
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
    new_password: joi_1.default.string().min(8)
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
exports.updateStaticContent = joi_1.default.object({
    pricing: joi_1.default.string(),
    contact_us: joi_1.default.string(),
    about_us: joi_1.default.string(),
    privacy_policy: joi_1.default.string(),
    terms_ondition: joi_1.default.string()
});
exports.performAction = joi_1.default.object({
    id: joi_1.default.number().required(),
    slot_id: joi_1.default.number().required(),
    coach_id: joi_1.default.number().required(),
    date: joi_1.default.string().required(),
    action: joi_1.default.number().required().valid(1, 2, 3, 4, 5),
    start_time: joi_1.default.string().required(),
    end_time: joi_1.default.string().required()
});
exports.addCoach = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
    country_code: joi_1.default.string().required(),
    phone_number: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    image: joi_1.default.string().optional(),
    fileName: joi_1.default.string().optional(),
    coach_specialization_category_ids: joi_1.default.array().optional(),
    employee_rank_ids: joi_1.default.array().optional(),
    coach_charge: joi_1.default.number().optional(),
});
exports.editCoach = joi_1.default.object({
    coach_id: joi_1.default.number().required(),
    name: joi_1.default.string().required(),
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
    country_code: joi_1.default.string().required(),
    phone_number: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    image: joi_1.default.string().optional(),
    fileName: joi_1.default.string().optional(),
    coach_specialization_category_ids: joi_1.default.array().optional(),
    employee_rank_ids: joi_1.default.array().optional(),
    coach_charge: joi_1.default.number().optional(),
});
exports.getCoachList = joi_1.default.object({
    searchKey: joi_1.default.string().optional(),
    coach_specialization_category_id: joi_1.default.number().optional(),
    employee_rank_id: joi_1.default.number().optional(),
    status: joi_1.default.number().optional().valid(0, 1),
    rating: joi_1.default.number().optional().valid(1, 2, 3, 4, 5),
    limit: joi_1.default.number().optional(),
    offset: joi_1.default.number().optional(),
});
exports.getCoachDetails = joi_1.default.object({
    coach_id: joi_1.default.number().required(),
});
exports.deleteCoach = joi_1.default.object({
    coach_id: joi_1.default.number().required(),
});
exports.blockUnblockCoach = joi_1.default.object({
    coach_id: joi_1.default.number().required(),
    status: joi_1.default.number().required().valid(0, 1),
});
exports.listCoachSpecializationCategories = joi_1.default.object({
    is_pagination: joi_1.default.number().default(1).optional(),
    searchKey: joi_1.default.string().optional(),
    limit: joi_1.default.number().optional(),
    offset: joi_1.default.number().optional(),
});
exports.listEmployeeRanks = joi_1.default.object({
    is_pagination: joi_1.default.number().default(1).optional(),
    searchKey: joi_1.default.string().optional(),
    limit: joi_1.default.number().optional(),
    offset: joi_1.default.number().optional(),
});
exports.getChatRoomId = joi_1.default.object({
    other_user_id: joi_1.default.string().required(),
});
exports.getChatList = joi_1.default.object({
    is_pagination: joi_1.default.number().default(1).optional(),
    limit: joi_1.default.number().optional(),
    offset: joi_1.default.number().optional(),
});
exports.sendChatNotification = joi_1.default.object({
    chat_room_id: joi_1.default.string().required(),
    message: joi_1.default.string().allow('', null).optional(),
});
exports.deleteAdmin = joi_1.default.object({
    admin_id: joi_1.default.number().required(),
});
exports.viewRoleDetails = joi_1.default.object({
    role_id: joi_1.default.number().required()
});
exports.deleteRole = joi_1.default.object({
    role_id: joi_1.default.number().required(),
});
exports.updateAdminAndRole = joi_1.default.object({
    admins: joi_1.default.array().items({
        id: joi_1.default.number(),
        email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
        name: joi_1.default.string().required(),
    }),
    id: joi_1.default.number().required(),
    role_name: joi_1.default.string(),
    module_wise_permissions: joi_1.default.array().items({ module: joi_1.default.string().required().valid('Dashboard', 'Coach Administration', 'Administration Management', 'Static Content', 'Session Content'), permissions: joi_1.default.array().required() }),
});
exports.updateAdminAndRoleStatus = joi_1.default.object({
    status: joi_1.default.number().required().valid(0, 1),
    id: joi_1.default.number().required()
});
exports.getrolesAndAdmins = joi_1.default.object({
    status: joi_1.default.number().optional().valid(0, 1),
    searchKey: joi_1.default.string().optional(),
    limit: joi_1.default.number().optional(),
    offset: joi_1.default.number().optional(),
    module: joi_1.default.string().optional().valid('Dashboard', 'Coach Administration', 'Administration Management', 'Static Content', 'Session Content'),
});
exports.getCoachBiosDetails = joi_1.default.object({
    id: joi_1.default.number().required()
});
//# sourceMappingURL=bluetangoAdminSchema.js.map