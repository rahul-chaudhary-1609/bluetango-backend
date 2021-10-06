import { CoachService } from "../../services/coach/coachService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a chat services  
const coachService = new CoachService();

export class CoachController {

    constructor() { }


    /**
    * get chat list
    * @param req :[]
    * @param res 
    */
    public async addSlot(req: any, res: any, next: any) {
        try {
            const responseFromService = await coachService.addSlot(req.body,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async getSlots(req: any, res: any, next: any) {
        try {
            const responseFromService = await coachService.getSlots(req.query,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async getSlot(req: any, res: any, next: any) {
        try {
            const responseFromService = await coachService.getSlot(req.query);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async deleteSlot(req: any, res: any, next: any) {
        try {
            const responseFromService = await coachService.deleteSlot(req.body);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

}