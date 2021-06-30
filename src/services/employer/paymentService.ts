
import paypal from '../../utils/payment';

import * as appUtils from '../../utils/appUtils';
import * as constants from "../../constants";

let amount = 5.00;

export class Payment{
    constructor() { }
 
    public async payment(params,res) {

        amount = params.amount;
        //origin = params.origin;
        console.log("params", params)

        let create_payment_json = {
            "intent": "SALE",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${constants.HOST_URL}/api/v1/employer/paymentSuccess`,
                "cancel_url": `${constants.HOST_URL}/api/v1/employer/paymentFailed`
            },
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": `${amount}`
                },
                "description": "This is the payment description."
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.log("Payment error", error)
                console.log("Payment Details", error.response.details)
                appUtils.errorResponse(res, error, constants.code.error_code);
            } else {
                console.log("Create Payment Response");
                console.log(payment);
                let redirectURLObject = payment.links.find((link) => link.rel === 'approval_url')
                appUtils.successResponse(res, redirectURLObject, constants.MESSAGES.success);
            }
        });
    }

    public async paymentSuccess(params) {
        console.log("params", params)

        let payerID = params.PayerID;
        let paymentID = params.paymentId;
        let token = params.token;

        let payment_execute_json = {
            payer_id: payerID,
            transactions: [
                {
                    amount: {
                        currency: "USD",
                        total: `${amount}`
                    }
                }
            ]
        }

        let pay = null;

        paypal.payment.execute(paymentID, payment_execute_json, (error, payment) => {
            if (error) {
                console.log("Error", error)

            }
            console.log(payment.transactions[0].related_resources[0].sale)
            pay = payment;
        })
        return true;
    }

    public async paymentFailed(params) {
        return constants.MESSAGES.payment_faliled;
    }

}