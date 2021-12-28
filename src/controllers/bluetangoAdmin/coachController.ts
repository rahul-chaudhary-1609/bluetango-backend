import { CoachService } from "../../services/bluetangoAdmin/coachService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';
import { deleteFile } from "../../middleware/multerParser"


//Instantiates a Home services  
const coachService = new CoachService();

export class CoachController {

    constructor() { }

    public async dashboard(req: any, res: any) {
        try {
            const responseFromService = await coachService.dashboard(req.query);
            const msg = constants.MESSAGES.success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async getCoachList(req: any, res: any) {
        try {
            const responseFromService = await coachService.getCoachList(req.query);
            const msg = constants.MESSAGES.success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    
}