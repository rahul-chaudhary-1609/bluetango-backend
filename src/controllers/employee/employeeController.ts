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
            const responseFromService = await employeeServices.getListOfTeamMemberByManagerId(req.query);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }
}