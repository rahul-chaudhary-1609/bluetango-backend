import { GoalServices } from "../../services/employee/goalServices";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const goalServices = new GoalServices();

export class GoalController {

    constructor() { }

    /**
    * add goal
    * @param req :[]
    * @param res 
    */
    public async addGoal(req: any, res: any, next: any) {
        try {
            // req.body.goal_details = JSON.parse(req.body.goal_details);
            const responseFromService = await goalServices.addGoal(req.body.goal_details, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * edit goal
    * @param req :[]
    * @param res 
    */
    public async editGoal(req: any, res: any, next: any) {
        try {
            req.body.employee_ids = JSON.parse(req.body.employee_ids);
            const responseFromService = await goalServices.editGoal(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * view goal
    * @param req :[]
    * @param res 
    */
    public async viewGoal(req: any, res: any, next: any) {
        try {
            const responseFromService = await goalServices.viewGoal(req.query, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

     /**
    * delete goal
    * @param req :[]
    * @param res 
    */
    public async deleteGoal(req: any, res: any, next: any) {
        try {
            const responseFromService = await goalServices.deleteGoal(req.query, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    
}