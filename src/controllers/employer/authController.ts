import * as EmployerService from "../../services/employer";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const authService = new EmployerService.AuthService();

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
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
        } catch (e) {
            next(e)
        }
    }
}