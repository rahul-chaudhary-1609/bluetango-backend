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

    /**
* to get all articles
* @param req :[]
* @param res 
*/
    public async getArticles(req: any, res: any, next: any) {
        try {
            const responseFromService = await homepageServices.getArticles();
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
* to get all Subscription plans
* @param req :[]
* @param res 
*/
    public async getSubscriptions(req: any, res: any, next: any) {
        try {
            const responseFromService = await homepageServices.getSubscriptions();
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }
    /**
      * get static content
      * @param req :
      * @param res 
      */
     public async getStaticContent(req: any, res: any) {
        try {
            const responseFromService = await homepageServices.getStaticContent(req.query);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.fetch_success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }


}