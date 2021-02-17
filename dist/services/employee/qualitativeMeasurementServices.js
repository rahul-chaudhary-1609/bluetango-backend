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
exports.QualitativeMeasuremetServices = void 0;
const lodash_1 = __importDefault(require("lodash"));
const constants = __importStar(require("../../constants"));
const qualitativeMeasurement_1 = require("../../models/qualitativeMeasurement");
const managerTeamMember_1 = require("../../models/managerTeamMember");
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
class QualitativeMeasuremetServices {
    constructor() { }
    /*
    * function to add qualitative measurement
    */
    addQualitativeMeasurement(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let date = new Date();
            date.setMonth(date.getMonth() - 3);
            let dateCheck = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
            let checkManagerEmployee = yield managerTeamMember_1.managerTeamMemberModel.findOne({
                where: {
                    manager_id: user.uid,
                    team_member_id: params.employee_id
                }
            });
            if (lodash_1.default.isEmpty(checkManagerEmployee)) {
                throw new Error(constants.MESSAGES.invalid_employee_id);
            }
            let qualitativeMeasurementData = yield qualitativeMeasurement_1.qualitativeMeasurementModel.findOne({
                where: {
                    manager_id: user.uid,
                    employee_id: params.employee_id,
                    updatedAt: { [Op.gte]: dateCheck }
                }
            });
            params.manager_id = user.uid;
            if (lodash_1.default.isEmpty(qualitativeMeasurementData)) {
                return yield qualitativeMeasurement_1.qualitativeMeasurementModel.create(params);
            }
            else {
                throw new Error(constants.MESSAGES.add_qualitative_measure_check);
            }
        });
    }
    /*
    * get to add qualitative measurement
    */
    getQualitativeMeasurement(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield qualitativeMeasurement_1.qualitativeMeasurementModel.findAll({
                where: { employee_id: params.employee_id }
            });
        });
    }
}
exports.QualitativeMeasuremetServices = QualitativeMeasuremetServices;
//# sourceMappingURL=qualitativeMeasurementServices.js.map