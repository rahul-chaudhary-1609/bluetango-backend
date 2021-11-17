import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import { chatRealtionMappingInRoomModel } from  "../../models/chatRelationMappingInRoom";
import { employeeModel } from "../../models/employee";
import { managerTeamMemberModel } from "../../models/managerTeamMember";
import { notificationModel } from "../../models/notification";
import { coachManagementModel } from "../../models/coachManagement";
const Sequelize = require('sequelize');
const OpenTok = require("opentok");
const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET_KEY, { timeout: 30000 });
var Op = Sequelize.Op;

export class ChatServices {
    constructor() { }
    /*
    * function to get chat  list
    */
    public async getChatList(user: any) {

        let chatRoomData = await chatRealtionMappingInRoomModel.findAll({
            where: {
                other_user_id: user.uid,
                type: constants.CHAT_ROOM_TYPE.coach
            }
        });

        let chats = [];

        for (let chat of chatRoomData) {
            let is_disabled = false;

            let employee = await employeeModel.findOne({
                attributes: ['id', 'name', 'profile_pic_url', 'status'],
                where: {
                    id: chat.user_id,
                }
            });
                

            if (employee.status==constants.STATUS.deleted) is_disabled = true;
            
            let chatObj=<any>{
                id: chat.id,
                room_id: chat.room_id,
                user: employee,
                status: chat.status,
                type: chat.type,
                is_disabled,
                info:chat.info?.find(info=>(info.id==user.uid && info.type==constants.CHAT_USER_TYPE.coach)),
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt
            }

            if(!chatObj.info.isDeleted){
                chatObj.chatLastDeletedOn=chatObj.info.chatLastDeletedOn;
                delete chatObj.info;
                chats.push(chatObj);
            }
        }

        

        return chats;
    }

    public createSession(params) {
        return new Promise((resolve) => {
            opentok.createSession(async (err: any, session: any) => {
                if (err) throw new Error(constants.MESSAGES.video_chat_session_create_error);

                // save the sessionId
                await chatRealtionMappingInRoomModel.update(
                    {
                        chat_session_id: session.sessionId
                    },
                    {
                        where: {
                            room_id: params.chat_room_id,
                        },
                        returning: true,
                    }
                )

                resolve(true);
            });
            
        });
    }
    /*
   * function to create video chat session
   */
    public async createChatSession(params: any, user: any) {
        
        let chatRoomData = await chatRealtionMappingInRoomModel.findOne({
            where: {
                room_id: params.chat_room_id,
            }
        });

        if (!chatRoomData) throw new Error(constants.MESSAGES.chat_room_notFound);

        //const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET_KEY, { timeout: 30000 });

        // opentok.createSession(async (err:any, session:any)=> {
        //     if (err) throw new Error(constants.MESSAGES.video_chat_session_create_error);

        //     // save the sessionId
        //     await chatRealtionMappingInRoomModel.update(
        //         {
        //             chat_session_id:session.sessionId
        //         },
        //         {
        //             where: {
        //                 room_id: params.chat_room_id,
        //             },
        //             returning:true,
        //         }
        //     )
        // });

        await this.createSession(params);
        

        chatRoomData = await chatRealtionMappingInRoomModel.findOne({
            where: {
                room_id: params.chat_room_id,
            }
        });
        
        let token = opentok.generateToken(chatRoomData.chat_session_id, {
            role: "moderator",
            expireTime: Math.floor(new Date().getTime() / 1000) + 60 * 60, // in one hour
            data: `userId=${user.uid}`,
            initialLayoutClassList: ["focus"],
        });


        return { sessionId: chatRoomData.chat_session_id, token }
        //return constants.MESSAGES.video_chat_session_created

    }
    
    /*
  * function to get video chat session id and token
  */
    public async getChatSessionIdandToken(params: any, user: any) {

        let chatRoomData = await chatRealtionMappingInRoomModel.findOne({
            where: {
                room_id: params.chat_room_id,
            }
        });

        if (!chatRoomData) throw new Error(constants.MESSAGES.chat_room_notFound);

        //const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET_KEY, { timeout: 30000 });

        let token = opentok.generateToken(chatRoomData.chat_session_id, {
            role: "moderator",
            expireTime: Math.floor(new Date().getTime() / 1000) + 60 * 60, // in one hour
            data: `userId=${user.uid}`,
            initialLayoutClassList: ["focus"],
        });


        return { sessionId: chatRoomData.chat_session_id, token }

    }

    /*
  * function to create video chat session
  */
    public async dropChatSession(params: any, user: any) {

        let chatRoomData = await chatRealtionMappingInRoomModel.update({
            chat_session_id: null,
        }, {
            where: {
                room_id: params.chat_room_id,
            },
            returning: true,
        });


        return chatRoomData

    }

    /*
  * function to create video chat session
  */
    public async checkChatSession(params: any, user: any) {

        let chatRoomData = await helperFunction.convertPromiseToObject(await chatRealtionMappingInRoomModel.findOne({
            where: {
                room_id: params.chat_room_id,
            }
        }));

        let isSessionExist = false;

        if (chatRoomData.chat_session_id) isSessionExist = true


        return { isSessionExist };

    }


    /*
* function to send video chat notification
*/
    public async sendChatNotification(params: any, user: any) {

        let chatRoomData = await chatRealtionMappingInRoomModel.findOne({
            where: {
                room_id: params.chat_room_id,
            }
        });

        if (!chatRoomData) throw new Error(constants.MESSAGES.chat_room_notFound);

        let recieverId = user.uid == chatRoomData.other_user_id ? chatRoomData.user_id : chatRoomData.other_user_id;

        let recieverEmployeeData = await employeeModel.findOne({
            where: { id: recieverId, }
        })

        chatRoomData=await helperFunction.convertPromiseToObject(chatRoomData);

        if(chatRoomData.info){

            await chatRealtionMappingInRoomModel.update({
                info:chatRoomData.info.map((info)=>{
                    return{
                        ...info,
                        isDeleted:false,
                    }
                })
            },{
                where:{
                    room_id: params.chat_room_id,
                }
            })
        }


        let senderEmployeeData = await helperFunction.convertPromiseToObject(await coachManagementModel.findOne({
            where: { id: user.uid, }
        }))

        delete senderEmployeeData.password

        let newNotification = null;

        if (params.chat_type == 'text') {
            //add notification 
            let notificationObj = <any>{
                type_id: params.chat_room_id,
                sender_id: user.uid,
                reciever_id: recieverId,
                reciever_type:constants.NOTIFICATION_RECIEVER_TYPE.employee,
                type: constants.NOTIFICATION_TYPE.message,
                data: {
                    type: constants.NOTIFICATION_TYPE.message,
                    title: 'Message',
                    message: params.message || `Message from ${senderEmployeeData.name}`,
                    chat_room_id: params.chat_room_id,
                    senderEmployeeData
                },
            }
            newNotification = await notificationModel.create(notificationObj);

            //send push notification
            let notificationData = <any>{
                title: 'Message',
                body: `Message from ${senderEmployeeData.name}`,
                data: {
                    type: constants.NOTIFICATION_TYPE.message,
                    title: 'Message',
                    message: params.message || `Message from ${senderEmployeeData.name}`,
                    chat_room_id: params.chat_room_id,
                    senderEmployeeData
                },
            }
            await helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
        }
        else if (params.chat_type == 'audio') {
            //add notification 
            let notificationObj = <any>{
                type_id: params.chat_room_id,
                sender_id: user.uid,
                reciever_id: recieverId,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                type: constants.NOTIFICATION_TYPE.audio_chat,
                data: {
                    type: constants.NOTIFICATION_TYPE.audio_chat,
                    title: 'Audio Chat',
                    message: `Audio chat from ${senderEmployeeData.name}`,
                    sessionId: params.session_id,
                    token: params.token,
                    chat_room_id: params.chat_room_id,
                    senderEmployeeData
                },
            }
            newNotification = await notificationModel.create(notificationObj);

            //send push notification
            let notificationData = <any>{
                title: 'Audio Chat',
                body: `Audio chat from ${senderEmployeeData.name}`,
                data: {
                    type: constants.NOTIFICATION_TYPE.audio_chat,
                    title: 'Audio Chat',
                    message: `Audio chat from ${senderEmployeeData.name}`,
                    sessionId: params.session_id,
                    token: params.token,
                    chat_room_id: params.chat_room_id,
                    senderEmployeeData
                },
            }
            await helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
        }
        else if (params.chat_type == 'video') {
            //add notification 
            let notificationObj = <any>{
                type_id: params.chat_room_id,
                sender_id: user.uid,
                reciever_id: recieverId,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                type: constants.NOTIFICATION_TYPE.video_chat,
                data: {
                    type: constants.NOTIFICATION_TYPE.video_chat,
                    title: 'Video Chat',
                    message: `Video chat from ${senderEmployeeData.name}`,
                    sessionId: params.session_id,
                    token: params.token,
                    chat_room_id: params.chat_room_id,
                    senderEmployeeData
                },
            }
            newNotification = await notificationModel.create(notificationObj);

            //send push notification
            let notificationData = <any>{
                title: 'Video Chat',
                body: `Video chat from ${senderEmployeeData.name}`,
                data: {
                    type: constants.NOTIFICATION_TYPE.video_chat,
                    title: 'Video Chat',
                    message: `Video chat from ${senderEmployeeData.name}`,
                    sessionId: params.session_id,
                    token: params.token,
                    chat_room_id: params.chat_room_id,
                    senderEmployeeData
                },
            }
            await helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
        }

        


        return newNotification

    }

    /*
* function to send disconnect video chat notification
*/
    public async sendChatDisconnectNotification(params: any, user: any) {

        let chatRoomData = await chatRealtionMappingInRoomModel.findOne({
            where: {
                room_id: params.chat_room_id,
            }
        });

        if (!chatRoomData) throw new Error(constants.MESSAGES.chat_room_notFound);

        let recieverId = user.uid == chatRoomData.other_user_id ? chatRoomData.user_id : chatRoomData.other_user_id;

        let recieverEmployeeData = await employeeModel.findOne({
            where: { id: recieverId, }
        })


        let senderEmployeeData = await helperFunction.convertPromiseToObject(await coachManagementModel.findOne({
            where: { id: user.uid, }
        }))

        delete senderEmployeeData.password

        let notificationData = null;

        if (params.disconnect_type && params.disconnect_type == constants.CHAT_DISCONNECT_TYPE.missed) {
            
            if (params.chat_type == 'audio') {
                //add notification 
                let notificationObj = <any>{
                    type_id: params.chat_room_id,
                    sender_id: user.uid,
                    reciever_id: recieverId,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: constants.NOTIFICATION_TYPE.audio_chat_missed,
                    data: {
                        type: constants.NOTIFICATION_TYPE.audio_chat_missed,
                        title: 'Missed Audio Chat',
                        message: `Missed audio chat from ${senderEmployeeData.name}`,
                        sessionId: params.session_id || null,
                        token: params.token || null,
                        chat_room_id: params.chat_room_id,
                        senderEmployeeData
                    },
                }
                
                await notificationModel.create(notificationObj);

                //send push notification
                notificationData = <any>{
                    title: 'Missed Audio Chat',
                    body: `Missed audio chat from ${senderEmployeeData.name}`,
                    data: {
                        type: constants.NOTIFICATION_TYPE.audio_chat_missed,
                        title: 'Missed Audio Chat',
                        message: `Missed audio chat from ${senderEmployeeData.name}`,
                        sessionId: params.session_id || null,
                        token: params.token || null,
                        chat_room_id: params.chat_room_id,
                        senderEmployeeData
                    },
                }
                await helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
            }
            else if (params.chat_type == 'video') {
                //add notification 
                let notificationObj = <any>{
                    type_id: params.chat_room_id,
                    sender_id: user.uid,
                    reciever_id: recieverId,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: constants.NOTIFICATION_TYPE.video_chat_missed,
                    data: {
                        type: constants.NOTIFICATION_TYPE.video_chat_missed,
                        title: 'Missed Video Chat',
                        message: `Missed video chat from ${senderEmployeeData.name}`,
                        sessionId: params.session_id || null,
                        token: params.token || null,
                        chat_room_id: params.chat_room_id,
                        senderEmployeeData
                    },
                }
                await notificationModel.create(notificationObj);
                //send push notification
                notificationData = <any>{
                    title: 'Missed Video Chat',
                    body: `Missed video chat from ${senderEmployeeData.name}`,
                    data: {
                        type: constants.NOTIFICATION_TYPE.video_chat_missed,
                        title: 'Missed Video Chat',
                        message: `Missed video chat from ${senderEmployeeData.name}`,
                        sessionId: params.session_id || null,
                        token: params.token || null,
                        chat_room_id: params.chat_room_id,
                        senderEmployeeData
                    },
                }
                await helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
            }
        }
        else {
            if (!params.chat_type) {
                //send push notification
                notificationData = <any>{
                    title: 'Disconnected',
                    body: `Chat disconnected by ${senderEmployeeData.name}`,
                    data: {
                        type: constants.NOTIFICATION_TYPE.chat_disconnect,
                        title: 'Disconneted',
                        message: `Chat disconnected by ${senderEmployeeData.name}`,
                        sessionId: params.session_id || null,
                        token: params.token || null,
                        chat_room_id: params.chat_room_id,
                        senderEmployeeData
                    },
                }
                await helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
            }
            else {
                if (params.chat_type == 'audio') {
                    //send push notification
                    notificationData = <any>{
                        title: 'Disconnected',
                        body: `Audio chat disconnected by ${senderEmployeeData.name}`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.chat_disconnect,
                            title: 'Disconnected',
                            message: `Audio chat disconnected by ${senderEmployeeData.name}`,
                            sessionId: params.session_id || null,
                            token: params.token || null,
                            chat_room_id: params.chat_room_id,
                            senderEmployeeData
                        },
                    }
                    await helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
                }
                else if (params.chat_type == 'video') {
                    //send push notification
                    notificationData = <any>{
                        title: 'Disconnected',
                        body: `Video chat disconnected by ${senderEmployeeData.name}`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.chat_disconnect,
                            title: 'Disconnected',
                            message: `Video chat disconnected by ${senderEmployeeData.name}`,
                            sessionId: params.session_id || null,
                            token: params.token || null,
                            chat_room_id: params.chat_room_id,
                            senderEmployeeData
                        },
                    }
                    await helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
                }
                else {
                    //send push notification
                    notificationData = <any>{
                        title: 'Disconnected',
                        body: `Chat disconnected by ${senderEmployeeData.name}`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.chat_disconnect,
                            title: 'Disconneted',
                            message: `Chat disconnected by ${senderEmployeeData.name}`,
                            sessionId: params.session_id || null,
                            token: params.token || null,
                            chat_room_id: params.chat_room_id,
                            senderEmployeeData
                        },
                    }
                    await helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
                }
            }
        }

        

        return notificationData

    }

    /*
* function to get notification
*/
    public async getNotifications(params: any, user: any) {

        let notifications = await helperFunction.convertPromiseToObject(await notificationModel.findAndCountAll({
            where: {
                reciever_id: user.uid,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
                type: {
                    [Op.notIn]: [
                        constants.NOTIFICATION_TYPE.message,
                    ]
                },
                status: [0, 1]
            },
            order: [["createdAt", "DESC"]]
        }));

        await notificationModel.update({
            status: 0,
        }, {
            where: {
                status: 1,
                type: {
                    [Op.notIn]: [
                        constants.NOTIFICATION_TYPE.message,
                    ]
                },
                reciever_id: user.uid,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
            }
        })


        return notifications;
    }

    /*
* function to get unseen notification count
*/
    public async getUnseenNotificationCount(user: any) {

        return {
            all: await notificationModel.count({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
                    type: {
                        [Op.notIn]: [
                            constants.NOTIFICATION_TYPE.message,
                        ]
                    },
                    status: 1,
                }
            }),

            // achievement: await notificationModel.count({
            //     where: {
            //         reciever_id: user.uid,
            //         reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
            //         type: [
            //             constants.NOTIFICATION_TYPE.achievement_post,
            //             constants.NOTIFICATION_TYPE.achievement_like,
            //             constants.NOTIFICATION_TYPE.achievement_highfive,
            //             constants.NOTIFICATION_TYPE.achievement_comment,
            //         ],
            //         status: 1,
            //     }
            // }),

            // achievement_post_only: await notificationModel.count({
            //     where: {
            //         reciever_id: user.uid,
            //         reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
            //         type: [
            //             constants.NOTIFICATION_TYPE.achievement_post,
            //         ],
            //         status: 1,
            //     }
            // }),

            chat: await notificationModel.count({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
                    type: [
                        constants.NOTIFICATION_TYPE.message,
                        constants.NOTIFICATION_TYPE.audio_chat,
                        constants.NOTIFICATION_TYPE.video_chat,
                        constants.NOTIFICATION_TYPE.audio_chat_missed,
                        constants.NOTIFICATION_TYPE.video_chat_missed,
                        constants.NOTIFICATION_TYPE.chat_disconnect,
                    ],
                    status: 1,
                }
            }),

            chat_message_only: (await helperFunction.convertPromiseToObject(await notificationModel.count({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
                    type: [
                        constants.NOTIFICATION_TYPE.message,
                    ],
                    status: 1,
                },
                group: ['type_id']
            }))).length,

            // goal: await notificationModel.count({
            //     where: {
            //         reciever_id: user.uid,
            //         reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
            //         type: [
            //             constants.NOTIFICATION_TYPE.assign_new_goal,
            //             constants.NOTIFICATION_TYPE.goal_complete_request,
            //             constants.NOTIFICATION_TYPE.goal_accept,
            //             constants.NOTIFICATION_TYPE.goal_reject,
            //         ],
            //         status: 1,
            //     }
            // }),

            // rating: await notificationModel.count({
            //     where: {
            //         reciever_id: user.uid,
            //         reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
            //         type: [
            //             constants.NOTIFICATION_TYPE.rating
            //         ],
            //         status: 1,
            //     }
            // })

        }



    }

    /*
* function to mark as viewed notification
*/
    public async markNotificationsAsViewed(params: any, user: any) {

        let whereCondition = null;

        if (params && params.type) {
            // if (params.type == "achievement") {
            //     whereCondition = {
            //         ...whereCondition,
            //         type: [
            //             constants.NOTIFICATION_TYPE.achievement_post,
            //             constants.NOTIFICATION_TYPE.achievement_like,
            //             constants.NOTIFICATION_TYPE.achievement_highfive,
            //             constants.NOTIFICATION_TYPE.achievement_comment,
            //         ]
            //     }
            // }
            // else if (params.type == "achievement_post_only") {
            //     whereCondition = {
            //         ...whereCondition,
            //         type: [
            //             constants.NOTIFICATION_TYPE.achievement_post,
            //         ]
            //     }
            // }
            if (params.type == "chat") {
                whereCondition = {
                    ...whereCondition,
                    type: [
                        constants.NOTIFICATION_TYPE.message,
                        constants.NOTIFICATION_TYPE.audio_chat,
                        constants.NOTIFICATION_TYPE.video_chat,
                        constants.NOTIFICATION_TYPE.audio_chat_missed,
                        constants.NOTIFICATION_TYPE.video_chat_missed,
                        constants.NOTIFICATION_TYPE.chat_disconnect,
                    ]
                }
            }
            else if (params.type == "chat_message_only") {

                if (!params.chat_room_id) throw new Error(constants.MESSAGES.chat_room_required)

                whereCondition = {
                    ...whereCondition,
                    type: [
                        constants.NOTIFICATION_TYPE.message,
                    ],
                    type_id: parseInt(params.chat_room_id),
                }
            }
            // else if (params.type == "goal") {
            //     whereCondition = {
            //         ...whereCondition,
            //         type: [
            //             constants.NOTIFICATION_TYPE.assign_new_goal,
            //             constants.NOTIFICATION_TYPE.goal_complete_request,
            //             constants.NOTIFICATION_TYPE.goal_accept,
            //             constants.NOTIFICATION_TYPE.goal_reject,
            //         ]
            //     }
            // }
            // else if (params.type == "rating") {
            //     whereCondition = {
            //         ...whereCondition,
            //         type: [
            //             constants.NOTIFICATION_TYPE.rating
            //         ]
            //     }
            // }

        }
        else {
            whereCondition = {
                ...whereCondition,
                type: {
                    [Op.notIn]: [
                        constants.NOTIFICATION_TYPE.message
                    ]
                },
            }
        }


        let notification = await helperFunction.convertPromiseToObject(await notificationModel.update({
            status: 0,
        }, {
            where: {
                //id: parseInt(params.notification_id),
                ...whereCondition,
                status: 1,
                reciever_id: user.uid,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
            }
        }));


        return notification;
    }

    /*
    * function to clear Chat
    */
    public async clearChat(params: any, user: any) {
        let chatRoomData = await helperFunction.convertPromiseToObject(
            await chatRealtionMappingInRoomModel.findOne({
                where: {
                    room_id: params.chat_room_id,
                }
            })
        );
        
        if (!chatRoomData) throw new Error(constants.MESSAGES.chat_room_notFound);

        
        if(chatRoomData.info){
            await chatRealtionMappingInRoomModel.update({
                info:chatRoomData.info.map((info)=>{
                    if(info.id==user.uid && info.type==constants.CHAT_USER_TYPE.coach){
                        return{
                            ...info,
                            chatLastDeletedOn:new Date(),
                            isDeleted:true,
                        }
                    }else{
                        return{
                            ...info,
                        }
                    }                        
                })
            },{
                where:{
                    room_id: params.chat_room_id,
                }
            })
        }       

        return true;
    }



}
