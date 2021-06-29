import * as EmployerService from "../../services/employer";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';
import { deleteFile } from "../../middleware/multerParser"


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
   * update device token
   * @param req :[]
   * @param res 
   */
    public async updateEmployerDeviceToken(req: any, res: any, next: any) {
        try {
            const responseFromService = await authService.updateEmployerDeviceToken(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
   * clear device token
   * @param req :[]
   * @param res 
   */
    public async clearEmployerDeviceToken(req: any, res: any, next: any) {
        try {
            const responseFromService = await authService.clearEmployerDeviceToken(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
   * change password
   * @param req :[]
   * @param res 
   */
    public async changePassword(req: any, res: any, next: any) {
        try {
            const responseFromService = await authService.changePassword(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
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
}