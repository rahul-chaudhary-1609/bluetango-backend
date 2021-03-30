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
const teamGoal_1 = require("../../models/teamGoal");
const teamGoalAssign_1 = require("../../models/teamGoalAssign");
const chatRelationMappingInRoom_1 = require("../../models/chatRelationMappingInRoom");
const qualitativeMeasurementComment_1 = require("../../models/qualitativeMeasurementComment");
const employee_1 = require("../../models/employee");
const managerTeamMember_1 = require("../../models/managerTeamMember");
const notification_1 = require("../../models/notification");
const Sequelize = require('sequelize');
const OpenTok = require("opentok");
var Op = Sequelize.Op;
class ChatServices {
    constructor() { }
    /*
    * function to get chat popup list as employee
    */
    getChatPopUpListAsEmployee(user) {
        return __awaiter(this, void 0, void 0, function* () {
            teamGoalAssign_1.teamGoalAssignModel.hasOne(teamGoal_1.teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
            let employeeGoalData = yield teamGoalAssign_1.teamGoalAssignModel.findAll({
                where: {
                    employee_id: user.uid
                },
                attributes: ['id'],
                include: [
                    {
                        model: teamGoal_1.teamGoalModel,
                        required: false,
                        attributes: ['id', 'title']
                    }
                ]
            });
            let getQuantitativeData = yield qualitativeMeasurementComment_1.qualitativeMeasurementCommentModel.findAll();
            // let formatEmployeeGoalData = employeeGoalData.map((val: any) => {
            //     console.log("val",val)
            //     return {
            //         id: val.id,
            //         label:val.team_goal,
            //     }
            // })
            return employeeGoalData.concat(getQuantitativeData);
        });
    }
    /*
    * function to get chat room id
    */
    getChatRoomId(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.uid == params.other_user_id) {
                throw new Error(constants.MESSAGES.self_chat);
            }
            let chatRoomData = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findOne({
                where: {
                    [Op.or]: [
                        { [Op.and]: [{ user_id: user.uid }, { other_user_id: params.other_user_id }] },
                        { [Op.and]: [{ user_id: params.other_user_id }, { other_user_id: user.uid }] }
                    ]
                }
            });
            // if (chatRoomData) {
            //     return chatRoomData;
            // } else {
            //     let chatRoomObj = <any> {
            //         user_id: user.uid,
            //         other_user_id: params.other_user_id,
            //         room_id: await helperFunction.randomStringEightDigit()
            //     }
            //     return await chatRealtionMappingInRoomModel.create(chatRoomObj);
            // }
            if (!chatRoomData) {
                let managerTeamMember = yield managerTeamMember_1.managerTeamMemberModel.findOne({
                    where: {
                        team_member_id: user.uid
                    }
                });
                if (params.other_user_id != managerTeamMember.manager_id)
                    throw new Error(constants.MESSAGES.only_manager_chat);
                let chatRoomObj = {
                    user_id: user.uid,
                    other_user_id: params.other_user_id,
                    room_id: yield helperFunction.randomStringEightDigit()
                };
                chatRoomData = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.create(chatRoomObj);
            }
            let users = yield employee_1.employeeModel.findAll({
                attributes: ['id', 'name', 'profile_pic_url'],
                where: {
                    id: [user.uid, params.other_user_id]
                }
            });
            chatRoomData = {
                id: chatRoomData.id,
                user: users.find((val) => val.id == user.uid),
                other_user: users.find((val) => val.id == params.other_user_id),
                room_id: chatRoomData.room_id,
                status: chatRoomData.status,
                createdAt: chatRoomData.createdAt,
                updatedAt: chatRoomData.updatedAt
            };
            return chatRoomData;
        });
    }
    /*
    * function to get chat  list
    */
    getChatList(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let chatRoomData = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findAll({
                where: {
                    [Op.or]: [
                        { user_id: user.uid },
                        { other_user_id: user.uid }
                    ]
                }
            });
            let chats = [];
            for (let chat of chatRoomData) {
                let is_disabled = false;
                let id = chat.other_user_id;
                if (chat.other_user_id == user.uid)
                    id = chat.user_id;
                let employee = yield employee_1.employeeModel.findOne({
                    attributes: ['id', 'name', 'profile_pic_url', 'is_manager'],
                    where: {
                        id
                    }
                });
                let currentUser = yield employee_1.employeeModel.findOne({
                    attributes: ['id', 'name', 'profile_pic_url', 'is_manager'],
                    where: {
                        id: user.uid
                    }
                });
                if (currentUser.is_manager) {
                    let managerTeamMember_manager = yield managerTeamMember_1.managerTeamMemberModel.findOne({
                        where: {
                            team_member_id: user.uid
                        }
                    });
                    let managerTeamMember_employee = yield managerTeamMember_1.managerTeamMemberModel.findAll({
                        where: {
                            manager_id: user.uid
                        }
                    });
                    let employee_ids = managerTeamMember_employee.map((val) => {
                        return val.team_member_id;
                    });
                    if (employee.id !== managerTeamMember_manager.manager_id && !(employee_ids.includes(employee.id)))
                        is_disabled = true;
                    chats.push({
                        id: chat.id,
                        room_id: chat.room_id,
                        user: employee,
                        status: chat.status,
                        is_disabled,
                        createdAt: chat.createdAt,
                        updatedAt: chat.updatedAt
                    });
                }
                else {
                    let managerTeamMember = yield managerTeamMember_1.managerTeamMemberModel.findOne({
                        where: {
                            team_member_id: user.uid
                        }
                    });
                    if (employee.id !== managerTeamMember.manager_id)
                        is_disabled = true;
                    chats.push({
                        id: chat.id,
                        room_id: chat.room_id,
                        user: employee,
                        status: chat.status,
                        is_disabled,
                        createdAt: chat.createdAt,
                        updatedAt: chat.updatedAt
                    });
                }
            }
            return chats;
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
            const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET_KEY, { timeout: 30000 });
            opentok.createSession((err, session) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    throw new Error(constants.MESSAGES.video_chat_session_create_error);
                // save the sessionId
                yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.update({
                    video_chat_session_id: session.sessionId
                }, {
                    where: {
                        room_id: params.chat_room_id,
                    },
                    returning: true,
                });
            }));
            return constants.MESSAGES.video_chat_session_created;
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
            const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET_KEY, { timeout: 30000 });
            let token = opentok.generateToken(chatRoomData.video_chat_session_id, {
                role: "moderator",
                expireTime: new Date().getTime() / 1000 + 60 * 60,
                data: `userId=${user.uid}`,
                initialLayoutClassList: ["focus"],
            });
            return { sessionId: chatRoomData.video_chat_session_id, token };
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
            let senderEmployeeData = yield employee_1.employeeModel.findOne({
                where: { id: user.uid, }
            });
            let newNotification = null;
            if (params.chat_type == 'text') {
                //add notification 
                let notificationObj = {
                    type_id: params.chat_room_id,
                    sender_id: user.uid,
                    reciever_id: recieverId,
                    type: constants.NOTIFICATION_TYPE.message
                };
                newNotification = yield notification_1.notificationModel.create(notificationObj);
                //send push notification
                let notificationData = {
                    title: 'Message',
                    body: `Message from ${senderEmployeeData.name}`,
                    data: {},
                };
                yield helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
            }
            else if (params.chat_type == 'audio') {
                //add notification 
                let notificationObj = {
                    type_id: params.chat_room_id,
                    sender_id: user.uid,
                    reciever_id: recieverId,
                    type: constants.NOTIFICATION_TYPE.audio_chat
                };
                newNotification = yield notification_1.notificationModel.create(notificationObj);
                //send push notification
                let notificationData = {
                    title: 'Audio Chat',
                    body: `Audio chat from ${senderEmployeeData.name}`,
                    data: {
                        sessionId: params.session_id,
                        token: params.token,
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
                    type: constants.NOTIFICATION_TYPE.video_chat
                };
                newNotification = yield notification_1.notificationModel.create(notificationObj);
                //send push notification
                let notificationData = {
                    title: 'Video Chat',
                    body: `Video chat from ${senderEmployeeData.name}`,
                    data: {
                        sessionId: params.session_id,
                        token: params.token,
                    },
                };
                yield helperFunction.sendFcmNotification([recieverEmployeeData.device_token], notificationData);
            }
            return newNotification;
        });
    }
}
exports.ChatServices = ChatServices;
//# sourceMappingURL=chatServices.js.map