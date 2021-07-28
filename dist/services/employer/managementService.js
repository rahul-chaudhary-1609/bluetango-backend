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
exports.EmployeeManagement = void 0;
const models_1 = require("../../models");
const lodash_1 = __importDefault(require("lodash"));
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
    /**
    * add edit employee function
    @param {} params pass all parameters from request
    */
    addEditEmployee(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            params.email = (params.email).toLowerCase();
            if (params.current_department_id) {
                let departmentExists = yield models_1.departmentModel.findOne({ where: { id: params.current_department_id } });
                if (!departmentExists)
                    throw new Error(constants.MESSAGES.invalid_department);
            }
            var existingUser;
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
            if (lodash_1.default.isEmpty(existingUser)) {
                let isEmployeeCodeExist = null;
                if (params.id) {
                    isEmployeeCodeExist = yield models_1.employeeModel.findOne({
                        where: {
                            employee_code: params.employee_code,
                            current_employer_id: params.current_employer_id,
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
                    isEmployeeCodeExist = yield models_1.employeeModel.findOne({
                        where: {
                            employee_code: params.employee_code,
                            current_employer_id: params.current_employer_id,
                            status: {
                                [Op.in]: [0, 1]
                            }
                        }
                    });
                }
                if (!isEmployeeCodeExist) {
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
                                        icon_image_url: params.manager_team_icon_url
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
                        let password = params.password;
                        params.password = yield appUtils.bcryptPassword(params.password);
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
                                icon_image_url: params.manager_team_icon_url
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
                }
                else {
                    throw new Error(constants.MESSAGES.employee_code_already_registered);
                }
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
            if (params.departmentId) {
                let departmentExists = yield models_1.departmentModel.findOne({ where: { id: parseInt(params.departmentId) } });
                if (!departmentExists)
                    throw new Error(constants.MESSAGES.invalid_department);
            }
            let whereCond = {
                status: [constants.STATUS.active, constants.STATUS.inactive]
            };
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
    /**
     * function to View employee details
     */
    viewEmployeeDetails(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            models_1.employeeModel.hasOne(models_1.departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
            models_1.employeeModel.hasOne(managerTeamMember_1.managerTeamMemberModel, { foreignKey: "team_member_id", sourceKey: "id", targetKey: "team_member_id" });
            managerTeamMember_1.managerTeamMemberModel.hasOne(models_1.employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
            let employeeDetails = yield helperFunction.convertPromiseToObject(yield models_1.employeeModel.findOne({
                //attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url', 'current_department_id', 'is_manager'],
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
            return { employeeDetails, goalStats, qualitativeMeasurements };
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
            let managerTeam = yield helperFunction.convertPromiseToObject(yield managerTeamMember_1.managerTeamMemberModel.update({
                manager_id: params.new_manager_id,
            }, {
                where: { manager_id: params.current_manager_id, },
                returning: true
            }));
            return true;
        });
    }
}
exports.EmployeeManagement = EmployeeManagement;
//# sourceMappingURL=managementService.js.map