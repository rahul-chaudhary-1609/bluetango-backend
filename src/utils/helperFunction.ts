// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// const sgMail = require('@sendgrid/mail');
// var FCM = require('fcm-node');
// sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
import * as constants from '../constants';

const templates = {
    reset_password_request: "d-35df6c94cd3e4eeb8ddcb997639d4f84",
    reset_password_otp_request: "d-02d8142ca89049ae806403a0649365e8",
    confirm_account: "d-a86c633b50884d7e8b4faaaeed92ed3b",
    contact_admin_message: "d-cacbc4956baf467e915f25ce6bf1fa24",
    notify_end_user: "d-a551714cd9864df4a8c93499625ccd4e"
};

/* function for sending the otp */
// export const sendOtp = async (mobile, message) => {
//     try {
//         await client.messages.create({
//             from: process.env.TWILIO_PHONE_NUMBER,
//             to: mobile,
//             body: `${message}`
//         });
//     } catch (error) {
//         throw new Error(error);
//     }
// }

/**
 * 
 * @param params to, from, subject, html
 */
// export const sendEmail = async (params:any) => {
//     try {
//         const msg = {
//             to: params.to,
//             from: "",
//             templateId: templates[params.templateName],
//             dynamic_template_data: params.templateData
//          };
//          await sgMail.send(msg);
//     } catch (error) {
//         if (error.response) {
//             console.error(error.response.body)
//         }
//         throw new Error(error);
//     }
// }

/**
 * 
 * @param tokens - fcm-device token for user's device
 * @param notification - object with body and title
 * @param payload - extra info like { go_to_screen : "Home Page" } and other data
 */
// export const sendNotification = async (tokens: any, notification: any) => {
//     var serverKey = process.env.FCM_SERVER_KEY; //put your server key here
//     var fcm = new FCM(serverKey);

//     var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
//         registration_ids: tokens,
//         // collapse_key: process.env.FCM_SERVER_TOKEN,
//         notification: {
//             title: notification.title,
//             body: notification.body
//         },
//         data: notification.data
//     };
//     if(tokens.length) {
//         fcm.send(message, function (err, response) {
//             if (err) {
//                 console.log("Something has gone wrong!", notification, JSON.stringify(err));
//             } else {
//                 console.log("Successfully sent with response: ", response);
//             }
//         });
//     } else {
//         console.log("No FCM Device token registered yet.");
//     }
// }

/*
*get the current time value
*/
export const currentUnixTimeStamp = () => {
    return Math.floor(Date.now());
}

export const pagination = (page, page_size) => {
    if (page_size) {
        page_size = Number(page_size)
    } else {
        page_size = constants.OFFSET_LIMIT
    }
    if (page) {
        page = ((Number(page) - 1) * Number(page_size))
    } else {
        page = 0
    }
    return [page, page_size];
}
