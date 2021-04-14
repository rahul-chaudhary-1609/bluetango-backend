import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import { teamGoalModel } from  "../../models/teamGoal"
import { teamGoalAssignModel } from  "../../models/teamGoalAssign"
import { chatRealtionMappingInRoomModel } from  "../../models/chatRelationMappingInRoom";
import { qualitativeMeasurementCommentModel } from "../../models/qualitativeMeasurementComment";
import { employeeModel } from "../../models/employee";
import { managerTeamMemberModel } from "../../models/managerTeamMember";
import { notificationModel } from "../../models/notification";
const Sequelize = require('sequelize');
const OpenTok = require("opentok");
var Op = Sequelize.Op;

export class ChatServices {
    constructor() { }

    /*
    * function to get chat popup list as employee
    */
    public async getChatPopUpListAsEmployee( user: any) {

        teamGoalAssignModel.hasOne(teamGoalModel,{foreignKey: "id", sourceKey: "goal_id", targetKey: "id"})
        let employeeGoalData = await teamGoalAssignModel.findAll({
            where: {
                employee_id: user.uid
            },
            attributes:['id'],
            include:[
                {
                    model: teamGoalModel,
                    required: false,
                    attributes: ['id','title']
                }
            ]
        });

        let getQuantitativeData = await qualitativeMeasurementCommentModel.findAll();

        // let formatEmployeeGoalData = employeeGoalData.map((val: any) => {
        //     console.log("val",val)
        //     return {
        //         id: val.id,
        //         label:val.team_goal,
        //     }
        // })

        return employeeGoalData.concat(getQuantitativeData);
    }

    /*
    * function to get chat room id
    */
    public async getChatRoomId(params: any, user: any) {
        
        if (user.uid == params.other_user_id) {
            throw new Error(constants.MESSAGES.self_chat);
        }

        

        let chatRoomData = await chatRealtionMappingInRoomModel.findOne({
            where: {
                [Op.or]:[
                    { [Op.and]: [ { user_id: user.uid}, { other_user_id: params.other_user_id}]  },
                    { [Op.and]: [ { user_id: params.other_user_id}, { other_user_id: user.uid }]  }
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
            let managerTeamMember = await managerTeamMemberModel.findOne({
                where: {
                    team_member_id: user.uid
                }
            });

            if (params.other_user_id != managerTeamMember.manager_id) throw new Error(constants.MESSAGES.only_manager_chat);
            
            let chatRoomObj = <any>{
                user_id: user.uid,
                other_user_id: params.other_user_id,
                room_id: await helperFunction.randomStringEightDigit()
            }
            chatRoomData = await chatRealtionMappingInRoomModel.create(chatRoomObj);
        }

        let users = await employeeModel.findAll({
            attributes: ['id','name','profile_pic_url'],
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
            createdAt: chatRoomData.createdAt,
            updatedAt: chatRoomData.updatedAt
            
        }

        return chatRoomData;
        
    }

    /*
    * function to get chat  list
    */
    public async getChatList(user: any) {

        let chatRoomData = await chatRealtionMappingInRoomModel.findAll({
            where: {
                [Op.or]: [
                    {  user_id: user.uid },
                    { other_user_id: user.uid }
                ]
            }
        });

        let currentUser = await employeeModel.findOne({
            attributes: ['id', 'name', 'profile_pic_url', 'is_manager'],
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
                attributes: ['id','name','profile_pic_url','is_manager'],
                where: {
                    id
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

                chats.push({
                    id: chat.id,
                    room_id: chat.room_id,
                    user: employee,
                    status: chat.status,
                    is_disabled,
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt
                })
            }
            else {

                let managerTeamMember = await managerTeamMemberModel.findOne({
                    where: {
                        team_member_id:user.uid
                    }
                });

                

                if (managerTeamMember && employee.id!==managerTeamMember.manager_id) is_disabled=true;

                chats.push({
                    id: chat.id,
                    room_id: chat.room_id,
                    user: employee,
                    status: chat.status,
                    is_disabled,
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt
                })
            }

        }

        return chats;
    }

    /*
   * function to create video chat session
   */
    public async createChatSession(params: any, user: any) {
        
        let chatRoomData = await chatRealtionMappingInRoomModel.findOne({
            where: {
                room_id:params.chat_room_id,
            }
        });

        if (!chatRoomData) throw new Error(constants.MESSAGES.chat_room_notFound);

        const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET_KEY, { timeout: 30000 });

        opentok.createSession(async (err:any, session:any)=> {
            if (err) throw new Error(constants.MESSAGES.video_chat_session_create_error);

            // save the sessionId
            await chatRealtionMappingInRoomModel.update(
                {
                    chat_session_id:session.sessionId
                },
                {
                    where: {
                        room_id: params.chat_room_id,
                    },
                    returning:true,
                }
            )
        });

        return constants.MESSAGES.video_chat_session_created

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

        const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET_KEY, { timeout: 30000 });

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
            chat_session_id:null,
        },{
            where: {
                room_id: params.chat_room_id,
            },
            returning:true,
        });


        return chatRoomData

    }

    /*
  * function to create video chat session
  */
    public async checkChatSession(params: any, user: any) {

        let chatRoomData = await helperFunction.convertPromiseToObject( await chatRealtionMappingInRoomModel.findOne({
            where: {
                room_id: params.chat_room_id,
            }
        }));

        let isSessionExist = false;

        if (chatRoomData.chat_session_id) isSessionExist=true


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

        let senderEmployeeData = await helperFunction.convertPromiseToObject( await employeeModel.findOne({
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
                type: constants.NOTIFICATION_TYPE.message
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
                    chat_room_id:params.chat_room_id,
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
                type: constants.NOTIFICATION_TYPE.audio_chat
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
                type: constants.NOTIFICATION_TYPE.video_chat
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

        let senderEmployeeData = await helperFunction.convertPromiseToObject(await employeeModel.findOne({
            where: { id: user.uid, }
        }))

        delete senderEmployeeData.password

        let notificationData = null;

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
                        sessionId: params.session_id ||null,
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

        return notificationData

    }


}