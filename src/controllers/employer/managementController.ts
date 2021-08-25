import  { EmployeeManagement }  from "../../services/employer";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const employeeService = new EmployeeManagement();

export class EmployeeController {

    constructor() { }

    /**
    * add edit employee
    * @param req :[Body data]
    * @param res : [employers data object]
    */
    public async addEditEmployee(req: any, res: any) {
        try {
            const responseFromService = await employeeService.addEditEmployee(req.body, req.user);
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
  * get manager list
  * @param req :[get data]
  * @param res : [employers data]
  */
    public async getManagerList(req: any, res: any) {
        try {
            const responseFromService = await employeeService.getManagerList(req.query,req.user);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * get employee list
    * @param req :[get data]
    * @param res : [employers data]
    */
    public async getEmployeeList(req: any, res: any) {
        try {
            const responseFromService = await employeeService.getEmployeeList(req.query, req.user);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employers_list);
            
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
   * get department list
   * @param req :[get data]
   * @param res : [employers data]
   */
    public async getDepartmentList(req: any, res: any) {
        try {
            const responseFromService = await employeeService.getDepartmentList();
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * view Employee Details
    * @param req :[get data]
    * @param res : [employee data]
    */
    public async viewEmployeeDetails(req: any, res: any) {
        try {
            const responseFromService = await employeeService.viewEmployeeDetails(req.params, req.user);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * delete employee
    * @param req :[get data]
    * @param res : [employee data]
    */
    public async deleteEmployee(req: any, res: any) {
        try {
            const responseFromService = await employeeService.deleteEmployee(req.params, req.user);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employee_deleted);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * delete employee
    * @param req :[get data]
    * @param res : [employee data]
    */
    public async updateManager(req: any, res: any) {
        try {
            const responseFromService = await employeeService.updateManager(req.body, req.user);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employee_deleted);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * add Edit Attributes
    * @param req :[get data]
    * @param res : [employee data]
    */
     public async addEditAttributes(req: any, res: any) {
        try {
            const responseFromService = await employeeService.addEditAttributes(req.body, req.user);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employee_deleted);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }


    /**
    * delete Attribute
    * @param req :[get data]
    * @param res : [employee data]
    */
     public async deleteAttribute(req: any, res: any) {
        try {
            const responseFromService = await employeeService.deleteAttribute(req.params, req.user);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employee_deleted);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }


    /**
    * toggle Attribute Status
    * @param req :[get data]
    * @param res : [employee data]
    */
     public async toggleAttributeStatus(req: any, res: any) {
        try {
            const responseFromService = await employeeService.toggleAttributeStatus(req.params, req.user);
            return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employee_deleted);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    

}