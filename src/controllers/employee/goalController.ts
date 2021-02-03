import { GoalServices } from "../../services/employee/goalServices";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const goalServices = new GoalServices();

export class GoalController {

    constructor() { }

    /**
    * getListOfTeamMemberByManagerId
    * @param req :[]
    * @param res 
    */
    public async addGoal(req: any, res: any, next: any) {
        try {
            req.body.goal_details = JSON.parse(req.body.goal_details);
            const responseFromService = await goalServices.addGoal(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    
}