
const paypal = require('@paypal/checkout-server-sdk');

import * as payPalClient from "../../utils/payment";
import * as constants from "../../constants";
const request = require("request")

let amount = 5.00;
var PAYPAL_API = 'https://api-m.sandbox.paypal.com';

const PORT = process.env.PORT || 1203;
const HOST = process.env.HOST || "http://localhost"

export class Payment{
    constructor() { }
    public async createPaymentMethod1(req,res) {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount
                }
            }]
        });

        let order;
        try {
            order = await payPalClient.client().execute(request);
        } catch (err) {

            console.error(err);
            return res.send(500);
        }

        res.status(200).json({
            orderID: order.result.id
        });
    }

    public async capturePayment(req, res) {
        const orderID = req.body.orderID;

        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});
        
        const capture = await payPalClient.client().execute(request);

        const captureID = capture.result.purchase_units[0]
            .payments.captures[0].id;
        
        res.status(200).json({ capture, captureID });

        
    }

    public async getPaymentDetails(req, res) {
        const orderID = req.body.orderID;

        let request = new paypal.orders.OrdersGetRequest(orderID);

        let order;
        try {
            order = await payPalClient.client().execute(request);
        } catch (err) {

            console.error(err);
            return res.send(500);
        }

        if (order.result.purchase_units[0].amount.value !== amount) {
            return res.send(400);
        }

        return res.status(200).json({ order });
    }

    public async createPaymentMethod2(res) {
        request.post(PAYPAL_API + '/v1/payments/payment',
            {
                auth:
                {
                    user: constants.SECRETS.PAYPAL_SECRETS.client_id,
                    pass: constants.SECRETS.PAYPAL_SECRETS.client_id,
                },
                body:
                {
                    intent: 'sale',
                    payer:
                    {
                        payment_method: 'paypal'
                    },
                    transactions: [
                        {
                            amount:
                            {
                                total: amount,
                                currency: 'USD'
                            }
                        }],
                    redirect_urls:
                    {
                        return_url: `${HOST}:${PORT}/api/v1/employer/paymentSuccess1`,
                        cancel_url: `${HOST}:${PORT}/api/v1/employer/paymentFailed1`
                    }
                },
                json: true
            }, function (err, response) {
                if (err) {
                    console.error(err);
                    return res.sendStatus(500);
                }
                // 3. Return the payment ID to the client
                res.json(
                    {
                        id: response.body.id
                    });
            });
    }

    public async executePayment(res, params) {
        var paymentID = params.paymentID;
        var payerID = params.payerID;
        // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
        request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID +
            '/execute',
            {
                auth:
                {
                    user: constants.SECRETS.PAYPAL_SECRETS.client_id,
                    pass: constants.SECRETS.PAYPAL_SECRETS.client_id,
                },
                body:
                {
                    payer_id: payerID,
                    transactions: [
                        {
                            amount:
                            {
                                total: amount,
                                currency: 'USD'
                            }
                        }]
                },
                json: true
            },
            function (err, response) {
                if (err) {
                    console.error(err);
                    return res.sendStatus(500);
                }
                // 4. Return a success response to the client
                res.json(
                    {
                        status: 'success'
                    });
            });
    }
    
    public async paymentSuccess1(params) {
        console.log("params", params)

        return "Success";
    }

    public async paymentFailed1(params) {
        console.log("params", params)
        return "Failed";
    }

    public async payment(res, params) {

        //toPayAmount = params.amount;
        //origin = params.origin;
        console.log("params", params)

        let create_payment_json = {
            "intent": "SALE",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${HOST}:${PORT}/api/v1/employer/paymentSuccess2`,
                "cancel_url": `${HOST}:${PORT}/api/v1/employer/paymentFailed2`
            },
            "transactions": [{
                // "item_list": {
                //     "items": [{
                //         "name": "item",
                //         "sku": "item",
                //         "price": `${toPayAmount}`,
                //         "currency": "USD",
                //         "quantity": 1
                //     }]
                // },
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
                res.send(error);
            } else {
                console.log("Create Payment Response");
                console.log(payment);
                let redirectURLObject = payment.links.find((link) => link.rel === 'approval_url')
                res.redirect(redirectURLObject.href);
            }
        });
    }

    public async paymentSuccess2(params) {
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

    public async paymentFailed2(params) {
        return "Failed";
    }

}





// const paypal = require("paypal-rest-sdk")


// paypal.configure({
//     'mode': 'sandbox', //sandbox or live
//     'client_id': 'AVgk4Blak5Zh1JyXlb30Dnhu9zflsp5eOqnilAaUTZEt7qaiINyJPhUQwRp4ThWhM3MQbQnLTvFJcsF9',
//     'client_secret': 'EKck4sZ9NgYStHO0qtEKXpRx6czFWbiiBGqUvlrcSDQSMsmcQSd12HoOX4rPhQru9xHCsJmxQzpodXpk'
// });

// let toPayAmount = 5;

// export class Payment{
//     constructor() {}

    
// }