"use strict";
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
const paypal = require("paypal-rest-sdk");
paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AVgk4Blak5Zh1JyXlb30Dnhu9zflsp5eOqnilAaUTZEt7qaiINyJPhUQwRp4ThWhM3MQbQnLTvFJcsF9',
    'client_secret': 'EKck4sZ9NgYStHO0qtEKXpRx6czFWbiiBGqUvlrcSDQSMsmcQSd12HoOX4rPhQru9xHCsJmxQzpodXpk'
});
let toPayAmount = 5;
class Payment {
    constructor() { }
    payment(res, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const PORT = process.env.PORT || 1203;
            const HOST = process.env.HOST || "http://localhost";
            toPayAmount = params.amount;
            //origin = params.origin;
            console.log("params", params);
            let create_payment_json = {
                "intent": "SALE",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": `${HOST}:${PORT}/api/v1/employer/success`,
                    "cancel_url": `${HOST}:${PORT}/api/v1/employer/cancel`
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
                            "total": `${toPayAmount}`
                        },
                        "description": "This is the payment description."
                    }]
            };
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
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
    success(params) {
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
                            total: `${toPayAmount}`
                        }
                    }
                ]
            };
            let pay = null;
            paypal.payment.execute(paymentID, payment_execute_json, (error, payment) => {
                if (error) {
                    console.log("Error", error);
                    return error;
                }
                console.log(payment.transactions[0].related_resources[0].sale);
                pay = payment;
            });
            return true;
        });
    }
    cancel(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return "Failed";
        });
    }
}
exports.Payment = Payment;
//# sourceMappingURL=paymentService.js.map