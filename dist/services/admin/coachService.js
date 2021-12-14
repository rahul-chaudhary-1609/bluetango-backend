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
const models_1 = require("../../models");
const coachManagement_1 = require("../../models/coachManagement");
const coachSpecializationCategories_1 = require("../../models/coachSpecializationCategories");
const employeeRanks_1 = require("../../models/employeeRanks");
const employeeCoachSession_1 = require("../../models/employeeCoachSession");
const helperFunction = __importStar(require("../../utils/helperFunction"));
const constants = __importStar(require("../../constants"));
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
class CoachService {
    constructor() { }
    addEditCoachSpecializationCategories(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let category = null;
            if (params.category_id) {
                category = yield coachSpecializationCategories_1.coachSpecializationCategoriesModel.findOne({
                    where: {
                        name: {
                            [Op.iLike]: `%${params.name}%`
                        },
                        status: [constants.STATUS.active, constants.STATUS.inactive],
                        id: {
                            [Op.notIn]: [params.category_id],
                        }
                    }
                });
            }
            else {
                category = yield coachSpecializationCategories_1.coachSpecializationCategoriesModel.findOne({
                    where: {
                        name: {
                            [Op.iLike]: `%${params.name}%`
                        },
                        status: [constants.STATUS.active, constants.STATUS.inactive],
                    }
                });
            }
            if (!category) {
                if (params.category_id) {
                    let category = yield coachSpecializationCategories_1.coachSpecializationCategoriesModel.findOne({
                        where: {
                            id: params.category_id,
                        }
                    });
                    if (category) {
                        category.name = params.name || category.name;
                        category.description = params.description || category.description;
                        category.save();
                        return yield helperFunction.convertPromiseToObject(category);
                    }
                    else {
                        throw new Error(constants.MESSAGES.no_coach_specialization_category);
                    }
                }
                else {
                    let categoryObj = {
                        name: params.name,
                        description: params.description,
                    };
                    return yield helperFunction.convertPromiseToObject(yield coachSpecializationCategories_1.coachSpecializationCategoriesModel.create(categoryObj));
                }
            }
            else {
                throw new Error(constants.MESSAGES.coach_specialization_category_already_exist);
            }
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
    getCoachSpecializationCategory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let category = yield helperFunction.convertPromiseToObject(yield coachSpecializationCategories_1.coachSpecializationCategoriesModel.findOne({
                where: {
                    id: params.category_id,
                }
            }));
            if (!category) {
                throw new Error(constants.MESSAGES.no_coach_specialization_category);
            }
            return category;
        });
    }
    deleteCoachSpecializationCategory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let category = yield coachSpecializationCategories_1.coachSpecializationCategoriesModel.findOne({
                where: {
                    id: params.category_id,
                }
            });
            if (!category) {
                throw new Error(constants.MESSAGES.no_coach_specialization_category);
            }
            let coachCount = yield coachManagement_1.coachManagementModel.count({
                where: {
                    coach_specialization_category_ids: {
                        [Op.contains]: [category.id]
                    }
                }
            });
            if (coachCount > 0) {
                throw new Error(constants.MESSAGES.coach_specialization_category_delete_error);
            }
            else {
                category.destroy();
                return true;
            }
        });
    }
    addEditEmployeeRank(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let rank = null;
            if (params.rank_id) {
                rank = yield employeeRanks_1.employeeRanksModel.findOne({
                    where: {
                        name: {
                            [Op.iLike]: `%${params.name}%`
                        },
                        status: [constants.STATUS.active, constants.STATUS.inactive],
                        id: {
                            [Op.notIn]: [params.rank_id],
                        }
                    }
                });
            }
            else {
                rank = yield employeeRanks_1.employeeRanksModel.findOne({
                    where: {
                        name: {
                            [Op.iLike]: `%${params.name}%`
                        },
                        status: [constants.STATUS.active, constants.STATUS.inactive],
                    }
                });
            }
            if (!rank) {
                if (params.rank_id) {
                    let rank = yield employeeRanks_1.employeeRanksModel.findOne({
                        where: {
                            id: params.rank_id,
                        }
                    });
                    if (rank) {
                        rank.name = params.name || rank.name;
                        rank.description = params.description || rank.description;
                        rank.save();
                        return yield helperFunction.convertPromiseToObject(rank);
                    }
                    else {
                        throw new Error(constants.MESSAGES.no_employee_rank);
                    }
                }
                else {
                    let rankObj = {
                        name: params.name,
                        description: params.description,
                    };
                    return yield helperFunction.convertPromiseToObject(yield employeeRanks_1.employeeRanksModel.create(rankObj));
                }
            }
            else {
                throw new Error(constants.MESSAGES.employee_rank_already_exist);
            }
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
    getEmployeeRank(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let rank = yield helperFunction.convertPromiseToObject(yield employeeRanks_1.employeeRanksModel.findOne({
                where: {
                    id: params.rank_id,
                }
            }));
            if (!rank) {
                throw new Error(constants.MESSAGES.no_employee_rank);
            }
            return rank;
        });
    }
    deleteEmployeeRank(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let rank = yield employeeRanks_1.employeeRanksModel.findOne({
                where: {
                    id: params.rank_id,
                }
            });
            if (!rank) {
                throw new Error(constants.MESSAGES.no_employee_rank);
            }
            let employeeCount = yield models_1.employeeModel.count({
                where: {
                    employee_rank_id: rank.id,
                    status: constants.STATUS.active
                }
            });
            if (employeeCount > 0) {
                throw new Error(constants.MESSAGES.employee_rank_delete_employee_error);
            }
            else {
                let coachCount = yield coachManagement_1.coachManagementModel.count({
                    where: {
                        employee_rank_ids: {
                            [Op.contains]: [rank.id]
                        },
                        status: constants.STATUS.active
                    }
                });
                if (coachCount > 0) {
                    throw new Error(constants.MESSAGES.employee_rank_delete_coach_error);
                }
                else {
                    rank.destroy();
                    return true;
                }
            }
        });
    }
    listEmployeeCoachSessions(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(coachManagement_1.coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(employeeRanks_1.employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });
            let where = {
            // status:{
            //     [Op.notIn]:[constants.STATUS.deleted]
            // },
            };
            let employeeWhere = {};
            let coachWhere = {};
            let employeeRankWhere = {};
            if (params.searchKey) {
                coachWhere = Object.assign(Object.assign({}, coachWhere), { name: {
                        [Op.iLike]: `%${params.searchKey}%`
                    } });
                let coaches = yield coachManagement_1.coachManagementModel.findOne({
                    where: coachWhere,
                });
                if (!coaches) {
                    coachWhere = {};
                    employeeWhere = Object.assign(Object.assign({}, employeeWhere), { name: {
                            [Op.iLike]: `%${params.searchKey}%`
                        } });
                }
                else {
                    employeeWhere = {};
                }
            }
            // if(params.date){
            //     where={
            //         [Op.and]: [
            //             {
            //                 ...where,                      
            //             },
            //             Sequelize.where(Sequelize.fn('date', Sequelize.col('datetime')), '=', params.date),
            //         ]                
            //     }
            // }
            if (params.date) {
                where = Object.assign(Object.assign({}, where), { date: params.date });
            }
            if (params.status) {
                if ([constants.EMPLOYEE_COACH_SESSION_STATUS.pending, constants.EMPLOYEE_COACH_SESSION_STATUS.accepted].includes(parseInt(params.status))) {
                    where = Object.assign(Object.assign({}, where), { status: {
                            [Op.in]: [
                                constants.EMPLOYEE_COACH_SESSION_STATUS.pending,
                                constants.EMPLOYEE_COACH_SESSION_STATUS.accepted
                            ]
                        } });
                }
                else {
                    where = Object.assign(Object.assign({}, where), { status: parseInt(params.status) });
                }
            }
            if (params.employeeRankId) {
                employeeRankWhere = Object.assign(Object.assign({}, employeeRankWhere), { id: params.employeeRankId });
            }
            if (params.sessionType) {
                where = Object.assign(Object.assign({}, where), { type: parseInt(params.sessionType) });
            }
            let sessions = yield helperFunction.convertPromiseToObject(yield employeeCoachSession_1.employeeCoachSessionsModel.findAndCountAll({
                where,
                include: [
                    {
                        model: models_1.employeeModel,
                        attributes: ['id', 'name'],
                        required: true,
                        where: employeeWhere,
                    },
                    {
                        model: coachManagement_1.coachManagementModel,
                        attributes: ['id', 'name'],
                        required: true,
                        where: coachWhere
                    },
                    {
                        model: employeeRanks_1.employeeRanksModel,
                        required: true,
                        where: employeeRankWhere
                    }
                ],
                limit,
                offset,
                order: [["createdAt", "DESC"]]
            }));
            if (sessions.count == 0)
                throw new Error(constants.MESSAGES.no_session);
            return sessions;
        });
    }
    getEmployeeCoachSession(params) {
        return __awaiter(this, void 0, void 0, function* () {
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(coachManagement_1.coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(employeeRanks_1.employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });
            employeeCoachSession_1.employeeCoachSessionsModel.hasOne(coachSpecializationCategories_1.coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id" });
            let session = yield helperFunction.convertPromiseToObject(yield employeeCoachSession_1.employeeCoachSessionsModel.findOne({
                where: {
                    id: params.session_id,
                },
                include: [
                    {
                        model: models_1.employeeModel,
                        attributes: ['id', 'name'],
                        required: true,
                    },
                    {
                        model: coachManagement_1.coachManagementModel,
                        attributes: ['id', 'name'],
                        required: true,
                    },
                    {
                        model: employeeRanks_1.employeeRanksModel,
                        required: true,
                    },
                    {
                        model: coachSpecializationCategories_1.coachSpecializationCategoriesModel,
                        required: true,
                    }
                ],
            }));
            if (!session)
                throw new Error(constants.MESSAGES.no_session);
            return session;
        });
    }
}
exports.CoachService = CoachService;
//# sourceMappingURL=coachService.js.map