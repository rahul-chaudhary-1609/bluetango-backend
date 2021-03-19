import { ChatServices } from "../../services/employee/chatServices";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const chatServices = new ChatServices();

export class ChatController {

    constructor() { }

    /**
    * view goal as manager
    * @param req :[]
    * @param res 
    */
    public async getChatPopListAsEmployee(req: any, res: any, next: any) {
        try {
            const responseFromService = await chatServices.getChatPopListAsEmployee(req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }
    
}