import { AuthService } from "../../services/bluetangoAdmin/authService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';
import { deleteFile } from "../../middleware/multerParser"


//Instantiates a Home services  
const authService = new AuthService();

export class AuthController {

    constructor() { }

    /**
    * login
    * @param req :[email, password]
    * @param res 
    */
    public async login(req: any, res: any) {
        try {
            const responseFromService = await authService.login(req.body);
            const msg = constants.MESSAGES.login_success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * add sub admin
    * @param req :[name, email, password, confirmPassword]
    * @param res 
    */
    public async addAdmin(req: any, res: any) {
        try {
            // if(req.user.user_role != constants.USER_ROLE.super_admin) {
            //     throw new Error(constants.MESSAGES.invalid_admin)
            // }
            const responseFromService = await authService.addAdmin(req.body);
            const msg = constants.MESSAGES.subAdmin_added;
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
            const responseFromService = await authService.forgotPassword(req.body);
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
            const responseFromService = await authService.resetPassword(req.body,req.user);
            const msg = constants.MESSAGES.reset_pass_success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

     /**
    * update profile
    * @param req :[]
    * @param res 
    */
      public async uploadFile(req: any, res: any, next: any) {
        try {
            const responseFromService = await authService.uploadFile(req.file, req.body.folderName);
            await deleteFile(req.file.filename);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * logout
    * @param req 
    * @param res 
    */
    public async logout(req: any, res: any) {
        try {
            const responseFromService = await authService.logout(req.body, req.user);
            const msg = constants.MESSAGES.logout_success;
            appUtils.successResponse(res, {}, msg);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
}