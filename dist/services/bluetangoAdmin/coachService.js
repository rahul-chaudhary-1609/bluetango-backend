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
const queryService = __importStar(require("../../queryService/bluetangoAdmin/queryService"));
const models_1 = require("../../models");
const coachSpecializationCategories_1 = require("../../models/coachSpecializationCategories");
const employeeRanks_1 = require("../../models/employeeRanks");
const employeeCoachSession_1 = require("../../models/employeeCoachSession");
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
class CoachService {
    constructor() { }
    dashboard(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let where = {
                [Op.and]: [
                    {
                        status: constants.STATUS.active,
                    },
                    Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '>=', params.from),
                    Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '<=', params.to),
                ]
            };
            let coachCount = yield queryService.count(models_1.coachManagementModel, { where });
            where = {
                [Op.and]: [
                    {
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    },
                    Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '>=', params.from),
                    Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '<=', params.to),
                ]
            };
            where = Object.assign(Object.assign({}, where), { type: constants.EMPLOYEE_COACH_SESSION_TYPE.free });
            let totalFreeSessions = yield queryService.count(employeeCoachSession_1.employeeCoachSessionsModel, { where });
            where = Object.assign(Object.assign({}, where), { type: constants.EMPLOYEE_COACH_SESSION_TYPE.paid });
            let totalPaidSessions = yield queryService.count(employeeCoachSession_1.employeeCoachSessionsModel, { where });
            where = {
                [Op.and]: [
                    {
                        status: {
                            [Op.notIn]: [
                                constants.EMPLOYEE_COACH_SESSION_STATUS.cancelled,
                                constants.EMPLOYEE_COACH_SESSION_STATUS.rejected
                            ]
                        }
                    },
                    Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '>=', params.from),
                    Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '<=', params.to),
                ]
            };
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(models_1.coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" });
            let conditions = {
                attributes: [
                    'coach_id',
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'sessionCount'],
                    [Sequelize.fn('SUM', Sequelize.col('call_duration')), 'totalDuration'],
                ],
                where,
                group: ['"employee_coach_sessions.coach_id"'],
                order: [[Sequelize.fn('COUNT', Sequelize.col('id')), "DESC"]],
            };
            let topFiveSessionTaker = yield helperFunction.convertPromiseToObject(yield queryService.selectAll(employeeCoachSession_1.employeeCoachSessionsModel, conditions));
            for (let coach of topFiveSessionTaker) {
                let conditions = {
                    attributes: ["id", "name", "email"],
                    where: {
                        id: coach.coach_id,
                    }
                };
                coach.coach = yield helperFunction.convertPromiseToObject(yield queryService.selectOne(models_1.coachManagementModel, conditions));
                conditions = {
                    attributes: ["createdAt"],
                    where: {
                        coach_id: coach.coach_id,
                    },
                    order: [["createdAt", "DESC"]],
                };
                coach.conversionRate = 1;
                coach.since = yield helperFunction.convertPromiseToObject(yield queryService.selectOne(employeeCoachSession_1.employeeCoachSessionsModel, conditions));
                coach.since = (_a = coach.since) === null || _a === void 0 ? void 0 : _a.createdAt;
            }
            let topCoaches = [];
            if (params.searchKey && params.searchKey.trim()) {
                topCoaches = topFiveSessionTaker.filter(coach => coach.coach.name.toLowerCase().includes(params.searchKey.toLowerCase())).slice(0, 5);
            }
            else {
                topCoaches = topFiveSessionTaker.slice(0, 5);
            }
            return {
                totalCoach: coachCount,
                avgFreeSession: coachCount ? totalFreeSessions / coachCount : 0,
                avgPaidSession: coachCount ? totalPaidSessions / coachCount : 0,
                totalFreeSessions,
                totalPaidSessions,
                avgConversionRate: 1,
                topCoaches
            };
        });
    }
    getCoachList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let where = {};
            if (params.searchKey && params.searchKey.trim()) {
                where = Object.assign(Object.assign({}, where), { [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${params.searchKey}%`
                            }
                        },
                        {
                            email: {
                                [Op.iLike]: `%${params.searchKey}%`
                            }
                        },
                        {
                            phone_number: {
                                [Op.iLike]: `%${params.searchKey}%`
                            }
                        },
                    ] });
            }
            if (params.coach_specialization_category_id) {
                where["coach_specialization_category_ids"] = {
                    [Op.contains]: [params.coach_specialization_category_id]
                };
            }
            if (params.employee_rank_id) {
                where["employee_rank_ids"] = {
                    [Op.contains]: [params.employee_rank_id]
                };
            }
            if (params.status) {
                where["status"] = parseInt(params.status);
            }
            else {
                where["status"] = {
                    [Op.in]: [constants.STATUS.active, constants.STATUS.inactive]
                };
            }
            let coachList = yield helperFunction.convertPromiseToObject(yield models_1.coachManagementModel.findAndCountAll({
                where: where,
                attributes: ["id", "name", "email", "phone_number", "coach_specialization_category_ids", "employee_rank_ids", "coach_charge"],
                order: [["id", "DESC"]]
            }));
            let c = 0;
            for (let coach of coachList.rows) {
                let coach_specialization_categories = //helperFunction.convertPromiseToObject(
                 coachSpecializationCategories_1.coachSpecializationCategoriesModel.findAll({
                    where: {
                        id: {
                            [Op.in]: coach.coach_specialization_category_ids || [],
                        },
                        status: constants.STATUS.active,
                    }
                });
                // )
                let employee_ranks = //helperFunction.convertPromiseToObject(
                 employeeRanks_1.employeeRanksModel.findAll({
                    where: {
                        id: {
                            [Op.in]: coach.employee_rank_ids || [],
                        },
                        status: constants.STATUS.active,
                    }
                });
                //)
                let total_completed_sessions = employeeCoachSession_1.employeeCoachSessionsModel.count({
                    where: {
                        coach_id: coach.id,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    }
                });
                let totalRating = employeeCoachSession_1.employeeCoachSessionsModel.sum('coach_rating', {
                    where: {
                        coach_id: coach.id,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                        coach_rating: {
                            [Op.gte]: 1
                        }
                    }
                });
                let rating_count = employeeCoachSession_1.employeeCoachSessionsModel.count({
                    where: {
                        coach_id: coach.id,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                        coach_rating: {
                            [Op.gte]: 1
                        }
                    }
                });
                let allPromiseResponse = yield Promise.all([
                    coach_specialization_categories,
                    employee_ranks,
                    total_completed_sessions,
                    totalRating,
                    rating_count
                ]);
                coach.coach_specialization_categories = allPromiseResponse[0];
                coach.employee_ranks = allPromiseResponse[1];
                coach.total_completed_sessions = allPromiseResponse[2];
                totalRating = allPromiseResponse[3];
                coach.rating_count = allPromiseResponse[4];
                coach.average_rating = 0;
                if (coach.rating_count > 0) {
                    coach.average_rating = parseFloat((parseInt(totalRating) / coach.rating_count).toFixed(0));
                }
                delete coach.coach_specialization_category_ids;
                delete coach.employee_rank_ids;
            }
            if (params.rating) {
                let coachListFilteredByRating = coachList.rows.filter((coach) => coach.average_rating == params.rating);
                coachList.rows = [...coachListFilteredByRating];
                coachList.count = coachListFilteredByRating.length;
            }
            coachList.rows = coachList.rows.slice(offset, offset + limit);
            return coachList;
        });
    }
}
exports.CoachService = CoachService;
//# sourceMappingURL=coachService.js.map