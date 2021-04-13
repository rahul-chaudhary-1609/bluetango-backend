import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import { achievementModel } from "../../models/achievement";
import { achievementLikeModel } from "../../models/achievementLike";
import { achievementCommentModel } from "../../models/achievementComment";

const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class AchievementServices {
    constructor() { }

    /*
    * function to get chat popup list as employee
    */
    public async getAchievement(user: any) {

        let achievement = await helperFunction.convertPromiseToObject(await achievementModel.findAll());
        let achievementLike = await helperFunction.convertPromiseToObject(await achievementLikeModel.findAll());
        let achievementComment = await helperFunction.convertPromiseToObject(await achievementCommentModel.findAll());

        return {achievement,achievementLike,achievementComment}
       
    }

}