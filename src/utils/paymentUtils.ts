import { makeRequest, generateRandomString } from './appHttpClient';
import _ from "lodash";

export const createCustomerWallet = (params: any) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const body = {
                "first_name": `${params.first_name}`,
                "last_name": `${params.last_name}`,
                "ewallet_reference_id": `e-${generateRandomString(5)}`,
                "metadata": {
                    "merchant_defined": true
                },
                "type": "person"
            }
            const result: any = await makeRequest(
                'POST',
                '/v1/user/',
                body
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

export const createCustomer = (params: any, ewallet) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const body = {
                ewallet: ewallet,
                metadata: {
                  merchant_defined: true
                },
                name: `${params.first_name} ${params.last_name}`
            };
            const result: any = await makeRequest(
                'POST',
                '/v1/customers',
                body
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

export const getSupportedPaymentMethods = (params: any) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const result: any = await makeRequest(
                'GET',
                `/v1/payment_methods/country?country=${params.country ? params.country : 'US'}&currency=USD&category=card`
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

export const getPaymentMethodRequiredFields = (params: any) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const result: any = await makeRequest(
                'GET',
                `/v1/payment_methods/required_fields/${params.method_name ? params.method_name : 'us_visa_card'}`
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

export const addPaymentMethod = (params: any, customer_id) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const body = {
                type: params.method_type,
                fields: params.fields
            };
            const result: any = await makeRequest(
                'POST',
                `/v1/customers/${customer_id}/payment_methods`,
                body
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

export const listPaymentMethods = (customer_id) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const result: any = await makeRequest(
                'GET',
                `/v1/customers/${customer_id}/payment_methods`
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

export const markAsDefaultPaymentMethod = (token, customer_id) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const body = {
                default_payment_method: token
            };
            const result: any = await makeRequest(
                'POST',
                `/v1/customers/${customer_id}`,
                body
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

export const deletePaymentMethod = (token, customer_id) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const result: any = await makeRequest(
                'DELETE',
                `/v1/customers/${customer_id}/payment_methods/${token}`
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

export const createCardToken = (params: any, customer_id) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const body = {
                type: 'card',
                data: {
                    type: params.method_type,
                    fields: params.fields
                }
            };
            const result: any = await makeRequest(
                'POST',
                `/v1/tokens`,
                body
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

//Method to add money into wallet
export const addMoneyToWallet = (ewallet, amount, card_token) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const body = {
                "amount": amount,
                "currency": "USD",
                "description": "Add money to wallet",
                "payment_method": card_token,
                "ewallets": [{
                        "ewallet": ewallet,
                        "percentage": 100
                    }
                ],
                "metadata": {
                    "merchant_defined": true
                }
            }
            const result: any = await makeRequest(
                'POST',
                '/v1/payments/',
                body
            );
            if(result.statusCode == 200) {
                if(result.body.data.status == 'CLO') {
                    resolve(result.body)
                } else if(result.body.data.status == 'ACT') {
                    // if(process.env.RAPYD_ENV == 'sandbox') {
                    //     //call complete payment method to simulate 3DS
                    //     completePayment(result.body.data.id).then((data:any) => {
                    //         resolve(data)
                    //     }).catch(err => {
                    //         reject(err)
                    //     })
                    // } else {
                    //     //To Do 3DS implementation
                    //     resolve(result.body)
                    // }
                    resolve(result.body)
                }
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

//Only used in sandbox environment - to trigger PAYMENT_COMPLETED webhook event
export const completePayment = (pid: any) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const body = {
                token: pid
            }
            const result: any = await makeRequest(
                'POST',
                '/v1/payments/completePayment',
                body
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

export const customerWalletKYC = (custObj: any) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const body = {
                "first_name": "Jane",
                "last_name": "Doe",
                "middle_name": "",
                "second_last_name": "",
                "gender": "female",
                "marital_status": "single",
                "house_type": "lease",
                "contact_type": "personal",
                "phone_number": "+14155551233",
                "email": "jane200@rapyd.net",
                "identification_type": "PA",
                "identification_number": "1233242424",
                "date_of_birth": "11/22/2000",
                "country": "US",
                "nationality": "FR",
                "address": {
                    "name": "Jane Doe",
                    "line_1": "123 Lake Forest Drive",
                    "line_2": "",
                    "line_3": "",
                    "city": "Anytown",
                    "state": "NY",
                    "zip": "12345",
                    "phone_number": "+14155551234",
                    "metadata": {
                        "merchant_defined": true
                    },
                    "canton": "",
                    "district": ""
                },
                "metadata": {
                    "merchant_defined": true
                }
            }
            const result: any = await makeRequest(
                'POST',
                `/v1/ewallets/${custObj.ewallet}/contacts`,
                body
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

//wallet to wallet transfer
export const walletToWalletTransfer = (params: any) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const body = {
                amount: params.amount,
                currency: 'USD',
                source_ewallet: params.source_ewallet,
                destination_ewallet: params.destination_ewallet,
                metadata: {
                  merchant_defined: true
                }
            }
            const result: any = await makeRequest(
                'POST',
                '/v1/account/transfer',
                body
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

//accept transfer
export const acceptTransfer = (txn_id) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const body = {
                id: txn_id,
                metadata: {
                    merchant_defined: "accepted"
                },
                status: 'accept'
            }
            const result: any = await makeRequest(
                'POST',
                '/v1/account/transfer/response',
                body
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

//to put fund on hold, while book an appointment
export const putFundsOnHold = (params: any) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const body = {
                amount: params.amount,
                currency: 'USD',
                ewallet: params.ewallet,
            }
            const result: any = await makeRequest(
                'POST',
                '/v1/account/balance/hold',
                body
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

//To release onHold fund, when actual transfer done
export const releaseOnHoldFund = (params: any) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const body = {
                amount: params.amount,
                currency: 'USD',
                ewallet: params.ewallet,
            }
            const result: any = await makeRequest(
                'POST',
                '/v1/account/balance/release',
                body
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

//To get list of transactions
export const listTransactions = (params: any, ewallet) => {
    return new Promise(async(resolve, reject) =>{
        try {
            let path = `/v1/user/${ewallet}/transactions?page_number=${params.page_number ? params.page_number : 1}&page_size=${params.page_size? params.page_size : 10}&currency=${params.currency ? params.currency : 'USD'}`
            if(!_.isEmpty(params.start_date)) {
                path+= `&start_date=${params.start_date}`
            }
            if(!_.isEmpty(params.end_date)) {
                path+= `&end_date=${params.end_date}`
            }
            if(!_.isEmpty(params.type)) {
                path+= `&type=${params.type}`
            }
            const result: any = await makeRequest(
                'GET',
                path
            );
            if(result.statusCode == 200) {
                resolve(result.body)
            } else {
                reject(result.status)
            }
        } catch(err) {
            reject(err)
        }
    })
}

//To get wallet amount
export const getWalletAmount = (ewallet: any) => {
    return new Promise(async(resolve, reject) =>{
        try {
            const result:any = await makeRequest(
                'GET',
                `/v1/user/${ewallet}/accounts`
            );
            resolve(result.body.data[0])
        } catch(err) {
            reject(err)
        }
    })
}

/**
 * transfer-funds-to-bank-account-from-rapyd-wallet
 * create-refund
 * create-payout
 */