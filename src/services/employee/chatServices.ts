import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import { teamGoalModel } from  "../../models/teamGoal"
import { teamGoalAssignModel } from  "../../models/teamGoalAssign"
import { chatRealtionMappingInRoomModel } from  "../../models/chatRelationMappingInRoom";
import { qualitativeMeasurementCommentModel } from "../../models/qualitativeMeasurementComment";
import { employeeModel } from "../../models/employee";
const Sequelize = require('sequelize');
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
                    attributes: ['title']
                }
            ]
        });

        let getQuantitativeData = await qualitativeMeasurementCommentModel.findAll();

        let formatEmployeeGoalData = employeeGoalData.map((val: any) => {
            return {
                id: val.id,
                name:val.team_goal.title,
            }
        })

        return formatEmployeeGoalData.concat(getQuantitativeData);
    }

    /*
    * function to get chat room id
    */
    public async getChatRoomId( params: any, user: any) {

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
            let chatRoomObj = <any>{
                user_id: user.uid,
                other_user_id: params.other_user_id,
                room_id: await helperFunction.randomStringEightDigit()
            }
            chatRoomData = await chatRealtionMappingInRoomModel.create(chatRoomObj);
        }

        let users = await employeeModel.findAll({
            attributes: ['id','profile_pic_url'],
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
            let id = chat.other_user_id;
            if (chat.other_user_id == user.uid) id = chat.user_id;
            let employee = await employeeModel.findOne({
                attributes: ['id','name','profile_pic_url'],
                where: {
                    id
                }
            });

            chats.push({
                id:chat.id,
                room_id: chat.room_id,
                user: employee,
                status: chat.status,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt
            })

        }

        return chats;
    }


}