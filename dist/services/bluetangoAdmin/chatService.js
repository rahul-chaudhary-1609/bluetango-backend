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
const bluetangoChatRoom_1 = require("../../models/bluetangoChatRoom");
const coachManagement_1 = require("../../models/coachManagement");
const queryService = __importStar(require("../../queryService/bluetangoAdmin/queryService"));
const bluetangoAdmin_1 = require("../../models/bluetangoAdmin");
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
class ChatServices {
    constructor() { }
    /*
    * function to get chat room id
    */
    getChatRoomId(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                where: {
                    [Op.or]: [
                        { [Op.and]: [{ user_id: user.uid }, { other_user_id: params.other_user_id }] },
                        { [Op.and]: [{ user_id: params.other_user_id }, { other_user_id: user.uid }] }
                    ],
                }
            };
            let chatRoomData = yield queryService.selectOne(bluetangoChatRoom_1.bluetangoChatRoomModel, query);
            let coach = yield queryService.selectOne(coachManagement_1.coachManagementModel, {
                attributes: ['id', 'name', ['image', 'profile_pic_url']],
                where: {
                    id: parseInt(params.other_user_id),
                    app_id: constants.COACH_APP_ID.BT,
                }
            });
            if (!chatRoomData) {
                if (!coach)
                    throw new Error(constants.MESSAGES.no_coach);
                let chatRoomObj = {
                    user_id: user.uid,
                    other_user_id: params.other_user_id,
                    room_id: yield helperFunction.getUniqueBluetangoChatRoomId(),
                    info: [
                        {
                            id: user.uid,
                            chatLastDeletedOn: new Date(),
                            isDeleted: false,
                            type: constants.BLUETANGO_CHAT_USER_TYPE.admin
                        },
                        {
                            id: parseInt(params.other_user_id),
                            chatLastDeletedOn: new Date(),
                            isDeleted: false,
                            type: constants.BLUETANGO_CHAT_USER_TYPE.coach
                        }
                    ]
                };
                chatRoomData = yield queryService.addData(bluetangoChatRoom_1.bluetangoChatRoomModel, chatRoomObj);
                chatRoomData = chatRoomData.get({ plain: true });
            }
            else {
                chatRoomData.info = chatRoomData.info.map((info) => {
                    return Object.assign(Object.assign({}, info), { isDeleted: false });
                });
                chatRoomData.save();
            }
            let users = yield queryService.selectOne(bluetangoAdmin_1.bluetangoAdminModel, {
                attributes: ['id', 'name', 'profile_pic_url', 'admin_role', 'status', 'permissions'],
                where: {
                    id: user.uid
                }
            });
            chatRoomData = {
                id: chatRoomData.id,
                user: users,
                other_user: coach,
                room_id: chatRoomData.room_id,
                status: chatRoomData.status,
                // chatLastDeletedOn:chatRoomData.info?.find(info=>(info.id==user.uid && info.type==constants.CHAT_USER_TYPE.employee)).chatLastDeletedOn,
                createdAt: chatRoomData.createdAt,
                updatedAt: chatRoomData.updatedAt
            };
            return chatRoomData;
        });
    }
    /*
    * function to get chat  list
    */
    getChatList(params, user) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                where: {
                    user_id: user.uid,
                },
            };
            if (!params.is_pagination || params.is_pagination == constants.IS_PAGINATION.yes) {
                let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
                query.offset = offset,
                    query.limit = limit;
            }
            let chatRoomData = yield queryService.selectAndCountAll(bluetangoChatRoom_1.bluetangoChatRoomModel, query);
            let currentUser = yield queryService.selectOne(bluetangoAdmin_1.bluetangoAdminModel, {
                attributes: ['id', 'name', 'profile_pic_url', 'admin_role', 'status', 'permissions'],
                where: {
                    id: user.uid
                }
            });
            let chats = {
                count: chatRoomData.count,
                rows: []
            };
            for (let chat of chatRoomData.rows) {
                let coach = yield queryService.selectOne(coachManagement_1.coachManagementModel, {
                    attributes: ['id', 'name', ['image', 'profile_pic_url']],
                    where: {
                        id: chat.other_user_id,
                    }
                });
                let chatObj = {
                    id: chat.id,
                    room_id: chat.room_id,
                    user: currentUser,
                    other_user: coach,
                    status: chat.status,
                    info: (_a = chat.info) === null || _a === void 0 ? void 0 : _a.find(info => (info.id == user.uid && info.type == constants.BLUETANGO_CHAT_USER_TYPE.admin)),
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt
                };
                // if(!chatObj.info.isDeleted){
                //     chatObj.chatLastDeletedOn=chatObj.info.chatLastDeletedOn;
                //     delete chatObj.info;
                //     chats.rows.push(chatObj)
                // }
                chats.rows.push(chatObj);
            }
            return chats;
        });
    }
    /*
* function to send video chat notification
*/
    sendChatNotification(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let chatRoomData = yield queryService.selectOne(bluetangoChatRoom_1.bluetangoChatRoomModel, {
                where: {
                    room_id: params.chat_room_id,
                }
            });
            let groupChatRoomData = null;
            if (!chatRoomData) {
                throw new Error(constants.MESSAGES.chat_room_notFound);
            }
            let recieverId = null;
            if (chatRoomData) {
                recieverId = chatRoomData.other_user_id;
            }
            let recieverData = yield queryService.selectOne(coachManagement_1.coachManagementModel, {
                where: { id: recieverId, }
            });
            chatRoomData = yield helperFunction.convertPromiseToObject(chatRoomData);
            if (chatRoomData === null || chatRoomData === void 0 ? void 0 : chatRoomData.info) {
                yield bluetangoChatRoom_1.bluetangoChatRoomModel.update({
                    info: chatRoomData.info.map((info) => {
                        return Object.assign(Object.assign({}, info), { isDeleted: false });
                    })
                }, {
                    where: {
                        room_id: params.chat_room_id,
                    }
                });
            }
            let senderEmployeeData = yield helperFunction.convertPromiseToObject(yield queryService.selectOne(bluetangoAdmin_1.bluetangoAdminModel, {
                where: { id: user.uid, }
            }));
            delete senderEmployeeData.password;
            let newNotification = null;
            //add notification 
            // let notificationObj = <any>{
            //     type_id: params.chat_room_id,
            //     sender_id: user.uid,
            //     reciever_id: recieverId,
            //     reciever_type: chatRoomData.type == constants.CHAT_ROOM_TYPE.coach ? constants.NOTIFICATION_RECIEVER_TYPE.coach : constants.NOTIFICATION_RECIEVER_TYPE.employee,
            //     type: constants.NOTIFICATION_TYPE.message,
            //     data: {
            //         type: constants.NOTIFICATION_TYPE.message,
            //         title: 'Message',
            //         message: params.message || `Message from ${senderEmployeeData.name}`,
            //         chat_room_id: params.chat_room_id,
            //         senderEmployeeData
            //     },
            // }
            // newNotification = await notificationModel.create(notificationObj);
            //send push notification
            let notificationData = {
                title: 'Message',
                body: `Message from ${senderEmployeeData.name}`,
                data: {
                    type: constants.BLUETANGO_NOTIFICATION_TYPE.text_chat,
                    title: 'Message',
                    message: params.message || `Message from ${senderEmployeeData.name}`,
                    chat_room_id: params.chat_room_id,
                    senderEmployeeData
                },
            };
            yield helperFunction.sendFcmNotification([recieverData.device_token], notificationData);
            return newNotification;
        });
    }
}
exports.ChatServices = ChatServices;
//# sourceMappingURL=chatService.js.map