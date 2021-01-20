import { LoginService } from "../../services/admin/index";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const loginService = new LoginService();

export class LoginController {

    constructor() { }

    /**
    * login
    * @param req :[email, password]
    * @param res 
    */
    public async login(req: any, res: any) {
        try {
            const responseFromService = await loginService.login(req.body);
            const msg = constants.MESSAGES.login_success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * addNewAdmin
    * @param req :[name, email, password, confirmPassword]
    * @param res 
    */
    public async addNewAdmin(req: any, res: any) {
        try {
            const responseFromService = await loginService.addNewAdmin(req.body);
            const msg = constants.MESSAGES.login_success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * addNewAdmin
    * @param req :[email]
    * @param res 
    */
    public async forgetPassword(req: any, res: any) {
        try {
            const responseFromService = await loginService.forgetPassword(req.body);
            const msg = constants.MESSAGES.forget_pass_otp;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * addNewAdmin
    * @param req :[email, otp, password, confirmPassword]
    * @param res 
    */
    public async resetPassword(req: any, res: any) {
        try {
            const responseFromService = await loginService.resetPassword(req.body);
            const msg = constants.MESSAGES.reset_pass_success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * changePassword
    * @param req :[oldPassword, password, confirmPassword]
    * @param res 
    */
    public async changePassword(req: any, res: any) {
        try {
            const responseFromService = await loginService.changePassword(req.body, req.user);
            const msg = constants.MESSAGES.reset_pass_success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * logout
    * @param req 
    * @param res 
    */
    public async logout(req: any, res: any) {
        try {
            const responseFromService = await loginService.logout(req.body, req.user);
            const msg = constants.MESSAGES.logout_success;
            appUtils.successResponse(res, {}, msg);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
}