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
const groupChatRoom_1 = require("../../models/groupChatRoom");
const employee_1 = require("../../models/employee");
const managerTeamMember_1 = require("../../models/managerTeamMember");
const notification_1 = require("../../models/notification");
const coachManagement_1 = require("../../models/coachManagement");
const attributes_1 = require("../../models/attributes");
const admin = __importStar(require("firebase-admin"));
const Sequelize = require('sequelize');
const OpenTok = require("opentok");
const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET_KEY, { timeout: 30000 });
var Op = Sequelize.Op;
const serviceAccount = require('../../../bluetango3-77c2f-firebase-adminsdk-kfu3h-18ee9f4654.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
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
            // let getQuantitativeData = await qualitativeMeasurementCommentModel.findAll({
            //     where:{status:constants.STATUS.active}
            // });
            let attribute = yield attributes_1.attributeModel.findAll({
                where: {
                    employer_id: user.current_employer_id,
                    status: constants.STATUS.active,
                },
                order: [["createdAt", "DESC"]]
            });
            // let formatEmployeeGoalData = employeeGoalData.map((val: any) => {
            //     console.log("val",val)
            //     return {
            //         id: val.id,
            //         label:val.team_goal,
            //     }
            // })
            return employeeGoalData.concat(attribute);
        });
    }
    /*
    * function to get chat room id
    */
    getChatRoomId(params, user) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (user.uid == params.other_user_id) {
                throw new Error(constants.MESSAGES.self_chat);
            }
            if (params.type && params.type == constants.CHAT_ROOM_TYPE.coach) {
                let chatRoomData = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findOne({
                    where: {
                        [Op.or]: [
                            { [Op.and]: [{ user_id: user.uid }, { other_user_id: params.other_user_id }] },
                            { [Op.and]: [{ user_id: params.other_user_id }, { other_user_id: user.uid }] }
                        ],
                        type: constants.CHAT_ROOM_TYPE.coach
                    }
                });
                let coach = yield coachManagement_1.coachManagementModel.findOne({
                    attributes: ['id', 'name', ['image', 'profile_pic_url']],
                    where: {
                        id: parseInt(params.other_user_id),
                    }
                });
                if (!chatRoomData) {
                    if (!coach)
                        throw new Error(constants.MESSAGES.only_manager_or_coach_chat);
                    let chatRoomObj = {
                        user_id: user.uid,
                        other_user_id: params.other_user_id,
                        room_id: yield helperFunction.getUniqueChatRoomId(),
                        type: constants.CHAT_ROOM_TYPE.coach,
                        info: [
                            {
                                id: user.uid,
                                chatLastDeletedOn: new Date(),
                                isDeleted: false,
                                type: constants.CHAT_USER_TYPE.employee
                            },
                            {
                                id: parseInt(params.other_user_id),
                                chatLastDeletedOn: new Date(),
                                isDeleted: false,
                                type: constants.CHAT_USER_TYPE.coach
                            }
                        ]
                    };
                    chatRoomData = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.create(chatRoomObj);
                }
                else {
                    chatRoomData.info = chatRoomData.info.map((info) => {
                        return Object.assign(Object.assign({}, info), { isDeleted: false });
                    });
                    chatRoomData.save();
                }
                let users = yield employee_1.employeeModel.findAll({
                    attributes: ['id', 'name', 'profile_pic_url'],
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
                    chatLastDeletedOn: (_a = chatRoomData.info) === null || _a === void 0 ? void 0 : _a.find(info => (info.id == user.uid && info.type == constants.CHAT_USER_TYPE.employee)).chatLastDeletedOn,
                    createdAt: chatRoomData.createdAt,
                    updatedAt: chatRoomData.updatedAt
                };
                return chatRoomData;
            }
            else {
                let isHighestManager = yield managerTeamMember_1.managerTeamMemberModel.findOne({
                    where: {
                        team_member_id: user.uid,
                    }
                });
                if (!isHighestManager) {
                    throw new Error(constants.MESSAGES.top_level_manager);
                }
                let chatRoomData = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findOne({
                    where: {
                        [Op.or]: [
                            { [Op.and]: [{ user_id: user.uid }, { other_user_id: params.other_user_id }] },
                            { [Op.and]: [{ user_id: params.other_user_id }, { other_user_id: user.uid }] }
                        ],
                        type: constants.CHAT_ROOM_TYPE.employee
                    }
                });
                if (!chatRoomData) {
                    let managerTeamMember = yield managerTeamMember_1.managerTeamMemberModel.findOne({
                        where: {
                            team_member_id: user.uid
                        }
                    });
                    if (params.other_user_id != managerTeamMember.manager_id)
                        throw new Error(constants.MESSAGES.only_manager_or_coach_chat);
                    let chatRoomObj = {
                        user_id: user.uid,
                        other_user_id: params.other_user_id,
                        room_id: yield helperFunction.getUniqueChatRoomId(),
                        info: [
                            {
                                id: user.uid,
                                chatLastDeletedOn: new Date(),
                                isDeleted: false,
                                type: constants.CHAT_USER_TYPE.employee,
                            },
                            {
                                id: parseInt(params.other_user_id),
                                chatLastDeletedOn: new Date(),
                                isDeleted: false,
                                type: constants.CHAT_USER_TYPE.employee,
                            }
                        ]
                    };
                    chatRoomData = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.create(chatRoomObj);
                }
                else {
                    chatRoomData.info = chatRoomData.info.map((info) => {
                        return Object.assign(Object.assign({}, info), { isDeleted: false });
                    });
                    chatRoomData.save();
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
                    chatLastDeletedOn: (_b = chatRoomData.info) === null || _b === void 0 ? void 0 : _b.find(info => (info.id == user.uid && info.type == constants.CHAT_USER_TYPE.employee)).chatLastDeletedOn,
                    createdAt: chatRoomData.createdAt,
                    updatedAt: chatRoomData.updatedAt
                };
                return chatRoomData;
            }
        });
    }
    /*
    * function to handle group chat
    */
    groupChatHandler(manager, currentUser) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const db = admin.firestore();
            let managerGroupChatRoom = yield groupChatRoom_1.groupChatRoomModel.findOne({
                where: {
                    manager_id: parseInt(manager.id),
                }
            });
            let managerTeamMembers = yield helperFunction.convertPromiseToObject(yield managerTeamMember_1.managerTeamMemberModel.findAll({
                attributes: ['team_member_id'],
                where: {
                    manager_id: parseInt(manager.id),
                }
            }));
            if (!managerGroupChatRoom) {
                let info = managerTeamMembers.map(managerTeamMember => managerTeamMember.team_member_id).map((managerTeamMemberId) => {
                    return {
                        id: managerTeamMemberId,
                        chatLastDeletedOn: new Date(),
                        isDeleted: false,
                        type: constants.CHAT_USER_TYPE.employee,
                    };
                });
                info.push({
                    id: parseInt(manager.id),
                    chatLastDeletedOn: new Date(),
                    isDeleted: false,
                    type: constants.CHAT_USER_TYPE.employee,
                });
                let groupChatRoomObj = {
                    manager_id: parseInt(manager.id),
                    member_ids: managerTeamMembers.map(managerTeamMember => managerTeamMember.team_member_id),
                    live_member_ids: managerTeamMembers.map(managerTeamMember => managerTeamMember.team_member_id),
                    room_id: yield helperFunction.getUniqueChatRoomId(),
                    info,
                };
                managerGroupChatRoom = yield helperFunction.convertPromiseToObject(yield groupChatRoom_1.groupChatRoomModel.create(groupChatRoomObj));
                const newDoc = yield db.collection('chats_dev').doc(managerGroupChatRoom.room_id).set({
                    id: groupChatRoomObj.room_id,
                });
                if (!newDoc) {
                    throw new Error(constants.MESSAGES.firebase_firestore_doc_not_created);
                }
            }
            else {
                let teamMemberIds = managerTeamMembers.map(managerTeamMember => managerTeamMember.team_member_id);
                let newMembersInfo = teamMemberIds.filter(id => !managerGroupChatRoom.member_ids.includes(id)).map((managerTeamMemberId) => {
                    return {
                        id: managerTeamMemberId,
                        chatLastDeletedOn: new Date(),
                        isDeleted: false,
                        type: constants.CHAT_USER_TYPE.employee,
                    };
                });
                managerGroupChatRoom.member_ids = teamMemberIds; //[...new Set([...managerGroupChatRoom.member_ids, ...teamMemberIds])];
                managerGroupChatRoom.live_member_ids = teamMemberIds;
                managerGroupChatRoom.info = managerGroupChatRoom.info && [...managerGroupChatRoom.info, ...newMembersInfo];
                managerGroupChatRoom.save();
                managerGroupChatRoom = yield helperFunction.convertPromiseToObject(managerGroupChatRoom);
            }
            let groupMembers = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findAll({
                attributes: ['id', 'name', 'profile_pic_url', 'status', 'is_manager'],
                where: {
                    id: managerGroupChatRoom.member_ids,
                }
            }));
            let groupManager = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                attributes: ['id', 'name', 'profile_pic_url', 'status', 'is_manager'],
                where: {
                    id: managerGroupChatRoom.manager_id,
                }
            }));
            const updateDoc = yield db.collection('chats_dev').doc(managerGroupChatRoom.room_id).set({
                member: [groupManager, ...groupMembers],
            }, { merge: true });
            if (!updateDoc) {
                throw new Error(constants.MESSAGES.firebase_firestore_doc_not_updated);
            }
            return {
                id: managerGroupChatRoom.id,
                room_id: managerGroupChatRoom.room_id,
                group_name: managerGroupChatRoom.name,
                group_icon_url: managerGroupChatRoom.icon_image_url,
                group_members: groupMembers,
                group_manager: groupManager,
                current_user: yield helperFunction.convertPromiseToObject(currentUser),
                status: managerGroupChatRoom.status,
                type: constants.CHAT_ROOM_TYPE.group,
                amIGroupManager: manager.is_manager,
                is_disabled: false,
                info: (_a = managerGroupChatRoom.info) === null || _a === void 0 ? void 0 : _a.find(info => (info.id == currentUser.id && info.type == constants.CHAT_USER_TYPE.employee)),
                createdAt: managerGroupChatRoom.createdAt,
                updatedAt: managerGroupChatRoom.updatedAt
            };
        });
    }
    /*
    * function to get chat  list
    */
    getChatList(user) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let chatRoomDataUser = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findAll({
                where: {
                    user_id: user.uid,
                }
            });
            let chatRoomDataOtherUser = yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findAll({
                where: {
                    other_user_id: user.uid,
                    type: constants.CHAT_ROOM_TYPE.employee
                }
            });
            let chatRoomData = [...chatRoomDataUser, ...chatRoomDataOtherUser];
            let currentUser = yield employee_1.employeeModel.findOne({
                attributes: ['id', 'name', 'profile_pic_url', 'status', 'is_manager'],
                where: {
                    id: user.uid
                }
            });
            let chats = [];
            for (let chat of chatRoomData) {
                let is_disabled = false;
                let id = chat.other_user_id;
                if (chat.other_user_id == user.uid)
                    id = chat.user_id;
                let employee = yield employee_1.employeeModel.findOne({
                    attributes: ['id', 'name', 'profile_pic_url', 'status', 'is_manager'],
                    where: {
                        id
                    }
                });
                let coach = yield coachManagement_1.coachManagementModel.findOne({
                    attributes: ['id', 'name', ['image', 'profile_pic_url']],
                    where: {
                        id,
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
                    if (managerTeamMember_manager && employee.id !== managerTeamMember_manager.manager_id && !(employee_ids.includes(employee.id)))
                        is_disabled = true;
                    if (chat.type == constants.CHAT_ROOM_TYPE.coach && !coach)
                        is_disabled = true;
                    if (chat.type == constants.CHAT_ROOM_TYPE.coach && coach)
                        is_disabled = false;
                    let chatObj = {
                        id: chat.id,
                        room_id: chat.room_id,
                        user: chat.type == constants.CHAT_ROOM_TYPE.coach ? coach : employee,
                        status: chat.status,
                        type: chat.type,
                        is_disabled,
                        info: (_a = chat.info) === null || _a === void 0 ? void 0 : _a.find(info => (info.id == user.uid && info.type == constants.CHAT_USER_TYPE.employee)),
                        createdAt: chat.createdAt,
                        updatedAt: chat.updatedAt
                    };
                    if (!chatObj.info.isDeleted) {
                        chatObj.chatLastDeletedOn = chatObj.info.chatLastDeletedOn;
                        delete chatObj.info;
                        chats.push(chatObj);
                    }
                }
                else {
                    let managerTeamMember = yield managerTeamMember_1.managerTeamMemberModel.findOne({
                        where: {
                            team_member_id: user.uid
                        }
                    });
                    if (managerTeamMember && employee.id !== managerTeamMember.manager_id)
                        is_disabled = true;
                    if (chat.type == constants.CHAT_ROOM_TYPE.coach && !coach)
                        is_disabled = true;
                    if (chat.type == constants.CHAT_ROOM_TYPE.coach && coach)
                        is_disabled = false;
                    let chatObj = {
                        id: chat.id,
                        room_id: chat.room_id,
                        user: chat.type == constants.CHAT_ROOM_TYPE.coach ? coach : employee,
                        status: chat.status,
                        type: chat.type,
                        is_disabled,
                        info: (_b = chat.info) === null || _b === void 0 ? void 0 : _b.find(info => (info.id == user.uid && info.type == constants.CHAT_USER_TYPE.employee)),
                        createdAt: chat.createdAt,
                        updatedAt: chat.updatedAt
                    };
                    if (!chatObj.info.isDeleted) {
                        chatObj.chatLastDeletedOn = chatObj.info.chatLastDeletedOn;
                        delete chatObj.info;
                        chats.push(chatObj);
                    }
                }
            }
            let groupChatIds = [];
            if (currentUser.is_manager) {
                let groupChat = yield this.groupChatHandler({ id: user.uid, is_manager: true, }, currentUser);
                groupChatIds.push(groupChat.id);
                // if(!groupChat?.info?.isDeleted){
                //     groupChat.chatLastDeletedOn=groupChat.info.chatLastDeletedOn;
                //     delete groupChat.info;
                //     chats.push(groupChat)
                // }
                groupChat.chatLastDeletedOn = groupChat.info.chatLastDeletedOn;
                delete groupChat.info;
                chats.push(groupChat);
            }
            let manager = yield helperFunction.convertPromiseToObject(yield managerTeamMember_1.managerTeamMemberModel.findOne({
                attributes: ['manager_id'],
                where: {
                    team_member_id: parseInt(user.uid),
                }
            }));
            if (manager) {
                let groupChat = yield this.groupChatHandler({ id: manager.manager_id, is_manager: false, }, currentUser);
                groupChatIds.push(groupChat.id);
                // if(!groupChat?.info?.isDeleted){
                //     groupChat.chatLastDeletedOn=groupChat.info.chatLastDeletedOn;
                //     delete groupChat.info;
                //     chats.push(groupChat)
                // }
                groupChat.chatLastDeletedOn = groupChat.info.chatLastDeletedOn;
                delete groupChat.info;
                chats.push(groupChat);
            }
            // let groupChatRooms = await helperFunction.convertPromiseToObject(
            //     await groupChatRoomModel.findAll({
            //         where: {
            //             member_ids: {
            //                 [Op.contains]:[parseInt(user.uid)],
            //             }
            //         }
            //     })
            // )
            // for (let groupChatRoom of groupChatRooms) {
            //     if (!groupChatIds.includes(groupChatRoom.id)) {
            //         let groupMembers = await helperFunction.convertPromiseToObject(
            //             await employeeModel.findAll({
            //                 attributes: ['id', 'name', 'profile_pic_url','status', 'is_manager'],
            //                 where: {
            //                     id: groupChatRoom.member_ids,
            //                 }
            //             })
            //         )
            //         let groupManager = await helperFunction.convertPromiseToObject(
            //             await employeeModel.findOne({
            //                 attributes: ['id', 'name', 'profile_pic_url', 'status', 'is_manager'],
            //                 where: {
            //                     id: groupChatRoom.manager_id,
            //                 }
            //             })
            //         )
            //         chats.push({
            //             id: groupChatRoom.id,
            //             room_id: groupChatRoom.room_id,
            //             group_name: groupChatRoom.name,
            //             group_icon_url: groupChatRoom.icon_image_url,
            //             group_members: groupMembers,
            //             group_manager: groupManager,
            //             current_user: await helperFunction.convertPromiseToObject(currentUser),
            //             status: groupChatRoom.status,
            //             type: constants.CHAT_ROOM_TYPE.group,
            //             amIGroupManager: false,
            //             is_disabled: true,
            //             createdAt: groupChatRoom.createdAt,
            //             updatedAt: groupChatRoom.updatedAt
            //         })
            //     }
            // }
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
            let groupChatRoomData = null;
            if (!chatRoomData) {
                groupChatRoomData = yield helperFunction.convertPromiseToObject(yield groupChatRoom_1.groupChatRoomModel.findOne({
                    where: {
                        room_id: params.chat_room_id,
                    }
                }));
                if (!groupChatRoomData)
                    throw new Error(constants.MESSAGES.chat_room_notFound);
            }
            let recieverId = null;
            if (chatRoomData) {
                recieverId = user.uid == chatRoomData.other_user_id ? chatRoomData.user_id : chatRoomData.other_user_id;
            }
            let recieverEmployeeData = yield employee_1.employeeModel.findOne({
                where: { id: recieverId, }
            });
            if (chatRoomData && chatRoomData.type == constants.CHAT_ROOM_TYPE.coach) {
                recieverEmployeeData = yield coachManagement_1.coachManagementModel.findOne({
                    where: { id: recieverId, }
                });
            }
            chatRoomData = yield helperFunction.convertPromiseToObject(chatRoomData);
            if (chatRoomData === null || chatRoomData === void 0 ? void 0 : chatRoomData.info) {
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
            let senderEmployeeData = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                where: { id: user.uid, }
            }));
            delete senderEmployeeData.password;
            let newNotification = null;
            if (params.chat_type == 'text') {
                if (groupChatRoomData) {
                    let recieverEmployees = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findAll({
                        where: { id: [...groupChatRoomData.live_member_ids, groupChatRoomData.manager_id], }
                    }));
                    yield groupChatRoom_1.groupChatRoomModel.update({
                        info: groupChatRoomData.info.map((info) => {
                            return Object.assign(Object.assign({}, info), { isDeleted: false });
                        })
                    }, {
                        where: {
                            room_id: params.chat_room_id,
                        }
                    });
                    for (let recieverEmployee of recieverEmployees) {
                        if (senderEmployeeData.id != recieverEmployee.id) {
                            //add notification 
                            let notificationObj = {
                                type_id: params.chat_room_id,
                                sender_id: user.uid,
                                reciever_id: recieverEmployee.id,
                                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                                type: constants.NOTIFICATION_TYPE.group_chat,
                                data: {
                                    type: constants.NOTIFICATION_TYPE.group_chat,
                                    title: 'Message',
                                    message: params.message || `Message from ${senderEmployeeData.name}`,
                                    chat_room_id: params.chat_room_id,
                                    group_name: groupChatRoomData.name,
                                    senderEmployeeData
                                },
                            };
                            newNotification = yield notification_1.notificationModel.create(notificationObj);
                            //send push notification
                            let notificationData = {
                                title: 'Message',
                                body: `Message from ${senderEmployeeData.name}`,
                                data: {
                                    type: constants.NOTIFICATION_TYPE.group_chat,
                                    title: 'Message',
                                    message: params.message || `Message from ${senderEmployeeData.name}`,
                                    chat_room_id: params.chat_room_id,
                                    group_name: groupChatRoomData.name,
                                    senderEmployeeData
                                },
                            };
                            yield helperFunction.sendFcmNotification([recieverEmployee.device_token], notificationData);
                        }
                    }
                }
                else {
                    //add notification 
                    let notificationObj = {
                        type_id: params.chat_room_id,
                        sender_id: user.uid,
                        reciever_id: recieverId,
                        reciever_type: chatRoomData.type == constants.CHAT_ROOM_TYPE.coach ? constants.NOTIFICATION_RECIEVER_TYPE.coach : constants.NOTIFICATION_RECIEVER_TYPE.employee,
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
            }
            else if (params.chat_type == 'audio') {
                //add notification 
                let notificationObj = {
                    type_id: params.chat_room_id,
                    sender_id: user.uid,
                    reciever_id: recieverId,
                    reciever_type: chatRoomData.type == constants.CHAT_ROOM_TYPE.coach ? constants.NOTIFICATION_RECIEVER_TYPE.coach : constants.NOTIFICATION_RECIEVER_TYPE.employee,
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
                    reciever_type: chatRoomData.type == constants.CHAT_ROOM_TYPE.coach ? constants.NOTIFICATION_RECIEVER_TYPE.coach : constants.NOTIFICATION_RECIEVER_TYPE.employee,
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
            if (chatRoomData.type == constants.CHAT_ROOM_TYPE.coach) {
                recieverEmployeeData = yield coachManagement_1.coachManagementModel.findOne({
                    where: { id: recieverId, }
                });
            }
            let senderEmployeeData = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
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
                        reciever_type: chatRoomData.type == constants.CHAT_ROOM_TYPE.coach ? constants.NOTIFICATION_RECIEVER_TYPE.coach : constants.NOTIFICATION_RECIEVER_TYPE.employee,
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
                        reciever_type: chatRoomData.type == constants.CHAT_ROOM_TYPE.coach ? constants.NOTIFICATION_RECIEVER_TYPE.coach : constants.NOTIFICATION_RECIEVER_TYPE.employee,
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
    * function to clear Chat
    */
    clearChat(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let chatRoomData = yield helperFunction.convertPromiseToObject(yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.findOne({
                where: {
                    room_id: params.chat_room_id,
                }
            }));
            let groupChatRoomData = null;
            if (!chatRoomData) {
                groupChatRoomData = yield helperFunction.convertPromiseToObject(yield groupChatRoom_1.groupChatRoomModel.findOne({
                    where: {
                        room_id: params.chat_room_id,
                    }
                }));
                if (groupChatRoomData.info) {
                    yield groupChatRoom_1.groupChatRoomModel.update({
                        info: groupChatRoomData.info.map((info) => {
                            if (info.id == user.uid && info.type == constants.CHAT_USER_TYPE.employee) {
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
            }
            else {
                if (chatRoomData.info) {
                    yield chatRelationMappingInRoom_1.chatRealtionMappingInRoomModel.update({
                        info: chatRoomData.info.map((info) => {
                            if (info.id == user.uid && info.type == constants.CHAT_USER_TYPE.employee) {
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
            }
            return true;
        });
    }
}
exports.ChatServices = ChatServices;
//# sourceMappingURL=chatServices.js.map