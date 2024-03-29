import { employeeCoachSessionsModel, coachManagementModel, employeeRanksModel, coachSpecializationCategoriesModel, coachScheduleModel, employeeModel } from "../../models";
import _ from "lodash";
import * as helperFunction from "../../utils/helperFunction";
import * as appUtils from "../../utils/appUtils"
import * as constants from "../../constants";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
import path from 'path'
import * as queryService from '../../queryService/bluetangoAdmin/queryService';
import { notificationModel } from "../../models/notification";

employeeCoachSessionsModel.hasOne(coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" })
employeeCoachSessionsModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id", as: 'team_level' })
employeeCoachSessionsModel.hasOne(coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id", as: 'coach_specialization_category' })
coachScheduleModel.hasOne(coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" })
employeeCoachSessionsModel.hasOne(coachScheduleModel, { foreignKey: "coach_id", sourceKey: "coach_id", targetKey: "coach_id" })

export class SessionManagementService {
    constructor() { }
    /*
  *get Session List
  */
    public async getSessionList(params: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        var where: any = {}
        let Where: any = { app_id: constants.COACH_APP_ID.BT }
        let Wheres: any = {}

        if (params.searchKey && params.searchKey.trim()) {
            Where = {
                [Op.or]: [
                    {
                        name: {
                            [Op.iLike]: `%${params.searchKey}%`
                        }
                    }
                ]
            }
        }
        var order = ['id', 'DESC'];
        if (params.status) {
            where["status"] = params.status;
            let dateObj = params.date ? new Date(params.date) : new Date();
            dateObj.setMonth(dateObj.getMonth() - 6);
            switch (Number(params.status)) {
                case 1://Current to future
                    where["date"] = {
                        [Op.gte]: params.date || new Date()
                    }
                    order = ['date', 'ASC'];
                    break;
                case 2://Currrent to Future sessions
                    where["date"] = {
                        [Op.gte]: params.date || new Date()
                    }
                    order = ['date', 'ASC'];
                    break;
                case 3://Only past rejected session , nearest past to older past
                    where["date"] = {
                        [Op.between]: [
                            dateObj,
                            params.date || new Date(),
                        ]
                        //[Op.lte]: params.date || new Date()
                    }
                    order = ['date', 'DESC'];
                    break;
                case 4://Descending order me cancelled sessions (Latest to older dates)
                    where["date"] = {
                        [Op.between]: [
                            dateObj,
                            params.date || new Date(),
                        ]
                        //[Op.lte]: params.date || new Date()
                    }
                    order = ['date', 'DESC'];
                    break;
                case 5://Current to past
                    where["date"] = {
                        [Op.between]: [
                            dateObj,
                            params.date || new Date(),
                        ]
                        //[Op.lte]: params.date || new Date()
                    }
                    order = ['date', 'DESC'];
                    break;
            }
        }
        if (params.type) {
            where["type"] = params.type
        }

        if (params.team_level_Id) {
            Wheres["id"] = params.team_level_Id
        }
        let sessions = await queryService.selectAndCountAll(employeeCoachSessionsModel, {
            where: where,
            include: [
                {
                    model: coachManagementModel,
                    required: true,
                    attributes: [],
                    where: Where
                },
                {
                    model: employeeRanksModel,
                    where: Wheres,
                    required: true,
                    attributes: [],
                    as: 'team_level',
                }
            ],
            raw: true,
            order: [order],
            attributes: ["id", "coach_id", "query", "date", "start_time", "action", "slot_id", "end_time", "call_duration", "status", "type", [Sequelize.col('coach_management.name'), 'name'], [Sequelize.col('team_level.name'), 'team_level']]
        }, {})
        sessions.rows = sessions.rows.slice(offset, offset + limit);
        sessions.rows = appUtils.formatPassedAwayTime(sessions.rows);
        return sessions
    }
    /*
 *get Session details
 */
    public async getSessionDetail(params: any) {
        let where: any = {}
        if (params.id) {
            where["id"] = params.id
        }
        let sessions = await queryService.selectOne(employeeCoachSessionsModel, {
            where: where,
            include: [
                {
                    model: coachManagementModel,
                    required: true,
                    attributes: [],
                    where: { app_id: constants.COACH_APP_ID.BT }
                },
                {
                    model: employeeRanksModel,
                    required: true,
                    attributes: [],
                    as: 'team_level',
                },
                {
                    model: coachSpecializationCategoriesModel,
                    required: true,
                    attributes: [],
                    as: 'coach_specialization_category',
                }
            ],
            raw: true,
            attributes: ["id", "comment", "coach_rating", "cancelled_by", "request_received_date", "employee_rank_id", "coach_specialization_category_id", "coach_id", "slot_id", "date", "timeline", "start_time", "end_time", "call_duration", "status", "type", [Sequelize.col('coach_management.name'), 'name'], [Sequelize.col('coach_management.email'), 'email'], [Sequelize.col('team_level.name'), 'team_level'], [Sequelize.col('coach_specialization_category.name'), 'coach_specialization_category'], "query"]
        })
        if (sessions) {
            return appUtils.formatPassedAwayTime([sessions])[0];
        }
        return sessions
    }

    /*
*perform action on sessions
*/
    public async performAction(params: any, user: any) {
        let Sessions = await this.getSessionDetail(params)
        params.model = employeeCoachSessionsModel
        params.action_by = constants.ACTION_BY.admin;
        if (Sessions.timeline) {
            params.timeline = [...Sessions.timeline, {
                "name": Sessions.name,
                "request_received": Sessions.request_received_date,
                "status": "Sent",
                "action": Number(params.action),
                "action_by": constants.ACTION_BY.admin
            }]
        } else {
            params.timeline = [{
                "name": Sessions.name,
                "request_received": Sessions.request_received_date,
                "status": "Sent",
                "action": Number(params.action),
                "action_by": constants.ACTION_BY.admin
            }]
        }
        params.request_received_date = Date.now()
        let sessions = await queryService.updateData(params, { returning: true, where: { id: params.id } })
        await queryService.updateData({ model: coachScheduleModel, status: 2 }, { where: { id: params.slot_id } })
        //send push notification
        if (Number(params.action) == 4) {
            employeeCoachSessionsModel.hasOne(coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" })
            employeeCoachSessionsModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" })
            let session = await queryService.selectOne(employeeCoachSessionsModel, {
                where: { id: params.id },
                include: [
                    {
                        model: coachManagementModel,
                        required: true,
                        attributes: ["id", "name", "device_token"],
                    },
                    {
                        model: employeeModel,
                        required: true,
                        attributes: ["id", "name"],
                    },
                ]
            })
            //add notification 
            let notificationObj = <any>{
                type_id: session.id,
                sender_id: user.uid,
                reciever_id: session.coach_id,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
                type: constants.NOTIFICATION_TYPE.session_reassigned,
                data: {
                    type: constants.NOTIFICATION_TYPE.session_reassigned,
                    title: 'Sesssion assigned by admin',
                    message: `Admin has assigned session for ${session.employee.name} on ${session.date} at ${session.start_time}`,
                    senderEmployeeData: { id: user.uid },
                },
            }

            await notificationModel.create(notificationObj);

            let notificationData = <any>{
                title: 'Sesssion assigned by admin',
                message: `Admin has assigned session for ${session.employee.name} on ${session.date} at ${session.start_time}`,
                data: {
                    type: constants.NOTIFICATION_TYPE.session_reassigned,
                    title: 'Sesssion assigned by admin',
                    message: `Admin has assigned session for ${session.employee.name} on ${session.date} at ${session.start_time}`,
                    senderEmployeeData: { id: user.uid },
                },
            }
            await helperFunction.sendFcmNotification([session.coach_management.device_token], notificationData);

            let mailParams = <any>{};
            mailParams.to = Sessions.email;
            mailParams.html = `Hi  ${Sessions.name}
                <br>A new session is assigned to you by admin with session id:${Sessions.id}
                `;
            mailParams.subject = "Session Assign";
            mailParams.name = "BlueTango"
            //await helperFunction.sendEmail(mailParams);
        }
        return sessions

    }
    /*
*get Availabile Coaches
*/
    public async getAvailabileCoaches(params: any) {
        let Sessions = await this.getSessionDetail(params)
        let availableCoaches: any = { rows: [], count: 0 };
        if (Sessions) {
            let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
            let where: any = {}
            let Where: any = { app_id: constants.COACH_APP_ID.BT }

            where = {
                date: [Sessions.date],
                [Op.or]: [
                    // {
                    //     start_time: {
                    //         [Op.between]: [
                    //             Sessions.start_time,
                    //             Sessions.end_time,
                    //         ]
                    //     },
                    // },
                    // {
                    //     end_time: {
                    //         [Op.between]: [
                    //             Sessions.start_time,
                    //             Sessions.end_time,
                    //         ]
                    //     },
                    // },
                    {
                        [Op.and]: [
                            {
                                start_time: {
                                    [Op.lte]: Sessions.start_time,
                                },
                            },
                            {
                                end_time: {
                                    [Op.gte]: Sessions.end_time,
                                },
                            },
                        ],
                    }
                ]
            }
            Where["coach_specialization_category_ids"] = { [Op.contains]: [Sessions.coach_specialization_category_id] }
            Where["employee_rank_ids"] = { [Op.contains]: [Sessions.employee_rank_id] }
            availableCoaches = await queryService.selectAndCountAll(coachScheduleModel, {
                where: where,
                include: [
                    {
                        model: coachManagementModel,
                        where: Where,
                        required: true,
                        attributes: [],
                    }
                ],
                raw: true,
                attributes: ["id", "date", "start_time", "end_time", "coach_id", "status", [Sequelize.col('coach_management.name'), 'name'], [Sequelize.col('coach_management.email'), 'email'], [Sequelize.col('coach_management.phone_number'), 'phone_number']]
            }, {})
            availableCoaches.rows.forEach((element, index, arr) => {
                arr[index]["coach_specialization_category"] = Sessions.coach_specialization_category
                arr[index]["team_level"] = Sessions.team_level,
                    arr[index]["session_id"] = Sessions.id
            });
            availableCoaches.rows = availableCoaches.rows.slice(offset, offset + limit);
            return availableCoaches;
        }
        return availableCoaches;
    }
}