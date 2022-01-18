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
exports.getEmployeeCoachSession = exports.listEmployeeCoachSessions = exports.deleteEmployeeRank = exports.getEmployeeRank = exports.listEmployeeRanks = exports.addEditEmployeeRank = exports.deleteCoachSpecializationCategory = exports.getCoachSpecializationCategory = exports.listCoachSpecializationCategories = exports.addEditCoachSpecializationCategories = exports.getFeedbackDetails = exports.listFeedback = exports.addEditCoach = exports.getEmployersList = exports.updateSubscriptionPlan = exports.addSubscriptionPlan = exports.addEditEmployers = exports.changePassword = exports.resetPassword = exports.forgetPassword = exports.addNewAdmin = exports.login = void 0;
const joi_1 = __importDefault(require("joi"));
const constants = __importStar(require("../constants"));
exports.login = joi_1.default.object({
    username: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
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
exports.addNewAdmin = joi_1.default.object({
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
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
    confirmPassword: joi_1.default.string().min(8)
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
    //passkey: Joi.string().required(),
    name: joi_1.default.string().required(),
    phone_number: joi_1.default.string().required(),
    country_code: joi_1.default.string().required(),
    permissions: joi_1.default.string().optional()
});
exports.forgetPassword = joi_1.default.object({
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
});
exports.resetPassword = joi_1.default.object({
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
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
    confirmPassword: joi_1.default.string().min(8)
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
    otp: joi_1.default.string().required(),
});
exports.changePassword = joi_1.default.object({
    oldPassword: joi_1.default.string().required(),
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
    confirmPassword: joi_1.default.string().min(8)
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
exports.addEditEmployers = joi_1.default.object({
    id: joi_1.default.string().optional(),
    name: joi_1.default.string().required(),
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
    // password: Joi.string().min(8).optional()
    // .max(15)
    // .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
    // // .required()
    // .messages({
    //   "string.min": constants.CUSTOM_JOI_MESSAGE.password_msg.min,
    //   "string.max": constants.CUSTOM_JOI_MESSAGE.password_msg.max,
    //   "string.base": constants.CUSTOM_JOI_MESSAGE.password_msg.base,
    //   "string.empty": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
    //   "any.required": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
    //   "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.password_msg.pattern
    // }),
    country_code: joi_1.default.string().required(),
    phone_number: joi_1.default.string().required(),
    industry_type: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    contact_name: joi_1.default.string().required(),
});
exports.addSubscriptionPlan = joi_1.default.object({
    plan_name: joi_1.default.string().required(),
    description: joi_1.default.array().required(),
    charge: joi_1.default.string().required(),
    duration: joi_1.default.string().required()
});
exports.updateSubscriptionPlan = joi_1.default.object({
    id: joi_1.default.string().required(),
    plan_name: joi_1.default.string().allow(),
    description: joi_1.default.array().allow(),
    charge: joi_1.default.string().allow(),
    duration: joi_1.default.string().allow(),
    status: joi_1.default.number().allow()
});
exports.getEmployersList = joi_1.default.object({
    industry_type: joi_1.default.string().optional(),
    limit: joi_1.default.string().optional(),
    offset: joi_1.default.string().optional(),
    searchKey: joi_1.default.string().optional(),
    isPagination: joi_1.default.string().optional()
});
exports.addEditCoach = joi_1.default.object({
    id: joi_1.default.string().optional(),
    name: joi_1.default.string().required(),
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
    // password: Joi.string().min(8).optional()
    // .max(15)
    // .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
    // // .required()
    // .messages({
    //   "string.min": constants.CUSTOM_JOI_MESSAGE.password_msg.min,
    //   "string.max": constants.CUSTOM_JOI_MESSAGE.password_msg.max,
    //   "string.base": constants.CUSTOM_JOI_MESSAGE.password_msg.base,
    //   "string.empty": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
    //   "any.required": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
    //   "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.password_msg.pattern
    // }),
    country_code: joi_1.default.string().required(),
    phone_number: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    image: joi_1.default.string().optional(),
    fileName: joi_1.default.string().optional(),
    coach_specialization_category_ids: joi_1.default.array().optional(),
    employee_rank_ids: joi_1.default.array().optional(),
    coach_charge: joi_1.default.number().optional(),
    social_media_handles: joi_1.default.object().allow(null).optional(),
    website: joi_1.default.string().allow("", null).optional(),
    document_url: joi_1.default.string().allow("", null).optional()
});
exports.listFeedback = joi_1.default.object({
    feedbackType: joi_1.default.number().valid(1, 2, 3, 4).optional(),
    limit: joi_1.default.number().optional(),
    offset: joi_1.default.number().optional(),
    searchKey: joi_1.default.string().optional()
});
exports.getFeedbackDetails = joi_1.default.object({
    feedback_id: joi_1.default.number().required(),
});
exports.addEditCoachSpecializationCategories = joi_1.default.object({
    category_id: joi_1.default.number().optional(),
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
});
exports.listCoachSpecializationCategories = joi_1.default.object({
    is_pagination: joi_1.default.number().default(1).optional(),
    searchKey: joi_1.default.string().optional(),
    limit: joi_1.default.number().optional(),
    offset: joi_1.default.number().optional(),
});
exports.getCoachSpecializationCategory = joi_1.default.object({
    category_id: joi_1.default.number().required(),
});
exports.deleteCoachSpecializationCategory = joi_1.default.object({
    category_id: joi_1.default.number().required(),
});
exports.addEditEmployeeRank = joi_1.default.object({
    rank_id: joi_1.default.number().optional(),
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
});
exports.listEmployeeRanks = joi_1.default.object({
    is_pagination: joi_1.default.number().default(1).optional(),
    searchKey: joi_1.default.string().optional(),
    limit: joi_1.default.number().optional(),
    offset: joi_1.default.number().optional(),
});
exports.getEmployeeRank = joi_1.default.object({
    rank_id: joi_1.default.number().required(),
});
exports.deleteEmployeeRank = joi_1.default.object({
    rank_id: joi_1.default.number().required(),
});
exports.listEmployeeCoachSessions = joi_1.default.object({
    searchKey: joi_1.default.string().optional(),
    date: joi_1.default.string().optional(),
    status: joi_1.default.number().optional(),
    employeeRankId: joi_1.default.number().optional(),
    sessionType: joi_1.default.number().optional(),
    limit: joi_1.default.number().optional(),
    offset: joi_1.default.number().optional(),
});
exports.getEmployeeCoachSession = joi_1.default.object({
    session_id: joi_1.default.number().required(),
});
//# sourceMappingURL=adminSchema.js.map