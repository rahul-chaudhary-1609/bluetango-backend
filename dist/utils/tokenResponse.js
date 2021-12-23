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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmailToken = exports.verificationEmailToken = exports.bluetangoForgotPasswordTokenResponse = exports.forgotPasswordTokenResponse = exports.coachTokenResponse = exports.employerTokenResponse = exports.employeeTokenResponse = exports.adminTokenResponse = exports.bluetangoAdminTokenResponse = exports.tokenResponse = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants = __importStar(require("../constants"));
exports.tokenResponse = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({ id: obj.user_id, role: obj.role }, process.env.SECRET_KEY || constants.SECRET_KEY);
    return { token };
});
exports.bluetangoAdminTokenResponse = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({
        id: obj.id,
        user_role: obj.admin_role
    }, process.env.BLUETANGO_ADMIN_SECRET_KEY || constants.BLUETANGO_ADMIN_SECRET_KEY);
    return { token };
});
exports.adminTokenResponse = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({
        id: obj.id,
        user_role: obj.admin_role
    }, process.env.ADMIN_SECRET_KEY || constants.ADMIN_SECRET_KEY);
    return { token };
});
exports.employeeTokenResponse = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({
        id: obj.id,
        user_role: constants.USER_ROLE.employee
    }, process.env.EMPLOYEE_SECRET_KEY || constants.EMPLOYEE_SECRET_KEY);
    return { token };
});
exports.employerTokenResponse = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({
        id: obj.id,
        user_role: constants.USER_ROLE.employer
    }, process.env.EMPLOYER_SECRET_KEY || constants.EMPLOYER_SECRET_KEY);
    return { token };
});
exports.coachTokenResponse = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({
        id: obj.id,
        user_role: constants.USER_ROLE.coach
    }, process.env.COACH_SECRET_KEY || constants.COACH_SECRET_KEY);
    return { token };
});
exports.forgotPasswordTokenResponse = (obj, role) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({
        id: obj.id,
        user_role: role
    }, process.env.FORGOT_PASSWORD_SECRET_KEY || constants.FORGOT_PASSWORD_SECRET_KEY, { expiresIn: process.env.FORGOT_PASSWORD_LINK_EXPIRE_IN_MINUTES });
    return { token };
});
exports.bluetangoForgotPasswordTokenResponse = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({
        id: obj.id,
    }, process.env.BLUETANGO_FORGOT_PASSWORD_SECRET_KEY || constants.BLUETANGO_FORGOT_PASSWORD_SECRET_KEY, { expiresIn: process.env.FORGOT_PASSWORD_LINK_EXPIRE_IN_MINUTES });
    return { token };
});
exports.verificationEmailToken = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({ id: obj.id }, process.env.EMAIL_SECRET_KEY || constants.EMAIL_SECRET_KEY, { expiresIn: '1d' });
    return { token };
});
exports.validateEmailToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.EMAIL_SECRET_KEY || constants.EMAIL_SECRET_KEY);
        return decoded.id;
    }
    catch (error) {
        throw new Error(constants.MESSAGES.invalid_email_token);
    }
});
//# sourceMappingURL=tokenResponse.js.map