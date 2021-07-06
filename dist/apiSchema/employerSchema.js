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
exports.updateManager = exports.getManagerList = exports.contactUs = exports.cancelPlan = exports.buyPlan = exports.editProfile = exports.deleteEmployee = exports.viewEmployeeDetails = exports.updateEmployerDeviceToken = exports.getEmployeeList = exports.addEditEmployee = exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.login = void 0;
const joi_1 = __importDefault(require("joi"));
const constants = __importStar(require("../constants"));
exports.login = joi_1.default.object({
    username: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required()
        .messages({
        "string.base": constants.CUSTOM_JOI_MESSAGE.email_msg.base,
        "string.empty": constants.CUSTOM_JOI_MESSAGE.email_msg.required,
        "any.required": constants.CUSTOM_JOI_MESSAGE.email_msg.required,
        "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.email_msg.pattern
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
    })
});
exports.forgotPassword = joi_1.default.object({
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required()
        .messages({
        "string.base": constants.CUSTOM_JOI_MESSAGE.email_msg.base,
        "string.empty": constants.CUSTOM_JOI_MESSAGE.email_msg.required,
        "any.required": constants.CUSTOM_JOI_MESSAGE.email_msg.required,
        "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.email_msg.pattern
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
exports.addEditEmployee = joi_1.default.object({
    id: joi_1.default.string().optional(),
    name: joi_1.default.string().required(),
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
    password: joi_1.default.string().min(8)
        .max(15)
        .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
        .messages({
        "string.min": constants.CUSTOM_JOI_MESSAGE.password_msg.min,
        "string.max": constants.CUSTOM_JOI_MESSAGE.password_msg.max,
        "string.base": constants.CUSTOM_JOI_MESSAGE.password_msg.base,
        "string.empty": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
        "any.required": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
        "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.password_msg.pattern
    }).optional(),
    country_code: joi_1.default.string().required(),
    phone_number: joi_1.default.string().required(),
    current_department_id: joi_1.default.string().required(),
    current_designation: joi_1.default.string().optional(),
    employee_code: joi_1.default.string().required(),
    prev_employer: joi_1.default.string().optional(),
    prev_department: joi_1.default.string().optional(),
    prev_designation: joi_1.default.string().optional(),
    prev_date_of_joining: joi_1.default.string().optional(),
    prev_exit: joi_1.default.string().optional(),
    current_date_of_joining: joi_1.default.string().required(),
    manager_id: joi_1.default.number().optional(),
    is_manager: joi_1.default.number().valid(0, 1).required(),
    manager_team_name: joi_1.default.string().messages({
        "string.base": constants.CUSTOM_JOI_MESSAGE.manager_team_name_msg.base,
        "string.empty": constants.CUSTOM_JOI_MESSAGE.manager_team_name_msg.required,
    }).optional(),
    manager_team_icon_url: joi_1.default.string().messages({
        "string.base": constants.CUSTOM_JOI_MESSAGE.manager_team_icon_url_msg.base,
        "string.empty": constants.CUSTOM_JOI_MESSAGE.manager_team_icon_url_msg.required,
    }).optional(),
});
exports.getEmployeeList = joi_1.default.object({
    departmentId: joi_1.default.number().optional(),
    searchKey: joi_1.default.string().optional(),
    limit: joi_1.default.number().optional(),
    offset: joi_1.default.number().optional()
});
exports.updateEmployerDeviceToken = joi_1.default.object({
    device_token: joi_1.default.string().required()
});
exports.viewEmployeeDetails = joi_1.default.object({
    employee_id: joi_1.default.number().required()
});
exports.deleteEmployee = joi_1.default.object({
    employee_id: joi_1.default.number().required()
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
    industry_type: joi_1.default.number().optional(),
    address: joi_1.default.string().optional(),
    thought_of_the_day: joi_1.default.string().optional(),
    profile_pic_url: joi_1.default.string().allow(null, '').optional(),
});
exports.buyPlan = joi_1.default.object({
    plan_id: joi_1.default.number().required(),
    purchase_date: joi_1.default.string().required(),
    expiry_date: joi_1.default.string().required(),
    amount: joi_1.default.number().required(),
    transaction_id: joi_1.default.string().required(),
});
exports.cancelPlan = joi_1.default.object({
    subscription_id: joi_1.default.number().required(),
});
exports.contactUs = joi_1.default.object({
    message: joi_1.default.string().required(),
});
exports.getManagerList = joi_1.default.object({
    department_id: joi_1.default.number().optional(),
});
exports.updateManager = joi_1.default.object({
    current_manager_id: joi_1.default.number().required(),
    new_manager_id: joi_1.default.number().required(),
});
//# sourceMappingURL=employerSchema.js.map