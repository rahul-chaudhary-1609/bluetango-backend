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
    public async createAchievement(req: any, res: any, next: any) {
        try {
            const responseFromService = await achievementServices.createAchievement(req.body,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * like achievement
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
}