import { ChatServices } from "../../services/bluetangoAdmin/chatService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const chatServices = new ChatServices();

export class ChatController {

    constructor() { }


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
            const responseFromService = await chatServices.getChatList(req.query,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    
    /**
    * send chat notification
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
}