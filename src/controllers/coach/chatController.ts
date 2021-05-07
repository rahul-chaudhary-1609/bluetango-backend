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
    
    
}