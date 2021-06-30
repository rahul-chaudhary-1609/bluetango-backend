'use strict';

import * as constants from "../constants";

const paypal = require("paypal-rest-sdk");

paypal.configure({
    'mode': constants.SECRETS.PAYPAL_SECRETS.environment, //sandbox or live
    'client_id': constants.SECRETS.PAYPAL_SECRETS.client_id,
    'client_secret': constants.SECRETS.PAYPAL_SECRETS.client_secret
});

export default paypal;