import  { EmployeeManagement }  from "../../services/employer";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const employeeService = new EmployeeManagement();

export class EmployeeController {

    constructor() { }

    /**
    * add edit employee
    * @param req :[Body data]
    * @param res : [employers data object]
    */
    public async addEditEmployee(req: any, res: any) {
        try {
            const responseFromService = await employeeService.addEditEmployee(req.body, req.user);
            if (responseFromService) {
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * get employee list
    * @param req :[get data]
    * @param res : [employers data]
    */
    public async getEmployeeList(req: any, res: any) {
        try {
            console.log(req.user);
            const responseFromService = await employeeService.getEmployeeList(req.query, req.user);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employers_list);
            
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

}