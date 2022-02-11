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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeManagement = void 0;
const models_1 = require("../../models");
const constants = __importStar(require("../../constants"));
const appUtils = __importStar(require("../../utils/appUtils"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const Sequelize = require('sequelize');
const managerTeamMember_1 = require("../../models/managerTeamMember");
const teamGoal_1 = require("../../models/teamGoal");
const qualitativeMeasurement_1 = require("../../models/qualitativeMeasurement");
const teamGoalAssign_1 = require("../../models/teamGoalAssign");
const emoji_1 = require("../../models/emoji");
const groupChatRoom_1 = require("../../models/groupChatRoom");
const attributes_1 = require("../../models/attributes");
const attributeRatings_1 = require("../../models/attributeRatings");
const employeeRanks_1 = require("../../models/employeeRanks");
const teamGoalAssignCompletionByEmployee_1 = require("../../models/teamGoalAssignCompletionByEmployee");
var Op = Sequelize.Op;
class EmployeeManagement {
    constructor() { }
    /**
     * to check whether user have any active plan or not
     */
    haveActivePlan(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let employer = yield helperFunction.convertPromiseToObject(yield models_1.employersModel.findByPk(parseInt(user.uid)));
            if (employer.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan && employer.free_trial_status == constants.EMPLOYER_FREE_TRIAL_STATUS.over)
                return false;
            else
                return true;
        });
    }
    migrateGoalsToNewManager(manager_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            teamGoalAssign_1.teamGoalAssignModel.hasOne(teamGoal_1.teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
            let goalAssigns = yield helperFunction.convertPromiseToObject(yield teamGoalAssign_1.teamGoalAssignModel.findAll({
                where: {
                    employee_id,
                },
                include: [
                    {
                        model: teamGoal_1.teamGoalModel,
                        required: true,
                    }
                ]
            }));
            for (let goalAssign of goalAssigns) {
                let newGoalObj = {
                    manager_id,
                    title: goalAssign.team_goal.title,
                    description: goalAssign.team_goal.description,
                    start_date: goalAssign.team_goal.start_date,
                    end_date: goalAssign.team_goal.end_date,
                    select_measure: goalAssign.team_goal.select_measure,
                    enter_measure: goalAssign.team_goal.enter_measure,
                };
                let [newGoal, created] = yield helperFunction.convertPromiseToObject(yield teamGoal_1.teamGoalModel.findOrCreate({
                    where: newGoalObj,
                    defaults: newGoalObj,
                }));
                yield teamGoalAssign_1.teamGoalAssignModel.update({
                    goal_id: newGoal.id,
                }, {
                    where: {
                        id: goalAssign.id,
                    }
                });
                yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.update({
                    goal_id: newGoal.id,
                }, {
                    where: {
                        team_goal_assign_id: goalAssign.id,
                    }
                });
            }
        });
    }
    /**
    * add edit employee function
    @param {} params pass all parameters from request
    */
    addEditEmployee(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            params.email = (params.email).toLowerCase();
            params.name = params.first_name + " " + params.last_name;
            if (params.current_department_id) {
                let departmentExists = yield models_1.departmentModel.findOne({ where: { id: params.current_department_id } });
                if (!departmentExists)
                    throw new Error(constants.MESSAGES.invalid_department);
            }
            let existingUser = null;
            if (params.id) {
                existingUser = yield models_1.employeeModel.findOne({
                    where: {
                        [Op.or]: [
                            { email: params.email },
                            { phone_number: params.phone_number },
                        ],
                        status: {
                            [Op.in]: [0, 1]
                        },
                        id: {
                            [Op.ne]: params.id
                        }
                    }
                });
            }
            else {
                existingUser = yield models_1.employeeModel.findOne({
                    where: {
                        [Op.or]: [
                            { email: params.email },
                            { phone_number: params.phone_number },
                        ],
                        status: {
                            [Op.in]: [0, 1]
                        }
                    }
                });
            }
            params.current_employer_id = user.uid;
            if (!existingUser) {
                // let isEmployeeCodeExist = null;
                // if (params.id) {
                //     isEmployeeCodeExist = await employeeModel.findOne({
                //         where: {
                //             // employee_code: params.employee_code,
                //             current_employer_id: params.current_employer_id,
                //             status: {
                //                 [Op.in]: [0, 1]
                //             },
                //             id: {
                //                 [Op.ne]: params.id
                //             }
                //         }
                //     });
                // } else {
                //     isEmployeeCodeExist = await employeeModel.findOne({
                //         where: {
                //             // employee_code: params.employee_code,
                //             current_employer_id: params.current_employer_id,
                //             status: {
                //                 [Op.in]: [0, 1]
                //             }
                //         }
                //     });
                // }
                // if (!isEmployeeCodeExist) {
                if (params.is_manager == 1) {
                    if (!params.manager_team_name) {
                        throw new Error(constants.MESSAGES.manager_team_name_required);
                    }
                    if (!params.manager_team_icon_url) {
                        throw new Error(constants.MESSAGES.manager_team_icon_url_required);
                    }
                }
                if (params.id) {
                    delete params.password;
                    let updateData = yield models_1.employeeModel.update(params, {
                        where: { id: params.id }
                    });
                    if (updateData) {
                        let managerData = yield helperFunction.convertPromiseToObject(yield managerTeamMember_1.managerTeamMemberModel.findOne({
                            where: { team_member_id: params.id }
                        }));
                        if (managerData && params.manager_id) {
                            if (managerData.manager_id != parseInt(params.manager_id)) {
                                yield managerTeamMember_1.managerTeamMemberModel.update({
                                    manager_id: params.manager_id
                                }, {
                                    where: { team_member_id: params.id }
                                });
                                yield this.migrateGoalsToNewManager(params.manager_id, params.id);
                            }
                        }
                        else if (params.manager_id) {
                            let teamMemberObj = {
                                team_member_id: params.id,
                                manager_id: params.manager_id
                            };
                            yield managerTeamMember_1.managerTeamMemberModel.create(teamMemberObj);
                        }
                        else if (managerData) {
                            let where = {
                                team_member_id: params.id,
                                manager_id: managerData.manager_id
                            };
                            yield managerTeamMember_1.managerTeamMemberModel.destroy({ where });
                        }
                        let employeeRes = yield helperFunction.convertPromiseToObject(yield models_1.employeeModel.findOne({
                            where: { id: params.id }
                        }));
                        if (params.is_manager == 1) {
                            let groupChatRoom = yield groupChatRoom_1.groupChatRoomModel.findOne({
                                where: {
                                    manager_id: parseInt(params.id),
                                }
                            });
                            if (groupChatRoom) {
                                groupChatRoom.name = params.manager_team_name;
                                groupChatRoom.icon_image_url = params.manager_team_icon_url;
                                groupChatRoom.save();
                            }
                            else {
                                let groupChatRoomObj = {
                                    name: params.manager_team_name,
                                    manager_id: parseInt(params.id),
                                    member_ids: [],
                                    live_member_ids: [],
                                    room_id: yield helperFunction.getUniqueChatRoomId(),
                                    icon_image_url: params.manager_team_icon_url,
                                    info: [{
                                            id: parseInt(params.id),
                                            chatLastDeletedOn: new Date(),
                                            isDeleted: false,
                                            type: constants.CHAT_USER_TYPE.employee,
                                        }],
                                };
                                groupChatRoom = yield helperFunction.convertPromiseToObject(yield groupChatRoom_1.groupChatRoomModel.create(groupChatRoomObj));
                            }
                            employeeRes.groupChatRoom = groupChatRoom;
                        }
                        return employeeRes;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    // let password = params.password;
                    let password = yield helperFunction.generaePassword();
                    params.password = yield appUtils.bcryptPassword(password);
                    let employeeRes = yield models_1.employeeModel.create(params);
                    if (params.manager_id) {
                        let teamMemberObj = {
                            team_member_id: employeeRes.id,
                            manager_id: params.manager_id
                        };
                        yield managerTeamMember_1.managerTeamMemberModel.create(teamMemberObj);
                    }
                    if (params.is_manager == 1) {
                        let groupChatRoomObj = {
                            name: params.manager_team_name,
                            manager_id: parseInt(employeeRes.id),
                            member_ids: [],
                            live_member_ids: [],
                            room_id: yield helperFunction.getUniqueChatRoomId(),
                            icon_image_url: params.manager_team_icon_url,
                            info: [{
                                    id: parseInt(employeeRes.id),
                                    chatLastDeletedOn: new Date(),
                                    isDeleted: false,
                                    type: constants.CHAT_USER_TYPE.employee,
                                }],
                        };
                        let groupChatRoom = yield helperFunction.convertPromiseToObject(yield groupChatRoom_1.groupChatRoomModel.create(groupChatRoomObj));
                        employeeRes.groupChatRoom = groupChatRoom;
                    }
                    const mailParams = {};
                    mailParams.to = params.email;
                    mailParams.html = `Hi  ${params.name}
                <br> Please download the app by clicking on link below and use the given credentials for login into the app :
                <br><br><b> Android URL</b>: ${process.env.EMPLOYEE_ANDROID_URL}
                <br><b> IOS URL</b>: ${process.env.EMPLOYEE_IOS_URL} <br>
                <br><b> Web URL</b>: ${process.env.EMPLOYEE_WEB_URL} <br>
                <br> username : ${params.email}
                <br> password : ${password}
                `;
                    mailParams.subject = "Employee Login Credentials";
                    yield helperFunction.sendEmail(mailParams);
                    return employeeRes;
                }
                // } else {
                //     throw new Error(constants.MESSAGES.employee_code_already_registered);
                // }
            }
            else {
                throw new Error(constants.MESSAGES.email_phone_already_registered);
            }
        });
    }
    /**
     * get managers list
     */
    getManagerList(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {
                is_manager: 1,
                status: constants.STATUS.active,
                current_employer_id: parseInt(user.uid),
            };
            if (params.department_id) {
                where = Object.assign(Object.assign({}, where), { current_department_id: parseInt(params.department_id) });
            }
            return yield helperFunction.convertPromiseToObject(yield models_1.employeeModel.findAll({
                attributes: ['id', 'name', 'is_manager'],
                where
            }));
        });
    }
    /**
    * get employee list function
    @param {} params pass all parameters from request
    */
    getEmployeeList(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            models_1.employeeModel.hasOne(models_1.departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
            models_1.employeeModel.hasOne(emoji_1.emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
            models_1.employeeModel.hasOne(employeeRanks_1.employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });
            if (params.departmentId) {
                let departmentExists = yield models_1.departmentModel.findOne({ where: { id: parseInt(params.departmentId) } });
                if (!departmentExists)
                    throw new Error(constants.MESSAGES.invalid_department);
            }
            let whereCond = {
                status: [constants.STATUS.active, constants.STATUS.inactive]
            };
            let employeeRank = {};
            whereCond.current_employer_id = user.uid;
            if (params.departmentId) {
                whereCond = Object.assign(Object.assign({}, whereCond), { current_department_id: parseInt(params.departmentId) });
            }
            if (params.searchKey) {
                let searchKey = params.searchKey;
                whereCond = Object.assign(Object.assign({}, whereCond), { [Op.or]: [
                        { name: { [Op.iLike]: `%${searchKey}%` } },
                        { email: { [Op.iLike]: `%${searchKey}%` } },
                        { phone_number: { [Op.iLike]: `%${searchKey}%` } }
                    ] });
            }
            if (params.employeeRankId) {
                employeeRank = {
                    id: params.employeeRankId,
                };
            }
            let query = {
                attributes: ['id', 'name', 'email', 'country_code', 'phone_number', 'profile_pic_url', 'current_department_id', 'is_manager', 'energy_last_updated'],
                where: whereCond,
                include: [
                    {
                        model: models_1.departmentModel,
                        attributes: ['id', 'name'],
                        required: true,
                    },
                    {
                        model: emoji_1.emojiModel,
                        required: false,
                        as: 'energy_emoji_data',
                        attributes: ['id', 'image_url', 'caption']
                    },
                    {
                        model: employeeRanks_1.employeeRanksModel,
                        where: employeeRank,
                        required: true,
                        attributes: ["id", "name"]
                    }
                ],
                order: [["createdAt", "DESC"]]
            };
            if (params.offset && params.limit) {
                let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
                query = Object.assign(Object.assign({}, query), { limit: limit, offset: offset });
            }
            return yield models_1.employeeModel.findAndCountAll(query);
        });
    }
    /**
     * funtion to get department list
     */
    getDepartmentList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield helperFunction.convertPromiseToObject(yield models_1.departmentModel.findAndCountAll({
                where: {
                    status: constants.STATUS.active
                }
            }));
        });
    }
    getEmployeeRankList() {
        return __awaiter(this, void 0, void 0, function* () {
            let ranks = yield helperFunction.convertPromiseToObject(yield employeeRanks_1.employeeRanksModel.findAndCountAll({
                where: {
                    status: constants.STATUS.active,
                },
                order: [["name", "ASC"]]
            }));
            if (ranks.count == 0) {
                throw new Error(constants.MESSAGES.no_employee_rank);
            }
            return ranks;
        });
    }
    /**
     * function to View employee details
     */
    viewEmployeeDetails(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            models_1.employeeModel.hasOne(models_1.departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
            models_1.employeeModel.hasOne(managerTeamMember_1.managerTeamMemberModel, { foreignKey: "team_member_id", sourceKey: "id", targetKey: "team_member_id" });
            models_1.employeeModel.hasOne(employeeRanks_1.employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });
            managerTeamMember_1.managerTeamMemberModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
            let employeeDetails = yield helperFunction.convertPromiseToObject(yield models_1.employeeModel.findOne({
                where: {
                    id: parseInt(params.employee_id),
                    status: [constants.STATUS.active, constants.STATUS.inactive]
                },
                include: [
                    {
                        model: managerTeamMember_1.managerTeamMemberModel,
                        attributes: ['id', 'manager_id', 'team_member_id'],
                        required: false,
                        include: [{
                                model: models_1.employeeModel,
                                required: false,
                                attributes: ['id', 'name', 'email', 'profile_pic_url']
                            }]
                    },
                    {
                        model: models_1.departmentModel,
                        attributes: ['id', 'name'],
                        required: false,
                    },
                    {
                        model: employeeRanks_1.employeeRanksModel,
                        required: false,
                        attributes: ["id", "name"]
                    }
                ],
            }));
            delete employeeDetails.password;
            employeeDetails.groupChatRoom = null;
            if (employeeDetails.is_manager) {
                let groupChatRoom = yield helperFunction.convertPromiseToObject(yield groupChatRoom_1.groupChatRoomModel.findOne({
                    where: {
                        manager_id: parseInt(employeeDetails.id),
                    }
                }));
                employeeDetails.groupChatRoom = groupChatRoom;
            }
            teamGoalAssign_1.teamGoalAssignModel.hasOne(teamGoal_1.teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
            let quantitativeStatsOfGoals = yield helperFunction.convertPromiseToObject(yield teamGoalAssign_1.teamGoalAssignModel.findAll({
                where: { employee_id: parseInt(params.employee_id) },
                include: [
                    {
                        model: teamGoal_1.teamGoalModel,
                        required: true,
                    }
                ]
            }));
            let goalStats = [];
            for (let goal of quantitativeStatsOfGoals) {
                goalStats.push(Object.assign(Object.assign({}, goal), { quantitative_stats: `${parseFloat(goal.complete_measure)}/${parseFloat(goal.team_goal.enter_measure)}`, quantitative_stats_percent: (parseFloat(goal.complete_measure) / parseFloat(goal.team_goal.enter_measure)) * 100 }));
            }
            let qualitativeMeasurement = yield helperFunction.convertPromiseToObject(yield qualitativeMeasurement_1.qualitativeMeasurementModel.findAll({
                where: { employee_id: parseInt(params.employee_id) },
                attributes: ["id", "manager_id", "employee_id", "createdAt", "updatedAt",
                    ["initiative", "Initiative"], ["initiative_desc", "Initiative_desc"],
                    ["ability_to_delegate", "Ability to Delegate"], ["ability_to_delegate_desc", "Ability to Delegate_desc"],
                    ["clear_Communication", "Clear Communication"], ["clear_Communication_desc", "Clear Communication_desc"],
                    // ["self_awareness_of_strengths_and_weaknesses", "Self-awareness of strengths and weaknesses"], ["self_awareness_of_strengths_and_weaknesses_desc", "Self-awareness of strengths and weaknesses_desc"],
                    ["agile_thinking", "Agile Thinking"], ["agile_thinking_desc", "Agile Thinking_desc"],
                    // ["influence", "Influence"], ["influence_desc", "Influence_desc"],
                    ["empathy", "Empathy"], ["empathy_desc", "Empathy_desc"],
                ],
                order: [["updatedAt", "DESC"]],
                limit: 1
            }));
            let qualitativeMeasurements = null;
            if (qualitativeMeasurement.length !== 0) {
                //throw new Error(constants.MESSAGES.no_qualitative_measure);
                let startDate = new Date(qualitativeMeasurement[0].createdAt);
                let endDate = new Date(qualitativeMeasurement[0].createdAt);
                endDate.setMonth(startDate.getMonth() + 3);
                qualitativeMeasurements = {
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
                        // "Self-awareness of strengths and weaknesses",
                        "Agile Thinking",
                        // "Influence",
                        "Empathy",
                    ].includes(key)) {
                        qualitativeMeasurements.qualitativeMeasures.push({
                            label: key,
                            rating: qualitativeMeasurement[0][key],
                            desc: qualitativeMeasurement[0][`${key}_desc`]
                        });
                    }
                }
            }
            attributeRatings_1.attributeRatingModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
            let attributeRatings = yield helperFunction.convertPromiseToObject(yield attributeRatings_1.attributeRatingModel.findOne({
                where: { employee_id: params.employee_id || user.uid },
                include: [
                    {
                        model: models_1.employeeModel,
                        required: true,
                        attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                    }
                ],
                order: [["updatedAt", "DESC"]],
                limit: 1
            }));
            return { employeeDetails, goalStats, qualitativeMeasurements, attributeRatings };
        });
    }
    /**
     * function to delete an employee
     */
    deleteEmployee(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let employee = yield models_1.employeeModel.findOne({
                where: {
                    id: parseInt(params.employee_id),
                    status: [constants.STATUS.active, constants.STATUS.inactive]
                }
            });
            if (employee) {
                employee.status = constants.STATUS.deleted;
                employee.save();
            }
            else {
                throw new Error(constants.MESSAGES.employee_notFound);
            }
            return true;
        });
    }
    /**
     * function to updater an employee manager
     */
    updateManager(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield managerTeamMember_1.managerTeamMemberModel.update({
                manager_id: params.new_manager_id,
            }, {
                where: { manager_id: params.current_manager_id, },
                returning: true
            });
            let goals = yield helperFunction.convertPromiseToObject(yield teamGoal_1.teamGoalModel.findAll({
                where: {
                    manager_id: params.current_manager_id,
                }
            }));
            for (let goal of goals) {
                let newGoal = yield helperFunction.convertPromiseToObject(yield teamGoal_1.teamGoalModel.findOne({
                    where: {
                        manager_id: params.new_manager_id,
                        title: goal.title,
                        description: goal.description,
                        start_date: goal.start_date,
                        end_date: goal.end_date,
                        select_measure: goal.select_measure,
                        enter_measure: goal.enter_measure,
                    },
                }));
                if (newGoal) {
                    yield teamGoalAssign_1.teamGoalAssignModel.update({
                        goal_id: newGoal.id,
                    }, {
                        where: {
                            goal_id: goal.id,
                        }
                    });
                    yield teamGoalAssignCompletionByEmployee_1.teamGoalAssignCompletionByEmployeeModel.update({
                        goal_id: newGoal.id,
                    }, {
                        where: {
                            goal_id: goal.id,
                        }
                    });
                }
                else {
                    yield teamGoal_1.teamGoalModel.update({
                        manager_id: params.new_manager_id,
                    }, {
                        where: {
                            manager_id: params.current_manager_id,
                        },
                        returning: true
                    });
                }
            }
            return true;
        });
    }
    addAttributes(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("params.attributes", params.attributes, params);
            // params.attributes=JSON.parse(params.attributes);
            // console.log("params.attributes",params.attributes,params)
            let duplicateAttribute = null;
            let attributes = [];
            for (let attribute of params.attributes) {
                duplicateAttribute = yield attributes_1.attributeModel.findOne({
                    where: {
                        employer_id: user.uid,
                        name: {
                            [Op.iLike]: attribute.name.toLowerCase(),
                        },
                        status: [constants.STATUS.active, constants.STATUS.inactive],
                    }
                });
                if (duplicateAttribute) {
                    break;
                }
                attributes.push({
                    employer_id: user.uid,
                    name: attribute.name,
                    comment: attribute.desc || null,
                });
            }
            if (!duplicateAttribute) {
                return yield helperFunction.convertPromiseToObject(yield attributes_1.attributeModel.bulkCreate(attributes));
            }
            else {
                throw new Error(constants.MESSAGES.attribute_already_added);
            }
        });
    }
    getAttributes(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                where: {
                    employer_id: user.uid,
                    status: [constants.STATUS.active, constants.STATUS.inactive],
                },
                order: [["createdAt", "DESC"]]
            };
            if (!params.is_pagination || params.is_pagination == constants.IS_PAGINATION.yes) {
                let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
                query.offset = offset,
                    query.limit = limit;
            }
            let attribute = yield attributes_1.attributeModel.findAndCountAll(query);
            if (attribute) {
                return yield helperFunction.convertPromiseToObject(attribute);
            }
            else {
                throw new Error(constants.MESSAGES.attribute_not_found);
            }
        });
    }
    getAttributeDetails(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let attribute = yield attributes_1.attributeModel.findOne({
                where: {
                    id: params.attribute_id,
                    employer_id: user.uid,
                    status: [constants.STATUS.active, constants.STATUS.inactive],
                }
            });
            if (attribute) {
                return yield helperFunction.convertPromiseToObject(attribute);
            }
            else {
                throw new Error(constants.MESSAGES.attribute_not_found);
            }
        });
    }
    deleteAttribute(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let attribute = yield attributes_1.attributeModel.findOne({
                where: {
                    id: params.attribute_id,
                    employer_id: user.uid,
                    status: [constants.STATUS.active, constants.STATUS.inactive],
                }
            });
            if (attribute) {
                attribute.status = constants.STATUS.deleted;
                attribute.save();
                return true;
            }
            else {
                throw new Error(constants.MESSAGES.attribute_not_found);
            }
        });
    }
    toggleAttributeStatus(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let attribute = yield attributes_1.attributeModel.findOne({
                where: {
                    id: params.attribute_id,
                    employer_id: user.uid,
                    status: [constants.STATUS.active, constants.STATUS.inactive],
                }
            });
            if (attribute) {
                if (attribute.status == constants.STATUS.active) {
                    attribute.status = constants.STATUS.inactive;
                }
                else {
                    attribute.status = constants.STATUS.active;
                }
                attribute.save();
                return true;
            }
            else {
                throw new Error(constants.MESSAGES.attribute_not_found);
            }
        });
    }
}
exports.EmployeeManagement = EmployeeManagement;
//# sourceMappingURL=managementService.js.map