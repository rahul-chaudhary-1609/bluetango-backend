import { EmployersService } from "../../services/admin/employersService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';
const json2csv = require('json2csv').parse;


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
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.employer_add_update);
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
            req.query.admin_id = req.user.uid;
            const responseObject = await employersService.dashboardAnalytics(req.query);
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
            req.query.admin_id = req.user.uid;
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

    /**
       * add subscription plan
       * @param req :[subscription plan details]
       * @param res : [subscription plans]
       */
    public async addSubscriptionPlan(req: any, res: any) {
        try {
            const subscriptionPlan = await employersService.addSubscriptionPlan(req.body);
            return appUtils.successResponse(res, subscriptionPlan, constants.MESSAGES.subscription_plan_add);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
       * update subscription plan
       * @param req :[subscription plan details]
       * @param res : [subscription plans]
       */
    public async updateSubscriptionPlan(req: any, res: any) {
        try {
            const subscriptionPlan = await employersService.updateSubscriptionPlan(req.body);
            return appUtils.successResponse(res, subscriptionPlan, constants.MESSAGES.subscription_plan_update);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
       * view subscription plan
       * @param req :[]
       * @param res : [subscription plans]
       */
    public async viewSubscriptionPlan(req: any, res: any) {
        try {
            const subscriptionPlan = await employersService.viewSubscriptionPlan(req.query);
            return appUtils.successResponse(res, subscriptionPlan, constants.MESSAGES.subscription_plan_fetch);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
       * view payment list
       * @param req :[]
       * @param res : [payment list]
       */
    public async viewPaymentList(req: any, res: any) {
        try {
            req.query.admin_id = req.user.uid;
            const paymentList = await employersService.viewPaymentList(req.query);
            return appUtils.successResponse(res, paymentList, constants.MESSAGES.payment_list_fetch);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
       * view payment details
       * @param req :[]
       * @param res : [payment list]
       */
    public async viewPaymentDetails(req: any, res: any) {
        try {
            req.query.admin_id = req.user.uid;
            const paymentDetails = await employersService.viewPaymentDetails(req.query);
            return appUtils.successResponse(res, paymentDetails, constants.MESSAGES.payment_detail_fetch);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
       * export csv for payment list
       * @param req :[]
       * @param res : [csv file]
       */
    public async exportCsv(req: any, res: any) {
        try {
            req.query.admin_id = req.user.uid;
            const result = await employersService.exportCsv(req.query);
            // let result = await employersService.exportCsv(req.query);
            // const csvString = json2csv(result)
            // res.setHeader('Content-disposition', 'attachment; filename=paymentList.csv');
            // res.set('Content-Type', 'text/csv');
            // res.status(200).send(csvString);
            //return res.csv("paymenrList.csv",results)
            return appUtils.successResponse(res, result, constants.MESSAGES.json_format_csv);
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * employer detail employee
    * @param req :[Body data]
    * @param res : [employers data object]
    */
    public async employerDetails(req: any, res: any) {
        try {
            req.query.admin_id = req.user.uid;
            const employer = await employersService.employerDetails(req.query);
            if (employer) {
                return appUtils.successResponse(res, employer, constants.MESSAGES.employer_details_fetched);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
* add edit coach
* @param req :[Body data]
* @param res : [coach data object]
*/
    public async addEditCoach(req: any, res: any) {
        try {
            const responseFromService = await employersService.addEditCoach(req.body, req.user);
            if (responseFromService) {
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.coach_add_update);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
   * get coach list
   * @param req :[query params]
   * @param res : [coach list]
   */
    public async getCoachList(req: any, res: any) {
        try {
            // console.log('req - - - ', req.permissions)
            // if (req.permissions.includes('coach') || req.user.user_role == constants.USER_ROLE.super_admin) {

                req.query.admin_id = req.user.uid;
                const coach = await employersService.getCoachList(req.query);
                if (coach) {
                    return appUtils.successResponse(res, coach, constants.MESSAGES.coach_list_fetched);
                } else {
                    appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
                }
            // } else {
            //     throw new Error("You don't have permission to access this module")
            // }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
  * get coach details
  * @param req :[query params]
  * @param res : [coach list]
  */
    public async getCoachDetails(req: any, res: any) {
        try {
            req.query.admin_id = req.user.uid;
            const coach = await employersService.getCoachDetails(req.query);
            if (coach) {
                return appUtils.successResponse(res, coach, constants.MESSAGES.coach_details_fetched);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
  * delete coach
  * @param req :[query params]
  * @param res : [coach list]
  */
    public async deleteCoach(req: any, res: any) {
        try {
            req.query.admin_id = req.user.uid;
            const coach = await employersService.deleteCoach(req.query);
            if (coach) {
                return appUtils.successResponse(res, {}, constants.MESSAGES.coach_deleted);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
  * get contactus list
  * @param req :[query params]
  * @param res : [contactus list]
  */
    public async getCotactUsList(req: any, res: any) {
        try {
            req.query.admin_id = req.user.uid;
            const contactUS = await employersService.getCotactUsList(req.query);
            if (contactUS) {
                return appUtils.successResponse(res, contactUS, constants.MESSAGES.contact_list_fetched);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
 * send email and push notification
 * @param req :[query params]
 * @param res : [contactus list]
 */
    public async sendEmailAndNotification(req: any, res: any) {
        try {
            req.body.admin_id = req.user.uid;
            const email_notification = await employersService.sendEmailAndNotification(req.body);
            //if (email_notification) {
            return appUtils.successResponse(res, {}, constants.MESSAGES.email_notification_sent);
            //} else {
            //  appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            // }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * employer detail employee
    * @param req :[Body data]
    * @param res : [employers data object]
    */
    public async employeeDetails(req: any, res: any) {
        try {
            req.query.admin_id = req.user.uid;
            const employer = await employersService.employeeDetails(req.query);
            if (employer) {
                return appUtils.successResponse(res, employer, constants.MESSAGES.employee_details_fetched);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * department list
    * @param req :[Body data]
    * @param res : [department data object]
    */
    public async getDepartmentList(req: any, res: any) {
        try {
            req.query.admin_id = req.user.uid;
            const department = await employersService.getDepartmentList(req.query);
            if (department) {
                return appUtils.successResponse(res, department, constants.MESSAGES.department_list_fetched);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
    * subscription detail api
    * @param req :[Body data]
    * @param res : [subscription data object]
    */
    public async subscriptionDetails(req: any, res: any) {
        try {
            req.query.admin_id = req.user.uid;
            const employer = await employersService.subscriptionDetails(req.query);
            if (employer) {
                return appUtils.successResponse(res, employer, constants.MESSAGES.employee_details_fetched);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
   * change subscription status api
   * @param req :[query data]
   * @param res : [subscription data object]
   */
    public async changeSubsPlanStatus(req: any, res: any) {
        try {
            req.query.admin_id = req.user.uid;
            const subscription: any = await employersService.changeSubsPlanStatus(req.query);
            if (subscription) {
                return appUtils.successResponse(res, subscription, constants.MESSAGES.subscription_status_updated);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
   * get subscription list api
   * @param req :[query data]
   * @param res : [subAdmin data object]
   */
    public async getSubAdminList(req: any, res: any) {
        try {
            req.query.admin_id = req.user.uid;
            const subAdmin: any = await employersService.getSubAdminList(req.query);
            if (subAdmin) {
                return appUtils.successResponse(res, subAdmin, constants.MESSAGES.subAdmin_fetched);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
   * get subscription details api
   * @param req :[query data]
   * @param res : [subAdmin data object]
   */
    public async subAdminDetails(req: any, res: any) {
        try {
            req.query.admin_id = req.user.uid;
            const subAdmin: any = await employersService.subAdminDetails(req.query);
            if (subAdmin) {
                return appUtils.successResponse(res, subAdmin, constants.MESSAGES.subAdmin_details_fetched);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }



}