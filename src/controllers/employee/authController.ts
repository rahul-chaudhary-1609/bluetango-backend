import { AuthService } from "../../services/employee/authService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';
import { nextTick } from "process";


//Instantiates a Home services  
const authService = new AuthService();

export class AuthController {

    constructor() { }

    /**
    * login
    * @param req :[email, password]
    * @param res 
    */
    public async login(req: any, res: any, next: any) {
        try {
            const responseFromService = await authService.login(req.body);
            console.log('aaaaaaaaaaaaaaaaaaaaaaa');
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
        } catch (e) {
            // next(e)
            
            appUtils.errorResponse(res, e, constants.code.error_code);
        }
    }
}