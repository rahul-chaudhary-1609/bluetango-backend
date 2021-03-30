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

            let currentUser = await employeeModel.findOne({
                attributes: ['id', 'name', 'profile_pic_url', 'is_manager'],
                where: {
                    id:user.uid
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

                if (employee.id !== managerTeamMember_manager.manager_id && !(employee_ids.includes(employee.id))) is_disabled = true;

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

                

                if (employee.id!==managerTeamMember.manager_id) is_disabled=true;

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
                    video_chat_session_id:session.sessionId
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
    public async getVideoChatSessionIdandToken(params: any, user: any) {

        let chatRoomData = await chatRealtionMappingInRoomModel.findOne({
            where: {
                room_id: params.chat_room_id,
            }
        });

        if (!chatRoomData) throw new Error(constants.MESSAGES.chat_room_notFound);

        const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET_KEY, { timeout: 30000 });

        let token = opentok.generateToken(chatRoomData.video_chat_session_id, {
            role: "moderator",
            expireTime: new Date().getTime() / 1000 + 60 * 60, // in one hour
            data: `userId=${user.uid}`,
            initialLayoutClassList: ["focus"],
        });


        return { sessionId: chatRoomData.video_chat_session_id, token }

    }


}