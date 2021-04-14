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
exports.AchievementServices = void 0;
const helperFunction = __importStar(require("../../utils/helperFunction"));
const achievement_1 = require("../../models/achievement");
const achievementLike_1 = require("../../models/achievementLike");
const achievementComment_1 = require("../../models/achievementComment");
const employee_1 = require("../../models/employee");
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
class AchievementServices {
    constructor() { }
    /*
    * function to get achievemnets
    */
    getAchievements(user) {
        return __awaiter(this, void 0, void 0, function* () {
            achievement_1.achievementModel.hasMany(achievementLike_1.achievementLikeModel, { foreignKey: "achievement_id", sourceKey: "id", targetKey: "achievement_id" });
            achievement_1.achievementModel.hasMany(achievementComment_1.achievementCommentModel, { foreignKey: "achievement_id", sourceKey: "id", targetKey: "achievement_id" });
            achievement_1.achievementModel.hasMany(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            // achievementLikeModel.hasMany(employeeModel, { foreignKey: "id", sourceKey: "liked_by_employee_id", targetKey: "id" })
            // achievementCommentModel.hasMany(employeeModel, { foreignKey: "id", sourceKey: "commented_by_employee_id", targetKey: "id" })
            let achievements = yield helperFunction.convertPromiseToObject(yield achievement_1.achievementModel.findAll({
                include: [
                    {
                        model: employee_1.employeeModel,
                        attributes: ['id', 'name', 'profile_pic_url', 'createdAt', 'updatedAt'],
                        required: true
                    },
                    {
                        model: achievementLike_1.achievementLikeModel,
                        attributes: ['id', 'liked_by',],
                        where: { status: 1 },
                        order: [["createdAt", "DESC"]],
                        required: false,
                    },
                    {
                        model: achievementComment_1.achievementCommentModel,
                        attributes: ['id', 'commented_by', 'comment'],
                        where: { status: 1 },
                        order: [["createdAt", "DESC"]],
                        required: false,
                    },
                ],
                order: [["createdAt", "DESC"]]
            }));
            return { achievements };
        });
    }
    /*
    * function to create achievement
    */
    createAchievement(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let achievementObj = {
                employee_id: user.uid,
                description: params.description,
            };
            return yield helperFunction.convertPromiseToObject(yield achievement_1.achievementModel.create(achievementObj));
        });
    }
}
exports.AchievementServices = AchievementServices;
//# sourceMappingURL=achievementService.js.map