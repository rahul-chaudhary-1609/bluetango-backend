import { HomepageServices } from "../../services/web/homepageServices";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const homepageServices = new HomepageServices();

export class HomepageController {

    constructor() { }

    /**
   * to get all coaches
   * @param req :[]
   * @param res 
   */
    public async getCoaches(req: any, res: any, next: any) {
        try {
            const responseFromService = await homepageServices.getCoaches();
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
  * to get all advisors
  * @param req :[]
  * @param res 
  */
    public async getAdvisors(req: any, res: any, next: any) {
        try {
            const responseFromService = await homepageServices.getAdvisors();
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

   
}