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
exports.ChatServices = void 0;
const constants = __importStar(require("../../constants"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const chatRelationMappingInRoom_1 = require("../../models/chatRelationMappingInRoom");
const employee_1 = require("../../models/employee");
const notification_1 = require("../../models/notification");
const coachManagement_1 = require("../../models/coachManagement");
const Sequelize = require('sequelize');
const OpenTok = require("opentok");
const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET_KEY, { timeout: 30000 });
var Op = Sequelize.Op;
class ChatServices {
    constructor() { }
    /*
    * function to get chat  list
    */
    getChatList(user) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let chatRoomData = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findAll({
                where: {
                    other_user_id: user.uid,
                    type: constants.CHAT_ROOM_TYPE.coach
                }
            });
            let chats = [];
            for (let chat of chatRoomData) {
                let is_disabled = false;
                let employee = yield employee_1.employeeModel.findOne({
                    attributes: ['id', 'name', 'profile_pic_url', 'status'],
                    where: {
                        id: chat.user_id,
                    }
                });
                if (employee.status == constants.STATUS.deleted)
                    is_disabled = true;
                chats.push({
                    id: chat.id,
                    room_id: chat.room_id,
                    user: employee,
                    status: chat.status,
                    type: chat.type,
                    is_disabled,
                    info: ((_a = chat.info) === null || _a === void 0 ? void 0 : _a.find(info => info.id == user.uid)) || null,
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt
                });
            }
            return chats;
        });
    }
    createSession(params) {
        return new Promise((resolve) => {
            opentok.createSession((err, session) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    throw new Error(constants.MESSAGES.video_chat_session_create_error);
                // save the sessionId
                yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.update({
                    chat_session_id: session.sessionId
                }, {
                    where: {
                        room_id: params.chat_room_id,
                    },
                    returning: true,
                });
                resolve(true);
            }));
        });
    }
    /*
   * function to create video chat session
   */
    createChatSession(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let chatRoomData = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findOne({
                where: {
                    room_id: params.chat_room_id,
                }
            });
            if (!chatRoomData)
                throw new Error(constants.MESSAGES.chat_room_notFound);
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
            yield this.createSession(params);
            chatRoomData = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findOne({
                where: {
                    room_id: params.chat_room_id,
                }
            });
            let token = opentok.generateToken(chatRoomData.chat_session_id, {
                role: "moderator",
                expireTime: Math.floor(new Date().getTime() / 1000) + 60 * 60,
                data: `userId=${user.uid}`,
                initialLayoutClassList: ["focus"],
            });
            return { sessionId: chatRoomData.chat_session_id, token };
            //return constants.MESSAGES.video_chat_session_created
        });
    }
    /*
  * function to get video chat session id and token
  */
    getChatSessionIdandToken(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let chatRoomData = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findOne({
                where: {
                    room_id: params.chat_room_id,
                }
            });
            if (!chatRoomData)
                throw new Error(constants.MESSAGES.chat_room_notFound);
            //const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET_KEY, { timeout: 30000 });
            let token = opentok.generateToken(chatRoomData.chat_session_id, {
                role: "moderator",
                expireTime: Math.floor(new Date().getTime() / 1000) + 60 * 60,
                data: `userId=${user.uid}`,
                initialLayoutClassList: ["focus"],
            });
            return { sessionId: chatRoomData.chat_session_id, token };
        });
    }
    /*
  * function to create video chat session
  */
    dropChatSession(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let chatRoomData = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.update({
                chat_session_id: null,
            }, {
                where: {
                    room_id: params.chat_room_id,
                },
                returning: true,
            });
            return chatRoomData;
        });
    }
    /*
  * function to create video chat session
  */
    checkChatSession(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let chatRoomData = yield helperFunction.convertPromiseToObject(yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findOne({
                where: {
                    room_id: params.chat_room_id,
                }
            }));
            let isSessionExist = false;
            if (chatRoomData.chat_session_id)
                isSessionExist = true;
            return { isSessionExist };
        });
    }
    /*
* function to send video chat notification
*/
    sendChatNotification(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let chatRoomData = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findOne({
                where: {
                    room_id: params.chat_room_id,
                }
            });
            if (!chatRoomData)
                throw new Error(constants.MESSAGES.chat_room_notFound);
            let recieverId = user.uid == chatRoomData.other_user_id ? chatRoomData.user_id : chatRoomData.other_user_id;
            let recieverEmployeeData = yield employee_1.employeeModel.findOne({
                where: { id: recieverId, }
            });
            chatRoomData = yield helperFunction.convertPromiseToObject(chatRoomData);
            if (chatRoomData.info) {
                yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.update({
                    info: chatRoomData.info.map((info) => {
                        return Object.assign(Object.assign({}, info), { isDeleted: false });
                    })
                }, {
                    where: {
                        room_id: params.chat_room_id,
                    }
                });
            }
            let senderEmployeeData = yield helperFunction.convertPromiseToObject(yield coachManagement_1.coachManagementModel.findOne({
                where: { id: user.uid, }
            }));
            delete senderEmployeeData.password;
            let newNotification = null;
            if (params.chat_type == 'text') {
                //add notification 
                let notificationObj = {
                    type_id: params.chat_room_id,
                    sender_id: user.uid,
                    reciever_id: recieverId,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: constants.NOTIFICATION_TYPE.message,
                    data: {
                        type: constants.NOTIFICATION_TYPE.message,
                        title: 'Message',
                        message: params.message || `Message from ${senderEmployeeData.name}`,
                        chat_room_id: params.chat_room_id,
                        senderEmployeeData
                    },
                };
                newNotification = yield notification_1.notificationModel.create(notificationObj);
                //send push notification
                let notificationData = {
                    title: 'Message',
                    body: `Message from ${senderEmployeeData.name}`,
                    data: {
                        type: constants.NOTIFICATION_TYPE.message,
                        title: 'Message',
                        message: params.message || `Message from ${senderEmployeeData.name}`,
                        chat_room_id: params.chat_room_id,
                        senderEmployeeData
                    },
                };
                yield helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
            }
            else if (params.chat_type == 'audio') {
                //add notification 
                let notificationObj = {
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
                };
                newNotification = yield notification_1.notificationModel.create(notificationObj);
                //send push notification
                let notificationData = {
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
                };
                yield helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
            }
            else if (params.chat_type == 'video') {
                //add notification 
                let notificationObj = {
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
                };
                newNotification = yield notification_1.notificationModel.create(notificationObj);
                //send push notification
                let notificationData = {
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
                };
                yield helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
            }
            return newNotification;
        });
    }
    /*
* function to send disconnect video chat notification
*/
    sendChatDisconnectNotification(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let chatRoomData = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findOne({
                where: {
                    room_id: params.chat_room_id,
                }
            });
            if (!chatRoomData)
                throw new Error(constants.MESSAGES.chat_room_notFound);
            let recieverId = user.uid == chatRoomData.other_user_id ? chatRoomData.user_id : chatRoomData.other_user_id;
            let recieverEmployeeData = yield employee_1.employeeModel.findOne({
                where: { id: recieverId, }
            });
            let senderEmployeeData = yield helperFunction.convertPromiseToObject(yield coachManagement_1.coachManagementModel.findOne({
                where: { id: user.uid, }
            }));
            delete senderEmployeeData.password;
            let notificationData = null;
            if (params.disconnect_type && params.disconnect_type == constants.CHAT_DISCONNECT_TYPE.missed) {
                if (params.chat_type == 'audio') {
                    //add notification 
                    let notificationObj = {
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
                    };
                    yield notification_1.notificationModel.create(notificationObj);
                    //send push notification
                    notificationData = {
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
                    };
                    yield helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
                }
                else if (params.chat_type == 'video') {
                    //add notification 
                    let notificationObj = {
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
                    };
                    yield notification_1.notificationModel.create(notificationObj);
                    //send push notification
                    notificationData = {
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
                    };
                    yield helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
                }
            }
            else {
                if (!params.chat_type) {
                    //send push notification
                    notificationData = {
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
                    };
                    yield helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
                }
                else {
                    if (params.chat_type == 'audio') {
                        //send push notification
                        notificationData = {
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
                        };
                        yield helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
                    }
                    else if (params.chat_type == 'video') {
                        //send push notification
                        notificationData = {
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
                        };
                        yield helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
                    }
                    else {
                        //send push notification
                        notificationData = {
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
                        };
                        yield helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
                    }
                }
            }
            return notificationData;
        });
    }
    /*
* function to get notification
*/
    getNotifications(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let notifications = yield helperFunction.convertPromiseToObject(yield notification_1.notificationModel.findAndCountAll({
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
            yield notification_1.notificationModel.update({
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
            });
            return notifications;
        });
    }
    /*
* function to get unseen notification count
*/
    getUnseenNotificationCount(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                all: yield notification_1.notificationModel.count({
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
                chat: yield notification_1.notificationModel.count({
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
                chat_message_only: (yield helperFunction.convertPromiseToObject(yield notification_1.notificationModel.count({
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
            };
        });
    }
    /*
* function to mark as viewed notification
*/
    markNotificationsAsViewed(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    whereCondition = Object.assign(Object.assign({}, whereCondition), { type: [
                            constants.NOTIFICATION_TYPE.message,
                            constants.NOTIFICATION_TYPE.audio_chat,
                            constants.NOTIFICATION_TYPE.video_chat,
                            constants.NOTIFICATION_TYPE.audio_chat_missed,
                            constants.NOTIFICATION_TYPE.video_chat_missed,
                            constants.NOTIFICATION_TYPE.chat_disconnect,
                        ] });
                }
                else if (params.type == "chat_message_only") {
                    if (!params.chat_room_id)
                        throw new Error(constants.MESSAGES.chat_room_required);
                    whereCondition = Object.assign(Object.assign({}, whereCondition), { type: [
                            constants.NOTIFICATION_TYPE.message,
                        ], type_id: parseInt(params.chat_room_id) });
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
                whereCondition = Object.assign(Object.assign({}, whereCondition), { type: {
                        [Op.notIn]: [
                            constants.NOTIFICATION_TYPE.message
                        ]
                    } });
            }
            let notification = yield helperFunction.convertPromiseToObject(yield notification_1.notificationModel.update({
                status: 0,
            }, {
                where: Object.assign(Object.assign({}, whereCondition), { status: 1, reciever_id: user.uid, reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach })
            }));
            return notification;
        });
    }
    /*
    * function to clear Chat
    */
    clearChat(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let chatRoomData = yield helperFunction.convertPromiseToObject(yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findOne({
                where: {
                    room_id: params.chat_room_id,
                }
            }));
            if (!chatRoomData)
                throw new Error(constants.MESSAGES.chat_room_notFound);
            if (chatRoomData.info) {
                yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.update({
                    info: chatRoomData.info.map((info) => {
                        if (info.id == user.uid) {
                            return Object.assign(Object.assign({}, info), { chatLastDeletedOn: new Date(), isDeleted: true });
                        }
                        else {
                            return Object.assign({}, info);
                        }
                    })
                }, {
                    where: {
                        room_id: params.chat_room_id,
                    }
                });
            }
            return true;
        });
    }
}
exports.ChatServices = ChatServices;
//# sourceMappingURL=chatServices.js.map