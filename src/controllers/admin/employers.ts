import  { EmployersService }  from "../../services/admin/employersService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const employersService = new EmployersService();

export class EmployersController {

    constructor() { }

    /**
    * login
    * @param req :[email, password]
    * @param res 
    */
    public async addEditEmployers(req: any, res: any) {
        try {
            const responseFromService = await employersService.addEditEmployers(req.body);
            if (responseFromService) {
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

}