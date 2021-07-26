import { Payment } from "../../services/employer/paymentService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const paymentService = new Payment();

export class PaymentController {

    constructor() { }


    public async payment(req: any, res: any) {
        try {
            await paymentService.payment(req.body,res);          

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async paymentSuccess(req: any, res: any) {
        try {
            const responseFromService = await paymentService.paymentSuccess(req.query);
            if (responseFromService) {
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.payment_success);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }


    public async paymentFailed(req: any, res: any) {
        try {
            const responseFromService = await paymentService.paymentFailed(req.query);
            if (responseFromService) {
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async getBraintreeClientToken(req: any, res: any) {
        try {
            const responseFromService = await paymentService.getBraintreeClientToken(req.user);
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