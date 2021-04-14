import { AchievementServices } from "../../services/employee/achievementService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a achievement services  
const achievementServices = new AchievementServices();

export class AchievementController {

    constructor() { }

    /**
    * get chat pop up list
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
}