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
const Sequelize = require('sequelize');
const moment = require("moment");
var Op = Sequelize.Op;
class CoachService {
    constructor() { }
    addSlot(params, user) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("add slot params1", params);
            if (params.type == constants.COACH_SCHEDULE_TYPE.weekly && !params.day)
                throw new Error(constants.MESSAGES.coach_schedule_day_required);
            if (params.type == constants.COACH_SCHEDULE_TYPE.custom && ((_a = params.custom_dates) === null || _a === void 0 ? void 0 : _a.length) == 0)
                throw new Error(constants.MESSAGES.coach_schedule_custom_dates_required);
            let dates = [];
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
                    let start = new Date(params.date);
                    let end = new Date(params.date);
                    end.setFullYear(start.getFullYear() + 1);
                    while (start < end) {
                        if (params.day == parseInt(moment(start).format('d'))) {
                            dates.push(moment(start).format("YYYY-MM-DD"));
                        }
                        start.setDate(start.getDate() + 1);
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
            let slots = params.slots;
            slots.forEach((slot) => {
                Object.keys(slot).forEach((key) => {
                    slot[key] = slot[key].replace(/:/g, "");
                });
            });
            slots.forEach((slot1, index1) => {
                if (!(slot1.start_time < slot1.end_time)) {
                    throw new Error(constants.MESSAGES.coach_schedule_start_greater_or_equal_end);
                }
                Object.keys(slot1).forEach((key) => {
                    slots.forEach((slot2, index2) => {
                        if (slot1[key] >= slot2.start_time && slot1[key] <= slot2.end_time && index1 != index2) {
                            throw new Error(constants.MESSAGES.coach_schedule_overlaped);
                        }
                    });
                });
            });
            slots.forEach((slot) => {
                Object.keys(slot).forEach((key) => {
                    slot[key] = moment(slot[key], "HHmmss").format("HH:mm:ss");
                });
            });
            for (let slot of params.slots) {
                let schedule = yield coachSchedule_1.coachScheduleModel.findOne({
                    where: {
                        coach_id: user.uid,
                        date: {
                            [Op.in]: dates,
                        },
                        [Op.or]: [
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
                        status: {
                            [Op.notIn]: [constants.COACH_SCHEDULE_STATUS.passed]
                        }
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
            if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.individual) {
                let schedule = yield coachSchedule_1.coachScheduleModel.findByPk(parseInt(params.slot_id));
                if (!schedule)
                    throw new Error(constants.MESSAGES.no_coach_schedule);
                schedule.destroy();
            }
            else if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && params.slot_date_group_id) {
                let schedules = yield coachSchedule_1.coachScheduleModel.findAll({
                    where: {
                        slot_date_group_id: params.slot_date_group_id
                    }
                });
                if (schedules.length == 0)
                    throw new Error(constants.MESSAGES.no_coach_schedule);
                yield coachSchedule_1.coachScheduleModel.destroy({
                    where: {
                        slot_date_group_id: params.slot_date_group_id
                    }
                });
            }
            else if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && params.slot_time_group_id) {
                let schedules = yield coachSchedule_1.coachScheduleModel.findAll({
                    where: {
                        slot_time_group_id: params.slot_time_group_id
                    }
                });
                if (schedules.length == 0)
                    throw new Error(constants.MESSAGES.no_coach_schedule);
                yield coachSchedule_1.coachScheduleModel.destroy({
                    where: {
                        slot_time_group_id: params.slot_time_group_id
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
            let query = {};
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
                }
            ];
            return yield helperFunction.convertPromiseToObject(yield employeeCoachSession_1.employeeCoachSessionsModel.findAndCountAll(query));
        });
    }
    scheduleZoomMeeting(params) {
        return __awaiter(this, void 0, void 0, function* () {
            //comming soon...
            let details = {
                "created_at": "2019-09-05T16:54:14Z",
                "duration": 15,
                "host_id": "AbcDefGHi",
                "id": 1100000,
                "join_url": "https://zoom.us/j/1100000",
            };
            return details;
        });
    }
    cancelZoomMeeting(params) {
        return __awaiter(this, void 0, void 0, function* () {
            //comming soon...
            let details = {};
            return details;
        });
    }
    acceptSessionRequest(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let session = yield employeeCoachSession_1.employeeCoachSessionsModel.findByPk(params.session_id);
            if (!session) {
                throw new Error(constants.MESSAGES.no_session);
            }
            if (session.coach_id != user.uid) {
                throw new Error(constants.MESSAGES.session_not_belogs_to_coach);
            }
            session.details = yield this.scheduleZoomMeeting(params);
            let employeeSessionCount = yield employeeCoachSession_1.employeeCoachSessionsModel.count({
                where: {
                    employee_id: session.employee_id,
                    type: constants.EMPLOYEE_COACH_SESSION_TYPE.free,
                    status: {
                        [Op.in]: [
                            constants.EMPLOYEE_COACH_SESSION_STATUS.accepted,
                            constants.EMPLOYEE_COACH_SESSION_STATUS.completed
                        ]
                    }
                }
            });
            session.status = constants.EMPLOYEE_COACH_SESSION_STATUS.accepted;
            session.type = employeeSessionCount < 2 ? constants.EMPLOYEE_COACH_SESSION_TYPE.free : constants.EMPLOYEE_COACH_SESSION_TYPE.paid;
            session.save();
            return yield helperFunction.convertPromiseToObject(session);
        });
    }
    rejectSessionRequest(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let session = yield employeeCoachSession_1.employeeCoachSessionsModel.findByPk(params.session_id);
            if (!session) {
                throw new Error(constants.MESSAGES.no_session);
            }
            if (session.coach_id != user.uid) {
                throw new Error(constants.MESSAGES.session_not_belogs_to_coach);
            }
            session.status = constants.EMPLOYEE_COACH_SESSION_STATUS.rejected;
            session.save();
            return yield helperFunction.convertPromiseToObject(session);
        });
    }
    getAcceptedSessions(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(coachSpecializationCategories_1.coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id" });
            let query = {};
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
                }
            ];
            return yield helperFunction.convertPromiseToObject(yield employeeCoachSession_1.employeeCoachSessionsModel.findAndCountAll(query));
        });
    }
    cancelSession(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let session = yield employeeCoachSession_1.employeeCoachSessionsModel.findByPk(params.session_id);
            if (!session) {
                throw new Error(constants.MESSAGES.no_session);
            }
            if (session.coach_id != user.uid) {
                throw new Error(constants.MESSAGES.session_not_belogs_to_coach);
            }
            yield this.cancelZoomMeeting(params);
            session.status = constants.EMPLOYEE_COACH_SESSION_STATUS.cancelled;
            session.cancel_reason = params.cancel_reason;
            session.cancelled_by = constants.EMPLOYEE_COACH_SESSION_CANCELLED_BY.coach;
            session.save();
            return yield helperFunction.convertPromiseToObject(session);
        });
    }
}
exports.CoachService = CoachService;
//# sourceMappingURL=coachService.js.map