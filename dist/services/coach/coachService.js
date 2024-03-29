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
exports.CoachService = void 0;
const constants = __importStar(require("../../constants"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const coachSchedule_1 = require("../../models/coachSchedule");
const employeeCoachSession_1 = require("../../models/employeeCoachSession");
const models_1 = require("../../models");
const coachSpecializationCategories_1 = require("../../models/coachSpecializationCategories");
const chatRelationMappingInRoom_1 = require("../../models/chatRelationMappingInRoom");
const employeeRanks_1 = require("../../models/employeeRanks");
const Sequelize = require('sequelize');
const moment = require("moment");
var Op = Sequelize.Op;
const appUtils = __importStar(require("../../utils/appUtils"));
const queryService = __importStar(require("../../queryService/bluetangoAdmin/queryService"));
const notification_1 = require("../../models/notification");
class CoachService {
    constructor() { }
    addEditSlot(params, user) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (params.type == constants.COACH_SCHEDULE_TYPE.weekly && !params.day)
                throw new Error(constants.MESSAGES.coach_schedule_day_required);
            if (params.type == constants.COACH_SCHEDULE_TYPE.custom && ((_a = params.custom_dates) === null || _a === void 0 ? void 0 : _a.length) == 0)
                throw new Error(constants.MESSAGES.coach_schedule_custom_dates_required);
            let dates = [];
            //// new automatically created slots
            let Slots;
            let validslots = [];
            Slots = yield appUtils.calculate_time_slot(appUtils.parseTime(constants.DEFAAULT_START_END_TIME.start_time.replace('00', params.timings[0].start_time.split(":")[1])), appUtils.parseTime(constants.DEFAAULT_START_END_TIME.end_time), params.session_duration);
            for (let i = 0; i < Slots.length; i++) {
                if (Slots[i + 1]) {
                    validslots.push({ start_time: Slots[i], end_time: Slots[i + 1] });
                }
            }
            switch (parseInt(params.time_capture_type)) {
                case constants.TIME_CAPTURE_TYPE.available: {
                    let validslotss = yield appUtils.validateUnavailableTime(params.timings, validslots, params.time_capture_type);
                    return validslotss;
                    break;
                }
                case constants.TIME_CAPTURE_TYPE.unavailable: {
                    let validslotss = yield appUtils.validateUnavailableTime(params.timings, validslots, params.time_capture_type);
                    return validslotss;
                    break;
                }
                case constants.TIME_CAPTURE_TYPE.previewed: {
                    validslots = params.validslots;
                    break;
                }
            }
            ///////
            switch (parseInt(params.type)) {
                case constants.COACH_SCHEDULE_TYPE.does_not_repeat:
                    dates.push(params.date);
                    break;
                case constants.COACH_SCHEDULE_TYPE.daily: {
                    let start = new Date(params.date);
                    let end = new Date(params.date);
                    end.setFullYear(start.getFullYear() + 1);
                    while (start < end) {
                        dates.push(moment(start).format("YYYY-MM-DD"));
                        start.setDate(start.getDate() + 1);
                    }
                    break;
                }
                case constants.COACH_SCHEDULE_TYPE.every_week_day: {
                    let start = new Date(params.date);
                    let end = new Date(params.date);
                    end.setFullYear(start.getFullYear() + 1);
                    while (start < end) {
                        if (![constants.COACH_SCHEDULE_DAY.saturday, constants.COACH_SCHEDULE_DAY.sunday].includes(parseInt(moment(start).format('d')))) {
                            dates.push(moment(start).format("YYYY-MM-DD"));
                        }
                        start.setDate(start.getDate() + 1);
                    }
                    break;
                }
                case constants.COACH_SCHEDULE_TYPE.weekly: {
                    if (params.custom_dates) {
                        params.custom_dates.forEach(element => {
                            for (let d = 0; d < params.day.length; d++) {
                                if (params.day[d] == parseInt(moment(element).format('d'))) {
                                    dates.push(moment(element).format("YYYY-MM-DD"));
                                }
                            }
                        });
                    }
                    else {
                        let start = new Date(params.date);
                        let end = new Date(params.date);
                        end.setFullYear(start.getFullYear() + 1);
                        while (start < end) {
                            for (let d = 0; d < params.day.length; d++) {
                                if (params.day[d] == parseInt(moment(start).format('d'))) {
                                    dates.push(moment(start).format("YYYY-MM-DD"));
                                }
                            }
                            start.setDate(start.getDate() + 1);
                        }
                    }
                    break;
                }
                case constants.COACH_SCHEDULE_TYPE.custom: {
                    let start = new Date(params.date);
                    let end = new Date(params.custom_date);
                    while (start <= end) {
                        dates.push(moment(start).format("YYYY-MM-DD"));
                        start.setDate(start.getDate() + 1);
                    }
                    break;
                }
                // case constants.COACH_SCHEDULE_TYPE.custom:{
                //     for(let date of params.custom_dates){
                //         dates.push(date)
                //     }
                //     break
                // }
            }
            let schedules = [];
            let slot_time_group_id = yield helperFunction.getUniqueSlotTimeGroupId();
            let slots = validslots;
            params.slots = validslots;
            slots.forEach((slot) => {
                let keys = Object.keys(slot);
                let index = keys.indexOf("is_available");
                keys.splice(index, 1);
                keys.forEach((key) => {
                    slot[key] = slot[key].replace(/:/g, "");
                });
            });
            // slots.forEach((slot1, index1) => {
            //     if (!(slot1.start_time < slot1.end_time)) {
            //         throw new Error(constants.MESSAGES.coach_schedule_start_greater_or_equal_end)
            //     }
            //     Object.keys(slot1).forEach((key) => {
            //         slots.forEach((slot2, index2) => {
            //             console.log(slot1[key],slot2.start_time,slot1[key],slot2.end_time,index1,index2)
            //             if (slot1[key] >= slot2.start_time && slot1[key] <= slot2.end_time && index1 != index2) {
            //                 throw new Error(constants.MESSAGES.coach_schedule_overlaped)
            //             }
            //         })
            //     })
            // })
            slots.forEach((slot) => {
                let keys = Object.keys(slot);
                let index = keys.indexOf("is_available");
                keys.splice(index, 1);
                keys.forEach((key) => {
                    slot[key] = moment(slot[key], "HHmmss").format("HH:mm:ss");
                });
            });
            if (params.is_update) {
                var slot_type = params.slot_type == 1 ? Op.between : Op.notBetween;
                let bookedSlots = [];
                let bookedSlotsIds = [];
                for (let timings of params.timings) {
                    var BookedSlots = yield queryService.selectAndCountAll(coachSchedule_1.coachScheduleModel, {
                        where: {
                            id: {
                                [Op.notIn]: bookedSlotsIds
                            },
                            coach_id: user.uid,
                            status: constants.COACH_SCHEDULE_STATUS.booked,
                            date: {
                                [Op.in]: dates,
                            },
                            [Op.and]: [
                                {
                                    start_time: {
                                        [slot_type]: [
                                            timings.start_time,
                                            timings.end_time,
                                        ]
                                    },
                                },
                                {
                                    end_time: {
                                        [slot_type]: [
                                            timings.start_time,
                                            timings.end_time,
                                        ]
                                    },
                                }
                            ]
                        }
                    }, {});
                    bookedSlotsIds.push(...BookedSlots.rows.map((ele) => ele.id));
                    bookedSlots.push(...BookedSlots.rows);
                }
                if (bookedSlots.length >= 1) {
                    return { bookedSlots: bookedSlots };
                }
                for (let Timings of params.timings) {
                    yield queryService.deleteData(coachSchedule_1.coachScheduleModel, {
                        where: {
                            coach_id: user.uid,
                            date: {
                                [Op.in]: dates,
                            },
                            [Op.and]: [
                                {
                                    start_time: {
                                        [slot_type]: [
                                            Timings.start_time,
                                            Timings.end_time,
                                        ]
                                    },
                                },
                                {
                                    end_time: {
                                        [slot_type]: [
                                            Timings.start_time,
                                            Timings.end_time,
                                        ]
                                    },
                                }
                            ]
                        }
                    });
                }
            }
            for (let slot of params.slots) {
                let schedule = yield coachSchedule_1.coachScheduleModel.findOne({
                    where: {
                        coach_id: user.uid,
                        date: {
                            [Op.in]: dates,
                        },
                        [Op.and]: [
                            {
                                start_time: {
                                    [Op.between]: [
                                        slot.start_time,
                                        slot.end_time,
                                    ]
                                },
                            },
                            {
                                end_time: {
                                    [Op.between]: [
                                        slot.start_time,
                                        slot.end_time,
                                    ]
                                },
                            },
                        ],
                    }
                });
                if (schedule)
                    throw new Error(constants.MESSAGES.coach_schedule_already_exist);
                let slot_date_group_id = yield helperFunction.getUniqueSlotDateGroupId();
                for (let date of dates) {
                    schedules.push({
                        slot_date_group_id,
                        slot_time_group_id,
                        coach_id: user.uid,
                        date,
                        start_time: slot.start_time,
                        end_time: slot.end_time,
                        type: params.type,
                        day: params.type == constants.COACH_SCHEDULE_TYPE.weekly ? params.day : null,
                        custom_date: params.type == constants.COACH_SCHEDULE_TYPE.custom ? params.custom_date : null,
                        custom_dates: null,
                        is_available: slot.is_available,
                        status: slot.is_available
                    });
                }
            }
            if (schedules.length < 1000) {
                yield coachSchedule_1.coachScheduleModel.bulkCreate(schedules);
                return true;
            }
            else {
                let size = schedules.length;
                let start = 0;
                let end = 999;
                while (size > 0) {
                    yield coachSchedule_1.coachScheduleModel.bulkCreate(schedules.slice(start, end));
                    start = start + 999;
                    end = end + 999;
                    size = size - 999;
                }
                return true;
            }
        });
    }
    getSlots(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("params", params);
            let where = {
                coach_id: user.uid,
                status: {
                    [Op.notIn]: [constants.COACH_SCHEDULE_STATUS.passed]
                }
            };
            let start_date = new Date();
            let end_date = new Date();
            if (params.filter_key) {
                if (params.filter_key == "Daily") {
                    where = Object.assign(Object.assign({}, where), { date: moment(new Date()).format("YYYY-MM-DD") });
                }
                else if (params.filter_key == "Weekly") {
                    start_date = helperFunction.getMonday(start_date);
                    end_date = helperFunction.getMonday(start_date);
                    end_date.setDate(start_date.getDate() + 6);
                    where = Object.assign(Object.assign({}, where), { date: {
                            [Op.between]: [
                                moment(start_date).format("YYYY-MM-DD"),
                                moment(end_date).format("YYYY-MM-DD")
                            ]
                        } });
                }
                else if (params.filter_key == "Monthly") {
                    start_date.setDate(1);
                    end_date.setMonth(start_date.getMonth() + 1);
                    end_date.setDate(1);
                    end_date.setDate(end_date.getDate() - 1);
                    where = Object.assign(Object.assign({}, where), { date: {
                            [Op.between]: [
                                moment(start_date).format("YYYY-MM-DD"),
                                moment(end_date).format("YYYY-MM-DD")
                            ]
                        } });
                }
                else if (params.filter_key == "Yearly") {
                    start_date.setDate(1);
                    start_date.setMonth(0);
                    end_date.setDate(1);
                    end_date.setMonth(0);
                    end_date.setFullYear(end_date.getFullYear() + 1);
                    end_date.setDate(end_date.getDate() - 1);
                    where = Object.assign(Object.assign({}, where), { date: {
                            [Op.between]: [
                                moment(start_date).format("YYYY-MM-DD"),
                                moment(end_date).format("YYYY-MM-DD")
                            ]
                        } });
                }
            }
            else if ((params.day && params.month && params.year) || params.date) {
                where = Object.assign(Object.assign({}, where), { date: params.date || `${params.year}-${params.month}-${params.day}` });
            }
            else if (params.week && params.year) {
                where = {
                    [Op.and]: [
                        Object.assign({}, where),
                        Sequelize.where(Sequelize.fn("date_part", "year", Sequelize.col("date")), "=", params.year),
                        Sequelize.where(Sequelize.fn("date_part", "week", Sequelize.col("date")), "=", params.week),
                    ]
                };
            }
            else if (params.month && params.year) {
                where = {
                    [Op.and]: [
                        Object.assign({}, where),
                        Sequelize.where(Sequelize.fn("date_part", "year", Sequelize.col("date")), "=", params.year),
                        Sequelize.where(Sequelize.fn("date_part", "month", Sequelize.col("date")), "=", params.month),
                    ]
                };
            }
            else if (params.year) {
                where = {
                    [Op.and]: [
                        Object.assign({}, where),
                        Sequelize.where(Sequelize.fn("date_part", "year", Sequelize.col("date")), "=", params.year),
                    ]
                };
            }
            else {
                start_date.setDate(1);
                end_date.setMonth(start_date.getMonth() + 1);
                end_date.setDate(1);
                end_date.setDate(end_date.getDate() - 1);
                where = Object.assign(Object.assign({}, where), { date: {
                        [Op.between]: [
                            moment(start_date).format("YYYY-MM-DD"),
                            moment(end_date).format("YYYY-MM-DD")
                        ]
                    } });
            }
            return yield helperFunction.convertPromiseToObject(yield coachSchedule_1.coachScheduleModel.findAndCountAll({
                where,
                order: [["date", "ASC"], ["start_time", "ASC"]]
            }));
        });
    }
    getSlot(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let schedule = yield helperFunction.convertPromiseToObject(yield coachSchedule_1.coachScheduleModel.findByPk(parseInt(params.slot_id)));
            if (!schedule)
                throw new Error(constants.MESSAGES.no_coach_schedule);
            return schedule;
        });
    }
    deleteSlot(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.individual && !params.slot_id)
                throw new Error(constants.MESSAGES.slot_id_required);
            if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && params.group_type == constants.COACH_SCHEDULE_SLOT_GROUP_DELETE_TYPE.date && !params.slot_date_group_id)
                throw new Error(constants.MESSAGES.slot_date_group_id_required);
            if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && params.group_type == constants.COACH_SCHEDULE_SLOT_GROUP_DELETE_TYPE.time && !params.slot_time_group_id)
                throw new Error(constants.MESSAGES.slot_time_group_id_required);
            if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && !params.current_date)
                throw new Error(constants.MESSAGES.slot_group_delete_date_required);
            if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.individual) {
                let schedule = yield coachSchedule_1.coachScheduleModel.findByPk(parseInt(params.slot_id));
                if (!schedule)
                    throw new Error(constants.MESSAGES.no_coach_schedule);
                schedule.destroy();
            }
            else if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && params.slot_date_group_id) {
                let schedules = yield coachSchedule_1.coachScheduleModel.findAll({
                    where: {
                        slot_date_group_id: params.slot_date_group_id,
                        date: {
                            [Op.gte]: params.current_date,
                        }
                    }
                });
                if (schedules.length == 0)
                    throw new Error(constants.MESSAGES.no_coach_schedule);
                yield coachSchedule_1.coachScheduleModel.destroy({
                    where: {
                        slot_date_group_id: params.slot_date_group_id,
                        date: {
                            [Op.gte]: params.current_date,
                        }
                    }
                });
            }
            else if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && params.slot_time_group_id) {
                let schedules = yield coachSchedule_1.coachScheduleModel.findAll({
                    where: {
                        slot_time_group_id: params.slot_time_group_id,
                        date: {
                            [Op.gte]: params.current_date,
                        }
                    }
                });
                if (schedules.length == 0)
                    throw new Error(constants.MESSAGES.no_coach_schedule);
                yield coachSchedule_1.coachScheduleModel.destroy({
                    where: {
                        slot_time_group_id: params.slot_time_group_id,
                        date: {
                            [Op.gte]: params.current_date,
                        }
                    }
                });
            }
            return true;
        });
    }
    getSessionRequests(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(coachSpecializationCategories_1.coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(employeeRanks_1.employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });
            if (params.datetime) {
                let sessions = yield helperFunction.convertPromiseToObject(yield employeeCoachSession_1.employeeCoachSessionsModel.findAll({
                    where: {
                        coach_id: user.uid,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.pending,
                    }
                }));
                for (let session of sessions) {
                    let startTime = moment(`${params.datetime}`, "YYYY-MM-DD HH:mm:ss");
                    let endTime = moment(`${session.date} ${session.end_time}`, "YYYY-MM-DD HH:mm:ss");
                    let duration = moment.duration(endTime.diff(startTime));
                    let secondDiff = Math.ceil(duration.asSeconds());
                    if (secondDiff <= 0) {
                        yield employeeCoachSession_1.employeeCoachSessionsModel.update({
                            status: constants.EMPLOYEE_COACH_SESSION_STATUS.rejected,
                        }, {
                            where: {
                                id: session.id,
                            }
                        });
                    }
                }
            }
            let query = {
                order: [["date"], ["start_time"]]
            };
            query.where = {
                coach_id: user.uid,
                status: constants.EMPLOYEE_COACH_SESSION_STATUS.pending,
            };
            if (params.is_pagination && params.is_pagination == constants.IS_PAGINATION.yes) {
                let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
                query.offset = offset;
                query.limit = limit;
            }
            query.include = [
                {
                    model: models_1.employeeModel,
                    attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'energy_last_updated', 'profile_pic_url'],
                },
                {
                    model: coachSpecializationCategories_1.coachSpecializationCategoriesModel,
                    attributes: ['id', 'name', 'description'],
                },
                {
                    model: employeeRanks_1.employeeRanksModel,
                    attributes: ['id', 'name', 'description'],
                }
            ];
            let sessions = yield helperFunction.convertPromiseToObject(yield employeeCoachSession_1.employeeCoachSessionsModel.findAndCountAll(query));
            for (let session of sessions.rows) {
                session.chatRoom = yield helperFunction.convertPromiseToObject(yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findOne({
                    where: {
                        user_id: session.employee_id,
                        other_user_id: session.coach_id,
                        type: constants.CHAT_ROOM_TYPE.coach,
                        status: constants.STATUS.active,
                    }
                }));
                if (session.chatRoom) {
                    session.chatRoom.user = yield helperFunction.convertPromiseToObject(yield models_1.employeeModel.findOne({
                        attributes: ['id', 'name', 'profile_pic_url', 'status'],
                        where: {
                            id: session.employee_id,
                        }
                    }));
                    session.chatRoom.other_user = yield helperFunction.convertPromiseToObject(yield models_1.coachManagementModel.findOne({
                        attributes: ['id', 'name', ['image', 'profile_pic_url']],
                        where: {
                            id: session.coach_id,
                        }
                    }));
                }
            }
            return sessions;
        });
    }
    acceptSessionRequest(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("acceptSessionRequest", params, user);
            // let session = await employeeCoachSessionsModel.findByPk(params.session_id);
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(models_1.coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            let session = yield employeeCoachSession_1.employeeCoachSessionsModel.findOne({
                where: { id: params.session_id },
                include: [
                    {
                        model: models_1.coachManagementModel,
                        required: true,
                        attributes: ["id", "name", "email", "device_token", "app_id"],
                    },
                    {
                        model: models_1.employeeModel,
                        required: true,
                        attributes: ["id", "name", "email", "device_token"],
                    },
                ],
            });
            if (!session) {
                throw new Error(constants.MESSAGES.no_session);
            }
            if (session.coach_id != user.uid) {
                throw new Error(constants.MESSAGES.session_not_belogs_to_coach);
            }
            params.session = yield helperFunction.convertPromiseToObject(session);
            session.details = yield helperFunction.scheduleZoomMeeting(params);
            session.status = constants.EMPLOYEE_COACH_SESSION_STATUS.accepted;
            if (session.coach_management.app_id == constants.COACH_APP_ID.BT) {
                if (session.timeline) {
                    session.timeline = [...session.timeline, {
                            "name": session.coach_management.name,
                            "request_received": session.request_received_date,
                            "status": "Sent",
                            "action": constants.SESSION_ACTION.accepted,
                            "action_by": constants.ACTION_BY.coach
                        }];
                }
                else {
                    session.timeline = [{
                            "name": session.coach_management.name,
                            "request_received": session.request_received_date,
                            "status": "Sent",
                            "action": constants.SESSION_ACTION.accepted,
                            "action_by": constants.ACTION_BY.coach
                        }];
                }
            }
            session.save();
            //add notification 
            let notificationObj = {
                type_id: session.id,
                sender_id: user.uid,
                reciever_id: session.employee_id,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                type: constants.NOTIFICATION_TYPE.session_accepted,
                data: {
                    type: constants.NOTIFICATION_TYPE.session_accepted,
                    title: 'Sesssion accepted by coach',
                    message: `${session.coach_management.name} has accepted session on ${session.date} at ${session.start_time}`,
                    senderEmployeeData: session.coach_management,
                },
            };
            yield notification_1.notificationModel.create(notificationObj);
            //send push notification
            let notificationData = {
                title: 'Sesssion accepted by coach',
                body: `${session.coach_management.name} has accepted session on ${session.date} at ${session.start_time}`,
                data: {
                    type: constants.NOTIFICATION_TYPE.session_accepted,
                    title: 'Sesssion accepted by coach',
                    message: `${session.coach_management.name} has accepted session on ${session.date} at ${session.start_time}`,
                    senderEmployeeData: session.coach_management,
                },
            };
            yield helperFunction.sendFcmNotification([session.employee.device_token], notificationData);
            let mailParams = {};
            mailParams.to = session.employee.email;
            mailParams.html = `Hi  ${session.employee.name}
            <br>Your session request is Accepted by ${session.coach_management.name}
            `;
            mailParams.subject = "Session Request Accepted";
            mailParams.name = "BlueXinga";
            yield helperFunction.sendEmail(mailParams);
            return yield helperFunction.convertPromiseToObject(session);
        });
    }
    rejectSessionRequest(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // let session = await employeeCoachSessionsModel.findByPk(params.session_id);
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(models_1.coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            let session = yield employeeCoachSession_1.employeeCoachSessionsModel.findOne({
                where: { id: params.session_id },
                include: [
                    {
                        model: models_1.coachManagementModel,
                        required: true,
                        attributes: ["id", "name", "email", "device_token", "app_id"],
                    },
                    {
                        model: models_1.employeeModel,
                        required: true,
                        attributes: ["id", "name", "email", "device_token"],
                    },
                ],
            });
            if (!session) {
                throw new Error(constants.MESSAGES.no_session);
            }
            if (session.coach_id != user.uid) {
                throw new Error(constants.MESSAGES.session_not_belogs_to_coach);
            }
            session.status = constants.EMPLOYEE_COACH_SESSION_STATUS.rejected;
            if (session.coach_management.app_id == constants.COACH_APP_ID.BT) {
                if (session.timeline) {
                    session.timeline = [...session.timeline, {
                            "name": session.coach_management.name,
                            "request_received": session.request_received_date,
                            "status": "Sent",
                            "action": constants.SESSION_ACTION.declined,
                            "action_by": constants.ACTION_BY.coach
                        }];
                }
                else {
                    session.timeline = [{
                            "name": session.coach_management.name,
                            "request_received": session.request_received_date,
                            "status": "Sent",
                            "action": constants.SESSION_ACTION.declined,
                            "action_by": constants.ACTION_BY.coach
                        }];
                }
            }
            session.save();
            let slot = yield coachSchedule_1.coachScheduleModel.findByPk(parseInt(session.slot_id));
            slot.status = constants.COACH_SCHEDULE_STATUS.available;
            slot.save();
            //add notification 
            let notificationObj = {
                type_id: session.id,
                sender_id: user.uid,
                reciever_id: session.employee_id,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                type: constants.NOTIFICATION_TYPE.session_rejected,
                data: {
                    type: constants.NOTIFICATION_TYPE.session_rejected,
                    title: 'Sesssion rejected by coach',
                    message: `${session.coach_management.name} has rejected session on ${session.date} at ${session.start_time}`,
                    senderEmployeeData: session.coach_management,
                },
            };
            yield notification_1.notificationModel.create(notificationObj);
            //send push notification
            let notificationData = {
                title: 'Sesssion rejected by coach',
                message: `${session.coach_management.name} has rejected session on ${session.date} at ${session.start_time}`,
                data: {
                    type: constants.NOTIFICATION_TYPE.session_rejected,
                    title: 'Sesssion rejected by coach',
                    message: `${session.coach_management.name} has rejected session on ${session.date} at ${session.start_time}`,
                    senderEmployeeData: session.coach_management,
                },
            };
            yield helperFunction.sendFcmNotification([session.employee.device_token], notificationData);
            let mailParams = {};
            mailParams.to = session.employee.email;
            mailParams.html = `Hi  ${session.employee.name}
            <br>Your session request is rejected by ${session.coach_management.name}
            `;
            mailParams.subject = "Session Request Rejected";
            mailParams.name = "BlueXinga";
            yield helperFunction.sendEmail(mailParams);
            return yield helperFunction.convertPromiseToObject(session);
        });
    }
    getAcceptedSessions(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getAcceptedSessions", params, user);
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(coachSpecializationCategories_1.coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(employeeRanks_1.employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });
            if (params.datetime) {
                let sessions = yield helperFunction.convertPromiseToObject(yield employeeCoachSession_1.employeeCoachSessionsModel.findAll({
                    where: {
                        coach_id: user.uid,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.accepted,
                    }
                }));
                for (let session of sessions) {
                    let startTime = moment(`${params.datetime}`, "YYYY-MM-DD HH:mm:ss");
                    let endTime = moment(`${session.date} ${session.end_time}`, "YYYY-MM-DD HH:mm:ss");
                    let duration = moment.duration(endTime.diff(startTime));
                    let secondDiff = Math.ceil(duration.asSeconds());
                    if (secondDiff <= 0) {
                        let startTime = moment(session.start_time, "HH:mm:ss");
                        let endTime = moment(session.end_time, "HH:mm:ss");
                        let duration = moment.duration(endTime.diff(startTime));
                        yield employeeCoachSession_1.employeeCoachSessionsModel.update({
                            status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                        }, {
                            where: {
                                id: session.id,
                            }
                        });
                    }
                }
            }
            let query = {
                order: [["date"], ["start_time"]]
            };
            query.where = {
                coach_id: user.uid,
                status: constants.EMPLOYEE_COACH_SESSION_STATUS.accepted,
            };
            if (params.is_pagination && params.is_pagination == constants.IS_PAGINATION.yes) {
                let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
                query.offset = offset;
                query.limit = limit;
            }
            query.include = [
                {
                    model: models_1.employeeModel,
                    attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'energy_last_updated', 'profile_pic_url'],
                },
                {
                    model: coachSpecializationCategories_1.coachSpecializationCategoriesModel,
                    attributes: ['id', 'name', 'description'],
                },
                {
                    model: employeeRanks_1.employeeRanksModel,
                    attributes: ['id', 'name', 'description'],
                }
            ];
            let sessions = yield helperFunction.convertPromiseToObject(yield employeeCoachSession_1.employeeCoachSessionsModel.findAndCountAll(query));
            for (let session of sessions.rows) {
                session.chatRoom = yield helperFunction.convertPromiseToObject(yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findOne({
                    where: {
                        user_id: session.employee_id,
                        other_user_id: session.coach_id,
                        type: constants.CHAT_ROOM_TYPE.coach,
                        status: constants.STATUS.active,
                    }
                }));
                if (session.chatRoom) {
                    session.chatRoom.user = yield helperFunction.convertPromiseToObject(yield models_1.employeeModel.findOne({
                        attributes: ['id', 'name', 'profile_pic_url', 'status'],
                        where: {
                            id: session.employee_id,
                        }
                    }));
                    session.chatRoom.other_user = yield helperFunction.convertPromiseToObject(yield models_1.coachManagementModel.findOne({
                        attributes: ['id', 'name', ['image', 'profile_pic_url']],
                        where: {
                            id: session.coach_id,
                        }
                    }));
                }
            }
            return sessions;
        });
    }
    cancelSession(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // let session = await employeeCoachSessionsModel.findByPk(params.session_id);
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(models_1.coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            let session = yield employeeCoachSession_1.employeeCoachSessionsModel.findOne({
                where: { id: params.session_id },
                include: [
                    {
                        model: models_1.coachManagementModel,
                        required: true,
                        attributes: ["id", "name", "device_token"],
                    },
                    {
                        model: models_1.employeeModel,
                        required: true,
                        attributes: ["id", "name", "device_token"],
                    },
                ],
            });
            if (!session) {
                throw new Error(constants.MESSAGES.no_session);
            }
            if (session.coach_id != user.uid) {
                throw new Error(constants.MESSAGES.session_not_belogs_to_coach);
            }
            params.session = yield helperFunction.convertPromiseToObject(session);
            if (params.datetime) {
                let startTime = moment(`${params.datetime}`, "YYYY-MM-DD HH:mm:ss");
                let endTime = moment(`${params.session.date} ${params.session.end_time}`, "YYYY-MM-DD HH:mm:ss");
                let duration = moment.duration(endTime.diff(startTime));
                let secondDiff = Math.ceil(duration.asSeconds());
                if (secondDiff <= 0) {
                    throw new Error(constants.MESSAGES.zoom_meeting_coach_cancel_error);
                }
            }
            yield helperFunction.cancelZoomMeeting(params);
            session.status = constants.EMPLOYEE_COACH_SESSION_STATUS.cancelled;
            session.cancel_reason = params.cancel_reason;
            session.cancelled_by = constants.EMPLOYEE_COACH_SESSION_CANCELLED_BY.coach;
            session.save();
            let slot = yield coachSchedule_1.coachScheduleModel.findByPk(parseInt(session.slot_id));
            slot.status = constants.COACH_SCHEDULE_STATUS.available;
            slot.save();
            //add notification 
            let notificationObj = {
                type_id: session.id,
                sender_id: user.uid,
                reciever_id: session.employee_id,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                type: constants.NOTIFICATION_TYPE.cancel_session,
                data: {
                    type: constants.NOTIFICATION_TYPE.cancel_session,
                    title: 'Sesssion cancelled by coach',
                    message: `${session.coach_management.name} has cancelled session on ${session.date} at ${session.start_time}`,
                    senderEmployeeData: session.coach_management,
                },
            };
            yield notification_1.notificationModel.create(notificationObj);
            //send push notification
            let notificationData = {
                title: 'Sesssion cancelled by coach',
                body: `${session.coach_management.name} has cancelled session on ${session.date} at ${session.start_time}`,
                data: {
                    type: constants.NOTIFICATION_TYPE.cancel_session,
                    title: 'Sesssion cancelled by coach',
                    message: `${session.coach_management.name} has cancelled session on ${session.date} at ${session.start_time}`,
                    senderEmployeeData: session.coach_management,
                },
            };
            yield helperFunction.sendFcmNotification([session.employee.device_token], notificationData);
            return yield helperFunction.convertPromiseToObject(session);
        });
    }
    listSessionHistory(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(coachSpecializationCategories_1.coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(employeeRanks_1.employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });
            if (params.datetime) {
                let sessions = yield helperFunction.convertPromiseToObject(yield employeeCoachSession_1.employeeCoachSessionsModel.findAll({
                    where: {
                        coach_id: user.uid,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.pending,
                    }
                }));
                for (let session of sessions) {
                    let startTime = moment(`${params.datetime}`, "YYYY-MM-DD HH:mm:ss");
                    let endTime = moment(`${session.date} ${session.end_time}`, "YYYY-MM-DD HH:mm:ss");
                    let duration = moment.duration(endTime.diff(startTime));
                    let secondDiff = Math.ceil(duration.asSeconds());
                    if (secondDiff <= 0) {
                        yield employeeCoachSession_1.employeeCoachSessionsModel.update({
                            status: constants.EMPLOYEE_COACH_SESSION_STATUS.rejected,
                        }, {
                            where: {
                                id: session.id,
                            }
                        });
                    }
                }
                sessions = yield helperFunction.convertPromiseToObject(yield employeeCoachSession_1.employeeCoachSessionsModel.findAll({
                    where: {
                        coach_id: user.uid,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.accepted,
                    }
                }));
                for (let session of sessions) {
                    let startTime = moment(`${params.datetime}`, "YYYY-MM-DD HH:mm:ss");
                    let endTime = moment(`${session.date} ${session.end_time}`, "YYYY-MM-DD HH:mm:ss");
                    let duration = moment.duration(endTime.diff(startTime));
                    let secondDiff = Math.ceil(duration.asSeconds());
                    if (secondDiff <= 0) {
                        let startTime = moment(session.start_time, "HH:mm:ss");
                        let endTime = moment(session.end_time, "HH:mm:ss");
                        let duration = moment.duration(endTime.diff(startTime));
                        yield employeeCoachSession_1.employeeCoachSessionsModel.update({
                            status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                            call_duration: Math.ceil(duration.asMinutes()),
                        }, {
                            where: {
                                id: session.id,
                            }
                        });
                    }
                }
            }
            let query = {
                order: [["date", "DESC"], ["start_time", "DESC"]]
            };
            query.where = {
                coach_id: user.uid,
                status: {
                    [Op.in]: [
                        constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                        constants.EMPLOYEE_COACH_SESSION_STATUS.cancelled,
                        constants.EMPLOYEE_COACH_SESSION_STATUS.rejected,
                    ]
                },
            };
            if (params.is_pagination && params.is_pagination == constants.IS_PAGINATION.yes) {
                let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
                query.offset = offset;
                query.limit = limit;
            }
            query.include = [
                {
                    model: models_1.employeeModel,
                    attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'energy_last_updated', 'profile_pic_url'],
                },
                {
                    model: coachSpecializationCategories_1.coachSpecializationCategoriesModel,
                    attributes: ['id', 'name', 'description'],
                },
                {
                    model: employeeRanks_1.employeeRanksModel,
                    attributes: ['id', 'name', 'description'],
                }
            ];
            return yield helperFunction.convertPromiseToObject(yield employeeCoachSession_1.employeeCoachSessionsModel.findAndCountAll(query));
        });
    }
    getSessionHistoryDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(coachSpecializationCategories_1.coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(employeeRanks_1.employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });
            let query = {};
            query.where = {
                id: params.session_id,
            };
            query.include = [
                {
                    model: models_1.employeeModel,
                    attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'energy_last_updated', 'profile_pic_url'],
                },
                {
                    model: coachSpecializationCategories_1.coachSpecializationCategoriesModel,
                    attributes: ['id', 'name', 'description'],
                },
                {
                    model: employeeRanks_1.employeeRanksModel,
                    attributes: ['id', 'name', 'description'],
                }
            ];
            let session = yield helperFunction.convertPromiseToObject(yield employeeCoachSession_1.employeeCoachSessionsModel.findOne(query));
            if (!session) {
                throw new Error(constants.MESSAGES.no_session);
            }
            return session;
        });
    }
    updateZoomMeetingDuration(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let session = yield employeeCoachSession_1.employeeCoachSessionsModel.findByPk(params.session_id);
            if (!session) {
                throw new Error(constants.MESSAGES.no_session);
            }
            if (session.coach_id != user.uid) {
                throw new Error(constants.MESSAGES.session_not_belogs_to_coach);
            }
            params.session = yield helperFunction.convertPromiseToObject(session);
            params.extendingMinutes = 5;
            yield helperFunction.updateZoomMeetingDuration(params);
            return true;
        });
    }
    endZoomMeeting(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let session = yield employeeCoachSession_1.employeeCoachSessionsModel.findByPk(params.session_id);
            if (!session) {
                throw new Error(constants.MESSAGES.no_session);
            }
            if (session.coach_id != user.uid) {
                throw new Error(constants.MESSAGES.session_not_belogs_to_coach);
            }
            params.session = yield helperFunction.convertPromiseToObject(session);
            yield helperFunction.endZoomMeeting(params);
            return true;
        });
    }
    updateSlotAvailability(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {};
            if (params.event_type == 0) {
                where = {
                    status: { [Op.in]: [1, 4] },
                    coach_id: user.uid,
                    date: {
                        [Op.in]: [params.date],
                    }
                };
            }
            else {
                where = {
                    status: { [Op.in]: [1, 4] },
                    coach_id: user.uid,
                    date: {
                        [Op.gte]: params.date,
                    }
                };
            }
            for (let slot of params.timings) {
                where.start_time = { [Op.in]: [slot.start_time] };
                where.end_time = { [Op.in]: [slot.end_time] };
                yield queryService.updateData({ model: coachSchedule_1.coachScheduleModel, status: params.is_available, is_available: params.is_available }, { where: where });
            }
        });
    }
    getUnseenChatNotificationCount(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = (yield helperFunction.convertPromiseToObject(yield notification_1.notificationModel.count({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
                    type: [
                        constants.NOTIFICATION_TYPE.message,
                    ],
                    status: 1,
                },
                group: ['type_id']
            }))).length;
            yield notification_1.notificationModel.update({
                status: 0,
            }, {
                where: {
                    status: 1,
                    type: [
                        constants.NOTIFICATION_TYPE.message,
                    ],
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
                }
            });
            return { count };
        });
    }
}
exports.CoachService = CoachService;
//# sourceMappingURL=coachService.js.map