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
exports.AuthService = void 0;
const lodash_1 = __importDefault(require("lodash"));
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const tokenResponse = __importStar(require("../../utils/tokenResponse"));
const models_1 = require("../../models");
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
class AuthService {
    constructor() { }
    /**
    * login function
    @param {} params pass all parameters from request
    */
    login(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let existingUser = yield models_1.employersModel.findOne({
                where: {
                    email: params.username.toLowerCase(),
                    status: { [Op.in]: [0, 1] }
                }
            });
            if (!lodash_1.default.isEmpty(existingUser) && existingUser.status == 0) {
                throw new Error(constants.MESSAGES.deactivate_account);
            }
            else if (!lodash_1.default.isEmpty(existingUser) && existingUser.status == 2) {
                throw new Error(constants.MESSAGES.delete_account);
            }
            else if (!lodash_1.default.isEmpty(existingUser)) {
                existingUser = yield helperFunction.convertPromiseToObject(existingUser);
                let comparePassword = yield appUtils.comparePassword(params.password, existingUser.password);
                if (comparePassword) {
                    delete existingUser.password;
                    delete existingUser.reset_pass_otp;
                    let token = yield tokenResponse.employerTokenResponse(existingUser);
                    existingUser.token = token.token;
                    return existingUser;
                }
                else {
                    throw new Error(constants.MESSAGES.invalid_password);
                }
            }
            else {
                throw new Error(constants.MESSAGES.invalid_email);
            }
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map