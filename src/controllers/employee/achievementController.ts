import { AchievementServices } from "../../services/employee/achievementService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a achievement services  
const achievementServices = new AchievementServices();

export class AchievementController {

    constructor() { }

    /**
    * get achievements
    * @param req :[]
    * @param res 
    */
    public async getAchievements(req: any, res: any, next: any) {
        try {
            const responseFromService = await achievementServices.getAchievements(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * create achievement
    * @param req :[]
    * @param res 
    */
    public async createUpdateAchievement(req: any, res: any, next: any) {
        try {
            const responseFromService = await achievementServices.createUpdateAchievement(req.body,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * like dislike achievement
    * @param req :[]
    * @param res 
    */
    public async likeDislikeAchievement(req: any, res: any, next: any) {
        try {
            const responseFromService = await achievementServices.likeDislikeAchievement(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * high five achievement
    * @param req :[]
    * @param res 
    */
    public async highFiveAchievement(req: any, res: any, next: any) {
        try {
            const responseFromService = await achievementServices.highFiveAchievement(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * comment achievement
    * @param req :[]
    * @param res 
    */
    public async addEditCommentAchievement(req: any, res: any, next: any) {
        try {
            const responseFromService = await achievementServices.addEditCommentAchievement(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * get comments of achievement
    * @param req :[]
    * @param res 
    */
    public async getAchievementComments(req: any, res: any, next: any) {
        try {
            const responseFromService = await achievementServices.getAchievementComments(req.params, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * delete achievement
    * @param req :[]
    * @param res 
    */
    public async deleteAchievement(req: any, res: any, next: any) {
        try {
            const responseFromService = await achievementServices.deleteAchievement(req.params, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * delete achievement comment
    * @param req :[]
    * @param res 
    */
    public async deleteAchievementComment(req: any, res: any, next: any) {
        try {
            const responseFromService = await achievementServices.deleteAchievementComment(req.params, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }
}