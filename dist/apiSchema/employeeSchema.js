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
exports.submitGoalAsEmployee = exports.addGoal = exports.editGoal = exports.viewGoalAsManager = exports.searchTeamMember = exports.viewDetailsEmployee = exports.limitOffsetValidate = exports.getListOfTeamMemberByManagerId = exports.updateProfile = exports.resetPassword = exports.forgotPassword = exports.login = void 0;
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
    })
});
exports.forgotPassword = joi_1.default.object({
    email: joi_1.default.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required()
        .messages({
        "string.pattern.base": constants.MESSAGES.invalid_email
    }),
    user_role: joi_1.default.string().regex(new RegExp("^(?=.*[1-4])")).required(),
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
exports.updateProfile = joi_1.default.object({
    name: joi_1.default.string().optional(),
    phone_number: joi_1.default.string().min(8).max(12).optional(),
    country_code: joi_1.default.string().max(5).optional(),
    date_of_birth: joi_1.default.string().optional(),
    accomplishments: joi_1.default.string().optional(),
    profile_pic_url: joi_1.default.string().optional()
});
exports.getListOfTeamMemberByManagerId = joi_1.default.object({
    limit: joi_1.default.string().optional(),
    offset: joi_1.default.string().optional()
});
exports.limitOffsetValidate = joi_1.default.object({
    limit: joi_1.default.string().optional(),
    offset: joi_1.default.string().optional()
});
exports.viewDetailsEmployee = joi_1.default.object({
    id: joi_1.default.string().required()
});
exports.searchTeamMember = joi_1.default.object({
    search_string: joi_1.default.string().required(),
    limit: joi_1.default.string().optional(),
    offset: joi_1.default.string().optional()
});
exports.viewGoalAsManager = joi_1.default.object({
    search_string: joi_1.default.string().optional(),
    limit: joi_1.default.string().optional(),
    offset: joi_1.default.string().optional()
});
exports.editGoal = joi_1.default.object({
    id: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    start_date: joi_1.default.string().required(),
    end_date: joi_1.default.string().required(),
    select_measure: joi_1.default.string().required(),
    enter_measure: joi_1.default.string().required(),
    employee_ids: joi_1.default.string().required(),
});
// export const addGoal = Joi.object({
//   goal_details:Joi.string().required()
// });
exports.addGoal = joi_1.default.object().keys({
    goal_details: joi_1.default.array().items(joi_1.default.object({
        title: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        start_date: joi_1.default.string().required(),
        end_date: joi_1.default.string().required(),
        select_measure: joi_1.default.string().required(),
        enter_measure: joi_1.default.string().required(),
        employee_ids: joi_1.default.array().items(joi_1.default.number())
    }))
});
exports.submitGoalAsEmployee = joi_1.default.object({
    complete_measure: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    team_goal_assign_id: joi_1.default.string().required(),
    goal_id: joi_1.default.string().required()
});
//# sourceMappingURL=employeeSchema.js.map