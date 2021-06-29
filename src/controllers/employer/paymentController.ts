import { Payment } from "../../services/employer/paymentService";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const paymentService = new Payment();

export class PaymentController {

    constructor() { }

   
    public async createPaymentMethod1(req: any, res: any) {
        try {
            console.log(
                'createPaymentMethod1 Controller req.body',req.body
            )
            await paymentService.createPaymentMethod1(req,res);
            
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async capturePayment(req: any, res: any) {
        try {
            console.log(
                'capturePayment Controller req.body', req.body
            )
            await paymentService.capturePayment(req, res);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async getPaymentDetails(req: any, res: any) {
        try {
            console.log(
                'getPaymentDetails Controller req.body', req.body
            )
            await paymentService.getPaymentDetails(req, res);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async createPaymentMethod2(req: any, res: any) {
        try {
            console.log(
                'createPaymentMethod2 Controller req.body', req.body
            )
            await paymentService.createPaymentMethod2(res);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async executePayment(req: any, res: any) {
        try {
            console.log(
                'executePayment Controller req.body', req.body
            )
            await paymentService.executePayment(res, req.query);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

 
    public async paymentSuccess1(req: any, res: any) {
        try {
            const responseFromService = await paymentService.paymentSuccess1(req.query);
            if (responseFromService) {
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }


    public async paymentFailed1(req: any, res: any) {
        try {
            const responseFromService = await paymentService.paymentFailed1(req.query);
            if (responseFromService) {
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async payment(req: any, res: any) {
        try {
            console.log(
                'payment Controller req.body', req.body
            )
            await paymentService.payment(res, req.body);

        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }

    public async paymentSuccess2(req: any, res: any) {
        try {
            const responseFromService = await paymentService.paymentSuccess2(req.query);
            if (responseFromService) {
                return appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
            } else {
                appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
            }
        } catch (error) {
            appUtils.errorResponse(res, error, constants.code.error_code);
        }
    }


    public async paymentFailed2(req: any, res: any) {
        try {
            const responseFromService = await paymentService.paymentFailed2(req.query);
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