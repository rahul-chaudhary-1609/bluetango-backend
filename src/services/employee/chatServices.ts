import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import { teamGoalModel } from  "../../models/teamGoal"
import { teamGoalAssignModel } from  "../../models/teamGoalAssign"
import { chatRealtionMappingInRoomModel } from  "../../models/chatRelationMappingInRoom";
import { groupChatRoomModel } from  "../../models/groupChatRoom";
import { qualitativeMeasurementCommentModel } from "../../models/qualitativeMeasurementComment";
import { employeeModel } from "../../models/employee";
import { managerTeamMemberModel } from "../../models/managerTeamMember";
import { notificationModel } from "../../models/notification";
import { coachManagementModel } from "../../models/coachManagement";
import { attributeModel } from "../../models/attributes";
import * as admin from "firebase-admin";
import e from "express";
const Sequelize = require('sequelize');
const OpenTok = require("opentok");
const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET_KEY, { timeout: 30000 });
var Op = Sequelize.Op;


const serviceAccount = require('../../../bluetango3-77c2f-firebase-adminsdk-kfu3h-18ee9f4654.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


export class ChatServices {
    constructor() { }

    /*
    * function to get chat popup list as employee
    */
    public async getChatPopUpListAsEmployee(user: any) {

        teamGoalAssignModel.hasOne(teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" })
        let employeeGoalData = await teamGoalAssignModel.findAll({
            where: {
                employee_id: user.uid
            },
            attributes: ['id'],
            include: [
                {
                    model: teamGoalModel,
                    required: false,
                    attributes: ['id', 'title']
                }
            ]
        });

        // let getQuantitativeData = await qualitativeMeasurementCommentModel.findAll({
        //     where:{status:constants.STATUS.active}
        // });

        let attribute=await attributeModel.findAll({
            where:{
                employer_id:user.current_employer_id,
                status:constants.STATUS.active,                
            },
            order: [["createdAt", "DESC"]]
        })

        // let formatEmployeeGoalData = employeeGoalData.map((val: any) => {
        //     console.log("val",val)
        //     return {
        //         id: val.id,
        //         label:val.team_goal,
        //     }
        // })

        return employeeGoalData.concat(attribute);
    }

    /*
    * function to get chat room id
    */
    public async getChatRoomId(params: any, user: any) {
        
        if (user.uid == params.other_user_id) {
            throw new Error(constants.MESSAGES.self_chat);
        }

        let isHighestManager = await managerTeamMemberModel.findOne({
            where: {
                team_member_id: user.uid,
            }
        })

        if(!isHighestManager){
            throw new Error(constants.MESSAGES.top_level_manager);
        }

        if (params.type && params.type == constants.CHAT_ROOM_TYPE.coach) {
            let chatRoomData = await chatRealtionMappingInRoomModel.findOne({
                where: {
                    [Op.or]: [
                        { [Op.and]: [{ user_id: user.uid }, { other_user_id: params.other_user_id }] },
                        { [Op.and]: [{ user_id: params.other_user_id }, { other_user_id: user.uid }] }
                    ],
                    type: constants.CHAT_ROOM_TYPE.coach
                }
            });


            let coach = await coachManagementModel.findOne({
                attributes: ['id', 'name', ['image', 'profile_pic_url']],
                where: {
                    id: parseInt(params.other_user_id),
                }
            });

            if (!chatRoomData) {
                

                if (!coach) throw new Error(constants.MESSAGES.only_manager_or_coach_chat);

                let chatRoomObj = <any>{
                    user_id: user.uid,
                    other_user_id: params.other_user_id,
                    room_id: await helperFunction.getUniqueChatRoomId(), //await helperFunction.randomStringEightDigit(),
                    type: constants.CHAT_ROOM_TYPE.coach,
                    info:[
                        {
                            id:user.uid,
                            chatLastDeletedOn:new Date(),
                            isDeleted:false,
                            type:constants.CHAT_USER_TYPE.employee
                        },
                        {
                            id:parseInt(params.other_user_id),
                            chatLastDeletedOn:new Date(),
                            isDeleted:false,
                            type:constants.CHAT_USER_TYPE.coach
                        }
                    ]
                }
                chatRoomData = await chatRealtionMappingInRoomModel.create(chatRoomObj);
            }else{
                chatRoomData.info=chatRoomData.info.map((info)=>{
                    return{
                        ...info,
                        isDeleted:false,
                    }
                });

                chatRoomData.save();
            }

            
            let users = await employeeModel.findAll({
                attributes: ['id', 'name', 'profile_pic_url'],
                where: {
                    id: user.uid
                }
            });

            chatRoomData = <any>{
                id: chatRoomData.id,
                user: users,
                other_user: coach,
                room_id: chatRoomData.room_id,
                status: chatRoomData.status,
                chatLastDeletedOn:chatRoomData.info?.find(info=>(info.id==user.uid && info.type==constants.CHAT_USER_TYPE.employee)).chatLastDeletedOn,
                createdAt: chatRoomData.createdAt,
                updatedAt: chatRoomData.updatedAt

            }
         

            
            return chatRoomData;
        }
        else {
            let chatRoomData = await chatRealtionMappingInRoomModel.findOne({
                where: {
                    [Op.or]: [
                        { [Op.and]: [{ user_id: user.uid }, { other_user_id: params.other_user_id }] },
                        { [Op.and]: [{ user_id: params.other_user_id }, { other_user_id: user.uid }] }
                    ],
                    type: constants.CHAT_ROOM_TYPE.employee
                }
            });


            if (!chatRoomData) {
                let managerTeamMember = await managerTeamMemberModel.findOne({
                    where: {
                        team_member_id: user.uid
                    }
                });

                if (params.other_user_id != managerTeamMember.manager_id) throw new Error(constants.MESSAGES.only_manager_or_coach_chat);

                let chatRoomObj = <any>{
                    user_id: user.uid,
                    other_user_id: params.other_user_id,
                    room_id: await helperFunction.getUniqueChatRoomId(),//await helperFunction.randomStringEightDigit(),
                    info:[
                        {
                            id:user.uid,
                            chatLastDeletedOn:new Date(),
                            isDeleted:false,
                            type:constants.CHAT_USER_TYPE.employee,
                        },
                        {
                            id:parseInt(params.other_user_id),
                            chatLastDeletedOn:new Date(),
                            isDeleted:false,
                            type:constants.CHAT_USER_TYPE.employee,
                        }
                    ]
                }
                chatRoomData = await chatRealtionMappingInRoomModel.create(chatRoomObj);
            }else{
                chatRoomData.info=chatRoomData.info.map((info)=>{
                    return{
                        ...info,
                        isDeleted:false,
                    }
                });

                chatRoomData.save();
            }

            let users = await employeeModel.findAll({
                attributes: ['id', 'name', 'profile_pic_url'],
                where: {
                    id: [user.uid, params.other_user_id]
                }
            });

            chatRoomData = <any>{
                id: chatRoomData.id,
                user: users.find((val: any) => val.id == user.uid),
                other_user: users.find((val: any) => val.id == params.other_user_id),
                room_id: chatRoomData.room_id,
                status: chatRoomData.status,
                chatLastDeletedOn:chatRoomData.info?.find(info=>(info.id==user.uid && info.type==constants.CHAT_USER_TYPE.employee)).chatLastDeletedOn,
                createdAt: chatRoomData.createdAt,
                updatedAt: chatRoomData.updatedAt

            }

            return chatRoomData;

        }

        
    }

    /*
    * function to handle group chat
    */
    public async groupChatHandler(manager: any, currentUser: any) {

        const db = admin.firestore();
      
        let managerGroupChatRoom = await groupChatRoomModel.findOne({
            where: {
                manager_id: parseInt(manager.id),
            }
        });

        let managerTeamMembers = await helperFunction.convertPromiseToObject(
            await managerTeamMemberModel.findAll({
                attributes: ['team_member_id'],
                where: {
                    manager_id: parseInt(manager.id),
                }
            })
        );

        if (!managerGroupChatRoom) {

            let info=managerTeamMembers.map(managerTeamMember => managerTeamMember.team_member_id).map((managerTeamMemberId)=>{
                return {
                    id:managerTeamMemberId,
                    chatLastDeletedOn:new Date(),
                    isDeleted:false,
                    type:constants.CHAT_USER_TYPE.employee,
                }
            });

            info.push({
                id:parseInt(manager.id),
                chatLastDeletedOn:new Date(),
                isDeleted:false,
                type:constants.CHAT_USER_TYPE.employee,
            })
            
            let groupChatRoomObj = <any>{
                manager_id: parseInt(manager.id),
                member_ids: managerTeamMembers.map(managerTeamMember => managerTeamMember.team_member_id),
                live_member_ids: managerTeamMembers.map(managerTeamMember => managerTeamMember.team_member_id),
                room_id: await helperFunction.getUniqueChatRoomId(), //await helperFunction.randomStringEightDigit(),
                info,
            };

            managerGroupChatRoom = await helperFunction.convertPromiseToObject(
                await groupChatRoomModel.create(groupChatRoomObj)
            );

            const newDoc = await db.collection('chats_dev').doc(managerGroupChatRoom.room_id).set(
                {
                    id: groupChatRoomObj.room_id,
                }
            )

            if (!newDoc) {
                throw new Error(constants.MESSAGES.firebase_firestore_doc_not_created)
            }

           
        }
        else {
            
            let teamMemberIds = managerTeamMembers.map(managerTeamMember => managerTeamMember.team_member_id);
            let newMembersInfo=teamMemberIds.filter(id=>!managerGroupChatRoom.member_ids.includes(id)).map((managerTeamMemberId)=>{
                return {
                    id:managerTeamMemberId,
                    chatLastDeletedOn:new Date(),
                    isDeleted:false,
                    type:constants.CHAT_USER_TYPE.employee,
                }
            });
            
            managerGroupChatRoom.member_ids = teamMemberIds;//[...new Set([...managerGroupChatRoom.member_ids, ...teamMemberIds])];
            managerGroupChatRoom.live_member_ids = teamMemberIds;
            managerGroupChatRoom.info=managerGroupChatRoom.info && [...managerGroupChatRoom.info,...newMembersInfo]
            managerGroupChatRoom.save();
            managerGroupChatRoom = await helperFunction.convertPromiseToObject(managerGroupChatRoom);
        }

        let groupMembers = await helperFunction.convertPromiseToObject(
            await employeeModel.findAll({
                attributes: ['id', 'name', 'profile_pic_url', 'status','is_manager'],
                where: {
                    id: managerGroupChatRoom.member_ids,
                }
            })
        )

        let groupManager = await helperFunction.convertPromiseToObject(
            await employeeModel.findOne({
                attributes: ['id', 'name', 'profile_pic_url', 'status', 'is_manager'],
                where: {
                    id: managerGroupChatRoom.manager_id,
                }
            })
        )

        const updateDoc = await db.collection('chats_dev').doc(managerGroupChatRoom.room_id).set(
            {
                member: [groupManager, ...groupMembers],
            },
            { merge: true }
        )

        if (!updateDoc) {
            throw new Error(constants.MESSAGES.firebase_firestore_doc_not_updated)
        }

        

        return <any>{
            id: managerGroupChatRoom.id,
            room_id: managerGroupChatRoom.room_id,
            group_name: managerGroupChatRoom.name,
            group_icon_url: managerGroupChatRoom.icon_image_url,
            group_members: groupMembers,
            group_manager: groupManager,
            current_user: await helperFunction.convertPromiseToObject(currentUser),
            status: managerGroupChatRoom.status,
            type: constants.CHAT_ROOM_TYPE.group,
            amIGroupManager: manager.is_manager,
            is_disabled: false,
            info:managerGroupChatRoom.info?.find(info=>(info.id==currentUser.id && info.type==constants.CHAT_USER_TYPE.employee)),
            createdAt: managerGroupChatRoom.createdAt,
            updatedAt: managerGroupChatRoom.updatedAt
        }
        

    }

    /*
    * function to get chat  list
    */
    public async getChatList(user: any) {

        let chatRoomDataUser = await chatRealtionMappingInRoomModel.findAll({
            where: {
                user_id: user.uid,
            }
        });

        let chatRoomDataOtherUser = await chatRealtionMappingInRoomModel.findAll({
            where: {
                other_user_id: user.uid,
                type: constants.CHAT_ROOM_TYPE.employee
            }
        });

        let chatRoomData = [...chatRoomDataUser, ...chatRoomDataOtherUser]

        let currentUser = await employeeModel.findOne({
            attributes: ['id', 'name', 'profile_pic_url', 'status', 'is_manager'],
            where: {
                id: user.uid
            }
        });

        let chats = [];

        for (let chat of chatRoomData) {
            let is_disabled = false;
            let id = chat.other_user_id;
            if (chat.other_user_id == user.uid) id = chat.user_id;
            let employee = await employeeModel.findOne({
                attributes: ['id', 'name', 'profile_pic_url', 'status', 'is_manager'],
                where: {
                    id
                }
            });


            let coach = await coachManagementModel.findOne({
                attributes: ['id', 'name', ['image', 'profile_pic_url']],
                where: {
                    id,
                    //status: constants.STATUS.active,
                }
            });

            
            if (currentUser.is_manager) {

                let managerTeamMember_manager = await managerTeamMemberModel.findOne({
                    where: {
                        team_member_id: user.uid
                    }
                });

                let managerTeamMember_employee = await managerTeamMemberModel.findAll({
                    where: {
                        manager_id: user.uid
                    }
                });

                let employee_ids = managerTeamMember_employee.map((val: any) => {
                    return val.team_member_id
                })

                if (managerTeamMember_manager && employee.id !== managerTeamMember_manager.manager_id && !(employee_ids.includes(employee.id))) is_disabled = true;

                if (chat.type == constants.CHAT_ROOM_TYPE.coach && !coach) is_disabled = true;
                if (chat.type == constants.CHAT_ROOM_TYPE.coach && coach) is_disabled = false;

                let chatObj=<any>{
                    id: chat.id,
                    room_id: chat.room_id,
                    user: chat.type == constants.CHAT_ROOM_TYPE.coach ? coach : employee,
                    status: chat.status,
                    type: chat.type,
                    is_disabled,
                    info:chat.info?.find(info=>(info.id==user.uid && info.type==constants.CHAT_USER_TYPE.employee)),
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt
                }
                
                if(!chatObj.info.isDeleted){
                    chatObj.chatLastDeletedOn=chatObj.info.chatLastDeletedOn;
                    delete chatObj.info;
                    chats.push(chatObj)
                }
            }
            else {

                let managerTeamMember = await managerTeamMemberModel.findOne({
                    where: {
                        team_member_id: user.uid
                    }
                });

                

                if (managerTeamMember && employee.id !== managerTeamMember.manager_id) is_disabled = true;
                
                if (chat.type == constants.CHAT_ROOM_TYPE.coach && !coach) is_disabled = true;
                if (chat.type == constants.CHAT_ROOM_TYPE.coach && coach) is_disabled = false;

                let chatObj=<any>{
                    id: chat.id,
                    room_id: chat.room_id,
                    user: chat.type == constants.CHAT_ROOM_TYPE.coach ? coach : employee,
                    status: chat.status,
                    type: chat.type,
                    is_disabled,
                    info:chat.info?.find(info=>(info.id==user.uid && info.type==constants.CHAT_USER_TYPE.employee)),
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt
                }

                if(!chatObj.info.isDeleted){
                    chatObj.chatLastDeletedOn=chatObj.info.chatLastDeletedOn;
                    delete chatObj.info;
                    chats.push(chatObj)
                }
            }

        }

        let groupChatIds = [];

        if (currentUser.is_manager) {
            let groupChat = await this.groupChatHandler({ id: user.uid, is_manager: true, }, currentUser );
            groupChatIds.push(groupChat.id)
            // if(!groupChat?.info?.isDeleted){
            //     groupChat.chatLastDeletedOn=groupChat.info.chatLastDeletedOn;
            //     delete groupChat.info;
            //     chats.push(groupChat)
            // }
            groupChat.chatLastDeletedOn=groupChat.info.chatLastDeletedOn;
            delete groupChat.info;
            chats.push(groupChat)
        }

        let manager = await helperFunction.convertPromiseToObject(
            await managerTeamMemberModel.findOne({
                attributes: ['manager_id'],
                where: {
                    team_member_id: parseInt(user.uid),
                }
            })
        );

        if (manager) {
            let groupChat = await this.groupChatHandler({ id: manager.manager_id, is_manager: false, }, currentUser )
            groupChatIds.push(groupChat.id)
            // if(!groupChat?.info?.isDeleted){
            //     groupChat.chatLastDeletedOn=groupChat.info.chatLastDeletedOn;
            //     delete groupChat.info;
            //     chats.push(groupChat)
            // }
            groupChat.chatLastDeletedOn=groupChat.info.chatLastDeletedOn;
            delete groupChat.info;
            chats.push(groupChat)
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

        let groupChatRoomData = null;
        if (!chatRoomData) {
            groupChatRoomData = await helperFunction.convertPromiseToObject( await groupChatRoomModel.findOne({
                    where: {
                        room_id: params.chat_room_id,
                    }
                })
            )

            if (!groupChatRoomData) throw new Error(constants.MESSAGES.chat_room_notFound);
        }

        let recieverId = null;

        if (chatRoomData) {

            recieverId = user.uid == chatRoomData.other_user_id ? chatRoomData.user_id : chatRoomData.other_user_id;
        }

        let recieverEmployeeData = await employeeModel.findOne({
            where: { id: recieverId, }
        })

        if (chatRoomData && chatRoomData.type == constants.CHAT_ROOM_TYPE.coach) {
            recieverEmployeeData = await coachManagementModel.findOne({
                where: { id: recieverId, }
            })
        }

        chatRoomData=await helperFunction.convertPromiseToObject(chatRoomData);

        if(chatRoomData?.info){

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

        let senderEmployeeData = await helperFunction.convertPromiseToObject(await employeeModel.findOne({
            where: { id: user.uid, }
        }))

        delete senderEmployeeData.password

        let newNotification = null;

        if (params.chat_type == 'text') {
            if (groupChatRoomData) {

                let recieverEmployees = await helperFunction.convertPromiseToObject( await employeeModel.findAll({
                        where: { id: [...groupChatRoomData.live_member_ids,groupChatRoomData.manager_id], }
                    })
                )
                await groupChatRoomModel.update({
                    info:groupChatRoomData.info.map((info)=>{
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
                
                for (let recieverEmployee of recieverEmployees) {
                    if (senderEmployeeData.id != recieverEmployee.id) {
                        //add notification 
                        let notificationObj = <any>{
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
                        }
                        newNotification = await notificationModel.create(notificationObj);

                        //send push notification
                        let notificationData = <any>{
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
                        }
                        await helperFunction.sendFcmNotification([recieverEmployee.device_token], notificationData);
                    }
                }
            }
            else {
                //add notification 
                let notificationObj = <any>{
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
        }
        else if (params.chat_type == 'audio') {
            //add notification 
            let notificationObj = <any>{
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

        if (chatRoomData.type == constants.CHAT_ROOM_TYPE.coach) {
            recieverEmployeeData = await coachManagementModel.findOne({
                where: { id: recieverId, }
            })
        }

        let senderEmployeeData = await helperFunction.convertPromiseToObject(await employeeModel.findOne({
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

        let groupChatRoomData = null;
        if (!chatRoomData) {
            groupChatRoomData = await helperFunction.convertPromiseToObject( await groupChatRoomModel.findOne({
                    where: {
                        room_id: params.chat_room_id,
                    }
                })
            )

            if(groupChatRoomData.info){
                await groupChatRoomModel.update({
                    info:groupChatRoomData.info.map((info)=>{
                        if(info.id==user.uid && info.type==constants.CHAT_USER_TYPE.employee){
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
        }else{

            if(chatRoomData.info){
                await chatRealtionMappingInRoomModel.update({
                    info:chatRoomData.info.map((info)=>{
                        if(info.id==user.uid && info.type==constants.CHAT_USER_TYPE.employee){
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
            
        }

        return true;
    }


}
