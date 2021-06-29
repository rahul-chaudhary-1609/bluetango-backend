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
exports.PaymentController = void 0;
const paymentService_1 = require("../../services/employer/paymentService");
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
//Instantiates a Home services  
const paymentService = new paymentService_1.Payment();
class PaymentController {
    constructor() { }
    createPaymentMethod1(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('createPaymentMethod1 Controller req.body', req.body);
                yield paymentService.createPaymentMethod1(req, res);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    capturePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('capturePayment Controller req.body', req.body);
                yield paymentService.capturePayment(req, res);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    getPaymentDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('getPaymentDetails Controller req.body', req.body);
                yield paymentService.getPaymentDetails(req, res);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    createPaymentMethod2(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('createPaymentMethod2 Controller req.body', req.body);
                yield paymentService.createPaymentMethod2(res);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    executePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('executePayment Controller req.body', req.body);
                yield paymentService.executePayment(res, req.query);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    paymentSuccess1(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield paymentService.paymentSuccess1(req.query);
                if (responseFromService) {
                    return appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
                }
                else {
                    appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
                }
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    paymentFailed1(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield paymentService.paymentFailed1(req.query);
                if (responseFromService) {
                    return appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
                }
                else {
                    appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
                }
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    payment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('payment Controller req.body', req.body);
                yield paymentService.payment(res, req.body);
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    paymentSuccess2(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield paymentService.paymentSuccess2(req.query);
                if (responseFromService) {
                    return appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
                }
                else {
                    appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
                }
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
    paymentFailed2(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseFromService = yield paymentService.paymentFailed2(req.query);
                if (responseFromService) {
                    return appUtils.successResponse(res, responseFromService, constants.MESSAGES.login_success);
                }
                else {
                    appUtils.errorResponse(res, constants.MESSAGES.exception_occured, constants.code.error_code);
                }
            }
            catch (error) {
                appUtils.errorResponse(res, error, constants.code.error_code);
            }
        });
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=paymentController.js.map