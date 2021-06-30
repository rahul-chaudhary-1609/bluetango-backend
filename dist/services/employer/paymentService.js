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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const payment_1 = __importDefault(require("../../utils/payment"));
const appUtils = __importStar(require("../../utils/appUtils"));
const constants = __importStar(require("../../constants"));
let amount = 5.00;
class Payment {
    constructor() { }
    payment(params, res) {
        return __awaiter(this, void 0, void 0, function* () {
            amount = params.amount;
            //origin = params.origin;
            console.log("params", params);
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
            payment_1.default.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    console.log("Payment error", error);
                    console.log("Payment Details", error.response.details);
                    appUtils.errorResponse(res, error, constants.code.error_code);
                }
                else {
                    console.log("Create Payment Response");
                    console.log(payment);
                    let redirectURLObject = payment.links.find((link) => link.rel === 'approval_url');
                    appUtils.successResponse(res, redirectURLObject, constants.MESSAGES.success);
                }
            });
        });
    }
    paymentSuccess(params) {
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
            payment_1.default.payment.execute(paymentID, payment_execute_json, (error, payment) => {
                if (error) {
                    console.log("Error", error);
                }
                console.log(payment.transactions[0].related_resources[0].sale);
                pay = payment;
            });
            return true;
        });
    }
    paymentFailed(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return constants.MESSAGES.payment_faliled;
        });
    }
}
exports.Payment = Payment;
//# sourceMappingURL=paymentService.js.map