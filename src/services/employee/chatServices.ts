import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import { teamGoalModel } from  "../../models/teamGoal"
import { teamGoalAssignModel } from  "../../models/teamGoalAssign"
import { chatRealtionMappingInRoomModel } from  "../../models/chatRelationMappingInRoom";
import { qualitativeMeasurementCommentModel } from "../../models/qualitativeMeasurementComment";
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

         return employeeGoalData.concat(getQuantitativeData);
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

        if (chatRoomData) {
            return chatRoomData;
        } else {
            let chatRoomObj = <any> {
                user_id: user.uid,
                other_user_id: params.other_user_id,
                room_id: await helperFunction.randomStringEightDigit()
            }

            return await chatRealtionMappingInRoomModel.create(chatRoomObj);
        }
        
    }



}