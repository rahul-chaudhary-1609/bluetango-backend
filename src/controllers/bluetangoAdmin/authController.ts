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
    * @param req :[]
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

    public async getProfile(req: any, res: any) {
        try {
            const responseFromService = await authService.getProfile(req.user);
            const msg = constants.MESSAGES.success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async updateProfile(req: any, res: any) {
        try {
            const responseFromService = await authService.updateProfile(req.body, req.user);
            const msg = constants.MESSAGES.update_user_details;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async changePassword(req: any, res: any) {
        try {
            const responseFromService = await authService.changePassword(req.body, req.user);
            const msg = constants.MESSAGES.password_change_success;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }


    public async forgetPassword(req: any, res: any) {
        try {
            const responseFromService = await authService.forgotPassword(req.body);
            const msg = constants.MESSAGES.forget_pass_otp;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async resetPassword(req: any, res: any) {
        try {
            const responseFromService = await authService.resetPassword(req.body, req.user);
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
    /**
    * delete admin
    * @param req :admin_id
    * @param res 
    */
    public async deleteAdmin(req: any, res: any) {
        try {
            const responseFromService = await authService.deleteAdmin(req.params, req.user);
            const msg = constants.MESSAGES.admin_deleted;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
    /**
    * view role details
    * @param req :role_id
    * @param res 
    */
    public async viewRoleDetails(req: any, res: any) {
        try {
            const responseFromService = await authService.viewRoleDetails(req.query);
            const msg = constants.MESSAGES.role_details_fetched;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
    /**
    * delete role
    * @param req :role_id
    * @param res 
    */
    public async deleteRole(req: any, res: any) {
        try {
            const responseFromService = await authService.deleteRole(req.params, req.user);
            const msg = constants.MESSAGES.role_deleted;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
    /**
    * update Admin And Role
    * @param req :[]
    * @param res 
    */
     public async updateAdminAndRole(req: any, res: any) {
        try {
            // if(req.user.user_role != constants.USER_ROLE.super_admin) {
            //     throw new Error(constants.MESSAGES.invalid_admin)
            // }
            const responseFromService = await authService.updateAdminAndRole(req.body);
            const msg = constants.MESSAGES.admin_And_role_updated;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
     /**
    * update Admin And RoleS tatus
    * @param req :[]
    * @param res 
    */
      public async updateAdminAndRoleStatus(req: any, res: any) {
        try {
            const responseFromService = await authService.updateAdminAndRoleStatus(req.body);
            const msg = constants.MESSAGES.admin_and_role_status;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
     /**
    * get roles And Admins
    * @param req :[]
    * @param res 
    */
      public async getrolesAndAdmins(req: any, res: any) {
        try {
            const responseFromService = await authService.getrolesAndAdmins(req.query);
            const msg = constants.MESSAGES.role_fetched;
            appUtils.successResponse(res, responseFromService, msg);
        } catch (error) {
            console.log(error)
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }
}