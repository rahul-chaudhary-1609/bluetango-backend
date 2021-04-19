import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import { achievementModel } from "../../models/achievement";
import { achievementLikeModel } from "../../models/achievementLike";
import { achievementCommentModel } from "../../models/achievementComment";
import { achievementHighFiveModel } from "../../models/achievementHighFive";
import { employeeModel } from "../../models/employee";

const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class AchievementServices {
    constructor() { }

    /*
    * function to get achievemnets
    */
    public async getAchievements(user: any) {

        achievementModel.hasMany(achievementLikeModel, { foreignKey: "achievement_id", sourceKey: "id", targetKey: "achievement_id" })
        achievementModel.hasMany(achievementCommentModel, { foreignKey: "achievement_id", sourceKey: "id", targetKey: "achievement_id" })
        achievementModel.hasMany(achievementHighFiveModel, { foreignKey: "achievement_id", sourceKey: "id", targetKey: "achievement_id" })
        achievementModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" })
        achievementLikeModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "liked_by_employee_id", targetKey: "id" })
        achievementHighFiveModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "high_fived_by_employee_id", targetKey: "id" })

        let achievements = await helperFunction.convertPromiseToObject(
            await achievementModel.findAll({
                attributes: [
                    'id', 'employee_id', 'description','status' ,'createdAt','updatedAt',
                    [Sequelize.fn('COUNT', Sequelize.col('achievement_likes.id')),'likeCount'],
                    [Sequelize.fn('COUNT', Sequelize.col('achievement_high_fives.id')), 'highFiveCount'],
                    [Sequelize.fn('COUNT', Sequelize.col('achievement_comments.id')), 'commentCount']
                ],
                include: [
                    {
                        model: employeeModel,
                        attributes: ['id', 'name', 'profile_pic_url', 'createdAt', 'updatedAt'],
                        required:true
                    },
                    {
                        model: achievementLikeModel,
                        attributes:[],
                        where: { status: 1 },
                        required: false,
                    },
                    {
                        model: achievementHighFiveModel,
                        attributes: [],
                        where: { status: 1 },
                        required: false,
                    },
                    {
                        model: achievementCommentModel,
                        attributes: [],
                        where: { status: 1 },
                        required: false,
                    },
                ],
                group: [
                    '"achievements.id"', '"employee.id"'
                ],                
                order: [["createdAt", "DESC"]]
            })
        )

        for (let achievement of achievements) {

            achievement.isLiked = false;
            achievement.isHighFived = false;

            let achievementLike = await achievementLikeModel.findOne({
                where: {
                    liked_by_employee_id: user.uid,
                    achievement_id: achievement.id,
                }
            })

            let achievementHighFive = await achievementHighFiveModel.findOne({
                where: {
                    high_fived_by_employee_id: user.uid,
                    achievement_id: achievement.id,
                }
            })

            if (achievementLike) achievement.isLiked = true;
            if (achievementHighFive) achievement.isHighFived = true;

        }

        
        
        return {achievements}
       
    }

    /*
    * function to create achievement
    */
    public async createUpdateAchievement(params:any,user: any) {

        let achievement = <any>{};

        if (params.achievement_id) {
            achievement = await achievementModel.findOne({
                where: {
                    employee_id: user.uid,
                    id: parseInt(params.achievement_id)
                }
            })

            if (achievement) {
                achievement.description = params.description;
                await achievement.save();
            }
            else
                throw new Error(constants.MESSAGES.no_achievement);
        }
        else {
            let achievementObj = <any>{
                employee_id: user.uid,
                description: params.description
            }

            achievement = await achievementModel.create(achievementObj);
        }


        return await helperFunction.convertPromiseToObject(achievement);

    }

    /*
    * function to like dislike an achievement
    */
    public async likeDislikeAchievement(params: any, user: any) {

        let achievementLike = await achievementLikeModel.findOne({
            where: {
                liked_by_employee_id: user.uid,
                achievement_id: parseInt(params.achievement_id)
            }
        })

        if (achievementLike) {
            await achievementLike.destroy()
        }
        else {

            let achievementLikeObj = <any>{
                liked_by_employee_id: user.uid,
                achievement_id: parseInt(params.achievement_id)
            }

            await achievementLikeModel.create(achievementLikeObj)
        }

        return true;        

    }

    /*
    * function to high five an achievement
    */
    public async highFiveAchievement(params: any, user: any) {

        let achievementhighFive = await achievementHighFiveModel.findOne({
            where: {
                high_fived_by_employee_id: user.uid,
                achievement_id: parseInt(params.achievement_id)
            }
        })

        if (achievementhighFive) {
            await achievementhighFive.destroy()
        }
        else {

            let achievementHighFiveObj = <any>{
                high_fived_by_employee_id: user.uid,
                achievement_id: parseInt(params.achievement_id)
            }

            await achievementHighFiveModel.create(achievementHighFiveObj)
        }

        return true;

    }

    /*
    * function to add edit comment on achievement
    */
    public async addEditCommentAchievement(params: any, user: any) {

        let achievementComment = <any>{};

        if (params.achievement_comment_id) {
            achievementComment = await achievementCommentModel.findOne({
                    where: {
                        commented_by_employee_id: user.uid,
                        id: parseInt(params.achievement_comment_id)
                    }
            })

            if (achievementComment) {
                achievementComment.comment = params.comment;
                await achievementComment.save();
            }
            else
                throw new Error(constants.MESSAGES.no_achievement_comment);
        }
        else {
            let achievementCommentObj = <any>{
                commented_by_employee_id: user.uid,
                achievement_id: parseInt(params.achievement_id),
                comment:params.comment
            }

            achievementComment = await achievementCommentModel.create(achievementCommentObj);
        }        
        

        return await helperFunction.convertPromiseToObject(achievementComment);

    }


    /*
    * function to get comments on achievement
    */
    public async getAchievementComments(params: any, user: any) {

        achievementCommentModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "commented_by_employee_id", targetKey: "id" })

        let achievementComments = await helperFunction.convertPromiseToObject(
            await achievementCommentModel.findAll({
                where: {
                    achievement_id:parseInt(params.achievement_id)
                },
                include: [
                    {
                        model: employeeModel,
                        attributes: ['id', 'name', 'profile_pic_url'],
                        required:false
                    }
                ],
                order: [["createdAt", "DESC"]]
            })
        )

        for (let comment of achievementComments) {
            comment.isCommented = false
            if (comment.employee.id == parseInt(user.uid)) comment.isCommented = true;
        }

        return achievementComments;
    }

    /*
    * function to delete an achievement
    */
    public async deleteAchievement(params: any, user: any) {
            let achievement = await achievementModel.findOne({
                where: {
                    employee_id: user.uid,
                    id: parseInt(params.achievement_id)
                }
            })

            if (achievement) {
                await achievement.destroy();
                return true
            }
            else
                throw new Error(constants.MESSAGES.no_achievement);
        
    }

}