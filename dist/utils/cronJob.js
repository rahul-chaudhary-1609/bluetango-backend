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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleSystemActionOnSessions = exports.scheduleMeetingSessionNotificationJob = exports.scheduleDeleteNotificationJob = exports.scheduleGoalSubmitReminderNotificationJob = exports.scheduleFreeTrialExpirationNotificationJob = void 0;
const constants = __importStar(require("../constants"));
const helperFunction = __importStar(require("../utils/helperFunction"));
const models_1 = require("../models");
const employee_1 = require("../models/employee");
const notification_1 = require("../models/notification");
const teamGoal_1 = require("../models/teamGoal");
const teamGoalAssign_1 = require("../models/teamGoalAssign");
const teamGoalAssignCompletionByEmployee_1 = require("../models/teamGoalAssignCompletionByEmployee");
const index_1 = require("../models/index");
const schedule = require('node-schedule');
const Sequelize = require('sequelize');
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
var Op = Sequelize.Op;
const queryService = __importStar(require("../queryService/bluetangoAdmin/queryService"));
const sessionManagementService_1 = require("../services/bluetangoAdmin/sessionManagementService");
/*
* function to schedule job
*/
exports.scheduleFreeTrialExpirationNotificationJob = () => __awaiter(void 0, void 0, void 0, function* () {
    schedule.scheduleJob('0 7 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        let employers = yield helperFunction.convertPromiseToObject(yield models_1.employersModel.findAll({
            where: {
                status: constants.STATUS.active,
                subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.free
            }
        }));
        for (let employer of employers) {
            if (employer.free_trial_status == constants.EMPLOYER_FREE_TRIAL_STATUS.on_going) {
                let trialExpiryDate = new Date(employer.free_trial_start_datetime);
                trialExpiryDate.setDate(trialExpiryDate.getDate() + 14);
                const timeRemaining = Math.floor((trialExpiryDate.getTime() - (new Date()).getTime()) / 1000);
                if (Math.floor(timeRemaining / 3600) <= 72 && Math.floor(timeRemaining / 3600) >= 0) {
                    let notificationObj = {
                        type_id: employer.id,
                        sender_id: employer.id,
                        reciever_id: employer.id,
                        reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employer,
                        type: constants.NOTIFICATION_TYPE.expiration_of_free_trial,
                        data: {
                            type: constants.NOTIFICATION_TYPE.expiration_of_free_trial,
                            title: 'Reminder',
                            message: `Employer free trial of 14 days is going to expire in ${Math.floor(timeRemaining / 3600)} hour(s)`,
                            senderEmplyeeData: employer
                        },
                    };
                    yield notification_1.notificationModel.create(notificationObj);
                    if (!employer.device_token)
                        continue;
                    //send push notification
                    let notificationData = {
                        title: 'Reminder',
                        body: `Employer free trial of 14 days is going to expire in ${Math.floor(timeRemaining / 3600)} hour(s)`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.expiration_of_free_trial,
                            title: 'Reminder',
                            message: `Employer free trial of 14 days is going to expire in ${Math.floor(timeRemaining / 3600)} hour(s)`,
                            senderEmplyeeData: employer
                        },
                    };
                    yield helperFunction.sendFcmNotification([employer.device_token], notificationData);
                }
                else if (Math.floor(timeRemaining / 3600) < 0) {
                    yield models_1.employersModel.update({
                        subscription_type: constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan,
                        free_trial_status: constants.EMPLOYER_FREE_TRIAL_STATUS.over,
                    }, {
                        where: {
                            id: parseInt(employer.id),
                        }
                    });
                }
            }
        }
    }));
    console.log("Free trial expiration notification cron job started!");
    return true;
});
/*
* function to schedule job
*/
exports.scheduleGoalSubmitReminderNotificationJob = () => __awaiter(void 0, void 0, void 0, function* () {
    schedule.scheduleJob('0 10 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        teamGoalAssign_1.teamGoalAssignModel.hasOne(teamGoal_1.teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
        teamGoalAssign_1.teamGoalAssignModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
        teamGoal_1.teamGoalModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
        teamGoalAssign_1.teamGoalAssignModel.hasMany(teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel, { foreignKey: "team_goal_assign_id", sourceKey: "id", targetKey: "team_goal_assign_id" });
        let employees = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findAll({
            where: {
                status: constants.STATUS.active,
            }
        }));
        for (let employee of employees) {
            let goals = yield helperFunction.convertPromiseToObject(yield teamGoalAssign_1.teamGoalAssignModel.findAll({
                where: { employee_id: employee.id },
                include: [
                    {
                        model: teamGoal_1.teamGoalModel,
                        required: false,
                    },
                    {
                        model: teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel,
                        separate: true,
                        required: false,
                        order: [["createdAt", "DESC"]]
                    }
                ],
                order: [["createdAt", "DESC"]]
            }));
            let isActiveInPastTenDays = true;
            let employeeLastGoalReminderDate = new Date(employee.last_goal_reminder_datetime);
            for (let goal of goals) {
                let goalEndDate = new Date(goal.team_goal.end_date);
                let employeeLastSubmitReminderDate = new Date(goal.last_submit_reminder_datetime);
                let employeeLastActivityDate = ((_a = goal.team_goal_assign_completion_by_employees[0]) === null || _a === void 0 ? void 0 : _a.updatedAt) && new Date(goal.team_goal_assign_completion_by_employees[0].updatedAt);
                let timeDiff = Math.floor((goalEndDate.getTime() - (new Date()).getTime()) / 1000);
                if (parseInt(goal.team_goal.enter_measure) > parseInt(goal.complete_measure)) {
                    if (timeDiff > 0) {
                        if (employeeLastActivityDate) {
                            timeDiff = Math.floor(((new Date()).getTime() - employeeLastActivityDate.getTime()) / 1000);
                        }
                        if (!employeeLastActivityDate || timeDiff > 864000) {
                            isActiveInPastTenDays = false;
                        }
                        if (!employeeLastActivityDate || timeDiff > 604800) {
                            timeDiff = Math.floor(((new Date()).getTime() - employeeLastSubmitReminderDate.getTime()) / 1000);
                            if (timeDiff > 420) {
                                let notificationObj = {
                                    type_id: employee.id,
                                    sender_id: employee.id,
                                    reciever_id: employee.id,
                                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                                    type: constants.NOTIFICATION_TYPE.goal_submit_reminder,
                                    data: {
                                        type: constants.NOTIFICATION_TYPE.goal_submit_reminder,
                                        title: 'Reminder',
                                        message: `You have not filled anything in respect of goal ${goal.team_goal.title} in past 7 days.`,
                                        senderEmplyeeData: employee
                                    },
                                };
                                yield notification_1.notificationModel.create(notificationObj);
                                if (!employee.device_token)
                                    continue;
                                //send push notification
                                let notificationData = {
                                    title: 'Reminder',
                                    body: `You have not filled anything in respect of goal ${goal.team_goal.title} in past 7 days.`,
                                    data: {
                                        type: constants.NOTIFICATION_TYPE.goal_submit_reminder,
                                        title: 'Reminder',
                                        message: `You have not filled anything in respect of goal ${goal.team_goal.title} in past 7 days.`,
                                        senderEmplyeeData: employee
                                    },
                                };
                                yield helperFunction.sendFcmNotification([employee.device_token], notificationData);
                                yield teamGoalAssign_1.teamGoalAssignModel.update({
                                    last_submit_reminder_datetime: new Date(),
                                }, {
                                    where: {
                                        id: goal.id
                                    }
                                });
                            }
                        }
                    }
                }
            }
            let timeDiff = Math.floor(((new Date()).getTime() - employeeLastGoalReminderDate.getTime()) / 1000);
            if (timeDiff > 864000) {
                isActiveInPastTenDays = false;
            }
            else {
                isActiveInPastTenDays = true;
            }
            if (!isActiveInPastTenDays && goals && goals.length > 0) {
                let notificationObj = {
                    type_id: employee.id,
                    sender_id: employee.id,
                    reciever_id: employee.id,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: constants.NOTIFICATION_TYPE.goal_submit_reminder,
                    data: {
                        type: constants.NOTIFICATION_TYPE.goal_submit_reminder,
                        title: 'Reminder',
                        message: `You have not filled anything in respect of any goal in past 10 days.`,
                        senderEmplyeeData: employee
                    },
                };
                yield notification_1.notificationModel.create(notificationObj);
                if (!employee.device_token)
                    continue;
                //send push notification
                let notificationData = {
                    title: 'Reminder',
                    body: `You have not filled anything in respect of any goal in past 10 days.`,
                    data: {
                        type: constants.NOTIFICATION_TYPE.goal_submit_reminder,
                        title: 'Reminder',
                        message: `You have not filled anything in respect of any goal in past 10 days.`,
                        senderEmplyeeData: employee
                    },
                };
                yield helperFunction.sendFcmNotification([employee.device_token], notificationData);
                yield employee_1.employeeModel.update({
                    last_goal_reminder_datetime: new Date(),
                }, {
                    where: {
                        id: employee.id
                    }
                });
            }
        }
    }));
    console.log("Goal submit reminder notification cron job has started!");
    return true;
});
exports.scheduleDeleteNotificationJob = () => __awaiter(void 0, void 0, void 0, function* () {
    schedule.scheduleJob('0 */24 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        let dateBeforeTenDays = new Date((new Date()).setDate(new Date().getDate() - 10));
        notification_1.notificationModel.destroy({
            where: {
                createdAt: {
                    [Op.lt]: dateBeforeTenDays,
                },
                status: {
                    [Op.notIn]: [constants.STATUS.active]
                }
            }
        });
        let dateBeforeSixtyDays = new Date((new Date()).setDate(new Date().getDate() - 30));
        notification_1.notificationModel.destroy({
            where: {
                createdAt: {
                    [Op.lt]: dateBeforeSixtyDays,
                },
            }
        });
    }));
    console.log("Delete Notification cron job has started!");
    return true;
});
const sendNotification = (params) => __awaiter(void 0, void 0, void 0, function* () {
    if (params.isCoach) {
        let coach = yield helperFunction.convertPromiseToObject(yield models_1.coachManagementModel.findByPk(params.session.coach_id));
        delete coach.password;
        let notificationObj = {
            type_id: params.session.id,
            sender_id: coach.id,
            reciever_id: coach.id,
            reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.coach,
            type: params.notificationType,
            data: {
                type: params.notificationType,
                title: params.title,
                message: params.body,
                senderEmplyeeData: coach,
                session: params.session,
            },
        };
        yield notification_1.notificationModel.create(notificationObj);
        if (coach.device_token) {
            //send push notification
            let notificationData = {
                title: params.title,
                body: params.body,
                data: {
                    type: params.notificationType,
                    title: params.title,
                    message: params.body,
                    senderEmplyeeData: coach,
                    session: params.session,
                },
            };
            yield helperFunction.sendFcmNotification([coach.device_token], notificationData);
        }
    }
    if (params.isEmployee) {
        let employee = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findByPk(params.session.employee_id));
        delete employee.password;
        let notificationObj = {
            type_id: params.session.id,
            sender_id: employee.id,
            reciever_id: employee.id,
            reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
            type: params.notificationType,
            data: {
                type: params.notificationType,
                title: params.title,
                message: params.body,
                senderEmplyeeData: employee,
                session: params.session,
            },
        };
        yield notification_1.notificationModel.create(notificationObj);
        if (employee.device_token) {
            //send push notification
            let notificationData = {
                title: params.title,
                body: params.body,
                data: {
                    type: params.notificationType,
                    title: params.title,
                    message: params.body,
                    senderEmplyeeData: employee,
                    session: params.session,
                },
            };
            yield helperFunction.sendFcmNotification([employee.device_token], notificationData);
        }
    }
});
exports.scheduleMeetingSessionNotificationJob = () => __awaiter(void 0, void 0, void 0, function* () {
    schedule.scheduleJob('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        let sessions = yield helperFunction.convertPromiseToObject(yield index_1.employeeCoachSessionsModel.findAll({
            where: {
                status: constants.EMPLOYEE_COACH_SESSION_STATUS.accepted,
                date: {
                    [Op.gte]: moment_1.default(new Date()).tz(constants.TIME_ZONE).format("YYYY-MM-DD")
                },
                end_time: {
                    [Op.gte]: moment_1.default(new Date()).tz(constants.TIME_ZONE).format("HH:mm:ss")
                }
            }
        }));
        for (let session of sessions) {
            let currentDateTime = moment_1.default(new Date()).tz(constants.TIME_ZONE).format("HH:mm:ss");
            let currentTime = moment_1.default(currentDateTime, "HH:mm:ss");
            let startTime = moment_1.default(session.start_time, "HH:mm:ss");
            let endTime = moment_1.default(session.end_time, "HH:mm:ss");
            let startDuration = moment_1.default.duration(currentTime.diff(startTime));
            let endDuration = moment_1.default.duration(endTime.diff(currentTime));
            let leftToStartDuration = moment_1.default.duration(startTime.diff(currentTime));
            let diffFromStartInSeconds = Math.ceil(startDuration.asSeconds());
            let diffToEndInSeconds = Math.ceil(endDuration.asSeconds());
            let diffToStartInSeconds = Math.ceil(leftToStartDuration.asSeconds());
            console.log(currentTime, "\n", startTime, "\n", endTime, "\n", "\n", diffFromStartInSeconds, "\n", diffToEndInSeconds, "/n", diffToStartInSeconds);
            if (session.type == constants.EMPLOYEE_COACH_SESSION_TYPE.free) {
                if (diffToStartInSeconds == 600) {
                    let params = {
                        notificationType: constants.NOTIFICATION_TYPE.session_with_in_10_min,
                        session,
                        title: `Reminder`,
                        body: `Next Session in 10 minutes`,
                        isEmployee: true,
                        isCoach: true,
                    };
                    yield sendNotification(params);
                }
                else if (diffFromStartInSeconds == 1200) {
                    let params = {
                        session,
                    };
                    yield helperFunction.endZoomMeeting(params);
                }
                else if (diffToEndInSeconds == 0) {
                    let extendingMinutes = Math.floor((1200 - diffFromStartInSeconds) / 60);
                    let params = {
                        notificationType: constants.NOTIFICATION_TYPE.update_meeting_duration,
                        session,
                        title: `Meeting duration updated`,
                        body: `We are extending the duration of the meeting by ${extendingMinutes} minutes. It will automatically disconnect after ${extendingMinutes} minutes`,
                        isEmployee: false,
                        isCoach: true,
                    };
                    yield sendNotification(params);
                    params.extendingMinutes = extendingMinutes;
                    yield helperFunction.updateZoomMeetingDuration(params);
                }
                else if (diffToEndInSeconds == 300) {
                    let params = {
                        notificationType: constants.NOTIFICATION_TYPE.meeting_about_to_end,
                        session,
                        title: `Reminder`,
                        body: `Ongoing zoom meeting duration will end in 5 minutes`,
                        isEmployee: true,
                        isCoach: true,
                    };
                    yield sendNotification(params);
                }
            }
            else if (session.type == constants.EMPLOYEE_COACH_SESSION_TYPE.paid) {
                if (diffToEndInSeconds == 300) {
                    let params = {
                        notificationType: constants.NOTIFICATION_TYPE.meeting_about_to_end,
                        session,
                        title: `Reminder`,
                        body: `Ongoing zoom meeting duration will end in 5 minutes`,
                        isEmployee: true,
                        isCoach: true,
                    };
                    yield sendNotification(params);
                }
            }
        }
        let current_time = moment_1.default(new Date()).tz(constants.TIME_ZONE).format("YYYY-MM-DD HH:mm:ss");
        if (current_time) {
            let sessions = yield helperFunction.convertPromiseToObject(yield index_1.employeeCoachSessionsModel.findAll({
                where: {
                    date: {
                        [Op.gte]: moment_1.default(new Date()).tz(constants.TIME_ZONE).format("YYYY-MM-DD")
                    },
                    status: [
                        constants.EMPLOYEE_COACH_SESSION_STATUS.pending,
                        constants.EMPLOYEE_COACH_SESSION_STATUS.accepted,
                    ]
                }
            }));
            for (let session of sessions) {
                let startTime = moment_1.default(`${current_time}`, "YYYY-MM-DD HH:mm:ss");
                let endTime = moment_1.default(`${session.date} ${session.end_time}`, "YYYY-MM-DD HH:mm:ss");
                let duration = moment_1.default.duration(endTime.diff(startTime));
                let secondDiff = Math.ceil(duration.asSeconds());
                if (secondDiff <= 0) {
                    if (session.status == constants.EMPLOYEE_COACH_SESSION_STATUS.pending) {
                        yield index_1.employeeCoachSessionsModel.update({
                            status: constants.EMPLOYEE_COACH_SESSION_STATUS.rejected,
                        }, {
                            where: {
                                id: session.id,
                            }
                        });
                        let params = {
                            notificationType: constants.NOTIFICATION_TYPE.session_rejected,
                            session,
                            title: `Info`,
                            body: `Session Rejected`,
                            isEmployee: true,
                            isCoach: false,
                        };
                        yield sendNotification(params);
                    }
                    else if (session.status == constants.EMPLOYEE_COACH_SESSION_STATUS.accepted) {
                        let startTime = moment_1.default(session.start_time, "HH:mm:ss");
                        let endTime = moment_1.default(session.end_time, "HH:mm:ss");
                        let duration = moment_1.default.duration(endTime.diff(startTime));
                        yield index_1.employeeCoachSessionsModel.update({
                            status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                            call_duration: Math.ceil(duration.asMinutes()),
                        }, {
                            where: {
                                id: session.id,
                            }
                        });
                        let params = {
                            notificationType: constants.NOTIFICATION_TYPE.session_completed,
                            session,
                            title: `Info`,
                            body: `Session Completed`,
                            isEmployee: true,
                            isCoach: true,
                        };
                        yield sendNotification(params);
                    }
                }
            }
        }
    }));
    console.log("Meeting sessions Notification Job has started!");
    return true;
});
/*
*perform action on sessions
*/
const sessionExpire = (params) => __awaiter(void 0, void 0, void 0, function* () {
    let Sessions = yield new sessionManagementService_1.SessionManagementService().getSessionDetail(params);
    params.model = index_1.employeeCoachSessionsModel;
    params.action_by = constants.ACTION_BY.system;
    if (Sessions.timeline) {
        params.timeline = [...Sessions.timeline, {
                "name": Sessions.name,
                "request_received": Sessions.request_received_date,
                "status": "Sent",
                "action": Number(params.action),
                "action_by": constants.ACTION_BY.system
            }];
    }
    else {
        params.timeline = [{
                "name": Sessions.name,
                "request_received": Sessions.request_received_date,
                "status": "Sent",
                "action": Number(params.action),
                "action_by": constants.ACTION_BY.system
            }];
    }
    let sessions = yield queryService.updateData(params, { where: { id: params.id } });
    let mailParams = {};
    mailParams.to = Sessions.email;
    mailParams.html = `Hi  ${Sessions.name}
            <br>session expired with the session id:${Sessions.id}
            `;
    mailParams.subject = "Session expired";
    mailParams.name = "BlueTango";
    // await helperFunction.sendEmail(mailParams);
    return sessions;
});
const randomsSessionSchedule = (params) => __awaiter(void 0, void 0, void 0, function* () {
    let coaches = yield new sessionManagementService_1.SessionManagementService().getAvailabileCoaches(params);
    coaches = coaches.rows.filter(elem => elem.status == 1);
    let random_index = Math.floor(Math.random() * coaches.length);
    coaches = coaches[random_index];
    params.model = index_1.employeeCoachSessionsModel;
    params.date = coaches.date;
    params.start_time = coaches.start_time;
    params.end_time = coaches.end_time;
    params.slot_id = coaches.id;
    params.coach_id = coaches.coach_id;
    params.request_received_date = Date.now();
    let sessions = yield queryService.updateData(params, { returning: true, where: { id: params.id } });
    yield queryService.updateData({ model: index_1.coachScheduleModel, status: 2 }, { where: { id: coaches.id } });
    let Sessions = yield new sessionManagementService_1.SessionManagementService().getSessionDetail(params);
    // let mailParams = <any>{};
    // mailParams.to = Sessions.email;
    // mailParams.html = `Hi  ${Sessions.name}
    //         <br>A new session is assigned to you by admin with session id:${Sessions.id}
    //         `;
    // mailParams.subject = "Session Assign";
    // mailParams.name = "BlueTango"
    //await helperFunction.sendEmail(mailParams);
    return sessions;
});
exports.scheduleSystemActionOnSessions = () => __awaiter(void 0, void 0, void 0, function* () {
    schedule.scheduleJob('*/20 * * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        index_1.employeeCoachSessionsModel.hasOne(models_1.coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" });
        let sessions = yield queryService.selectAll(index_1.employeeCoachSessionsModel, {
            where: { action: { [Op.in]: [1, 2, 3, 4] }, status: { [Op.in]: [1, 3] } },
            include: [
                {
                    model: models_1.coachManagementModel,
                    required: true,
                    attributes: [],
                    where: { app_id: constants.COACH_APP_ID.BT }
                }
            ],
            raw: true,
            attributes: ["id", "coach_id", "query", "date", "start_time", "action", "end_time", "status", "type", "action_by", "request_received_date"]
        }, {});
        sessions.forEach((ele, index, arr) => {
            let received_date = new Date(ele.request_received_date).setHours(new Date(ele.request_received_date).getHours() + 24);
            let current_date = Date.now();
            let params = {};
            switch (ele.action) {
                case 1:
                    //for automatic expire
                    if (received_date < current_date) {
                        params.id = ele.id;
                        params.action = constants.SESSION_ACTION.expired;
                        return sessionExpire(params);
                    }
                case 2:
                    //for declined session reassign
                    if (moment_1.default(current_date).format("YYYY-MM-DD") < ele.date) {
                        params.id = ele.id;
                        params.action_by = constants.ACTION_BY.pending;
                        return randomsSessionSchedule(params);
                    }
                case 3:
                    //for expired session reassign
                    if (moment_1.default(current_date).format("YYYY-MM-DD") < ele.date) {
                        params.id = ele.id;
                        params.action_by = constants.ACTION_BY.pending;
                        return randomsSessionSchedule(params);
                    }
            }
        });
    }));
});
//# sourceMappingURL=cronJob.js.map