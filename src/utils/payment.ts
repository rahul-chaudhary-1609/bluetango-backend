'use strict';

import * as constants from "../constants";


const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');


export const client=function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

function environment() {
    let clientId = constants.SECRETS.PAYPAL_SECRETS.client_id
    let clientSecret = constants.SECRETS.PAYPAL_SECRETS.client_secret

    return new checkoutNodeJssdk.core.SandboxEnvironment(
        clientId, clientSecret
    );
}
