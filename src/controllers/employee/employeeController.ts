import { EmployeeServices } from "../../services/employee/employeeServices";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const employeeServices = new EmployeeServices();

export class EmployeeController {

    constructor() { }

    /**
    * getListOfTeamMemberByManagerId
    * @param req :[]
    * @param res 
    */
    public async getListOfTeamMemberByManagerId(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getListOfTeamMemberByManagerId(req.query, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async getEmployeeCountGroupByEnergy(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getEmployeeCountGroupByEnergy(req.query, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * viewDetailsEmployee
    * @param req :[]
    * @param res 
    */
    public async viewDetailsEmployee(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.viewDetailsEmployee(req.query);
            if (responseFromService) {
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
            
        } catch (e) {
            next(e)
        }
    }

    /**
    * searchTeamMember
    * @param req :[]
    * @param res 
    */
    public async searchTeamMember(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.searchTeamMember(req.query, req.user);
            if (responseFromService) {
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
            
        } catch (e) {
            next(e)
        }
    }

    /**
    * add thought of the day
    * @param req :[]
    * @param res 
    */
    public async thoughtOfTheDay(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.thoughtOfTheDay(req.body, req.user);
            if (responseFromService) {
                appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
            
        } catch (e) {
            next(e)
        }
    }

     /**
    * add thought of the day
    * @param req :[]
    * @param res 
    */
    public async getEmoji(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getEmoji();
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            
        } catch (e) {
            next(e)
        }
    }

    /**
    * update energy of the employee
    * @param req :[]
    * @param res 
    */
    public async updateEnergyCheck(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.updateEnergyCheck(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            
        } catch (e) {
            next(e)
        }
    }

     /**
    * view energy of the team members
    * @param req :[]
    * @param res 
    */
    public async viewEnergyCheckTeamMembers(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.viewEnergyCheckTeamMembers(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            
        } catch (e) {
            next(e)
        }
    }

    /**
    * feel about job today
    * @param req :[]
    * @param res 
    */
    public async feelAboutJobToday(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.feelAboutJobToday(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
            
        } catch (e) {
            next(e)
        }
    }

    /**
    * update device token
    * @param req :[]
    * @param res 
    */
    public async updateEmployeeDeviceToken(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.updateEmployeeDeviceToken(req.body, req.user);
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
    public async clearEmployeeDeviceToken(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.clearEmployeeDeviceToken(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
    * get current manager
    * @param req :[]
    * @param res 
    */
    public async getCurrentManager(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getCurrentManager(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
    * get employee details to show employee detail on dashbord as team member view 
    * @param req :[]
    * @param res 
    */
    public async getEmployeeDetails(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getEmployeeDetails(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
    * view energy of employee on dashbord as team member view
    * @param req :[]
    * @param res 
    */
    public async viewEmployeeEnergy(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.viewEmployeeEnergy(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
    * to view thought of the day employee on dashbord as team member view
    * @param req :[]
    * @param res 
    */
    public async viewThoughtOfTheDay(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.viewThoughtOfTheDay(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
    * to view feel About Job Today on dashbord as team member view
    * @param req :[]
    * @param res 
    */
    public async viewFeelAboutJobToday(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.viewFeelAboutJobToday(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
   * to view thought of the day from admin on dashbord as team member view
   * @param req :[]
   * @param res 
   */
    public async viewThoughtOfTheDayFromAdmin(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.viewThoughtOfTheDayFromAdmin(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    public async getCoachSpecializationCategoryList(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getCoachSpecializationCategoryList();
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
   * to get coach list
   * @param req :[]
   * @param res 
   */
    public async getCoachList(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getCoachList(req.user,req.query);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    public async getSlots(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getSlots(req.query);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async getSlot(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getSlot(req.query);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async createSessionRequest(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.createSessionRequest(req.body,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async getSessions(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getSessions(req.query,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async cancelSession(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.cancelSession(req.body,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async getNotRatedSessions(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getNotRatedSessions(req.query,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async listSessionHistory(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.listSessionHistory(req.query,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async getSessionHistoryDetails(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getSessionHistoryDetails(req.params);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async rateCoachSession(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.rateCoachSession(req.body);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    public async skipRateSession(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.skipRateSession(req.body);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
   * to contact admin
   * @param req :[]
   * @param res 
   */
    public async contactUs(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.contactUs(req.body,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
  * to get notifiaction
  * @param req :[]
  * @param res 
  */
    public async getNotifications(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getNotifications(req.params, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
*  to get unseen notification count
* @param req :[]
* @param res 
*/
    public async getUnseenNotificationCount(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getUnseenNotificationCount( req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
 * to mark as viewed notification 
 * @param req :[]
 * @param res 
 */
    public async markNotificationsAsViewed(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.markNotificationsAsViewed(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
* to refer Friend
* @param req :[]
* @param res 
*/
    public async referFriend(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.referFriend(req.body);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
* to feedback
* @param req :[]
* @param res 
*/
    public async feedback(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.feedback(req.body,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    /**
* list library video
* @param req :[body data]
* @param res : [library data object]
*/
    public async listVideo(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.listVideo(req.query);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

      /**
    * get Employee CV
    * @param req :[body data]
    * @param res : [data object]
    */
    public async shareEmployeeCV(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.shareEmployeeCV(req.body,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

      /**
    * get Employee CV
    * @param req :[body data]
    * @param res : [data object]
    */
       public async getEmployeeCV(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getEmployeeCV(req.body,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

      /**
    * get Goal Submit Reminders
    * @param req :[body data]
    * @param res : [data object]
    */
       public async getGoalSubmitReminders(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getGoalSubmitReminders(req.params,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }
     /**
    * get thought
    */
      public async getThought(req: any, res: any, next: any) {
        try {
            const responseFromService = await employeeServices.getThought(req.query);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }
}
