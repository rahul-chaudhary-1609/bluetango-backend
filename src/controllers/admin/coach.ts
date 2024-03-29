import { CoachService } from "../../services/admin/coachService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';



//Instantiates a Home services  
const coachService = new CoachService();

export class CoachController {

    constructor() { }

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

    public async deleteCoachSpecializationCategory(req: any, res: any) {
        try {
            const responseFromService = await coachService.deleteCoachSpecializationCategory(req.body);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.delete_success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async addEditEmployeeRank(req: any, res: any) {
        try {
            const responseFromService = await coachService.addEditEmployeeRank(req.body);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async listEmployeeRanks(req: any, res: any) {
        try {
            const responseFromService = await coachService.listEmployeeRanks(req.query);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async getEmployeeRank(req: any, res: any) {
        try {
            const responseFromService = await coachService.getEmployeeRank(req.query);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async deleteEmployeeRank(req: any, res: any) {
        try {
            const responseFromService = await coachService.deleteEmployeeRank(req.body);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.delete_success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async listEmployeeCoachSessions(req: any, res: any) {
        try {
            console.log("params=============>",req.query)
            const responseFromService = await coachService.listEmployeeCoachSessions(req.query);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async getEmployeeCoachSession(req: any, res: any) {
        try {
            const responseFromService = await coachService.getEmployeeCoachSession(req.query);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
}