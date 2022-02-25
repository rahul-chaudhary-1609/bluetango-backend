import _ from "lodash";
import * as constants from "../../constants";
import * as helperFunction from "../../utils/helperFunction";
import { coachScheduleModel } from "../../models/coachSchedule";
import { employeeCoachSessionsModel } from "../../models/employeeCoachSession";
import { coachManagementModel, employeeModel } from "../../models";
import { coachSpecializationCategoriesModel } from "../../models/coachSpecializationCategories";
import { chatRealtionMappingInRoomModel } from "../../models/chatRelationMappingInRoom";
import { employeeRanksModel } from "../../models/employeeRanks";
const Sequelize = require('sequelize');
const moment = require("moment");
var Op = Sequelize.Op;
import * as appUtils from "../../utils/appUtils";
import * as queryService from '../../queryService/bluetangoAdmin/queryService';
import { notificationModel } from "../../models/notification";

export class CoachService {
    constructor() { }

    public async addEditSlot(params: any, user: any) {
        if (params.type == constants.COACH_SCHEDULE_TYPE.weekly && !params.day)
            throw new Error(constants.MESSAGES.coach_schedule_day_required)

        if (params.type == constants.COACH_SCHEDULE_TYPE.custom && params.custom_dates?.length == 0)
            throw new Error(constants.MESSAGES.coach_schedule_custom_dates_required)

        let dates = [];
        //// new automatically created slots
        let Slots;
        let validslots = [];
        Slots = await appUtils.calculate_time_slot(appUtils.parseTime(constants.DEFAAULT_START_END_TIME.start_time.replace('00', params.timings[0].start_time.split(":")[1])), appUtils.parseTime(constants.DEFAAULT_START_END_TIME.end_time), params.session_duration)
        for (let i = 0; i < Slots.length; i++) {
            if (Slots[i + 1]) {
                validslots.push({ start_time: Slots[i], end_time: Slots[i + 1] })
            }
        }
        switch (parseInt(params.time_capture_type)) {
            case constants.TIME_CAPTURE_TYPE.available: {
                let validslotss = await appUtils.validateUnavailableTime(params.timings, validslots, params.time_capture_type)
                return validslotss;
                break;
            }
            case constants.TIME_CAPTURE_TYPE.unavailable: {
                let validslotss = await appUtils.validateUnavailableTime(params.timings, validslots, params.time_capture_type)
                return validslotss;
                break;
            }
            case constants.TIME_CAPTURE_TYPE.previewed: {
                validslots = params.timings;
                break;
            }
        }
        ///////
        switch (parseInt(params.type)) {
            case constants.COACH_SCHEDULE_TYPE.does_not_repeat:
                dates.push(params.date)
                break

            case constants.COACH_SCHEDULE_TYPE.daily: {
                let start = new Date(params.date);
                let end = new Date(params.date);
                end.setFullYear(start.getFullYear() + 1)

                while (start < end) {
                    dates.push(moment(start).format("YYYY-MM-DD"))
                    start.setDate(start.getDate() + 1)
                }
                break
            }
            case constants.COACH_SCHEDULE_TYPE.every_week_day: {
                let start = new Date(params.date);
                let end = new Date(params.date);
                end.setFullYear(start.getFullYear() + 1)

                while (start < end) {
                    if (![constants.COACH_SCHEDULE_DAY.saturday, constants.COACH_SCHEDULE_DAY.sunday].includes(parseInt(moment(start).format('d')))) {
                        dates.push(moment(start).format("YYYY-MM-DD"))
                    }
                    start.setDate(start.getDate() + 1)
                }
                break
            }
            case constants.COACH_SCHEDULE_TYPE.weekly: {
                if (params.custom_dates) {
                    params.custom_dates.forEach(element => {
                        for (let d = 0; d < params.day.length; d++) {
                            if (params.day[d] == parseInt(moment(element).format('d'))) {
                                dates.push(moment(element).format("YYYY-MM-DD"))
                            }
                        }
                    });
                } else {
                    let start = new Date(params.date);
                    let end = new Date(params.date);
                    end.setFullYear(start.getFullYear() + 1)

                    while (start < end) {
                        for (let d = 0; d < params.day.length; d++) {
                            if (params.day[d] == parseInt(moment(start).format('d'))) {
                                dates.push(moment(start).format("YYYY-MM-DD"))
                            }
                        }
                        start.setDate(start.getDate() + 1)
                    }
                }
                break
            }
            case constants.COACH_SCHEDULE_TYPE.custom: {
                let start = new Date(params.date);
                let end = new Date(params.custom_date);

                while (start <= end) {
                    dates.push(moment(start).format("YYYY-MM-DD"))
                    start.setDate(start.getDate() + 1)
                }
                break
            }
            // case constants.COACH_SCHEDULE_TYPE.custom:{
            //     for(let date of params.custom_dates){
            //         dates.push(date)
            //     }
            //     break
            // }
        }
        let schedules = [];
        let slot_time_group_id = await helperFunction.getUniqueSlotTimeGroupId();

        let slots = validslots;
        params.slots = validslots;

        slots.forEach((slot) => {
            let keys = Object.keys(slot)
            let index = keys.indexOf("is_available");
            keys.splice(index, 1);
            keys.forEach((key) => {
                slot[key] = slot[key].replace(/:/g, "")
            })
        })

        // slots.forEach((slot1, index1) => {
        //     if (!(slot1.start_time < slot1.end_time)) {
        //         throw new Error(constants.MESSAGES.coach_schedule_start_greater_or_equal_end)
        //     }
        //     Object.keys(slot1).forEach((key) => {
        //         slots.forEach((slot2, index2) => {
        //             console.log(slot1[key],slot2.start_time,slot1[key],slot2.end_time,index1,index2)
        //             if (slot1[key] >= slot2.start_time && slot1[key] <= slot2.end_time && index1 != index2) {
        //                 throw new Error(constants.MESSAGES.coach_schedule_overlaped)
        //             }
        //         })
        //     })
        // })

        slots.forEach((slot) => {
            let keys = Object.keys(slot)
            let index = keys.indexOf("is_available");
            keys.splice(index, 1);
            keys.forEach((key) => {
                slot[key] = moment(slot[key], "HHmmss").format("HH:mm:ss")
            })
        })
        if (params.is_update) {
            let bookedSlots = await queryService.selectAndCountAll(coachScheduleModel, {
                where: {
                    coach_id: user.uid,
                    status: constants.COACH_SCHEDULE_STATUS.booked,
                    date: {
                        [Op.in]: dates,
                    }
                }
            }, {})
            if (bookedSlots.count >= 1) {
                return { bookedSlots: bookedSlots };
            }
            await queryService.deleteData(coachScheduleModel, {
                where: {
                    coach_id: user.uid,
                    date: {
                        [Op.in]: dates,
                    }
                }
            })
        }
        for (let slot of params.slots) {
            let schedule = await coachScheduleModel.findOne({
                where: {
                    coach_id: user.uid,
                    date: {
                        [Op.in]: dates,
                    },
                    [Op.or]: [
                        {
                            start_time: {
                                [Op.between]: [
                                    slot.start_time,
                                    slot.end_time,
                                ]
                            },
                        },
                        {
                            end_time: {
                                [Op.between]: [
                                    slot.start_time,
                                    slot.end_time,
                                ]
                            },
                        },
                        {
                            [Op.and]: [
                                {
                                    start_time: {
                                        [Op.lte]: slot.start_time,
                                    },
                                },
                                {
                                    end_time: {
                                        [Op.gte]: slot.end_time,
                                    },
                                },
                            ],
                        }
                    ],
                    // status:{
                    //     [Op.notIn]:[constants.COACH_SCHEDULE_STATUS.passed]
                    // }
                }

            })
            if (schedule) throw new Error(constants.MESSAGES.coach_schedule_already_exist)
            let slot_date_group_id = await helperFunction.getUniqueSlotDateGroupId();
            for (let date of dates) {
                schedules.push({
                    slot_date_group_id,
                    slot_time_group_id,
                    coach_id: user.uid,
                    date,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    type: params.type,
                    day: params.type == constants.COACH_SCHEDULE_TYPE.weekly ? params.day : null,
                    custom_date: params.type == constants.COACH_SCHEDULE_TYPE.custom ? params.custom_date : null,
                    custom_dates: null,
                    is_available: slot.is_available,
                    status: slot.is_available
                })
            }
        }
        if (schedules.length < 1000) {
            await coachScheduleModel.bulkCreate(schedules)
            return true;
        } else {
            let size = schedules.length;
            let start = 0;
            let end = 999;
            while (size > 0) {
                await coachScheduleModel.bulkCreate(schedules.slice(start, end))
                start = start + 999;
                end = end + 999;
                size = size - 999;
            }
            return true;
        }

    }

    public async getSlots(params: any, user: any) {

        console.log("params", params)

        let where = <any>{
            coach_id: user.uid,
            status: {
                [Op.notIn]: [constants.COACH_SCHEDULE_STATUS.passed]
            }
        }

        let start_date = new Date();
        let end_date = new Date();

        if (params.filter_key) {
            if (params.filter_key == "Daily") {
                where = {
                    ...where,
                    date: moment(new Date()).format("YYYY-MM-DD"),
                };
            } else if (params.filter_key == "Weekly") {
                start_date = helperFunction.getMonday(start_date);
                end_date = helperFunction.getMonday(start_date);
                end_date.setDate(start_date.getDate() + 6);
                where = {
                    ...where,
                    date: {
                        [Op.between]: [
                            moment(start_date).format("YYYY-MM-DD"),
                            moment(end_date).format("YYYY-MM-DD")
                        ]
                    }
                };
            } else if (params.filter_key == "Monthly") {
                start_date.setDate(1)
                end_date.setMonth(start_date.getMonth() + 1)
                end_date.setDate(1)
                end_date.setDate(end_date.getDate() - 1)

                where = {
                    ...where,
                    date: {
                        [Op.between]: [
                            moment(start_date).format("YYYY-MM-DD"),
                            moment(end_date).format("YYYY-MM-DD")
                        ]
                    }
                };
            } else if (params.filter_key == "Yearly") {
                start_date.setDate(1)
                start_date.setMonth(0)
                end_date.setDate(1)
                end_date.setMonth(0)
                end_date.setFullYear(end_date.getFullYear() + 1)
                end_date.setDate(end_date.getDate() - 1)
                where = {
                    ...where,
                    date: {
                        [Op.between]: [
                            moment(start_date).format("YYYY-MM-DD"),
                            moment(end_date).format("YYYY-MM-DD")
                        ]
                    }
                };
            }
        } else if ((params.day && params.month && params.year) || params.date) {
            where = {
                ...where,
                date: params.date || `${params.year}-${params.month}-${params.day}`,
            };
        } else if (params.week && params.year) {
            where = {
                [Op.and]: [
                    {
                        ...where,
                    },
                    Sequelize.where(Sequelize.fn("date_part", "year", Sequelize.col("date")), "=", params.year),
                    Sequelize.where(Sequelize.fn("date_part", "week", Sequelize.col("date")), "=", params.week),
                ]
            };
        } else if (params.month && params.year) {
            where = {
                [Op.and]: [
                    {
                        ...where,
                    },
                    Sequelize.where(Sequelize.fn("date_part", "year", Sequelize.col("date")), "=", params.year),
                    Sequelize.where(Sequelize.fn("date_part", "month", Sequelize.col("date")), "=", params.month),
                ]
            };
        } else if (params.year) {
            where = {
                [Op.and]: [
                    {
                        ...where,
                    },
                    Sequelize.where(Sequelize.fn("date_part", "year", Sequelize.col("date")), "=", params.year),
                ]
            };
        } else {
            start_date.setDate(1)
            end_date.setMonth(start_date.getMonth() + 1)
            end_date.setDate(1)
            end_date.setDate(end_date.getDate() - 1)

            where = {
                ...where,
                date: {
                    [Op.between]: [
                        moment(start_date).format("YYYY-MM-DD"),
                        moment(end_date).format("YYYY-MM-DD")
                    ]
                }
            };
        }

        return await helperFunction.convertPromiseToObject(
            await coachScheduleModel.findAndCountAll({
                where,
                order: [["date", "ASC"], ["start_time", "ASC"]]
            })
        )
    }

    public async getSlot(params: any) {

        let schedule = await helperFunction.convertPromiseToObject(
            await coachScheduleModel.findByPk(parseInt(params.slot_id))
        )

        if (!schedule) throw new Error(constants.MESSAGES.no_coach_schedule)

        return schedule
    }

    public async deleteSlot(params: any) {

        if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.individual && !params.slot_id) throw new Error(constants.MESSAGES.slot_id_required)

        if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && params.group_type == constants.COACH_SCHEDULE_SLOT_GROUP_DELETE_TYPE.date && !params.slot_date_group_id) throw new Error(constants.MESSAGES.slot_date_group_id_required);

        if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && params.group_type == constants.COACH_SCHEDULE_SLOT_GROUP_DELETE_TYPE.time && !params.slot_time_group_id) throw new Error(constants.MESSAGES.slot_time_group_id_required);

        if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && !params.current_date) throw new Error(constants.MESSAGES.slot_group_delete_date_required);

        if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.individual) {
            let schedule = await coachScheduleModel.findByPk(parseInt(params.slot_id));

            if (!schedule) throw new Error(constants.MESSAGES.no_coach_schedule)

            schedule.destroy();


        } else if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && params.slot_date_group_id) {
            let schedules = await coachScheduleModel.findAll({
                where: {
                    slot_date_group_id: params.slot_date_group_id,
                    date: {
                        [Op.gte]: params.current_date,
                    }
                }
            });

            if (schedules.length == 0) throw new Error(constants.MESSAGES.no_coach_schedule)

            await coachScheduleModel.destroy({
                where: {
                    slot_date_group_id: params.slot_date_group_id,
                    date: {
                        [Op.gte]: params.current_date,
                    }
                }
            });

        } else if (params.type == constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && params.slot_time_group_id) {
            let schedules = await coachScheduleModel.findAll({
                where: {
                    slot_time_group_id: params.slot_time_group_id,
                    date: {
                        [Op.gte]: params.current_date,
                    }
                }
            });

            if (schedules.length == 0) throw new Error(constants.MESSAGES.no_coach_schedule)

            await coachScheduleModel.destroy({
                where: {
                    slot_time_group_id: params.slot_time_group_id,
                    date: {
                        [Op.gte]: params.current_date,
                    }
                }
            });
        }

        return true;
    }

    public async getSessionRequests(params: any, user: any) {
        employeeCoachSessionsModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" })

        if (params.datetime) {
            let sessions = await helperFunction.convertPromiseToObject(
                await employeeCoachSessionsModel.findAll({
                    where: {
                        coach_id: user.uid,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.pending,
                    }
                }
                )
            )

            for (let session of sessions) {
                let startTime = moment(`${params.datetime}`, "YYYY-MM-DD HH:mm:ss")
                let endTime = moment(`${session.date} ${session.end_time}`, "YYYY-MM-DD HH:mm:ss")

                let duration = moment.duration(endTime.diff(startTime));
                let secondDiff = Math.ceil(duration.asSeconds())

                if (secondDiff <= 0) {
                    await employeeCoachSessionsModel.update({
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.rejected,
                    }, {
                        where: {
                            id: session.id,
                        }
                    })
                }
            }
        }

        let query = <any>{
            order: [["date"], ["start_time"]]
        }
        query.where = {
            coach_id: user.uid,
            status: constants.EMPLOYEE_COACH_SESSION_STATUS.pending,
        }

        if (params.is_pagination && params.is_pagination == constants.IS_PAGINATION.yes) {
            let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
            query.offset = offset;
            query.limit = limit;
        }

        query.include = [
            {
                model: employeeModel,
                attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'energy_last_updated', 'profile_pic_url'],
            },
            {
                model: coachSpecializationCategoriesModel,
                attributes: ['id', 'name', 'description'],
            },
            {
                model: employeeRanksModel,
                attributes: ['id', 'name', 'description'],
            }
        ]

        let sessions = await helperFunction.convertPromiseToObject(
            await employeeCoachSessionsModel.findAndCountAll(query)
        )

        for (let session of sessions.rows) {
            session.chatRoom = await helperFunction.convertPromiseToObject(
                await chatRealtionMappingInRoomModel.findOne({
                    where: {
                        user_id: session.employee_id,
                        other_user_id: session.coach_id,
                        type: constants.CHAT_ROOM_TYPE.coach,
                        status: constants.STATUS.active,
                    }
                })
            )

            if (session.chatRoom) {
                session.chatRoom.user = await helperFunction.convertPromiseToObject(
                    await employeeModel.findOne({
                        attributes: ['id', 'name', 'profile_pic_url', 'status'],
                        where: {
                            id: session.employee_id,
                        }
                    })
                )

                session.chatRoom.other_user = await helperFunction.convertPromiseToObject(
                    await coachManagementModel.findOne({
                        attributes: ['id', 'name', ['image', 'profile_pic_url']],
                        where: {
                            id: session.coach_id,
                        }
                    })
                )
            }
        }

        return sessions;
    }

    public async acceptSessionRequest(params: any, user: any) {
        console.log("acceptSessionRequest", params, user)
        // let session = await employeeCoachSessionsModel.findByPk(params.session_id);
        employeeCoachSessionsModel.hasOne(coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" })
        let session = await employeeCoachSessionsModel.findOne({
            where: { id: params.session_id },
            include: [
                {
                    model: coachManagementModel,
                    required: true,
                    attributes: ["id", "name", "email", "device_token", "app_id"],
                },
                {
                    model: employeeModel,
                    required: true,
                    attributes: ["id", "name", "email", "device_token"],
                },
            ],
        })

        if (!session) {
            throw new Error(constants.MESSAGES.no_session)
        }

        if (session.coach_id != user.uid) {
            throw new Error(constants.MESSAGES.session_not_belogs_to_coach)
        }

        params.session = await helperFunction.convertPromiseToObject(session);
        session.details = await helperFunction.scheduleZoomMeeting(params);
        session.status = constants.EMPLOYEE_COACH_SESSION_STATUS.accepted;
        if (session.coach_management.app_id == constants.COACH_APP_ID.BT) {
            if (session.timeline) {
                session.timeline = [...session.timeline, {
                    "name": session.coach_management.name,
                    "request_received": session.request_received_date,
                    "status": "Sent",
                    "action": constants.SESSION_ACTION.accepted,
                    "action_by": constants.ACTION_BY.coach
                }]
            } else {
                session.timeline = [{
                    "name": session.coach_management.name,
                    "request_received": session.request_received_date,
                    "status": "Sent",
                    "action": constants.SESSION_ACTION.accepted,
                    "action_by": constants.ACTION_BY.coach
                }]
            }
        }
        session.save();

        //add notification 
        let notificationObj = <any>{
            type_id: session.id,
            sender_id: user.uid,
            reciever_id: session.employee_id,
            reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
            type: constants.NOTIFICATION_TYPE.session_accepted,
            data: {
                type: constants.NOTIFICATION_TYPE.session_accepted,
                title: 'Sesssion accepted by coach',
                message: `${session.coach_management.name} has accepted session on ${session.date} at ${session.start_time}`,
                senderEmployeeData: session.coach_management,
            },
        }

        await notificationModel.create(notificationObj);
        //send push notification
        let notificationData = <any>{
            title: 'Sesssion accepted by coach',
            body: `${session.coach_management.name} has accepted session on ${session.date} at ${session.start_time}`,
            data: {
                type: constants.NOTIFICATION_TYPE.session_accepted,
                title: 'Sesssion accepted by coach',
                message: `${session.coach_management.name} has accepted session on ${session.date} at ${session.start_time}`,
                senderEmployeeData: session.coach_management,
            },
        }
        await helperFunction.sendFcmNotification([session.employee.device_token], notificationData);

        let mailParams = <any>{};
        mailParams.to = session.employee.email;
        mailParams.html = `Hi  ${session.employee.name}
            <br>Your session request is Accepted by ${session.coach_management.name}
            `;
        mailParams.subject = "Session Request Accepted";
        mailParams.name = "BlueXinga"
        await helperFunction.sendEmail(mailParams);


        return await helperFunction.convertPromiseToObject(session);
    }

    public async rejectSessionRequest(params: any, user: any) {
        // let session = await employeeCoachSessionsModel.findByPk(params.session_id);
        employeeCoachSessionsModel.hasOne(coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" })
        let session = await employeeCoachSessionsModel.findOne({
            where: { id: params.session_id },
            include: [
                {
                    model: coachManagementModel,
                    required: true,
                    attributes: ["id", "name", "email", "device_token", "app_id"],
                },
                {
                    model: employeeModel,
                    required: true,
                    attributes: ["id", "name", "email", "device_token"],
                },
            ],
        })

        if (!session) {
            throw new Error(constants.MESSAGES.no_session)
        }

        if (session.coach_id != user.uid) {
            throw new Error(constants.MESSAGES.session_not_belogs_to_coach)
        }

        session.status = constants.EMPLOYEE_COACH_SESSION_STATUS.rejected;
        if (session.coach_management.app_id == constants.COACH_APP_ID.BT) {
            if (session.timeline) {
                session.timeline = [...session.timeline, {
                    "name": session.coach_management.name,
                    "request_received": session.request_received_date,
                    "status": "Sent",
                    "action": constants.SESSION_ACTION.declined,
                    "action_by": constants.ACTION_BY.coach
                }]
            } else {
                session.timeline = [{
                    "name": session.coach_management.name,
                    "request_received": session.request_received_date,
                    "status": "Sent",
                    "action": constants.SESSION_ACTION.declined,
                    "action_by": constants.ACTION_BY.coach
                }]
            }
        }
        session.save();
        let slot = await coachScheduleModel.findByPk(parseInt(session.slot_id));
        slot.status = constants.COACH_SCHEDULE_STATUS.available;
        slot.save();

        //add notification 
        let notificationObj = <any>{
            type_id: session.id,
            sender_id: user.uid,
            reciever_id: session.employee_id,
            reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
            type: constants.NOTIFICATION_TYPE.session_rejected,
            data: {
                type: constants.NOTIFICATION_TYPE.session_rejected,
                title: 'Sesssion rejected by coach',
                message: `${session.coach_management.name} has rejected session on ${session.date} at ${session.start_time}`,
                senderEmployeeData: session.coach_management,
            },
        }

        await notificationModel.create(notificationObj);
        //send push notification
        let notificationData = <any>{
            title: 'Sesssion rejected by coach',
            message: `${session.coach_management.name} has rejected session on ${session.date} at ${session.start_time}`,
            data: {
                type: constants.NOTIFICATION_TYPE.session_rejected,
                title: 'Sesssion rejected by coach',
                message: `${session.coach_management.name} has rejected session on ${session.date} at ${session.start_time}`,
                senderEmployeeData: session.coach_management,
            },
        }
        await helperFunction.sendFcmNotification([session.employee.device_token], notificationData);

        let mailParams = <any>{};
        mailParams.to = session.employee.email;
        mailParams.html = `Hi  ${session.employee.name}
            <br>Your session request is rejected by ${session.coach_management.name}
            `;
        mailParams.subject = "Session Request Rejected";
        mailParams.name = "BlueXinga"
        await helperFunction.sendEmail(mailParams);


        return await helperFunction.convertPromiseToObject(session);
    }

    public async getAcceptedSessions(params: any, user: any) {
        console.log("getAcceptedSessions", params, user)
        employeeCoachSessionsModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" })

        if (params.datetime) {
            let sessions = await helperFunction.convertPromiseToObject(
                await employeeCoachSessionsModel.findAll({
                    where: {
                        coach_id: user.uid,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.accepted,
                    }
                }
                )
            )

            for (let session of sessions) {
                let startTime = moment(`${params.datetime}`, "YYYY-MM-DD HH:mm:ss")
                let endTime = moment(`${session.date} ${session.end_time}`, "YYYY-MM-DD HH:mm:ss")

                let duration = moment.duration(endTime.diff(startTime));
                let secondDiff = Math.ceil(duration.asSeconds())

                if (secondDiff <= 0) {
                    let startTime = moment(session.start_time, "HH:mm:ss");
                    let endTime = moment(session.end_time, "HH:mm:ss");

                    let duration = moment.duration(endTime.diff(startTime));

                    await employeeCoachSessionsModel.update({
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                        //call_duration:Math.ceil(duration.asMinutes()),
                    }, {
                        where: {
                            id: session.id,
                        }
                    })
                }
            }
        }

        let query = <any>{
            order: [["date"], ["start_time"]]
        }
        query.where = {
            coach_id: user.uid,
            status: constants.EMPLOYEE_COACH_SESSION_STATUS.accepted,
        }

        if (params.is_pagination && params.is_pagination == constants.IS_PAGINATION.yes) {
            let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
            query.offset = offset;
            query.limit = limit;
        }

        query.include = [
            {
                model: employeeModel,
                attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'energy_last_updated', 'profile_pic_url'],
            },
            {
                model: coachSpecializationCategoriesModel,
                attributes: ['id', 'name', 'description'],
            },
            {
                model: employeeRanksModel,
                attributes: ['id', 'name', 'description'],
            }
        ]

        let sessions = await helperFunction.convertPromiseToObject(
            await employeeCoachSessionsModel.findAndCountAll(query)
        )

        for (let session of sessions.rows) {
            session.chatRoom = await helperFunction.convertPromiseToObject(
                await chatRealtionMappingInRoomModel.findOne({
                    where: {
                        user_id: session.employee_id,
                        other_user_id: session.coach_id,
                        type: constants.CHAT_ROOM_TYPE.coach,
                        status: constants.STATUS.active,
                    }
                })
            )

            if (session.chatRoom) {
                session.chatRoom.user = await helperFunction.convertPromiseToObject(
                    await employeeModel.findOne({
                        attributes: ['id', 'name', 'profile_pic_url', 'status'],
                        where: {
                            id: session.employee_id,
                        }
                    })
                )

                session.chatRoom.other_user = await helperFunction.convertPromiseToObject(
                    await coachManagementModel.findOne({
                        attributes: ['id', 'name', ['image', 'profile_pic_url']],
                        where: {
                            id: session.coach_id,
                        }
                    })
                )
            }
        }

        return sessions;
    }

    public async cancelSession(params: any, user: any) {
        // let session = await employeeCoachSessionsModel.findByPk(params.session_id);

        employeeCoachSessionsModel.hasOne(coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" })
        let session = await employeeCoachSessionsModel.findOne({
            where: { id: params.session_id },
            include: [
                {
                    model: coachManagementModel,
                    required: true,
                    attributes: ["id", "name", "device_token"],
                },
                {
                    model: employeeModel,
                    required: true,
                    attributes: ["id", "name", "device_token"],
                },
            ],
        })

        if (!session) {
            throw new Error(constants.MESSAGES.no_session)
        }

        if (session.coach_id != user.uid) {
            throw new Error(constants.MESSAGES.session_not_belogs_to_coach)
        }

        params.session = await helperFunction.convertPromiseToObject(session);

        if (params.datetime) {
            let startTime = moment(`${params.datetime}`, "YYYY-MM-DD HH:mm:ss")
            let endTime = moment(`${params.session.date} ${params.session.end_time}`, "YYYY-MM-DD HH:mm:ss")

            let duration = moment.duration(endTime.diff(startTime));
            let secondDiff = Math.ceil(duration.asSeconds())

            if (secondDiff <= 0) {
                throw new Error(constants.MESSAGES.zoom_meeting_coach_cancel_error)
            }
        }

        await helperFunction.cancelZoomMeeting(params);

        session.status = constants.EMPLOYEE_COACH_SESSION_STATUS.cancelled;
        session.cancel_reason = params.cancel_reason;
        session.cancelled_by = constants.EMPLOYEE_COACH_SESSION_CANCELLED_BY.coach;
        session.save();

        let slot = await coachScheduleModel.findByPk(parseInt(session.slot_id));
        slot.status = constants.COACH_SCHEDULE_STATUS.available;
        slot.save();

        //add notification 
        let notificationObj = <any>{
            type_id: session.id,
            sender_id: user.uid,
            reciever_id: session.employee_id,
            reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
            type: constants.NOTIFICATION_TYPE.cancel_session,
            data: {
                type: constants.NOTIFICATION_TYPE.cancel_session,
                title: 'Sesssion cancelled by coach',
                message: `${session.coach_management.name} has cancelled session on ${session.date} at ${session.start_time}`,
                senderEmployeeData: session.coach_management,
            },
        }

        await notificationModel.create(notificationObj);
        //send push notification
        let notificationData = <any>{
            title: 'Sesssion cancelled by coach',
            body: `${session.coach_management.name} has cancelled session on ${session.date} at ${session.start_time}`,
            data: {
                type: constants.NOTIFICATION_TYPE.cancel_session,
                title: 'Sesssion cancelled by coach',
                message: `${session.coach_management.name} has cancelled session on ${session.date} at ${session.start_time}`,
                senderEmployeeData: session.coach_management,
            },
        }
        await helperFunction.sendFcmNotification([session.employee.device_token], notificationData);

        return await helperFunction.convertPromiseToObject(session);
    }

    public async listSessionHistory(params: any, user: any) {
        employeeCoachSessionsModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" })

        if (params.datetime) {
            let sessions = await helperFunction.convertPromiseToObject(
                await employeeCoachSessionsModel.findAll({
                    where: {
                        coach_id: user.uid,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.pending,
                    }
                }
                )
            )

            for (let session of sessions) {
                let startTime = moment(`${params.datetime}`, "YYYY-MM-DD HH:mm:ss")
                let endTime = moment(`${session.date} ${session.end_time}`, "YYYY-MM-DD HH:mm:ss")

                let duration = moment.duration(endTime.diff(startTime));
                let secondDiff = Math.ceil(duration.asSeconds())

                if (secondDiff <= 0) {
                    await employeeCoachSessionsModel.update({
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.rejected,
                    }, {
                        where: {
                            id: session.id,
                        }
                    })
                }
            }

            sessions = await helperFunction.convertPromiseToObject(
                await employeeCoachSessionsModel.findAll({
                    where: {
                        coach_id: user.uid,
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.accepted,
                    }
                }
                )
            )

            for (let session of sessions) {
                let startTime = moment(`${params.datetime}`, "YYYY-MM-DD HH:mm:ss")
                let endTime = moment(`${session.date} ${session.end_time}`, "YYYY-MM-DD HH:mm:ss")

                let duration = moment.duration(endTime.diff(startTime));
                let secondDiff = Math.ceil(duration.asSeconds())

                if (secondDiff <= 0) {
                    let startTime = moment(session.start_time, "HH:mm:ss");
                    let endTime = moment(session.end_time, "HH:mm:ss");

                    let duration = moment.duration(endTime.diff(startTime));

                    await employeeCoachSessionsModel.update({
                        status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                        call_duration: Math.ceil(duration.asMinutes()),
                    }, {
                        where: {
                            id: session.id,
                        }
                    })
                }
            }
        }

        let query = <any>{
            order: [["date", "DESC"], ["start_time", "DESC"]]
        }
        query.where = {
            coach_id: user.uid,
            status: {
                [Op.in]: [
                    constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    constants.EMPLOYEE_COACH_SESSION_STATUS.cancelled,
                    constants.EMPLOYEE_COACH_SESSION_STATUS.rejected,
                ]
            },
        }

        if (params.is_pagination && params.is_pagination == constants.IS_PAGINATION.yes) {
            let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
            query.offset = offset;
            query.limit = limit;
        }

        query.include = [
            {
                model: employeeModel,
                attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'energy_last_updated', 'profile_pic_url'],
            },
            {
                model: coachSpecializationCategoriesModel,
                attributes: ['id', 'name', 'description'],
            },
            {
                model: employeeRanksModel,
                attributes: ['id', 'name', 'description'],
            }
        ]

        return await helperFunction.convertPromiseToObject(
            await employeeCoachSessionsModel.findAndCountAll(query)
        )
    }

    public async getSessionHistoryDetails(params: any) {
        employeeCoachSessionsModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" })

        let query = <any>{}
        query.where = {
            id: params.session_id,
        }

        query.include = [
            {
                model: employeeModel,
                attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'energy_last_updated', 'profile_pic_url'],
            },
            {
                model: coachSpecializationCategoriesModel,
                attributes: ['id', 'name', 'description'],
            },
            {
                model: employeeRanksModel,
                attributes: ['id', 'name', 'description'],
            }
        ]

        let session = await helperFunction.convertPromiseToObject(
            await employeeCoachSessionsModel.findOne(query)
        );

        if (!session) {
            throw new Error(constants.MESSAGES.no_session);
        }

        return session;

    }

    public async updateZoomMeetingDuration(params: any, user: any) {

        let session = await employeeCoachSessionsModel.findByPk(params.session_id);

        if (!session) {
            throw new Error(constants.MESSAGES.no_session)
        }

        if (session.coach_id != user.uid) {
            throw new Error(constants.MESSAGES.session_not_belogs_to_coach)
        }

        params.session = await helperFunction.convertPromiseToObject(session);

        params.extendingMinutes = 5;

        await helperFunction.updateZoomMeetingDuration(params);

        return true;
    }

    public async endZoomMeeting(params: any, user: any) {

        let session = await employeeCoachSessionsModel.findByPk(params.session_id);

        if (!session) {
            throw new Error(constants.MESSAGES.no_session)
        }

        if (session.coach_id != user.uid) {
            throw new Error(constants.MESSAGES.session_not_belogs_to_coach)
        }

        params.session = await helperFunction.convertPromiseToObject(session);

        await helperFunction.endZoomMeeting(params);

        return true;
    }
    public async updateSlotAvailability(params: any, user: any) {
        let where: any = {}
        if (params.event_type == 0) {
            where = {
                status: { [Op.in]: [1, 4] },
                coach_id: user.uid,
                date: {
                    [Op.in]: [params.date],
                }
            }
        } else {
            where = {
                status: { [Op.in]: [1, 4] },
                coach_id: user.uid,
                date: {
                    [Op.gte]: params.date,
                }
            }
        }
        for (let slot of params.timings) {
            where.start_time = { [Op.in]: [slot.start_time] };
            where.end_time = { [Op.in]: [slot.end_time] };
            await queryService.updateData({ model: coachScheduleModel, status: params.is_available, is_available: params.is_available }, { where: where })

        }
    }

    public async getUnseenChatNotificationCount(user: any) {

        let count = (await helperFunction.convertPromiseToObject(await notificationModel.count({
            where: {
                reciever_id: user.uid,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
                type: [
                    constants.NOTIFICATION_TYPE.message,
                ],
                status: 1,
            },
            group: ['type_id']
        }))).length;


        await notificationModel.update({
            status: 0,
        }, {
            where: {
                status: 1,
                type: [
                    constants.NOTIFICATION_TYPE.message,
                ],
                reciever_id: user.uid,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
            }
        })


        return { count }

    }

}