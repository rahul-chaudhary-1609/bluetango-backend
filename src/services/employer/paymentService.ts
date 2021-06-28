const paypal = require("paypal-rest-sdk")

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AVgk4Blak5Zh1JyXlb30Dnhu9zflsp5eOqnilAaUTZEt7qaiINyJPhUQwRp4ThWhM3MQbQnLTvFJcsF9',
    'client_secret': 'EKck4sZ9NgYStHO0qtEKXpRx6czFWbiiBGqUvlrcSDQSMsmcQSd12HoOX4rPhQru9xHCsJmxQzpodXpk'
});

let toPayAmount = 5;

export class Payment{
    constructor() {}

    public async payment(res,params) {
        const PORT = process.env.PORT || 1203;
        const HOST = process.env.HOST || "http://localhost"

        toPayAmount = params.amount;
        //origin = params.origin;
        console.log("params", params)

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
            } else {
                console.log("Create Payment Response");
                console.log(payment);
                let redirectURLObject = payment.links.find((link) => link.rel === 'approval_url')
                res.redirect(redirectURLObject.href);
            }
        });
    }

    public async success(params) {
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
                        total: `${toPayAmount}`
                    }
                }
            ]
        }

        let pay = null;

        paypal.payment.execute(paymentID, payment_execute_json, (error, payment) => {
            if (error) {
                console.log("Error", error)
                return error;
            }
            console.log(payment.transactions[0].related_resources[0].sale)
            pay= payment;
        })
        return true;
    }

    public async cancel(params) {
        return "Failed";
    }
}