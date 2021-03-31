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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQueryParams = exports.validateBody = void 0;
const constants = __importStar(require("../constants"));
const appUtils_1 = require("../utils/appUtils");
/* function for validating the schema */
const validateObjectSchema = (data, schema) => {
    const result = schema.validate(data);
    if (result.error) {
        const errorDetails = result.error.details.map(value => {
            return {
                message: value.message,
                path: value.path
            };
        });
        return errorDetails;
    }
    return null;
};
/* function for validating the request body */
exports.validateBody = (schema) => {
    return (req, res, next) => {
        const error = validateObjectSchema(req.body, schema);
        if (error) {
            return appUtils_1.errorResponse(res, error, constants.code.error_code, error[0].message.split('"').join(""));
        }
        return next();
    };
};
/* function for validating the request params */
exports.validateQueryParams = (schema) => {
    return (req, res, next) => {
        const error = validateObjectSchema(req.query, schema);
        if (error) {
            return appUtils_1.errorResponse(res, error, constants.code.error_code, error[0].message.split('"').join(""));
        }
        return next();
    };
};
/* function for validating the request params */
exports.validateParams = (schema) => {
    return (req, res, next) => {
        const error = validateObjectSchema(req.params, schema);
        if (error) {
            return appUtils_1.errorResponse(res, error, constants.code.error_code, error[0].message.split('"').join(""));
        }
        return next();
    };
};
//# sourceMappingURL=joiSchemaValidation.js.map