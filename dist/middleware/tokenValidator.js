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
exports.validateEmployerToken = exports.validateEmployeeToken = exports.validateForgotPasswordToken = exports.validateAdminToken = void 0;
const constants = __importStar(require("../constants"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const employersService_1 = require("../services/admin/employersService");
//Instantiates a Home services  
const employersService = new employersService_1.EmployersService();
exports.validateAdminToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = Object.assign({}, constants.defaultServerResponse);
    try {
        if (!req.headers.authorization) {
            throw new Error(constants.MESSAGES.token_missing);
        }
        const token = req.headers.authorization;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ADMIN_SECRET_KEY || constants.ADMIN_SECRET_KEY);
        let payload = {
            uid: decoded.id,
            user_role: decoded.user_role
        };
        req.user = payload;
        let isUserExist = employersService.findAdminById(req.user);
        if (isUserExist) {
            response.status = 401;
            response.message = "User has been deleted please contact admin";
            return res.status(response.status).send(response);
        }
        return next();
    }
    catch (error) {
        response.message = error.message;
        response.status = 401;
    }
    return res.status(response.status).send(response);
});
exports.validateForgotPasswordToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = Object.assign({}, constants.defaultServerResponse);
    try {
        if (!req.headers.authorization) {
            throw new Error(constants.MESSAGES.token_missing);
        }
        const token = req.headers.authorization;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.FORGOT_PASSWORD_SECRET_KEY || constants.FORGOT_PASSWORD_SECRET_KEY);
        let payload = {
            uid: decoded.id,
            user_role: decoded.user_role
        };
        req.user = payload;
        return next();
    }
    catch (error) {
        response.message = error.message;
        response.status = 401;
    }
    return res.status(response.status).send(response);
});
exports.validateEmployeeToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = Object.assign({}, constants.defaultServerResponse);
    try {
        if (!req.headers.authorization) {
            throw new Error(constants.MESSAGES.token_missing);
        }
        const token = req.headers.authorization;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.EMPLOYEE_SECRET_KEY || constants.EMPLOYEE_SECRET_KEY);
        let payload = {
            uid: decoded.id,
            user_role: decoded.user_role
        };
        req.user = payload;
        return next();
    }
    catch (error) {
        response.message = error.message;
        response.status = 401;
    }
    return res.status(response.status).send(response);
});
exports.validateEmployerToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = Object.assign({}, constants.defaultServerResponse);
    try {
        if (!req.headers.authorization) {
            throw new Error(constants.MESSAGES.token_missing);
        }
        const token = req.headers.authorization;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.EMPLOYER_SECRET_KEY || constants.EMPLOYER_SECRET_KEY);
        let payload = {
            uid: decoded.id,
            user_role: decoded.user_role
        };
        req.user = payload;
        return next();
    }
    catch (error) {
        response.message = error.message;
        response.status = 401;
    }
    return res.status(response.status).send(response);
});
//# sourceMappingURL=tokenValidator.js.map