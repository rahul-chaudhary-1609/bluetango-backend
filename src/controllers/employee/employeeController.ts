import { EmployeeServices } from "../../services/employee/employeeServices";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const employeeServices = new EmployeeServices();

export class EmployeeController {

    constructor() { }

    /**
    * getListOfTeamMemberByManagerId
    * @param req :[]
    * @param res 
    */
    public async getListOfTeamMemberByManagerId(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getListOfTeamMemberByManagerId(req.query, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * viewDetailsEmployee
    * @param req :[]
    * @param res 
    */
    public async viewDetailsEmployee(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.viewDetailsEmployee(req.query);
            if (responseFromService) {
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
            
        } catch (e) {
            next(e)
        }
    }

    /**
    * searchTeamMember
    * @param req :[]
    * @param res 
    */
    public async searchTeamMember(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.searchTeamMember(req.query, req.user);
            if (responseFromService) {
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
            
        } catch (e) {
            next(e)
        }
    }

    /**
    * add thought of the day
    * @param req :[]
    * @param res 
    */
    public async thoughtOfTheDay(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.thoughtOfTheDay(req.body, req.user);
            if (responseFromService) {
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
            
        } catch (e) {
            next(e)
        }
    }

     /**
    * add thought of the day
    * @param req :[]
    * @param res 
    */
    public async getEmoji(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getEmoji();
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            
        } catch (e) {
            next(e)
        }
    }

    /**
    * update energy of the employee
    * @param req :[]
    * @param res 
    */
    public async updateEnergyCheck(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.updateEnergyCheck(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            
        } catch (e) {
            next(e)
        }
    }

     /**
    * view energy of the team members
    * @param req :[]
    * @param res 
    */
    public async viewEnergyCheckTeamMembers(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.viewEnergyCheckTeamMembers(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            
        } catch (e) {
            next(e)
        }
    }

    /**
    * feel about job today
    * @param req :[]
    * @param res 
    */
    public async feelAboutJobToday(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.feelAboutJobToday(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            
        } catch (e) {
            next(e)
        }
    }

    /**
    * update device token
    * @param req :[]
    * @param res 
    */
    public async updateEmployeeDeviceToken(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.updateEmployeeDeviceToken(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
    * get current manager
    * @param req :[]
    * @param res 
    */
    public async getCurrentManager(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getCurrentManager(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

}