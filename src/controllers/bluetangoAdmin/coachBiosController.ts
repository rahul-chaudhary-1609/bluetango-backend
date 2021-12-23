import { BiosService } from "../../services/bluetangoAdmin/index";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';
import { deleteFile } from "../../middleware/multerParser";


//Instantiates a Home services  
const biosService = new BiosService();

export class BiosController {

    constructor() { }
    /**
      * add coach bios
      * @param req :
      * @param res 
      */
    public async addBios(req: any, res: any) {
        try {
            const responseFromService = await biosService.addBios(req.body, req.file, req.user);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.biosAdded);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
    /**
      * update coach bios
      * @param req :
      * @param res 
      */
    public async updateBios(req: any, res: any) {
        try {
            const responseFromService = await biosService.updateBios(req.body, req.file, req.user);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.biosUpdated);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
    /**
      * delete coach bios
      * @param req :
      * @param res 
      */
    public async deleteBios(req: any, res: any) {
        try {
            const responseFromService = await biosService.deleteBios(req.params);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.biosDeleted);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
    /**
     * get all coach bios
     * @param req :
     * @param res 
     */
    public async getBios(req: any, res: any) {
        try {
            const responseFromService = await biosService.getBios();
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.fetch_success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

}