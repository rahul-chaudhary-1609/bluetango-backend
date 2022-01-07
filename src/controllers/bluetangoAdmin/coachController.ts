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

    public async addCoach(req: any, res: any) {
        try {
            const responseFromService = await coachService.addCoach(req.body,req.user);
            const msg = constants.MESSAGES.success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async editCoach(req: any, res: any) {
        try {
            const responseFromService = await coachService.editCoach(req.body);
            const msg = constants.MESSAGES.success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async getCoachDetails(req: any, res: any) {
        try {
            const responseFromService = await coachService.getCoachDetails(req.query);
            const msg = constants.MESSAGES.success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async deleteCoach(req: any, res: any) {
        try {
            const responseFromService = await coachService.deleteCoach(req.body);
            const msg = constants.MESSAGES.success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async blockUnblockCoach(req: any, res: any) {
        try {
            const responseFromService = await coachService.blockUnblockCoach(req.body);
            const msg = constants.MESSAGES.success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async listCoachSpecializationCategories(req: any, res: any) {
        try {
            const responseFromService = await coachService.listCoachSpecializationCategories(req.query);
            const msg = constants.MESSAGES.success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async listEmployeeRanks(req: any, res: any) {
        try {
            const responseFromService = await coachService.listEmployeeRanks(req.query);
            const msg = constants.MESSAGES.success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    
}