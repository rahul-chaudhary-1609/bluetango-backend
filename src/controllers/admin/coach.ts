import { CoachService } from "../../services/admin/coachService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';



//Instantiates a Home services  
const coachService = new CoachService();

export class CoachController {

    constructor() { }

    /**
    * get employer industry type list
    * @param req :[get data]
    * @param res : [data]
    */
    public async addEditCoachSpecializationCategories(req: any, res: any) {
        try {
            const responseFromService = await coachService.addEditCoachSpecializationCategories(req.body);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async listCoachSpecializationCategories(req: any, res: any) {
        try {
            const responseFromService = await coachService.listCoachSpecializationCategories(req.query);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async getCoachSpecializationCategory(req: any, res: any) {
        try {
            const responseFromService = await coachService.getCoachSpecializationCategory(req.query);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
}