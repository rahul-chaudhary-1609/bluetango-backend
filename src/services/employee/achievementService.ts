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
        //achievementModel.hasMany(achievementCommentModel, { foreignKey: "achievement_id", sourceKey: "id", targetKey: "achievement_id" })
        achievementModel.hasMany(achievementHighFiveModel, { foreignKey: "achievement_id", sourceKey: "id", targetKey: "achievement_id" })
        achievementModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" })
        achievementLikeModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "liked_by_employee_id", targetKey: "id" })
        //achievementCommentModel.hasMany(employeeModel, { foreignKey: "id", sourceKey: "commented_by_employee_id", targetKey: "id" })
        achievementHighFiveModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "high_fived_by_employee_id", targetKey: "id" })

        let achievements = await helperFunction.convertPromiseToObject(
            await achievementModel.findAll({
                attributes: [
                    'id', 'employee_id', 'description','status' ,'createdAt','updatedAt',
                    [Sequelize.fn('COUNT', Sequelize.col('achievement_likes.id')),'likeCount'],
                    [Sequelize.fn('COUNT', Sequelize.col('achievement_high_fives.id')), 'highFiveCount']
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
    public async createAchievement(params:any,user: any) {

        let achievementObj = <any>{
            employee_id: user.uid,
            description: params.description,
        }

        return await helperFunction.convertPromiseToObject(
            await achievementModel.create(achievementObj)
        )

    }

    /*
    * function to like an achievement
    */
    public async likeDislikeAchievement(params: any, user: any) {

        let achievementLike = await achievementLikeModel.findOne({
            where: {
                liked_by_employee_id: user.uid,
                achievement_id: params.achievement_id,
            }
        })

        if (achievementLike) {
            await achievementLike.destroy()
        }
        else {

            let achievementLikeObj = <any>{
                liked_by_employee_id: user.uid,
                achievement_id: params.achievement_id,
            }

            await achievementLikeModel.create(achievementLikeObj)
        }

        return true;        

    }

}