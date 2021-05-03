import { AuthService } from "../../services/coach/authService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a coach auth services  
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
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
        } catch (e) {
            next(e)
        }
    }



}