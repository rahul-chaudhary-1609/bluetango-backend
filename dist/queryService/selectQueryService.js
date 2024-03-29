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
exports.getRawQueryResult = exports.selectAndCountAll = exports.selectAll = exports.selectData = void 0;
const constants = __importStar(require("../constants"));
const lodash_1 = __importDefault(require("lodash"));
const connection_1 = require("../connection");
/*
* function for select details
* @req : token, data
*
*/
exports.selectData = (model, condition) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectQueryServiceData;
        if (!lodash_1.default.isEmpty(model)) {
            if (!lodash_1.default.isEmpty(condition)) {
                selectQueryServiceData = yield model.findOne(condition);
            }
            else {
                throw new Error(constants.MESSAGES.request_validation_message);
            }
        }
        else {
            throw new Error(constants.MESSAGES.model_name_required);
        }
        return selectQueryServiceData;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.selectAll = (model, condition, attributes) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectQueryServiceData;
        if (!lodash_1.default.isEmpty(model)) {
            if (!lodash_1.default.isEmpty(condition)) {
                selectQueryServiceData = yield model.findAll(condition);
            }
            else {
                selectQueryServiceData = yield model.findAll();
            }
        }
        else {
            throw new Error(constants.MESSAGES.model_name_required);
        }
        return selectQueryServiceData;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.selectAndCountAll = (model, condition, attributes) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectQueryServiceData;
        if (!lodash_1.default.isEmpty(model)) {
            if (!lodash_1.default.isEmpty(condition)) {
                selectQueryServiceData = yield model.findAndCountAll(condition);
            }
            else {
                selectQueryServiceData = yield model.findAndCountAll();
            }
        }
        else {
            throw new Error(constants.MESSAGES.model_name_required);
        }
        return selectQueryServiceData;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.getRawQueryResult = (query, replacements) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield connection_1.rawQuery(query, replacements);
    return result[0];
});
//# sourceMappingURL=selectQueryService.js.map