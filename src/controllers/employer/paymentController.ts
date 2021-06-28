import { Payment } from "../../services/employer/paymentService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const paymentService = new Payment();

export class PaymentController {

    constructor() { }

    /**
    * payment
    * @param req :[Body data]
    * @param res : [employers data object]
    */
    public async payment(req: any, res: any) {
        try {
            await paymentService.payment(res,req.body);
            
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    /**
   * payment success
   * @param req :[Body data]
   * @param res : [employers data object]
   */
    public async success(req: any, res: any) {
        try {
            const responseFromService = await paymentService.success(req.query);
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
   * payment failed
   * @param req :[Body data]
   * @param res : [employers data object]
   */
    public async cancel(req: any, res: any) {
        try {
            const responseFromService = await paymentService.cancel(req.query);
            if (responseFromService) {
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

}