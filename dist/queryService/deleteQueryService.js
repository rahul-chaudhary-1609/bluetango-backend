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
exports.deleteModel = exports.deleteData = void 0;
const constants = __importStar(require("../constants"));
const lodash_1 = __importDefault(require("lodash"));
/*
* function for delete details
* @req : token, data
*
*/
exports.deleteData = (params, condition) => __awaiter(void 0, void 0, void 0, function* () {
    let deleteQueryServiceData;
    if (!lodash_1.default.isEmpty(params.model)) {
        if (!lodash_1.default.isEmpty(params) && !lodash_1.default.isEmpty(condition)) {
            let model = params.model;
            deleteQueryServiceData = yield model.destroy(params, { where: condition });
        }
        else {
            throw new Error(constants.MESSAGES.request_validation_message);
        }
    }
    else {
        throw new Error(constants.MESSAGES.model_name_required);
    }
    return deleteQueryServiceData;
});
exports.deleteModel = (model) => __awaiter(void 0, void 0, void 0, function* () {
    let deleteQueryServiceData;
    if (!lodash_1.default.isEmpty(model)) {
        deleteQueryServiceData = yield model.destroy();
    }
    else {
        throw new Error(constants.MESSAGES.model_name_required);
    }
    return deleteQueryServiceData;
});
//# sourceMappingURL=deleteQueryService.js.map