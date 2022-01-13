import { employeeCoachSessionsModel, coachManagementModel, employeeRanksModel, coachSpecializationCategoriesModel, coachScheduleModel } from "../../models";
import _ from "lodash";
import * as helperFunction from "../../utils/helperFunction";
import * as appUtils from "../../utils/appUtils"
import * as constants from "../../constants";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
import path from 'path'
import * as queryService from '../../queryService/bluetangoAdmin/queryService';

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
        let where: any = {}
        let Where: any = {app_id:constants.COACH_APP_ID.BT}
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

        if (params.status) {
            where["status"] = params.status
        }
        if (params.type) {
            where["type"] = params.type
        }

        if (params.team_level) {
            Wheres["name"] = params.team_level
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
            attributes: ["id", "coach_id", "query", "date", "start_time", "action", "end_time", "call_duration", "status", "type", [Sequelize.col('coach_management.name'), 'name'], [Sequelize.col('team_level.name'), 'team_level']]
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
                    where:{app_id:constants.COACH_APP_ID.BT}
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
            attributes: ["id", "comment", "coach_rating", "cancelled_by", "request_received_date", "employee_rank_id", "coach_specialization_category_id", "coach_id", "date", "timeline", "start_time", "end_time", "call_duration", "status", "type", [Sequelize.col('coach_management.name'), 'name'], [Sequelize.col('coach_management.email'), 'email'], [Sequelize.col('team_level.name'), 'team_level'], [Sequelize.col('coach_specialization_category.name'), 'coach_specialization_category']]
        })
        if(sessions){
        return appUtils.formatPassedAwayTime([sessions])[0];
        }
        return sessions
    }

    /*
*perform action on sessions
*/
    public async performAction(params: any) {
        let Sessions = await this.getSessionDetail(params)
        params.model = employeeCoachSessionsModel
        params.action_by = 3;
        if (Sessions.timeline) {
            params.timeline = [...Sessions.timeline, {
                "name": Sessions.name,
                "request_received": Sessions.request_received_date,
                "status": "Sent",
                "action": Number(params.action),
                "action_by": 3
            }]
        } else {
            params.timeline = [{
                "name": Sessions.name,
                "request_received": Sessions.request_received_date,
                "status": "Sent",
                "action": Number(params.action),
                "action_by": 3
            }]
        }
        params.request_received_date = Date.now()
        let sessions = await queryService.updateData(params, { returning: true, where: { id: params.id } })
        await queryService.updateData({ model: coachScheduleModel, status: 2 }, { where: { id: params.slot_id } })
        let mailParams = <any>{};
        mailParams.to = Sessions.email;
        mailParams.html = `Hi  ${Sessions.name}
                <br>A new session is assigned to you by admin with session id:${Sessions.id}
                `;
        mailParams.subject = "Session Assign";
        mailParams.name = "BlueTango"
        //await helperFunction.sendEmail(mailParams);
        return sessions

    }
    /*
*get Availabile Coaches
*/
    public async getAvailabileCoaches(params: any) {
        let Sessions = await this.getSessionDetail(params)
        let availableCoaches: any = {rows:[],count:0};
        if(Sessions){
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let where: any = {}
        let Where: any = {app_id:constants.COACH_APP_ID.BT}

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