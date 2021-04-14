import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import { achievementModel } from "../../models/achievement";
import { achievementLikeModel } from "../../models/achievementLike";
import { achievementCommentModel } from "../../models/achievementComment";
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
        achievementModel.hasMany(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" })
        // achievementLikeModel.hasMany(employeeModel, { foreignKey: "id", sourceKey: "liked_by_employee_id", targetKey: "id" })
        // achievementCommentModel.hasMany(employeeModel, { foreignKey: "id", sourceKey: "commented_by_employee_id", targetKey: "id" })

        let achievements = await helperFunction.convertPromiseToObject(
            await achievementModel.findAll({
                include: [
                    {
                        model: employeeModel,
                        attributes: ['id', 'name', 'profile_pic_url', 'createdAt', 'updatedAt'],
                        required:true
                    },
                    {
                        model: achievementLikeModel,
                        attributes: ['id', 'liked_by',],
                        where: { status: 1 },
                        order: [["createdAt", "DESC"]],
                        required: false,
                    },
                    {
                        model: achievementCommentModel,
                        attributes: ['id', 'commented_by','comment'],
                        where: { status: 1 },
                        order: [["createdAt", "DESC"]],
                        required: false,
                    },
                ],
                order: [["createdAt", "DESC"]]
            })
        )
        
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

}