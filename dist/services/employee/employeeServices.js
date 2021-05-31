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
exports.EmployeeServices = void 0;
const lodash_1 = __importDefault(require("lodash"));
const constants = __importStar(require("../../constants"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const employee_1 = require("../../models/employee");
const admin_1 = require("../../models/admin");
const employers_1 = require("../../models/employers");
const department_1 = require("../../models/department");
const managerTeamMember_1 = require("../../models/managerTeamMember");
const teamGoalAssign_1 = require("../../models/teamGoalAssign");
const qualitativeMeasurement_1 = require("../../models/qualitativeMeasurement");
const teamGoal_1 = require("../../models/teamGoal");
const emoji_1 = require("../../models/emoji");
const coachManagement_1 = require("../../models/coachManagement");
const contactUs_1 = require("../../models/contactUs");
const notification_1 = require("../../models/notification");
const authService_1 = require("./authService");
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
const authService = new authService_1.AuthService();
class EmployeeServices {
    constructor() { }
    /*
    * function to get list of team members
    */
    getListOfTeamMemberByManagerId(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            managerTeamMember_1.managerTeamMemberModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
            employee_1.employeeModel.hasOne(emoji_1.emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
            let teamMembersData = yield helperFunction.convertPromiseToObject(yield managerTeamMember_1.managerTeamMemberModel.findAndCountAll({
                where: { manager_id: user.uid },
                include: [
                    {
                        model: employee_1.employeeModel,
                        required: false,
                        attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'energy_last_updated', 'profile_pic_url'],
                        include: [
                            {
                                model: emoji_1.emojiModel,
                                required: false,
                                attributes: ['image_url', 'caption'],
                            }
                        ]
                    }
                ],
                limit: limit,
                offset: offset,
                order: [["createdAt", "DESC"]]
            }));
            for (let obj of teamMembersData.rows) {
                obj.isEmployeeEnergyUpdatedInLast24Hour = true;
                const timeDiff = Math.floor(((new Date()).getTime() - (new Date(obj.employee.energy_last_updated)).getTime()) / 1000);
                if (timeDiff > 86400)
                    obj.isEmployeeEnergyUpdatedInLast24Hour = false;
            }
            let date = new Date();
            date.setMonth(date.getMonth() - 3);
            //let dateCheck = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
            let dateCheck = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            for (let i = 0; i < teamMembersData.rows.length; i++) {
                let rateCheck = yield helperFunction.convertPromiseToObject(yield qualitativeMeasurement_1.qualitativeMeasurementModel.findOne({
                    where: {
                        manager_id: user.uid,
                        employee_id: teamMembersData.rows[i].team_member_id,
                        updatedAt: { [Op.gte]: dateCheck }
                    }
                }));
                if (lodash_1.default.isEmpty(rateCheck)) {
                    teamMembersData.rows[i].rate_valid = 1;
                }
                else {
                    teamMembersData.rows[i].rate_valid_after_date = rateCheck.createdAt;
                    teamMembersData.rows[i].rate_valid = 0;
                }
            }
            return teamMembersData;
        });
    }
    /*
    * function to get details of employee
    */
    viewDetailsEmployee(params) {
        return __awaiter(this, void 0, void 0, function* () {
            employee_1.employeeModel.hasMany(teamGoalAssign_1.teamGoalAssignModel, { foreignKey: "employee_id", sourceKey: "id", targetKey: "employee_id" });
            teamGoalAssign_1.teamGoalAssignModel.hasOne(teamGoal_1.teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
            employee_1.employeeModel.hasOne(department_1.departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
            let employeeDetails = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                where: { id: params.id },
                include: [
                    {
                        model: department_1.departmentModel,
                        required: true
                    },
                    {
                        model: teamGoalAssign_1.teamGoalAssignModel,
                        required: false,
                        include: [
                            {
                                model: teamGoal_1.teamGoalModel,
                                required: false
                            }
                        ]
                    },
                ],
                attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'profile_pic_url', 'current_department_id']
            }));
            let qualitativeMeasurement = yield helperFunction.convertPromiseToObject(yield qualitativeMeasurement_1.qualitativeMeasurementModel.findAll({
                where: { employee_id: params.id },
                attributes: ["id", "manager_id", "employee_id", "createdAt", "updatedAt",
                    ["initiative", "Initiative"], ["initiative_desc", "Initiative_desc"],
                    ["ability_to_delegate", "Ability to Delegate"], ["ability_to_delegate_desc", "Ability to Delegate_desc"],
                    ["clear_Communication", "Clear Communication"], ["clear_Communication_desc", "Clear Communication_desc"],
                    //    ["self_awareness_of_strengths_and_weaknesses", "Self-awareness of strengths and weaknesses"], ["self_awareness_of_strengths_and_weaknesses_desc", "Self-awareness of strengths and weaknesses_desc"],
                    ["agile_thinking", "Agile Thinking"], ["agile_thinking_desc", "Agile Thinking_desc"],
                    //    ["influence", "Influence"], ["influence_desc", "Influence_desc"],
                    ["empathy", "Empathy"], ["empathy_desc", "Empathy_desc"],
                ],
                order: [["updatedAt", "DESC"]],
                limit: 1
            }));
            if (qualitativeMeasurement.length != 0) //throw new Error(constants.MESSAGES.no_qualitative_measure);
             {
                let startDate = new Date(qualitativeMeasurement[0].createdAt);
                let endDate = new Date(qualitativeMeasurement[0].createdAt);
                endDate.setMonth(startDate.getMonth() + 3);
                let result = {
                    id: qualitativeMeasurement[0].id,
                    manager_id: qualitativeMeasurement[0].manager_id,
                    employee_id: qualitativeMeasurement[0].employee_id,
                    startDate,
                    endDate,
                    createdAt: qualitativeMeasurement[0].createdAt,
                    updatedAt: qualitativeMeasurement[0].updatedAt,
                    qualitativeMeasures: [],
                };
                for (let key in qualitativeMeasurement[0]) {
                    if ([
                        "Initiative",
                        "Ability to Delegate",
                        "Clear Communication",
                        //    "Self-awareness of strengths and weaknesses",
                        "Agile Thinking",
                        //    "Influence",
                        "Empathy",
                    ].includes(key)) {
                        result.qualitativeMeasures.push({
                            label: key,
                            rating: qualitativeMeasurement[0][key],
                            desc: qualitativeMeasurement[0][`${key}_desc`]
                        });
                    }
                }
                employeeDetails.qualitativeMeasurementDetails = result;
            }
            return employeeDetails;
        });
    }
    /*
    * function to get details of employee
    */
    searchTeamMember(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            managerTeamMember_1.managerTeamMemberModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
            employee_1.employeeModel.hasOne(emoji_1.emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
            let teamMembersData = yield helperFunction.convertPromiseToObject(yield managerTeamMember_1.managerTeamMemberModel.findAndCountAll({
                where: { manager_id: user.uid },
                include: [
                    {
                        model: employee_1.employeeModel,
                        required: true,
                        where: {
                            [Op.or]: [
                                { name: { [Op.iLike]: `%${params.search_string}%` } },
                                { phone_number: { [Op.iLike]: `%${params.search_string}%` } },
                                { email: { [Op.iLike]: `%${params.search_string}%` } }
                            ]
                        },
                        attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'energy_last_updated', 'profile_pic_url'],
                        include: [
                            {
                                model: emoji_1.emojiModel,
                                required: false,
                                attributes: ['image_url', 'caption'],
                            }
                        ]
                    }
                ],
                limit: limit,
                offset: offset,
                order: [["createdAt", "DESC"]]
            }));
            for (let obj of teamMembersData.rows) {
                obj.isEmployeeEnergyUpdatedInLast24Hour = true;
                const timeDiff = Math.floor(((new Date()).getTime() - (new Date(obj.employee.energy_last_updated)).getTime()) / 1000);
                if (timeDiff > 86400)
                    obj.isEmployeeEnergyUpdatedInLast24Hour = false;
            }
            return teamMembersData;
        });
    }
    /*
    * function to add thought of the day
    */
    thoughtOfTheDay(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield employee_1.employeeModel.update({
                thought_of_the_day: params.thought_of_the_day
            }, {
                where: { id: user.uid }
            });
            return employee_1.employeeModel.findOne({
                where: { id: user.uid }
            });
        });
    }
    /*
    * function to add thought of the day
    */
    getEmoji() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield emoji_1.emojiModel.findAll({
                order: [["id"]]
            });
        });
    }
    /*
   * function to add thought of the day
   */
    updateEnergyCheck(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield employee_1.employeeModel.update({
                energy_id: params.energy_id,
                energy_last_updated: new Date(),
            }, {
                where: { id: user.uid }
            });
            return authService.getMyProfile(user);
        });
    }
    /*
    * function to view energy check
    */
    viewEnergyCheckTeamMembers(user) {
        return __awaiter(this, void 0, void 0, function* () {
            managerTeamMember_1.managerTeamMemberModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
            employee_1.employeeModel.hasOne(emoji_1.emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
            return yield managerTeamMember_1.managerTeamMemberModel.findAll({
                where: { manager_id: user.uid },
                include: [
                    {
                        model: employee_1.employeeModel,
                        required: false,
                        attributes: ['id', 'name', 'energy_id'],
                        include: [
                            {
                                model: emoji_1.emojiModel,
                                required: false,
                                attributes: ['image_url', 'caption'],
                            }
                        ]
                    }
                ]
            });
        });
    }
    /*
   * feel about job today
   */
    feelAboutJobToday(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield employee_1.employeeModel.update(params, {
                where: { id: user.uid }
            });
        });
    }
    /*
   * function to update device token
   */
    updateEmployeeDeviceToken(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield employee_1.employeeModel.update({
                device_token: params.device_token
            }, {
                where: { id: user.uid }
            });
            return authService.getMyProfile(user);
        });
    }
    /*
* function to clear device token
*/
    clearEmployeeDeviceToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield employee_1.employeeModel.update({
                device_token: null,
            }, {
                where: { id: user.uid },
                returning: true
            });
        });
    }
    /*
 * function to get current manager
 */
    getCurrentManager(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentManager = yield helperFunction.convertPromiseToObject(yield managerTeamMember_1.managerTeamMemberModel.findOne({
                where: { team_member_id: user.uid },
            }));
            return currentManager;
        });
    }
    /*
    * function to get employee details to show employee detail on dashbord as team member view
    */
    getEmployeeDetails(user) {
        return __awaiter(this, void 0, void 0, function* () {
            employee_1.employeeModel.hasOne(department_1.departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
            employee_1.employeeModel.hasOne(managerTeamMember_1.managerTeamMemberModel, { foreignKey: "team_member_id", sourceKey: "id", targetKey: "team_member_id" });
            managerTeamMember_1.managerTeamMemberModel.hasOne(employee_1.employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
            let employee = yield employee_1.employeeModel.findOne({
                attributes: ['id', 'name', 'employee_code', 'profile_pic_url'],
                where: {
                    id: user.uid
                },
                include: [
                    {
                        model: department_1.departmentModel,
                        required: false,
                        attributes: ['name']
                    },
                    {
                        model: managerTeamMember_1.managerTeamMemberModel,
                        required: false,
                        attributes: ['manager_id'],
                        include: [
                            {
                                model: employee_1.employeeModel,
                                required: false,
                                attributes: ['name'],
                            }
                        ]
                    }
                ],
            });
            return yield helperFunction.convertPromiseToObject(employee);
        });
    }
    /*
    * function to view energy of employee on dashbord as team member view
    */
    viewEmployeeEnergy(user) {
        return __awaiter(this, void 0, void 0, function* () {
            employee_1.employeeModel.hasOne(emoji_1.emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
            let employeeEnergy = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                attributes: ['id', 'name', 'energy_last_updated'],
                where: {
                    id: user.uid
                },
                include: [
                    {
                        model: emoji_1.emojiModel,
                        required: false,
                        attributes: ['id', 'image_url', 'caption']
                    },
                ],
            }));
            employeeEnergy.isUpdateAvailable = false;
            const timeDiff = Math.floor(((new Date()).getTime() - (new Date(employeeEnergy.energy_last_updated)).getTime()) / 1000);
            if (timeDiff > 86400)
                employeeEnergy.isUpdateAvailable = true;
            return employeeEnergy;
        });
    }
    /*
    * function to view thought of the day employee on dashbord as team member view
    */
    viewThoughtOfTheDay(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let employeeThoughtOfTheDay = yield employee_1.employeeModel.findOne({
                attributes: ['id', 'thought_of_the_day'],
                where: {
                    id: user.uid
                },
            });
            return yield helperFunction.convertPromiseToObject(employeeThoughtOfTheDay);
        });
    }
    /*
    * function to view feel About Job Today on dashbord as team member view
    */
    viewFeelAboutJobToday(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let employeeFeelAboutJobToday = yield employee_1.employeeModel.findOne({
                attributes: ['id', 'job_emoji_id', 'job_comments'],
                where: {
                    id: user.uid
                },
            });
            return yield helperFunction.convertPromiseToObject(employeeFeelAboutJobToday);
        });
    }
    /*
    * function to view thought of the day from admin on dashbord as team member view
    */
    viewThoughtOfTheDayFromAdmin(user) {
        return __awaiter(this, void 0, void 0, function* () {
            employee_1.employeeModel.hasOne(employers_1.employersModel, { foreignKey: "id", sourceKey: "current_employer_id", targetKey: "id" });
            employers_1.employersModel.hasOne(admin_1.adminModel, { foreignKey: "id", sourceKey: "admin_id", targetKey: "id" });
            let employeeFeelAboutJobTodayFromAdmin = yield employee_1.employeeModel.findOne({
                attributes: ['id'],
                where: {
                    id: user.uid
                },
                include: [
                    {
                        model: employers_1.employersModel,
                        required: false,
                        attributes: ['id', 'thought_of_the_day'],
                        include: [
                            {
                                model: admin_1.adminModel,
                                required: false,
                                attributes: ['id', 'thought_of_the_day']
                            },
                        ],
                    },
                ],
            });
            return yield helperFunction.convertPromiseToObject(employeeFeelAboutJobTodayFromAdmin);
        });
    }
    /*
   * function to get coach list
   */
    getCoachList(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let coachList = yield coachManagement_1.coachManagementModel.findAndCountAll({
                attributes: ['id', 'name', 'description'],
                where: {
                    status: constants.STATUS.active,
                }
            });
            return yield helperFunction.convertPromiseToObject(coachList);
        });
    }
    /*
  * function to contact admin
  */
    contactUs(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let employee = yield helperFunction.convertPromiseToObject(yield employee_1.employeeModel.findOne({
                where: {
                    id: user.uid,
                }
            }));
            let contactObj = {
                //employer_id: employee.current_employer_id,
                employee_id: user.uid,
                message: params.message,
                status: constants.STATUS.active,
            };
            return yield contactUs_1.contactUsModel.create(contactObj);
        });
    }
    /*
* function to get notification
*/
    getNotifications(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let notifications = yield helperFunction.convertPromiseToObject(yield notification_1.notificationModel.findAndCountAll({
                where: {
                    reciever_id: user.uid,
                    type: {
                        [Op.notIn]: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                            constants.NOTIFICATION_TYPE.message
                        ]
                    },
                    status: [0, 1]
                },
                order: [["createdAt", "DESC"]]
            }));
            yield notification_1.notificationModel.update({
                status: 0,
            }, {
                where: {
                    status: 1,
                    type: {
                        [Op.notIn]: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                            constants.NOTIFICATION_TYPE.message
                        ]
                    },
                    reciever_id: user.uid,
                }
            });
            return notifications;
        });
    }
    /*
* function to get unseen notification count
*/
    getUnseenNotificationCount(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                all: yield notification_1.notificationModel.count({
                    where: {
                        reciever_id: user.uid,
                        type: {
                            [Op.notIn]: [
                                constants.NOTIFICATION_TYPE.achievement_post,
                                constants.NOTIFICATION_TYPE.message
                            ]
                        },
                        status: 1,
                    }
                }),
                achievement: yield notification_1.notificationModel.count({
                    where: {
                        reciever_id: user.uid,
                        type: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                            constants.NOTIFICATION_TYPE.achievement_like,
                            constants.NOTIFICATION_TYPE.achievement_highfive,
                            constants.NOTIFICATION_TYPE.achievement_comment,
                        ],
                        status: 1,
                    }
                }),
                achievement_post_only: yield notification_1.notificationModel.count({
                    where: {
                        reciever_id: user.uid,
                        type: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                        ],
                        status: 1,
                    }
                }),
                chat: yield notification_1.notificationModel.count({
                    where: {
                        reciever_id: user.uid,
                        type: [
                            constants.NOTIFICATION_TYPE.message,
                            constants.NOTIFICATION_TYPE.audio_chat,
                            constants.NOTIFICATION_TYPE.video_chat,
                            constants.NOTIFICATION_TYPE.audio_chat_missed,
                            constants.NOTIFICATION_TYPE.video_chat_missed,
                            constants.NOTIFICATION_TYPE.chat_disconnect,
                        ],
                        status: 1,
                    }
                }),
                chat_message_only: (yield helperFunction.convertPromiseToObject(yield notification_1.notificationModel.count({
                    where: {
                        reciever_id: user.uid,
                        type: [
                            constants.NOTIFICATION_TYPE.message,
                        ],
                        status: 1,
                    },
                    group: ['type_id']
                }))).length,
                goal: yield notification_1.notificationModel.count({
                    where: {
                        reciever_id: user.uid,
                        type: [
                            constants.NOTIFICATION_TYPE.assign_new_goal,
                            constants.NOTIFICATION_TYPE.goal_complete_request,
                            constants.NOTIFICATION_TYPE.goal_accept,
                            constants.NOTIFICATION_TYPE.goal_reject,
                        ],
                        status: 1,
                    }
                }),
                rating: yield notification_1.notificationModel.count({
                    where: {
                        reciever_id: user.uid,
                        type: [
                            constants.NOTIFICATION_TYPE.rating
                        ],
                        status: 1,
                    }
                })
            };
        });
    }
    /*
* function to mark as viewed notification
*/
    markNotificationsAsViewed(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let whereCondition = null;
            if (params && params.type) {
                if (params.type == "achievement") {
                    whereCondition = Object.assign(Object.assign({}, whereCondition), { type: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                            constants.NOTIFICATION_TYPE.achievement_like,
                            constants.NOTIFICATION_TYPE.achievement_highfive,
                            constants.NOTIFICATION_TYPE.achievement_comment,
                        ] });
                }
                else if (params.type == "achievement_post_only") {
                    whereCondition = Object.assign(Object.assign({}, whereCondition), { type: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                        ] });
                }
                else if (params.type == "chat") {
                    whereCondition = Object.assign(Object.assign({}, whereCondition), { type: [
                            constants.NOTIFICATION_TYPE.message,
                            constants.NOTIFICATION_TYPE.audio_chat,
                            constants.NOTIFICATION_TYPE.video_chat,
                            constants.NOTIFICATION_TYPE.audio_chat_missed,
                            constants.NOTIFICATION_TYPE.video_chat_missed,
                            constants.NOTIFICATION_TYPE.chat_disconnect,
                        ] });
                }
                else if (params.type == "chat_message_only") {
                    if (!params.chat_room_id)
                        throw new Error(constants.MESSAGES.chat_room_required);
                    whereCondition = Object.assign(Object.assign({}, whereCondition), { type: [
                            constants.NOTIFICATION_TYPE.message,
                        ], type_id: parseInt(params.chat_room_id) });
                }
                else if (params.type == "goal") {
                    whereCondition = Object.assign(Object.assign({}, whereCondition), { type: [
                            constants.NOTIFICATION_TYPE.assign_new_goal,
                            constants.NOTIFICATION_TYPE.goal_complete_request,
                            constants.NOTIFICATION_TYPE.goal_accept,
                            constants.NOTIFICATION_TYPE.goal_reject,
                        ] });
                }
                else if (params.type == "rating") {
                    whereCondition = Object.assign(Object.assign({}, whereCondition), { type: [
                            constants.NOTIFICATION_TYPE.rating
                        ] });
                }
            }
            else {
                whereCondition = Object.assign(Object.assign({}, whereCondition), { type: {
                        [Op.notIn]: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                            constants.NOTIFICATION_TYPE.message
                        ]
                    } });
            }
            let notification = yield helperFunction.convertPromiseToObject(yield notification_1.notificationModel.update({
                status: 0,
            }, {
                where: Object.assign(Object.assign({}, whereCondition), { status: 1, reciever_id: user.uid })
            }));
            return notification;
        });
    }
    /**
     * function to refer a friend
     * @param params
     * @param user
     */
    referFriend(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailParams = {};
            mailParams.to = params.email;
            mailParams.html = `Hi  ${params.name}
                <br> Please download the app by clicking on link below and use the your credentials for login into the app :
                <br><br><b> Android URL</b>: ${process.env.EMPLOYER_ANDROID_URL}
                <br><b> IOS URL</b>: ${process.env.EMPLOYER_IOS_URL} <br>
                `;
            mailParams.subject = "BluXinga Friend Referral";
            yield helperFunction.sendEmail(mailParams);
            return true;
        });
    }
}
exports.EmployeeServices = EmployeeServices;
//# sourceMappingURL=employeeServices.js.map