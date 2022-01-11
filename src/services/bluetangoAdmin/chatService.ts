import _ from "lodash";
import * as constants from "../../constants";
import * as helperFunction from "../../utils/helperFunction";
import { bluetangoChatRoomModel } from  "../../models/bluetangoChatRoom";
import { coachManagementModel } from "../../models/coachManagement";
import * as queryService from '../../queryService/bluetangoAdmin/queryService';
import { bluetangoAdminModel } from "../../models/bluetangoAdmin";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;




export class ChatServices {
    constructor() { }

    /*
    * function to get chat room id
    */
    public async getChatRoomId(params: any, user: any) {

        let query:any={
            where: {
                [Op.or]: [
                    { [Op.and]: [{ user_id: user.uid }, { other_user_id: params.other_user_id }] },
                    { [Op.and]: [{ user_id: params.other_user_id }, { other_user_id: user.uid }] }
                ],
            }
        }


        let chatRoomData = await queryService.selectOne(bluetangoChatRoomModel,query);


        let coach = await queryService.selectOne(coachManagementModel,{
            attributes: ['id', 'name', ['image', 'profile_pic_url']],
            where: {
                id: parseInt(params.other_user_id),
                app_id:constants.COACH_APP_ID.BT,
            }
        });

        if (!chatRoomData) {
            

            if (!coach) throw new Error(constants.MESSAGES.no_coach);

            let chatRoomObj = <any>{
                user_id: user.uid,
                other_user_id: params.other_user_id,
                room_id: await helperFunction.getUniqueBluetangoChatRoomId(), //await helperFunction.randomStringEightDigit(),
                info:[
                    {
                        id:user.uid,
                        chatLastDeletedOn:new Date(),
                        isDeleted:false,
                        type:constants.BLUETANGO_CHAT_USER_TYPE.admin
                    },
                    {
                        id:parseInt(params.other_user_id),
                        chatLastDeletedOn:new Date(),
                        isDeleted:false,
                        type:constants.BLUETANGO_CHAT_USER_TYPE.coach
                    }
                ]
            }
            chatRoomData = await queryService.addData(bluetangoChatRoomModel,chatRoomObj);
            chatRoomData=chatRoomData.get({plain:true});
        }else{
            chatRoomData.info=chatRoomData.info.map((info)=>{
                return{
                    ...info,
                    isDeleted:false,
                }
            });

            chatRoomData.save();
        }

        
        let users = await queryService.selectOne(bluetangoAdminModel,{
            attributes: ['id', 'name', 'profile_pic_url','admin_role','status','permissions'],
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
            // chatLastDeletedOn:chatRoomData.info?.find(info=>(info.id==user.uid && info.type==constants.CHAT_USER_TYPE.employee)).chatLastDeletedOn,
            createdAt: chatRoomData.createdAt,
            updatedAt: chatRoomData.updatedAt

        }

        return chatRoomData;      

        
    }
    
    /*
    * function to get chat  list
    */
    public async getChatList(params:any,user: any) {

        let query:any={
            where: {
                user_id: user.uid,
            },
        }

        if(!params.is_pagination || params.is_pagination==constants.IS_PAGINATION.yes){
            let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
            query.offset=offset,
            query.limit=limit            
        }

        let chatRoomData = await queryService.selectAndCountAll(bluetangoChatRoomModel,query);

        
        let currentUser = await queryService.selectOne(bluetangoAdminModel,{
            attributes: ['id', 'name', 'profile_pic_url','admin_role','status','permissions'],
            where: {
                id: user.uid
            }
        });

        let chats = {
            count:chatRoomData.count,
            rows:[]
        };

        for (let chat of chatRoomData.rows) {

            let coach = await queryService.selectOne(coachManagementModel,{
                attributes: ['id', 'name', ['image', 'profile_pic_url']],
                where: {
                    id:chat.other_user_id,
                    //status: constants.STATUS.active,
                }
            });

            
            let chatObj=<any>{
                id: chat.id,
                room_id: chat.room_id,
                user: currentUser,
                other_user: coach,
                status: chat.status,
                info:chat.info?.find(info=>(info.id==user.uid && info.type==constants.BLUETANGO_CHAT_USER_TYPE.admin)),
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt
            }

            // if(!chatObj.info.isDeleted){
            //     chatObj.chatLastDeletedOn=chatObj.info.chatLastDeletedOn;
            //     delete chatObj.info;
            //     chats.rows.push(chatObj)
            // }
        
            chats.rows.push(chatObj);
        }

        
        return chats;
    }

    

    /*
* function to send video chat notification
*/
    public async sendChatNotification(params: any, user: any) {

        let chatRoomData = await queryService.selectOne(bluetangoChatRoomModel,{
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

        let recieverData = await queryService.selectOne(coachManagementModel,{
            where: { id: recieverId, }
        })


        chatRoomData=await helperFunction.convertPromiseToObject(chatRoomData);

        if(chatRoomData?.info){

            await bluetangoChatRoomModel.update({
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

        let senderEmployeeData = await helperFunction.convertPromiseToObject(await queryService.selectOne(bluetangoAdminModel,{
            where: { id: user.uid, }
        }))

        delete senderEmployeeData.password

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
        let notificationData = <any>{
            title: 'Message',
            body: `Message from ${senderEmployeeData.name}`,
            data: {
                type: constants.BLUETANGO_NOTIFICATION_TYPE.text_chat,
                title: 'Message',
                message: params.message || `Message from ${senderEmployeeData.name}`,
                chat_room_id: params.chat_room_id,
                senderEmployeeData
            },
        }

        await helperFunction.sendFcmNotification([recieverData.device_token], notificationData);
               

        return newNotification

    }

}
