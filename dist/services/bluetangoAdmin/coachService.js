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
const appUtils = __importStar(require("../../utils/appUtils"));
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
            // console.log("topFiveSessionTaker",topFiveSessionTaker)
            if (params.searchKey && params.searchKey.trim()) {
                topCoaches = topFiveSessionTaker.filter(coach => { var _a; return (_a = coach.coach) === null || _a === void 0 ? void 0 : _a.name.toLowerCase().includes(params.searchKey.toLowerCase()); }).slice(0, 5);
            }
            else {
                topCoaches = topFiveSessionTaker.slice(0, 5);
            }
            // console.log("topCoaches",topCoaches)
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
            let where = {
                app_id: constants.COACH_APP_ID.BT,
            };
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
            let query = {
                where: where,
                attributes: ["id", "name", "email", "phone_number", "coach_specialization_category_ids", "employee_rank_ids", "coach_charge", "status", "app_id", "social_media_handles", "website", "document_url"],
                order: [["id", "DESC"]],
            };
            let coachList = yield helperFunction.convertPromiseToObject(yield queryService.selectAndCountAll(models_1.coachManagementModel, query));
            let c = 0;
            for (let coach of coachList.rows) {
                let query = {
                    where: {
                        id: {
                            [Op.in]: coach.coach_specialization_category_ids || [],
                        },
                        status: constants.STATUS.active,
                    }
                };
                coach.coach_specialization_categories = yield helperFunction.convertPromiseToObject(yield queryService.selectAll(coachSpecializationCategories_1.coachSpecializationCategoriesModel, query));
                query = {
                    where: {
                        id: {
                            [Op.in]: coach.employee_rank_ids || [],
                        },
                        status: constants.STATUS.active,
                    }
                };
                coach.employee_ranks = yield helperFunction.convertPromiseToObject(yield queryService.selectAll(employeeRanks_1.employeeRanksModel, query));
                query = {
                    where: {
                        coach_id: coach.id,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    }
                };
                coach.total_completed_sessions = yield queryService.count(employeeCoachSession_1.employeeCoachSessionsModel, query);
                query = {
                    where: {
                        coach_id: coach.id,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                        coach_rating: {
                            [Op.gte]: 1
                        }
                    }
                };
                let totalRating = yield queryService.sum(employeeCoachSession_1.employeeCoachSessionsModel, 'coach_rating', query);
                query = {
                    where: {
                        coach_id: coach.id,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                        coach_rating: {
                            [Op.gte]: 1
                        }
                    }
                };
                coach.rating_count = yield queryService.count(employeeCoachSession_1.employeeCoachSessionsModel, query);
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
    addCoach(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            params.email = params.email.toLowerCase();
            let query = {
                where: {
                    [Op.or]: [
                        {
                            email: params.email,
                        },
                        {
                            phone_number: params.phone_number
                        },
                    ],
                    status: {
                        [Op.in]: [constants.STATUS.active, constants.STATUS.inactive]
                    },
                    app_id: constants.COACH_APP_ID.BT,
                }
            };
            let coach = yield queryService.selectOne(models_1.coachManagementModel, query);
            if (!coach) {
                let password = helperFunction.generaePassword();
                params.app_id = constants.COACH_APP_ID.BT;
                params.admin_id = user.uid,
                    params.password = yield appUtils.bcryptPassword(password);
                let newCoach = yield queryService.addData(models_1.coachManagementModel, params);
                newCoach = newCoach.get({ plain: true });
                delete newCoach.password;
                const mailParams = {};
                mailParams.to = params.email;
                mailParams.html = `Hi  ${params.name}
                <br> Please download the app by clicking on link below and use the given credentials for login into the app :
                <br><br><b> Android URL</b>: ${process.env.COACH_ANDROID_URL}
                <br><b> IOS URL</b>: ${process.env.COACH_IOS_URL} <br>
                <br> username : ${params.email}
                <br> password : ${password}
                <br> Check your details here:
                <br><table style="padding:0px 10px 10px 10px;">
                `;
                delete newCoach.password;
                let query = {
                    where: {
                        id: {
                            [Op.in]: newCoach.coach_specialization_category_ids || [],
                        },
                        status: constants.STATUS.active,
                    },
                    attributes: ['name']
                };
                newCoach.coach_specialization_categories = yield helperFunction.convertPromiseToObject(yield queryService.selectAll(coachSpecializationCategories_1.coachSpecializationCategoriesModel, query));
                newCoach.coach_specialization_categories = newCoach.coach_specialization_categories.map(category => category.name).join(', ');
                delete newCoach.coach_specialization_category_ids;
                query = {
                    where: {
                        id: {
                            [Op.in]: newCoach.employee_rank_ids || [],
                        },
                        status: constants.STATUS.active,
                    },
                    attributes: ['name']
                };
                newCoach.employee_ranks = yield helperFunction.convertPromiseToObject(yield queryService.selectAll(employeeRanks_1.employeeRanksModel, query));
                newCoach.employee_ranks = newCoach.employee_ranks.map(rank => rank.name).join(', ');
                newCoach.fees_per_session = newCoach.coach_charge;
                // delete newCoach.id;
                // delete newCoach.admin_id;
                // delete newCoach.device_token;
                delete newCoach.first_time_login;
                delete newCoach.first_time_login_datetime;
                delete newCoach.first_time_reset_password;
                delete newCoach.fileName;
                delete newCoach.status;
                delete newCoach.coach_charge;
                delete newCoach.employee_rank_ids;
                delete newCoach.updatedAt;
                delete newCoach.createdAt;
                for (let key in newCoach) {
                    mailParams.html += `<tr style="text-align: left;">
                            <th style="opacity: 0.9;">${key.split("_").map((ele) => {
                        if (ele == "of" || ele == "in")
                            return ele;
                        else
                            return ele.charAt(0).toUpperCase() + ele.slice(1);
                    }).join(" ")}</th>
                            <td style="opacity: 0.8;">:</td>
                            <td style="opacity: 0.8;">${key == 'image' ? `<img src='${newCoach[key]}' />` : newCoach[key]}</td>
                        </tr>`;
                }
                mailParams.html += `</table>`;
                mailParams.subject = "Coach Login Credentials";
                mailParams.name = "BlueTango";
                yield helperFunction.sendEmail(mailParams);
                return newCoach;
            }
            else {
                throw new Error(constants.MESSAGES.email_phone_already_registered);
            }
        });
    }
    editCoach(params) {
        return __awaiter(this, void 0, void 0, function* () {
            params.email = params.email.toLowerCase();
            let query = {
                where: {
                    [Op.or]: [
                        {
                            email: params.email,
                        },
                        {
                            phone_number: params.phone_number
                        },
                    ],
                    status: {
                        [Op.in]: [constants.STATUS.active, constants.STATUS.inactive]
                    },
                    app_id: constants.COACH_APP_ID.BT,
                    id: {
                        [Op.ne]: params.coach_id,
                    }
                }
            };
            let coach = yield queryService.selectOne(models_1.coachManagementModel, query);
            if (!coach) {
                params.model = models_1.coachManagementModel;
                let query = {
                    where: {
                        id: params.coach_id,
                        app_id: constants.COACH_APP_ID.BT,
                    },
                    raw: true,
                };
                let updatedCoach = yield queryService.updateData(params, query);
                return updatedCoach;
            }
            else {
                throw new Error(constants.MESSAGES.email_phone_already_registered);
            }
        });
    }
    getCoachDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                where: {
                    id: params.coach_id,
                    status: [0, 1]
                },
                attributes: ["id", "name", "email", "phone_number", "country_code", "description", "image", "fileName", "coach_specialization_category_ids", "employee_rank_ids", "coach_charge", "status", "app_id", "social_media_handles", "website", "document_url"],
            };
            const coach = yield helperFunction.convertPromiseToObject(yield queryService.selectOne(models_1.coachManagementModel, query));
            if (coach) {
                let query = {
                    where: {
                        id: {
                            [Op.in]: coach.coach_specialization_category_ids || [],
                        },
                        status: constants.STATUS.active,
                    }
                };
                coach.coach_specialization_categories = yield helperFunction.convertPromiseToObject(yield queryService.selectAll(coachSpecializationCategories_1.coachSpecializationCategoriesModel, query));
                query = {
                    where: {
                        id: {
                            [Op.in]: coach.employee_rank_ids || [],
                        },
                        status: constants.STATUS.active,
                    }
                };
                coach.employee_ranks = yield helperFunction.convertPromiseToObject(yield queryService.selectAll(employeeRanks_1.employeeRanksModel, query));
                query = {
                    where: {
                        coach_id: coach.id,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    }
                };
                coach.total_completed_sessions = yield queryService.count(employeeCoachSession_1.employeeCoachSessionsModel, query);
                query = {
                    where: {
                        coach_id: coach.id,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                        coach_rating: {
                            [Op.gte]: 1
                        }
                    }
                };
                let totalRating = yield queryService.sum(employeeCoachSession_1.employeeCoachSessionsModel, 'coach_rating', query);
                query = {
                    where: {
                        coach_id: coach.id,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                        coach_rating: {
                            [Op.gte]: 1
                        }
                    }
                };
                coach.rating_count = yield queryService.count(employeeCoachSession_1.employeeCoachSessionsModel, query);
                coach.average_rating = 0;
                if (coach.rating_count > 0) {
                    coach.average_rating = parseFloat((parseInt(totalRating) / coach.rating_count).toFixed(0));
                }
                delete coach.coach_specialization_category_ids;
                delete coach.employee_rank_ids;
                let where = {
                    status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    coach_id: coach.id,
                    type: constants.EMPLOYEE_COACH_SESSION_TYPE.free,
                };
                coach.freeSessionsCount = yield queryService.count(employeeCoachSession_1.employeeCoachSessionsModel, { where });
                coach.freeSessionsMinutes = (yield queryService.sum(employeeCoachSession_1.employeeCoachSessionsModel, 'call_duration', { where })) || 0;
                where = Object.assign(Object.assign({}, where), { type: constants.EMPLOYEE_COACH_SESSION_TYPE.paid });
                coach.paidSessionsCount = yield queryService.count(employeeCoachSession_1.employeeCoachSessionsModel, { where });
                coach.paidSessionsMinutes = (yield queryService.sum(employeeCoachSession_1.employeeCoachSessionsModel, 'call_duration', { where })) || 0;
                coach.conversionRate = 1;
                return coach;
            }
            else {
                throw new Error(constants.MESSAGES.coach_not_found);
            }
        });
    }
    deleteCoach(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                where: {
                    id: params.coach_id
                }
            };
            const coach = yield queryService.deleteData(models_1.coachManagementModel, query);
            query = {
                where: {
                    coach_id: params.coach_id
                }
            };
            yield queryService.deleteData(models_1.coachBiosModel, query);
            return coach;
        });
    }
    blockUnblockCoach(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                where: {
                    id: params.coach_id
                }
            };
            params.model = models_1.coachManagementModel;
            const coach = yield queryService.updateData(params, query);
            return coach;
        });
    }
    listCoachSpecializationCategories(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                order: [["createdAt", "DESC"]]
            };
            query.where = {
                status: {
                    [Op.in]: [constants.STATUS.active, constants.STATUS.inactive]
                }
            };
            if (params.searchKey) {
                query.where = Object.assign(Object.assign({}, query.where), { name: {
                        [Op.iLike]: `%${params.searchKey}%`
                    } });
            }
            if (!params.is_pagination || params.is_pagination == constants.IS_PAGINATION.yes) {
                let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
                query.offset = offset,
                    query.limit = limit;
            }
            let categories = yield helperFunction.convertPromiseToObject(yield coachSpecializationCategories_1.coachSpecializationCategoriesModel.findAndCountAll(query));
            if (categories.count == 0) {
                throw new Error(constants.MESSAGES.no_coach_specialization_category);
            }
            return categories;
        });
    }
    listEmployeeRanks(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                order: [["createdAt", "DESC"]]
            };
            query.where = {
                status: {
                    [Op.in]: [constants.STATUS.active, constants.STATUS.inactive]
                }
            };
            if (params.searchKey) {
                query.where = Object.assign(Object.assign({}, query.where), { name: {
                        [Op.iLike]: `%${params.searchKey}%`
                    } });
            }
            if (!params.is_pagination || params.is_pagination == constants.IS_PAGINATION.yes) {
                let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
                query.offset = offset,
                    query.limit = limit;
            }
            let ranks = yield helperFunction.convertPromiseToObject(yield employeeRanks_1.employeeRanksModel.findAndCountAll(query));
            if (ranks.count == 0) {
                throw new Error(constants.MESSAGES.no_employee_rank);
            }
            return ranks;
        });
    }
}
exports.CoachService = CoachService;
//# sourceMappingURL=coachService.js.map