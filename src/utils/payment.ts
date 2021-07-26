'use strict';

import * as constants from "../constants";

const paypal = require("paypal-rest-sdk");
var braintree = require('braintree');

paypal.configure({
    'mode': constants.SECRETS.PAYPAL_SECRETS.environment, //sandbox or live
    'client_id': constants.SECRETS.PAYPAL_SECRETS.client_id,
    'client_secret': constants.SECRETS.PAYPAL_SECRETS.client_secret
});



var braintreeGateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: constants.SECRETS.BRAINTREE_SECRETS.merchant_id,
    publicKey: constants.SECRETS.BRAINTREE_SECRETS.public_key,
    privateKey: constants.SECRETS.BRAINTREE_SECRETS.private_key
});

export {
    paypal,
    braintreeGateway
}
