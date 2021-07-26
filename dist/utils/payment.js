'use strict';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.braintreeGateway = exports.paypal = void 0;
const constants = __importStar(require("../constants"));
const paypal = require("paypal-rest-sdk");
exports.paypal = paypal;
var braintree = require('braintree');
paypal.configure({
    'mode': constants.SECRETS.PAYPAL_SECRETS.environment,
    'client_id': constants.SECRETS.PAYPAL_SECRETS.client_id,
    'client_secret': constants.SECRETS.PAYPAL_SECRETS.client_secret
});
var braintreeGateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: constants.SECRETS.BRAINTREE_SECRETS.merchant_id,
    publicKey: constants.SECRETS.BRAINTREE_SECRETS.public_key,
    privateKey: constants.SECRETS.BRAINTREE_SECRETS.private_key
});
exports.braintreeGateway = braintreeGateway;
//# sourceMappingURL=payment.js.map