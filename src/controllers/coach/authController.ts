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

    /**
    * forgot password
    * @param req :[email]
    * @param res 
    */
    public async forgotPassword(req: any, res: any, next: any) {
        try {
            const responseFromService = await authService.forgotPassword(req.body);
            const msg = constants.MESSAGES.forget_pass_otp;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            next(error)
        }
    }

    /**
    * reset password
    * @param req :[password]
    * @param res 
    */
    public async resetPassword(req: any, res: any, next: any) {
        try {
            const responseFromService = await authService.resetPassword(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.reset_pass_success);
        } catch (error) {
            next(error);
        }
    }

    /**
    * get  profile
    * @param req 
    * @param res 
    */
    public async getProfile(req: any, res: any, next: any) {
        try {
            const responseFromService = await authService.getProfile(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (error) {
            next(error);
        }
    }




}