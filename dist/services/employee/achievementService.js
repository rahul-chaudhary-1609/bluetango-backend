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
const constants = __importStar(require("../../constants"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const achievement_1 = require("../../models/achievement");
const achievementLike_1 = require("../../models/achievementLike");
const achievementComment_1 = require("../../models/achievementComment");
const achievementHighFive_1 = require("../../models/achievementHighFive");
const employee_1 = require("../../models/employee");
const notification_1 = require("../../models/notification");
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
class AchievementServices {
    constructor() { }
    /*
    * function to get achievemnets
    */
    getAchievements(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let employee = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findByPk(parseInt(user.uid)));
            achievement_1.achievementModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            let achievements = yield helperFunction.convertPromiseToObject(yield achievement_1.achievementModel.findAll({
                attributes: [
                    'id', 'employee_id', 'description', 'status',
                    ['like_count', 'likeCount'],
                    ['high_five_count', 'highFiveCount'],
                    ['comment_count', 'commentCount'],
                    'last_action_on', 'createdAt', 'updatedAt',
                ],
                include: [
                    {
                        model: employee_1.employeeModel,
                        attributes: ['id', 'name', 'profile_pic_url', 'current_employer_id', 'status', 'createdAt', 'updatedAt'],
                        where: { current_employer_id: employee.current_employer_id },
                        required: true
                    },
                ],
                order: [["last_action_on", "DESC"]]
            }));
            for (let achievement of achievements) {
                achievement.isLiked = false;
                achievement.isHighFived = false;
                achievement.isSelf = false;
                let achievementLike = yield achievementLike_1.achievementLikeModel.findOne({
                    where: {
                        liked_by_employee_id: user.uid,
                        achievement_id: parseInt(achievement.id),
                    }
                });
                let achievementHighFive = yield achievementHighFive_1.achievementHighFiveModel.findOne({
                    where: {
                        high_fived_by_employee_id: user.uid,
                        achievement_id: parseInt(achievement.id),
                    }
                });
                if (achievementLike)
                    achievement.isLiked = true;
                if (achievementHighFive)
                    achievement.isHighFived = true;
                if (achievement.employee && achievement.employee.id == parseInt(user.uid))
                    achievement.isSelf = true;
            }
            return { achievements };
        });
    }
    /*
    * function to get achievemnet by id
    */
    getAchievementById(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            achievement_1.achievementModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            achievementComment_1.achievementCommentModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "commented_by_employee_id", targetKey: "id" });
            let achievement = yield helperFunction.convertPromiseToObject(yield achievement_1.achievementModel.findOne({
                attributes: [
                    'id', 'employee_id', 'description', 'status',
                    ['like_count', 'likeCount'],
                    ['high_five_count', 'highFiveCount'],
                    ['comment_count', 'commentCount'],
                    'last_action_on', 'createdAt', 'updatedAt',
                ],
                where: {
                    id: parseInt(params.achievement_id),
                },
                include: [
                    {
                        model: employee_1.employeeModel,
                        attributes: ['id', 'name', 'profile_pic_url', 'current_employer_id', 'status', 'createdAt', 'updatedAt'],
                        required: true
                    },
                ],
                order: [["last_action_on", "DESC"]]
            }));
            if (!achievement)
                throw new Error(constants.MESSAGES.no_achievement);
            achievement.isLiked = false;
            achievement.isHighFived = false;
            achievement.isSelf = false;
            let achievementLike = yield achievementLike_1.achievementLikeModel.findOne({
                where: {
                    liked_by_employee_id: user.uid,
                    achievement_id: parseInt(achievement.id),
                }
            });
            let achievementHighFive = yield achievementHighFive_1.achievementHighFiveModel.findOne({
                where: {
                    high_fived_by_employee_id: user.uid,
                    achievement_id: parseInt(achievement.id),
                }
            });
            if (achievementLike)
                achievement.isLiked = true;
            if (achievementHighFive)
                achievement.isHighFived = true;
            if (achievement.employee && achievement.employee.id == parseInt(user.uid))
                achievement.isSelf = true;
            let achievementComments = yield helperFunction.convertPromiseToObject(yield achievementComment_1.achievementCommentModel.findAll({
                where: {
                    achievement_id: parseInt(params.achievement_id)
                },
                include: [
                    {
                        model: employee_1.employeeModel,
                        attributes: ['id', 'name', 'profile_pic_url'],
                        required: false
                    }
                ],
                order: [["createdAt", "DESC"]]
            }));
            for (let comment of achievementComments) {
                comment.isSelf = false;
                if (comment.employee && comment.employee.id == parseInt(user.uid))
                    comment.isSelf = true;
            }
            achievement.achievement_comments = achievementComments;
            return { achievement };
        });
    }
    /*
    * function to create achievement
    */
    createUpdateAchievement(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let achievement = {};
            if (params.achievement_id) {
                achievement = yield achievement_1.achievementModel.findOne({
                    where: {
                        employee_id: user.uid,
                        id: parseInt(params.achievement_id)
                    }
                });
                if (achievement) {
                    achievement.description = params.description;
                    yield achievement.save();
                }
                else
                    throw new Error(constants.MESSAGES.no_achievement);
            }
            else {
                let achievementObj = {
                    employee_id: user.uid,
                    description: params.description,
                    last_action_on: new Date(),
                };
                achievement = yield helperFunction.convertPromiseToObject(yield achievement_1.achievementModel.create(achievementObj));
                let senderData = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findByPk(parseInt(user.uid)));
                let recieversData = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findAll({
                    where: {
                        current_employer_id: senderData.current_employer_id,
                        status: constants.STATUS.active
                    }
                }));
                delete senderData.password;
                for (let recieverData of recieversData) {
                    delete recieverData.password;
                    // add notification for employee
                    let notificationObj = {
                        type_id: parseInt(achievement.id),
                        sender_id: senderData.id,
                        reciever_id: recieverData.id,
                        type: constants.NOTIFICATION_TYPE.achievement_post,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_post,
                            title: 'New Achievement Post',
                            message: `${senderData.name} has posted new achievement`,
                            id: parseInt(achievement.id),
                            senderEmplyeeData: senderData,
                        },
                    };
                    yield notification_1.notificationModel.create(notificationObj);
                    // send push notification
                    let notificationData = {
                        title: 'New Achievement Post',
                        body: `${senderData.name} has posted new achievement`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_post,
                            title: 'New Achievement Post',
                            message: `${senderData.name} has posted new achievement`,
                            id: parseInt(achievement.id),
                            senderEmplyeeData: senderData,
                        },
                    };
                    yield helperFunction.sendFcmNotification([recieverData.device_token], notificationData);
                }
            }
            return achievement;
        });
    }
    /*
    * function to like dislike an achievement
    */
    likeDislikeAchievement(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let achievement = yield achievement_1.achievementModel.findByPk(parseInt(params.achievement_id));
            if (achievement) {
                let employee = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                    attributes: ['id', 'name', 'profile_pic_url', 'current_employer_id', 'status', 'createdAt', 'updatedAt'],
                    where: {
                        id: parseInt(achievement.employee_id),
                    }
                }));
                let achievementLike = yield achievementLike_1.achievementLikeModel.findOne({
                    where: {
                        liked_by_employee_id: user.uid,
                        achievement_id: parseInt(params.achievement_id)
                    }
                });
                if (achievementLike) {
                    yield achievementLike.destroy();
                    achievement.like_count = parseInt(achievement.like_count) - 1;
                    achievement.save();
                }
                else {
                    let achievementLikeObj = {
                        liked_by_employee_id: user.uid,
                        achievement_id: parseInt(params.achievement_id)
                    };
                    yield achievementLike_1.achievementLikeModel.create(achievementLikeObj);
                    //achievement.last_action_on = new Date();
                    achievement.like_count = parseInt(achievement.like_count) + 1;
                    achievement.save();
                    let senderData = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findByPk(parseInt(user.uid)));
                    let recieverData = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findByPk(parseInt(achievement.employee_id)));
                    delete recieverData.password;
                    delete senderData.password;
                    // add notification for employee
                    let notificationObj = {
                        type_id: parseInt(params.achievement_id),
                        sender_id: senderData.id,
                        reciever_id: recieverData.id,
                        type: constants.NOTIFICATION_TYPE.achievement_like,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_like,
                            title: 'Achievement Like',
                            message: `${senderData.name} has liked your achievement post`,
                            id: parseInt(params.achievement_id),
                            senderEmplyeeData: senderData,
                        },
                    };
                    yield notification_1.notificationModel.create(notificationObj);
                    // send push notification
                    let notificationData = {
                        title: 'Achievement Like',
                        body: `${senderData.name} has liked your achievement post`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_like,
                            title: 'Achievement Like',
                            message: `${senderData.name} has liked your achievement post`,
                            id: parseInt(params.achievement_id),
                            senderEmplyeeData: senderData,
                        },
                    };
                    yield helperFunction.sendFcmNotification([recieverData.device_token], notificationData);
                }
                achievement = yield helperFunction.convertPromiseToObject(achievement);
                achievement.employee = employee;
                return achievement;
            }
            else {
                throw new Error(constants.MESSAGES.no_achievement);
            }
        });
    }
    /*
    * function to high five an achievement
    */
    highFiveAchievement(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let achievement = yield achievement_1.achievementModel.findByPk(parseInt(params.achievement_id));
            if (achievement) {
                let employee = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                    attributes: ['id', 'name', 'profile_pic_url', 'current_employer_id', 'status', 'createdAt', 'updatedAt'],
                    where: {
                        id: parseInt(achievement.employee_id),
                    }
                }));
                let achievementhighFive = yield achievementHighFive_1.achievementHighFiveModel.findOne({
                    where: {
                        high_fived_by_employee_id: user.uid,
                        achievement_id: parseInt(params.achievement_id)
                    }
                });
                if (achievementhighFive) {
                    yield achievementhighFive.destroy();
                    achievement.high_five_count = parseInt(achievement.high_five_count) - 1;
                    achievement.save();
                }
                else {
                    let achievementHighFiveObj = {
                        high_fived_by_employee_id: user.uid,
                        achievement_id: parseInt(params.achievement_id)
                    };
                    yield achievementHighFive_1.achievementHighFiveModel.create(achievementHighFiveObj);
                    //achievement.last_action_on = new Date();
                    achievement.high_five_count = parseInt(achievement.high_five_count) + 1;
                    achievement.save();
                    let senderData = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findByPk(parseInt(user.uid)));
                    let recieverData = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findByPk(parseInt(achievement.employee_id)));
                    delete recieverData.password;
                    delete senderData.password;
                    // add notification for employee
                    let notificationObj = {
                        type_id: parseInt(params.achievement_id),
                        sender_id: senderData.id,
                        reciever_id: recieverData.id,
                        type: constants.NOTIFICATION_TYPE.achievement_highfive,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_highfive,
                            title: 'Achievement Highfive',
                            message: `${senderData.name} has reacted as highfive on your achievement post`,
                            id: parseInt(params.achievement_id),
                            senderEmplyeeData: senderData,
                        },
                    };
                    yield notification_1.notificationModel.create(notificationObj);
                    // send push notification
                    let notificationData = {
                        title: 'Achievement Highfive',
                        body: `${senderData.name} has reacted as highfive on your achievement post`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_highfive,
                            title: 'Achievement Highfive',
                            message: `${senderData.name} has reacted as highfive on your achievement post`,
                            id: parseInt(params.achievement_id),
                            senderEmplyeeData: senderData,
                        },
                    };
                    yield helperFunction.sendFcmNotification([recieverData.device_token], notificationData);
                }
                achievement = yield helperFunction.convertPromiseToObject(achievement);
                achievement.employee = employee;
                return achievement;
            }
            else {
                throw new Error(constants.MESSAGES.no_achievement);
            }
        });
    }
    /*
    * function to add edit comment on achievement
    */
    addEditCommentAchievement(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let achievement = yield achievement_1.achievementModel.findByPk(parseInt(params.achievement_id));
            if (achievement) {
                let achievementComment = {};
                if (params.achievement_comment_id) {
                    achievementComment = yield achievementComment_1.achievementCommentModel.findOne({
                        where: {
                            commented_by_employee_id: user.uid,
                            id: parseInt(params.achievement_comment_id)
                        }
                    });
                    if (achievementComment) {
                        achievementComment.comment = params.comment;
                        yield achievementComment.save();
                    }
                    else
                        throw new Error(constants.MESSAGES.no_achievement_comment);
                }
                else {
                    let achievementCommentObj = {
                        commented_by_employee_id: user.uid,
                        achievement_id: parseInt(params.achievement_id),
                        comment: params.comment
                    };
                    achievementComment = yield achievementComment_1.achievementCommentModel.create(achievementCommentObj);
                    achievement.last_action_on = new Date();
                    achievement.comment_count = parseInt(achievement.comment_count) + 1;
                    achievement.save();
                    let senderData = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findByPk(parseInt(user.uid)));
                    let recieverData = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findByPk(parseInt(achievement.employee_id)));
                    delete recieverData.password;
                    delete senderData.password;
                    // add notification for employee
                    let notificationObj = {
                        type_id: parseInt(params.achievement_id),
                        sender_id: senderData.id,
                        reciever_id: recieverData.id,
                        type: constants.NOTIFICATION_TYPE.achievement_comment,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_comment,
                            title: 'Achievement Comment',
                            message: `${senderData.name} has commented on your achievement post`,
                            id: parseInt(params.achievement_id),
                            senderEmplyeeData: senderData,
                        },
                    };
                    yield notification_1.notificationModel.create(notificationObj);
                    // send push notification
                    let notificationData = {
                        title: 'Achievement Comment',
                        body: `${senderData.name} has commented on your achievement post`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_comment,
                            title: 'Achievement Comment',
                            message: `${senderData.name} has commented on your achievement post`,
                            id: parseInt(params.achievement_id),
                            senderEmplyeeData: senderData,
                        },
                    };
                    yield helperFunction.sendFcmNotification([recieverData.device_token], notificationData);
                }
                return yield helperFunction.convertPromiseToObject(achievementComment);
            }
            else {
                throw new Error(constants.MESSAGES.no_achievement);
            }
        });
    }
    /*
    * function to get comments on achievement
    */
    getAchievementComments(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            achievementComment_1.achievementCommentModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "commented_by_employee_id", targetKey: "id" });
            let achievementComments = yield helperFunction.convertPromiseToObject(yield achievementComment_1.achievementCommentModel.findAll({
                where: {
                    achievement_id: parseInt(params.achievement_id)
                },
                include: [
                    {
                        model: employee_1.employeeModel,
                        attributes: ['id', 'name', 'status', 'profile_pic_url'],
                        required: false
                    }
                ],
                order: [["createdAt", "DESC"]]
            }));
            for (let comment of achievementComments) {
                comment.isSelf = false;
                if (comment.employee && comment.employee.id == parseInt(user.uid))
                    comment.isSelf = true;
            }
            return achievementComments;
        });
    }
    /*
    * function to delete an achievement
    */
    deleteAchievement(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let achievement = yield achievement_1.achievementModel.findOne({
                where: {
                    employee_id: user.uid,
                    id: parseInt(params.achievement_id)
                }
            });
            if (achievement) {
                yield achievement.destroy();
                return true;
            }
            else
                throw new Error(constants.MESSAGES.no_achievement);
        });
    }
    /*
    * function to delete an achievement comment
    */
    deleteAchievementComment(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let achievementComment = yield achievementComment_1.achievementCommentModel.findOne({
                where: {
                    commented_by_employee_id: user.uid,
                    id: parseInt(params.achievement_comment_id)
                }
            });
            if (achievementComment) {
                yield achievementComment.destroy();
                let achievement = yield achievement_1.achievementModel.findByPk(parseInt(achievementComment.achievement_id));
                achievement.comment_count = parseInt(achievement.comment_count) - 1;
                achievement.save();
                return true;
            }
            else
                throw new Error(constants.MESSAGES.no_achievement_comment);
        });
    }
    /*
    * function to get list of likes on achievement
    */
    getAchievementLikesList(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            achievementLike_1.achievementLikeModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "liked_by_employee_id", targetKey: "id" });
            let achievement = yield helperFunction.convertPromiseToObject(yield achievement_1.achievementModel.findByPk(parseInt(params.achievement_id)));
            let achievementLikes = yield helperFunction.convertPromiseToObject(yield achievementLike_1.achievementLikeModel.findAll({
                where: {
                    achievement_id: parseInt(params.achievement_id)
                },
                include: [
                    {
                        model: employee_1.employeeModel,
                        attributes: ['id', 'name', 'status', 'profile_pic_url'],
                        required: false
                    }
                ],
                order: [["createdAt", "DESC"]]
            }));
            for (let like of achievementLikes) {
                like.isSelf = false;
                if (like.employee && like.employee.id == parseInt(user.uid)) {
                    like.isSelf = true;
                    break;
                }
            }
            // achievementLikes.likeCount = achievement.like_count;
            // achievementLikes.highFiveCount = achievement.high_five_count;
            return {
                achievementLikes,
                likeCount: achievement.like_count,
                highFiveCount: achievement.high_five_count,
            };
        });
    }
    /*
    * function to get list of high fives on achievement
    */
    getAchievementHighFivesList(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            achievementHighFive_1.achievementHighFiveModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "high_fived_by_employee_id", targetKey: "id" });
            let achievement = yield helperFunction.convertPromiseToObject(yield achievement_1.achievementModel.findByPk(parseInt(params.achievement_id)));
            let achievementHighFives = yield helperFunction.convertPromiseToObject(yield achievementHighFive_1.achievementHighFiveModel.findAll({
                where: {
                    achievement_id: parseInt(params.achievement_id)
                },
                include: [
                    {
                        model: employee_1.employeeModel,
                        attributes: ['id', 'name', 'status', 'profile_pic_url'],
                        required: false
                    }
                ],
                order: [["createdAt", "DESC"]]
            }));
            for (let highFive of achievementHighFives) {
                highFive.isSelf = false;
                if (highFive.employee && highFive.employee.id == parseInt(user.uid)) {
                    highFive.isSelf = true;
                    break;
                }
            }
            // achievementHighFives.likeCount = achievement.like_count;
            // achievementHighFives.highFiveCount = achievement.high_five_count;
            return {
                achievementHighFives,
                likeCount: achievement.like_count,
                highFiveCount: achievement.high_five_count,
            };
        });
    }
}
exports.AchievementServices = AchievementServices;
//# sourceMappingURL=achievementService.js.map