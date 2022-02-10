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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManagementService = void 0;
const models_1 = require("../../models");
const helperFunction = __importStar(require("../../utils/helperFunction"));
const appUtils = __importStar(require("../../utils/appUtils"));
const constants = __importStar(require("../../constants"));
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
const queryService = __importStar(require("../../queryService/bluetangoAdmin/queryService"));
const notification_1 = require("../../models/notification");
models_1.employeeCoachSessionsModel.hasOne(models_1.coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" });
models_1.employeeCoachSessionsModel.hasOne(models_1.employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id", as: 'team_level' });
models_1.employeeCoachSessionsModel.hasOne(models_1.coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id", as: 'coach_specialization_category' });
models_1.coachScheduleModel.hasOne(models_1.coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" });
models_1.employeeCoachSessionsModel.hasOne(models_1.coachScheduleModel, { foreignKey: "coach_id", sourceKey: "coach_id", targetKey: "coach_id" });
class SessionManagementService {
    constructor() { }
    /*
  *get Session List
  */
    getSessionList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let where = {};
            let Where = { app_id: constants.COACH_APP_ID.BT };
            let Wheres = {};
            if (params.searchKey && params.searchKey.trim()) {
                Where = {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${params.searchKey}%`
                            }
                        }
                    ]
                };
            }
            if (params.status) {
                where["status"] = params.status;
            }
            if (params.type) {
                where["type"] = params.type;
            }
            if (params.team_level_Id) {
                Wheres["id"] = params.team_level_Id;
            }
            let sessions = yield queryService.selectAndCountAll(models_1.employeeCoachSessionsModel, {
                where: where,
                include: [
                    {
                        model: models_1.coachManagementModel,
                        required: true,
                        attributes: [],
                        where: Where
                    },
                    {
                        model: models_1.employeeRanksModel,
                        where: Wheres,
                        required: true,
                        attributes: [],
                        as: 'team_level',
                    }
                ],
                raw: true,
                attributes: ["id", "coach_id", "query", "date", "start_time", "action", "slot_id", "end_time", "call_duration", "status", "type", [Sequelize.col('coach_management.name'), 'name'], [Sequelize.col('team_level.name'), 'team_level']]
            }, {});
            sessions.rows = sessions.rows.slice(offset, offset + limit);
            sessions.rows = appUtils.formatPassedAwayTime(sessions.rows);
            return sessions;
        });
    }
    /*
 *get Session details
 */
    getSessionDetail(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {};
            if (params.id) {
                where["id"] = params.id;
            }
            let sessions = yield queryService.selectOne(models_1.employeeCoachSessionsModel, {
                where: where,
                include: [
                    {
                        model: models_1.coachManagementModel,
                        required: true,
                        attributes: [],
                        where: { app_id: constants.COACH_APP_ID.BT }
                    },
                    {
                        model: models_1.employeeRanksModel,
                        required: true,
                        attributes: [],
                        as: 'team_level',
                    },
                    {
                        model: models_1.coachSpecializationCategoriesModel,
                        required: true,
                        attributes: [],
                        as: 'coach_specialization_category',
                    }
                ],
                raw: true,
                attributes: ["id", "comment", "coach_rating", "cancelled_by", "request_received_date", "employee_rank_id", "coach_specialization_category_id", "coach_id", "slot_id", "date", "timeline", "start_time", "end_time", "call_duration", "status", "type", [Sequelize.col('coach_management.name'), 'name'], [Sequelize.col('coach_management.email'), 'email'], [Sequelize.col('team_level.name'), 'team_level'], [Sequelize.col('coach_specialization_category.name'), 'coach_specialization_category']]
            });
            if (sessions) {
                return appUtils.formatPassedAwayTime([sessions])[0];
            }
            return sessions;
        });
    }
    /*
*perform action on sessions
*/
    performAction(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let Sessions = yield this.getSessionDetail(params);
            params.model = models_1.employeeCoachSessionsModel;
            params.action_by = constants.ACTION_BY.admin;
            if (Sessions.timeline) {
                params.timeline = [...Sessions.timeline, {
                        "name": Sessions.name,
                        "request_received": Sessions.request_received_date,
                        "status": "Sent",
                        "action": Number(params.action),
                        "action_by": constants.ACTION_BY.admin
                    }];
            }
            else {
                params.timeline = [{
                        "name": Sessions.name,
                        "request_received": Sessions.request_received_date,
                        "status": "Sent",
                        "action": Number(params.action),
                        "action_by": constants.ACTION_BY.admin
                    }];
            }
            params.request_received_date = Date.now();
            let sessions = yield queryService.updateData(params, { returning: true, where: { id: params.id } });
            yield queryService.updateData({ model: models_1.coachScheduleModel, status: 2 }, { where: { id: params.slot_id } });
            //send push notification
            if (Number(params.action) == 4) {
                models_1.employeeCoachSessionsModel.hasOne(models_1.coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" });
                models_1.employeeCoachSessionsModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
                let session = yield queryService.selectAndCountAll(models_1.employeeCoachSessionsModel, {
                    where: { id: params.id },
                    include: [
                        {
                            model: models_1.coachManagementModel,
                            required: true,
                            attributes: ["id", "name", "device_token"],
                        },
                        {
                            model: models_1.employeeModel,
                            required: true,
                            attributes: ["id", "name"],
                        },
                    ],
                    raw: true,
                });
                //add notification 
                let notificationObj = {
                    type_id: session.id,
                    sender_id: user.uid,
                    reciever_id: session.coach_id,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
                    type: constants.NOTIFICATION_TYPE.session_reassigned,
                    data: {
                        type: constants.NOTIFICATION_TYPE.session_reassigned,
                        title: 'Sesssion assigned by admin',
                        message: `Admin has assigned session for ${session.employee.name} on ${session.date} at ${session.start_time}`,
                        senderEmployeeData: { id: user.uid },
                    },
                };
                yield notification_1.notificationModel.create(notificationObj);
                let notificationData = {
                    title: 'Sesssion assigned by admin',
                    message: `Admin has assigned session for ${session.employee.name} on ${session.date} at ${session.start_time}`,
                    data: {
                        type: constants.NOTIFICATION_TYPE.session_reassigned,
                        title: 'Sesssion assigned by admin',
                        message: `Admin has assigned session for ${session.employee.name} on ${session.date} at ${session.start_time}`,
                        senderEmployeeData: { id: user.uid },
                    },
                };
                yield helperFunction.sendFcmNotification([session.coach_management.device_token], notificationData);
                let mailParams = {};
                mailParams.to = Sessions.email;
                mailParams.html = `Hi  ${Sessions.name}
                <br>A new session is assigned to you by admin with session id:${Sessions.id}
                `;
                mailParams.subject = "Session Assign";
                mailParams.name = "BlueTango";
                //await helperFunction.sendEmail(mailParams);
            }
            return sessions;
        });
    }
    /*
*get Availabile Coaches
*/
    getAvailabileCoaches(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let Sessions = yield this.getSessionDetail(params);
            let availableCoaches = { rows: [], count: 0 };
            if (Sessions) {
                let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
                let where = {};
                let Where = { app_id: constants.COACH_APP_ID.BT };
                where = {
                    date: [Sessions.date],
                    [Op.or]: [
                        // {
                        //     start_time: {
                        //         [Op.between]: [
                        //             Sessions.start_time,
                        //             Sessions.end_time,
                        //         ]
                        //     },
                        // },
                        // {
                        //     end_time: {
                        //         [Op.between]: [
                        //             Sessions.start_time,
                        //             Sessions.end_time,
                        //         ]
                        //     },
                        // },
                        {
                            [Op.and]: [
                                {
                                    start_time: {
                                        [Op.lte]: Sessions.start_time,
                                    },
                                },
                                {
                                    end_time: {
                                        [Op.gte]: Sessions.end_time,
                                    },
                                },
                            ],
                        }
                    ]
                };
                Where["coach_specialization_category_ids"] = { [Op.contains]: [Sessions.coach_specialization_category_id] };
                Where["employee_rank_ids"] = { [Op.contains]: [Sessions.employee_rank_id] };
                availableCoaches = yield queryService.selectAndCountAll(models_1.coachScheduleModel, {
                    where: where,
                    include: [
                        {
                            model: models_1.coachManagementModel,
                            where: Where,
                            required: true,
                            attributes: [],
                        }
                    ],
                    raw: true,
                    attributes: ["id", "date", "start_time", "end_time", "coach_id", "status", [Sequelize.col('coach_management.name'), 'name'], [Sequelize.col('coach_management.email'), 'email'], [Sequelize.col('coach_management.phone_number'), 'phone_number']]
                }, {});
                availableCoaches.rows.forEach((element, index, arr) => {
                    arr[index]["coach_specialization_category"] = Sessions.coach_specialization_category;
                    arr[index]["team_level"] = Sessions.team_level,
                        arr[index]["session_id"] = Sessions.id;
                });
                availableCoaches.rows = availableCoaches.rows.slice(offset, offset + limit);
                return availableCoaches;
            }
            return availableCoaches;
        });
    }
}
exports.SessionManagementService = SessionManagementService;
//# sourceMappingURL=sessionManagementService.js.map