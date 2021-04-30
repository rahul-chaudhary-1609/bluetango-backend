import { EmployerService } from "../../services/employer/employerService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a employer services  
const employerService = new EmployerService();

export class EmployerController {

    constructor() { }

    /**
    * get Subscription Plan List
    * @param req 
    * @param res 
    */
    public async getSubscriptionPlanList(req: any, res: any, next: any) {
        try {
            const responseFromService = await employerService.getSubscriptionPlanList(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    
    
}