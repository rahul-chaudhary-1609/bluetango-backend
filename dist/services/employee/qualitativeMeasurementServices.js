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
const helperFunction = __importStar(require("../../utils/helperFunction"));
const qualitativeMeasurement_1 = require("../../models/qualitativeMeasurement");
const attributeRatings_1 = require("../../models/attributeRatings");
const qualitativeMeasurementComment_1 = require("../../models/qualitativeMeasurementComment");
const managerTeamMember_1 = require("../../models/managerTeamMember");
const employee_1 = require("../../models/employee");
const notification_1 = require("../../models/notification");
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
            //let dateCheck = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate(); 
            let dateCheck = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
            let employeeData = yield employee_1.employeeModel.findOne({
                where: { id: params.employee_id }
            });
            let managerData = yield employee_1.employeeModel.findOne({
                where: { id: params.employee_id }
            });
            delete managerData.password;
            if (lodash_1.default.isEmpty(qualitativeMeasurementData)) {
                let resData = yield qualitativeMeasurement_1.qualitativeMeasurementModel.create(params);
                // add notification for employee
                let notificationObj = {
                    type_id: resData.id,
                    sender_id: user.uid,
                    reciever_id: params.employee_id,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: constants.NOTIFICATION_TYPE.rating,
                    data: {
                        type: constants.NOTIFICATION_TYPE.rating,
                        title: 'New rating',
                        //message: `your manager has given rating to you`,
                        message: `Your rating has been updated`,
                        id: resData.id,
                        senderEmplyeeData: managerData,
                    },
                };
                yield notification_1.notificationModel.create(notificationObj);
                // send push notification
                let notificationData = {
                    title: 'New rating',
                    body: `Your rating has been updated`,
                    data: {
                        type: constants.NOTIFICATION_TYPE.rating,
                        title: 'New rating',
                        message: `Your rating has been updated`,
                        id: resData.id,
                        senderEmplyeeData: managerData,
                    },
                };
                yield helperFunction.sendFcmNotification([employeeData.device_token], notificationData);
                return resData;
            }
            else {
                throw new Error(constants.MESSAGES.add_qualitative_measure_check);
            }
        });
    }
    addAttributeRatings(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let date = new Date();
            date.setMonth(date.getMonth() - 3);
            //let dateCheck = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate(); 
            let dateCheck = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            let checkManagerEmployee = yield managerTeamMember_1.managerTeamMemberModel.findOne({
                where: {
                    manager_id: user.uid,
                    team_member_id: params.employee_id
                }
            });
            if (lodash_1.default.isEmpty(checkManagerEmployee)) {
                throw new Error(constants.MESSAGES.invalid_employee_id);
            }
            let attributeRating = yield attributeRatings_1.attributeRatingModel.findOne({
                where: {
                    manager_id: user.uid,
                    employee_id: params.employee_id,
                    updatedAt: { [Op.gte]: dateCheck }
                }
            });
            params.manager_id = user.uid;
            let employeeData = yield employee_1.employeeModel.findOne({
                where: { id: params.employee_id }
            });
            let managerData = yield employee_1.employeeModel.findOne({
                where: { id: params.employee_id }
            });
            delete managerData.password;
            if (lodash_1.default.isEmpty(attributeRating)) {
                let resData = yield attributeRatings_1.attributeRatingModel.create(params);
                // add notification for employee
                let notificationObj = {
                    type_id: resData.id,
                    sender_id: user.uid,
                    reciever_id: params.employee_id,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: constants.NOTIFICATION_TYPE.rating,
                    data: {
                        type: constants.NOTIFICATION_TYPE.rating,
                        title: 'New rating',
                        //message: `your manager has given rating to you`,
                        message: `Your rating has been updated`,
                        id: resData.id,
                        senderEmplyeeData: managerData,
                    },
                };
                yield notification_1.notificationModel.create(notificationObj);
                // send push notification
                let notificationData = {
                    title: 'New rating',
                    body: `Your rating has been updated`,
                    data: {
                        type: constants.NOTIFICATION_TYPE.rating,
                        title: 'New rating',
                        message: `Your rating has been updated`,
                        id: resData.id,
                        senderEmplyeeData: managerData,
                    },
                };
                yield helperFunction.sendFcmNotification([employeeData.device_token], notificationData);
                return resData;
            }
            else {
                throw new Error(constants.MESSAGES.add_qualitative_measure_check);
            }
        });
    }
    /*
    * get to add qualitative measurement
    */
    getQualitativeMeasurement(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            qualitativeMeasurement_1.qualitativeMeasurementModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            let qualitativeMeasurement = yield helperFunction.convertPromiseToObject(yield qualitativeMeasurement_1.qualitativeMeasurementModel.findAll({
                where: { employee_id: params.employee_id ? params.employee_id : user.uid },
                attributes: ["id", "manager_id", "employee_id", "createdAt", "updatedAt",
                    ["initiative", "Initiative"], ["initiative_desc", "Initiative_desc"],
                    ["ability_to_delegate", "Ability to Delegate"], ["ability_to_delegate_desc", "Ability to Delegate_desc"],
                    ["clear_Communication", "Clear Communication"], ["clear_Communication_desc", "Clear Communication_desc"],
                    //    ["self_awareness_of_strengths_and_weaknesses", "Self-awareness of strengths and weaknesses"], ["self_awareness_of_strengths_and_weaknesses_desc", "Self-awareness of strengths and weaknesses_desc"],
                    ["agile_thinking", "Agile Thinking"], ["agile_thinking_desc", "Agile Thinking_desc"],
                    //    ["influence", "Influence"], ["influence_desc", "Influence_desc"],
                    ["empathy", "Empathy"], ["empathy_desc", "Empathy_desc"],
                ],
                include: [
                    {
                        model: employee_1.employeeModel,
                        required: true,
                        attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                    }
                ],
                order: [["updatedAt", "DESC"]],
                limit: 1
            }));
            if (qualitativeMeasurement.length === 0)
                throw new Error(constants.MESSAGES.no_qualitative_measure);
            let startDate = new Date(qualitativeMeasurement[0].createdAt);
            let endDate = new Date(qualitativeMeasurement[0].createdAt);
            endDate.setMonth(startDate.getMonth() + 3);
            let result = {
                id: qualitativeMeasurement[0].id,
                manager_id: qualitativeMeasurement[0].manager_id,
                employee_id: qualitativeMeasurement[0].employee_id,
                startDate,
                endDate,
                createdAt: qualitativeMeasurement[0].createdAt,
                updatedAt: qualitativeMeasurement[0].updatedAt,
                qualitativeMeasures: [],
            };
            for (let key in qualitativeMeasurement[0]) {
                if ([
                    "Initiative",
                    "Ability to Delegate",
                    "Clear Communication",
                    //    "Self-awareness of strengths and weaknesses",
                    "Agile Thinking",
                    //    "Influence",
                    "Empathy",
                ].includes(key)) {
                    result.qualitativeMeasures.push({
                        label: key,
                        rating: qualitativeMeasurement[0][key],
                        desc: qualitativeMeasurement[0][`${key}_desc`]
                    });
                }
            }
            result['employee'] = qualitativeMeasurement[0].employee;
            return result;
        });
    }
    /*
    * get to add qualitative measurement details
    */
    getQualitativeMeasurementDetails(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = { status: constants.STATUS.active };
            if (params.name) {
                where = Object.assign(Object.assign({}, where), { name: params.name });
            }
            return yield qualitativeMeasurementComment_1.qualitativeMeasurementCommentModel.findAll({
                where: where,
            });
        });
    }
    /*
    * get qualitative measurement comment list
    */
    getQuantitativeMeasurementCommentList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield qualitativeMeasurementComment_1.qualitativeMeasurementCommentModel.findAll({
                where: { status: constants.STATUS.active }
            });
        });
    }
}
exports.QualitativeMeasuremetServices = QualitativeMeasuremetServices;
//# sourceMappingURL=qualitativeMeasurementServices.js.map