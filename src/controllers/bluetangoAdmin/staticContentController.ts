import { StaticContentService } from "../../services/bluetangoAdmin/index";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';
import { deleteFile } from "../../middleware/multerParser";


//Instantiates a Home services  
const staticContent = new StaticContentService();

export class StaticContentController {

    constructor() { }
    /**
     * update static content
     * @param req :
     * @param res 
     */
    public async addStaticContent(req: any, res: any) {
        try {
            const responseFromService = await staticContent.addStaticContent(req.body, req.user);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.biosUpdated);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
    /**
      * get static content
      * @param req :
      * @param res 
      */
    public async getStaticContent(req: any, res: any) {
        try {
            const responseFromService = await staticContent.getStaticContent(req.query);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.fetch_success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

}