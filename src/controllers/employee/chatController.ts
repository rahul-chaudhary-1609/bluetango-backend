import { ChatServices } from "../../services/employee/chatServices";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const chatServices = new ChatServices();

export class ChatController {

    constructor() { }

    /**
    * get chat pop up list
    * @param req :[]
    * @param res 
    */
    public async getChatPopUpListAsEmployee(req: any, res: any, next: any) {
        try {
            const responseFromService = await chatServices.getChatPopUpListAsEmployee(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * get chat room id
    * @param req :[]
    * @param res 
    */
    public async getChatRoomId(req: any, res: any, next: any) {
        try {
            const responseFromService = await chatServices.getChatRoomId(req.query, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

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
    * get video chat session id and token list
    * @param req :[]
    * @param res 
    */
    public async getVideoChatSessionIdandToken(req: any, res: any, next: any) {
        try {
            const responseFromService = await chatServices.getVideoChatSessionIdandToken(req.params,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }
    
}