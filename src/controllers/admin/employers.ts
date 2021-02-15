import { EmployersService } from "../../services/admin/employersService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const employersService = new EmployersService();

export class EmployersController {

    constructor() { }

    /**
    * get employer industry type list
    * @param req :[get data]
    * @param res : [data]
    */
    public async getIndustryTypeList(req: any, res: any) {
        try {
            const responseFromService = await employersService.getIndustryTypeList(req.query);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.industry_list);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * add edit employer
    * @param req :[Body data]
    * @param res : [employers data object]
    */
    public async addEditEmployers(req: any, res: any) {
        try {
            const responseFromService = await employersService.addEditEmployers(req.body, req.user);
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
    * get employer list
    * @param req :[get data]
    * @param res : [employers data]
    */
    public async getEmployersList(req: any, res: any) {
        try {
            const responseFromService = await employersService.getEmployersList(req.query);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employers_list);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * change employer status
    * @param req :[get data]
    * @param res : [employers data]
    */
    public async changeEmployerStatus(req: any, res: any) {
        try {
            await employersService.changeEmployerStatus(req.query);
            return appUtils.successResponse(res, {}, constants.MESSAGES.status_updated);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * get dashboard analytics
    * @param req :[get data]
    * @param res : [employers employees count]
    */
    public async dashboardAnalytics(req: any, res: any) {
        try {
            const responseObject = await employersService.dashboardAnalytics(req.user);
            return appUtils.successResponse(res, responseObject, constants.MESSAGES.dashboardAnalyticsCount)
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
   * get employee list
   * @param req :[get data]
   * @param res : [employee data]
   */
    public async getEmployeeList(req: any, res: any) {
        try {
            const responseFromService = await employersService.getEmployeeList(req.query);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employee_list);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
       * change employee status
       * @param req :[get data]
       * @param res : [employere data]
       */
    public async changeEmployeeStatus(req: any, res: any) {
        try {
            await employersService.changeEmployeeStatus(req.query);
            return appUtils.successResponse(res, {}, constants.MESSAGES.status_updated);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }


    /**
       * change employee status
       * @param req :[get data]
       * @param res : [employere data]
       */
      public async editEmployeeDetails(req: any, res: any) {
        try {
            const updateEmployee = await employersService.editEmployeeDetails(req.body);
            return appUtils.successResponse(res, updateEmployee[1][0], constants.MESSAGES.employee_update);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

}