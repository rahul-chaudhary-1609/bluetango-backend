import { ChatServices } from "../../services/coach/chatServices";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a chat services  
const chatServices = new ChatServices();

export class ChatController {

    constructor() { }


    /**
    * get chat list
    * @param req :[]
    * @param res 
    */
    public async getChatList(req: any, res: any, next: any) {
        try {
            const responseFromService = await chatServices.getChatList(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * get create chat session
    * @param req :[]
    * @param res 
    */
    public async createChatSession(req: any, res: any, next: any) {
        try {
            const responseFromService = await chatServices.createChatSession(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * get video chat session id and token 
    * @param req :[]
    * @param res 
    */
    public async getChatSessionIdandToken(req: any, res: any, next: any) {
        try {
            const responseFromService = await chatServices.getChatSessionIdandToken(req.params,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * get create chat session
    * @param req :[]
    * @param res 
    */
    public async dropChatSession(req: any, res: any, next: any) {
        try {
            const responseFromService = await chatServices.dropChatSession(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * get create chat session
    * @param req :[]
    * @param res 
    */
    public async checkChatSession(req: any, res: any, next: any) {
        try {
            const responseFromService = await chatServices.checkChatSession(req.params, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * send video chat notification
    * @param req :[]
    * @param res 
    */
    public async sendChatNotification(req: any, res: any, next: any) {
        try {
            const responseFromService = await chatServices.sendChatNotification(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
   * send disconnect video/audio chat notification
   * @param req :[]
   * @param res 
   */
    public async sendChatDisconnectNotification(req: any, res: any, next: any) {
        try {
            const responseFromService = await chatServices.sendChatDisconnectNotification(req.body, req.user);
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
            const responseFromService = await chatServices.getNotifications(req.params, req.user);
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
            const responseFromService = await chatServices.getUnseenNotificationCount(req.user);
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
            const responseFromService = await chatServices.markNotificationsAsViewed(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);

        } catch (e) {
            next(e)
        }
    }

    
    
}