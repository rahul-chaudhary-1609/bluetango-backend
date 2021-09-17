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
const coachSpecializationCategories_1 = require("../../models/coachSpecializationCategories");
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
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let whereCondintion = {};
            if (params.searchKey) {
                whereCondintion = Object.assign(Object.assign({}, whereCondintion), { name: {
                        [Op.iLike]: `%${params.searchKey}%`
                    } });
            }
            let categories = yield helperFunction.convertPromiseToObject(yield coachSpecializationCategories_1.coachSpecializationCategoriesModel.findAndCountAll({
                where: whereCondintion,
                limit,
                offset,
            }));
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
}
exports.CoachService = CoachService;
//# sourceMappingURL=coachService.js.map