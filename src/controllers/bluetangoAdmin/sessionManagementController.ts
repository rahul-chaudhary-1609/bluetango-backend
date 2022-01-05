import { SessionManagementService } from "../../services/bluetangoAdmin/index";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const sessionManagement = new SessionManagementService();

export class SessionManagementController {

    constructor() { }
    /**
      * get Session List
      * @param req :
      * @param res 
      */
    public async getSessionList(req: any, res: any) {
        try {
            const responseFromService = await sessionManagement.getSessionList(req.query);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.fetch_success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
    /**
      * get Session details
      * @param req :
      * @param res 
      */
    public async getSessionDetail(req: any, res: any) {
        try {
            const responseFromService = await sessionManagement.getSessionDetail(req.query);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.session_details_fetched);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
    /**
  * perform action on sessions
  * @param req :
  * @param res 
  */
    public async performAction(req: any, res: any) {
        try {
            const responseFromService = await sessionManagement.performAction(req.body);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.action_success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
    /**
  * get Availabile Coaches
  * @param req :
  * @param res 
  */
     public async getAvailabileCoaches(req: any, res: any) {
        try {
            const responseFromService = await sessionManagement.getAvailabileCoaches(req.query);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.available_coaches_fetched);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

}