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
            const responseFromService = await chatServices.getChatList(req.params,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }
    
}