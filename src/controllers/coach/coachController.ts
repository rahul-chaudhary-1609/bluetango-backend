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
    public async addEditSlot(req: any, res: any, next: any) {
        try {
            const responseFromService = await coachService.addEditSlot(req.body,req.user);
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

    public async getSessionRequests(req: any, res: any, next: any) {
        try {
            const responseFromService = await coachService.getSessionRequests(req.query,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async acceptSessionRequest(req: any, res: any, next: any) {
        try {
            const responseFromService = await coachService.acceptSessionRequest(req.body,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async rejectSessionRequest(req: any, res: any, next: any) {
        try {
            const responseFromService = await coachService.rejectSessionRequest(req.body,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async getAcceptedSessions(req: any, res: any, next: any) {
        try {
            const responseFromService = await coachService.getAcceptedSessions(req.query,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async cancelSession(req: any, res: any, next: any) {
        try {
            const responseFromService = await coachService.cancelSession(req.body,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async listSessionHistory(req: any, res: any, next: any) {
        try {
            const responseFromService = await coachService.listSessionHistory(req.query,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async getSessionHistoryDetails(req: any, res: any, next: any) {
        try {
            const responseFromService = await coachService.getSessionHistoryDetails(req.params);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async updateZoomMeetingDuration(req: any, res: any, next: any) {
        try {
            const responseFromService = await coachService.updateZoomMeetingDuration(req.body,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async endZoomMeeting(req: any, res: any, next: any) {
        try {
            const responseFromService = await coachService.endZoomMeeting(req.body,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

}