"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const paypal = require('@paypal/checkout-server-sdk');
const payPalClient = __importStar(require("../../utils/payment"));
const constants = __importStar(require("../../constants"));
const request = require("request");
let amount = 5.00;
var PAYPAL_API = 'https://api-m.sandbox.paypal.com';
const PORT = process.env.PORT || 1203;
const HOST = process.env.HOST || "http://localhost";
class Payment {
    constructor() { }
    createPaymentMethod1(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                order = yield payPalClient.client().execute(request);
            }
            catch (err) {
                console.error(err);
                return res.send(500);
            }
            res.status(200).json({
                orderID: order.result.id
            });
        });
    }
    capturePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderID = req.body.orderID;
            const request = new paypal.orders.OrdersCaptureRequest(orderID);
            request.requestBody({});
            const capture = yield payPalClient.client().execute(request);
            const captureID = capture.result.purchase_units[0]
                .payments.captures[0].id;
            res.status(200).json({ capture, captureID });
        });
    }
    getPaymentDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderID = req.body.orderID;
            let request = new paypal.orders.OrdersGetRequest(orderID);
            let order;
            try {
                order = yield payPalClient.client().execute(request);
            }
            catch (err) {
                console.error(err);
                return res.send(500);
            }
            if (order.result.purchase_units[0].amount.value !== amount) {
                return res.send(400);
            }
            return res.status(200).json({ order });
        });
    }
    createPaymentMethod2(res) {
        return __awaiter(this, void 0, void 0, function* () {
            request.post(PAYPAL_API + '/v1/payments/payment', {
                auth: {
                    user: constants.SECRETS.PAYPAL_SECRETS.client_id,
                    pass: constants.SECRETS.PAYPAL_SECRETS.client_id,
                },
                body: {
                    intent: 'sale',
                    payer: {
                        payment_method: 'paypal'
                    },
                    transactions: [
                        {
                            amount: {
                                total: amount,
                                currency: 'USD'
                            }
                        }
                    ],
                    redirect_urls: {
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
                res.json({
                    id: response.body.id
                });
            });
        });
    }
    executePayment(res, params) {
        return __awaiter(this, void 0, void 0, function* () {
            var paymentID = params.paymentID;
            var payerID = params.payerID;
            // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
            request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID +
                '/execute', {
                auth: {
                    user: constants.SECRETS.PAYPAL_SECRETS.client_id,
                    pass: constants.SECRETS.PAYPAL_SECRETS.client_id,
                },
                body: {
                    payer_id: payerID,
                    transactions: [
                        {
                            amount: {
                                total: amount,
                                currency: 'USD'
                            }
                        }
                    ]
                },
                json: true
            }, function (err, response) {
                if (err) {
                    console.error(err);
                    return res.sendStatus(500);
                }
                // 4. Return a success response to the client
                res.json({
                    status: 'success'
                });
            });
        });
    }
    paymentSuccess1(params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("params", params);
            return "Success";
        });
    }
    paymentFailed1(params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("params", params);
            return "Failed";
        });
    }
    payment(res, params) {
        return __awaiter(this, void 0, void 0, function* () {
            //toPayAmount = params.amount;
            //origin = params.origin;
            console.log("params", params);
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
                    console.log("Payment error", error);
                    console.log("Payment Details", error.response.details);
                    res.send(error);
                }
                else {
                    console.log("Create Payment Response");
                    console.log(payment);
                    let redirectURLObject = payment.links.find((link) => link.rel === 'approval_url');
                    res.redirect(redirectURLObject.href);
                }
            });
        });
    }
    paymentSuccess2(params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("params", params);
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
            };
            let pay = null;
            paypal.payment.execute(paymentID, payment_execute_json, (error, payment) => {
                if (error) {
                    console.log("Error", error);
                }
                console.log(payment.transactions[0].related_resources[0].sale);
                pay = payment;
            });
            return true;
        });
    }
    paymentFailed2(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return "Failed";
        });
    }
}
exports.Payment = Payment;
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
//# sourceMappingURL=paymentService.js.map