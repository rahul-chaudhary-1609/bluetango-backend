import _, { constant } from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import * as tokenResponse from "../../utils/tokenResponse";
import { employeeModel } from "../../models/employee"
import { adminModel } from "../../models/admin";
import { employersModel } from "../../models/employers"
import { departmentModel } from "../../models/department"
import { managerTeamMemberModel } from "../../models/managerTeamMember"
import { teamGoalAssignModel } from "../../models/teamGoalAssign"
import { qualitativeMeasurementModel } from "../../models/qualitativeMeasurement"
import { teamGoalModel } from "../../models/teamGoal";
import { emojiModel } from "../../models/emoji";
import { coachManagementModel } from "../../models/coachManagement";
import { contactUsModel } from "../../models/contactUs";
import { notificationModel } from "../../models/notification";
import { feedbackModel } from "../../models/feedback";
import { AuthService } from "./authService";
import { libraryManagementModel } from "../../models/libraryManagement";
import { deleteFile } from "../../middleware/multerParser";
import { attributeRatingModel } from "../../models/attributeRatings"
import { employeeRanksModel } from "../../models/employeeRanks";
import { coachSpecializationCategoriesModel } from "../../models/coachSpecializationCategories";
import { employeeCoachSessionsModel } from "../../models/employeeCoachSession";
import { coachScheduleModel } from "../../models/coachSchedule";
const moment = require("moment");
import * as path from 'path';
import { chatRealtionMappingInRoomModel } from "../../models/chatRelationMappingInRoom";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
const PDFDocument = require('pdfkit');
const fs = require('fs');
import * as queryService from '../../queryService/bluetangoAdmin/queryService';

const authService = new AuthService();

export class EmployeeServices {
    constructor() { }

    /*
    * function to get list of team members
    */
    public async getListOfTeamMemberByManagerId(params: any, user: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit);
        managerTeamMemberModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
        employeeModel.hasOne(emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });

        let teamMembersData = await helperFunction.convertPromiseToObject(await managerTeamMemberModel.findAndCountAll({
            where: { manager_id: user.uid },
            include: [
                {
                    model: employeeModel,
                    required: true,
                    attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'energy_last_updated', 'profile_pic_url'],
                    where: { status: 1 },
                    include: [
                        {
                            model: emojiModel,
                            required: false,
                            attributes: ['image_url', 'caption'],
                        }
                    ]
                }
            ],
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]]

        })
        );

        for (let obj of teamMembersData.rows) {
            if (obj.employee) {
                obj.isEmployeeEnergyUpdatedInLast24Hour = true;

                const timeDiff = Math.floor(((new Date()).getTime() - (new Date(obj.employee.energy_last_updated)).getTime()) / 1000)

                if (timeDiff > 86400) obj.isEmployeeEnergyUpdatedInLast24Hour = false;
            }


        }

        let date = new Date();
        date.setMonth(date.getMonth() - 3);
        //let dateCheck = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
        let dateCheck = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        for (let i = 0; i < teamMembersData.rows.length; i++) {
            let rateCheck = await helperFunction.convertPromiseToObject(await attributeRatingModel.findOne({
                where: {
                    manager_id: user.uid,
                    employee_id: teamMembersData.rows[i].team_member_id,
                    updatedAt: { [Op.gte]: dateCheck }
                }
            })
            );
            if (_.isEmpty(rateCheck)) {
                teamMembersData.rows[i].rate_valid = 1;
            } else {
                teamMembersData.rows[i].rate_valid_after_date = rateCheck.createdAt;
                teamMembersData.rows[i].rate_valid = 0;
            }
        }

        return teamMembersData;

    }

    /*
    * function to get details of employee
    */
    public async viewDetailsEmployee(params: any) {
        employeeModel.hasMany(teamGoalAssignModel, { foreignKey: "employee_id", sourceKey: "id", targetKey: "employee_id" });
        teamGoalAssignModel.hasOne(teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
        employeeModel.hasOne(departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
        let employeeDetails = await helperFunction.convertPromiseToObject(await employeeModel.findOne({
            where: { id: params.id },
            include: [
                {
                    model: departmentModel,
                    required: true
                },
                {
                    model: teamGoalAssignModel,
                    separate: true,
                    required: false,
                    include: [
                        {
                            model: teamGoalModel,
                            required: false
                        }
                    ]
                },
            ],
            attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'profile_pic_url', 'current_department_id']
        }));



        let qualitativeMeasurement = await helperFunction.convertPromiseToObject(await qualitativeMeasurementModel.findAll({
            where: { employee_id: params.id },
            attributes: ["id", "manager_id", "employee_id", "createdAt", "updatedAt",
                ["initiative", "Initiative"], ["initiative_desc", "Initiative_desc"],
                ["ability_to_delegate", "Ability to Delegate"], ["ability_to_delegate_desc", "Ability to Delegate_desc"],
                ["clear_Communication", "Clear Communication"], ["clear_Communication_desc", "Clear Communication_desc"],
                //    ["self_awareness_of_strengths_and_weaknesses", "Self-awareness of strengths and weaknesses"], ["self_awareness_of_strengths_and_weaknesses_desc", "Self-awareness of strengths and weaknesses_desc"],
                ["agile_thinking", "Agile Thinking"], ["agile_thinking_desc", "Agile Thinking_desc"],
                //    ["influence", "Influence"], ["influence_desc", "Influence_desc"],
                ["empathy", "Empathy"], ["empathy_desc", "Empathy_desc"],
                //    ["leadership_courage", "Leadership Courage"], ["leadership_courage_desc", "Leadership Courage_desc"],
                //    ["customer_client_patient_satisfaction", "Customer/Client/Patient Satisfaction"], ["customer_client_patient_satisfaction_desc", "Customer/Client/Patient Satisfaction_desc"],
                //    ["team_contributions", "Team contributions"], ["team_contributions_desc", "Team contributions_desc"],
                //    ["time_management", "Time Management"], ["time_management_desc", "Time Management_desc"],
                //    ["work_product", "Work Product"], ["work_product_desc", "Work Product_desc"],
            ],
            order: [["updatedAt", "DESC"]],
            limit: 1
        }))

        if (qualitativeMeasurement.length != 0) //throw new Error(constants.MESSAGES.no_qualitative_measure);
        {
            let startDate = new Date(qualitativeMeasurement[0].createdAt);
            let endDate = new Date(qualitativeMeasurement[0].createdAt)
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
            }



            for (let key in qualitativeMeasurement[0]) {
                if ([
                    "Initiative",
                    "Ability to Delegate",
                    "Clear Communication",
                    //    "Self-awareness of strengths and weaknesses",
                    "Agile Thinking",
                    //    "Influence",
                    "Empathy",
                    //    "Leadership Courage",
                    //    "Customer/Client/Patient Satisfaction",
                    //    "Team contributions",
                    //    "Time Management",
                    //    "Work Product",
                ].includes(key)) {
                    result.qualitativeMeasures.push({
                        label: key,
                        rating: qualitativeMeasurement[0][key],
                        desc: qualitativeMeasurement[0][`${key}_desc`]
                    })

                }

            }
            employeeDetails.qualitativeMeasurementDetails = result;
        }

        attributeRatingModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
        employeeDetails.attributeRatings = await helperFunction.convertPromiseToObject(await attributeRatingModel.findOne({
            where: { employee_id: params.id },
            include: [
                {
                    model: employeeModel,
                    required: true,
                    attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                }
            ],
            order: [["updatedAt", "DESC"]],
            limit: 1
        }))


        return employeeDetails;
    }

    /*
    * function to get details of employee
    */
    public async searchTeamMember(params: any, user: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit);

        managerTeamMemberModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
        employeeModel.hasOne(emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
        let teamMembersData = await helperFunction.convertPromiseToObject(await managerTeamMemberModel.findAndCountAll({
            where: { manager_id: user.uid },
            include: [
                {
                    model: employeeModel,
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
                            model: emojiModel,
                            required: false,
                            attributes: ['image_url', 'caption'],
                        }
                    ]
                }
            ],
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]]

        })
        )

        for (let obj of teamMembersData.rows) {
            obj.isEmployeeEnergyUpdatedInLast24Hour = true;

            const timeDiff = Math.floor(((new Date()).getTime() - (new Date(obj.employee.energy_last_updated)).getTime()) / 1000)

            if (timeDiff > 86400) obj.isEmployeeEnergyUpdatedInLast24Hour = false;

        }

        return teamMembersData
    }

    /*
    * function to add thought of the day
    */
    public async thoughtOfTheDay(params: any, user: any) {
        await employeeModel.update(
            {
                thought_of_the_day: params.thought_of_the_day
            },
            {
                where: { id: user.uid }
            }
        )

        return employeeModel.findOne({
            where: { id: user.uid }
        })
    }

    /*
    * function to add thought of the day
    */
    public async getEmoji() {
        return await emojiModel.findAll({
            order: [["id"]]
        });
    }

    /*
   * function to add thought of the day
   */
    public async updateEnergyCheck(params: any, user: any) {
        await employeeModel.update(
            {
                energy_id: params.energy_id,
                energy_last_updated: new Date(),
            },
            {
                where: { id: user.uid }
            }
        )
        return authService.getMyProfile(user);
    }

    /*
    * function to view energy check
    */
    public async viewEnergyCheckTeamMembers(user: any) {

        managerTeamMemberModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
        employeeModel.hasOne(emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });

        return await managerTeamMemberModel.findAll({
            where: { manager_id: user.uid },
            include: [
                {
                    model: employeeModel,
                    required: false,
                    attributes: ['id', 'name', 'energy_id'],
                    include: [
                        {
                            model: emojiModel,
                            required: false,
                            attributes: ['image_url', 'caption'],
                        }
                    ]
                }
            ]
        })
    }

    /*
   * feel about job today
   */
    public async feelAboutJobToday(params: any, user: any) {

        return await employeeModel.update(params,
            {
                where: { id: user.uid }
            });
    }

    /*
   * function to update device token
   */
    public async updateEmployeeDeviceToken(params: any, user: any) {
        await employeeModel.update(
            {
                device_token: params.device_token
            },
            {
                where: { id: user.uid }
            }
        )
        return authService.getMyProfile(user);
    }

    /*
* function to clear device token
*/
    public async clearEmployeeDeviceToken(user: any) {
        return await employeeModel.update(
            {
                device_token: null,
            },
            {
                where: { id: user.uid },
                returning: true
            }
        )
    }


    /*
 * function to get current manager
 */
    public async getCurrentManager(user: any) {
        let currentManager = await helperFunction.convertPromiseToObject(await managerTeamMemberModel.findOne({
            where: { team_member_id: user.uid },
        })
        );

        return currentManager;
    }

    /*
    * function to get employee details to show employee detail on dashbord as team member view
    */
    public async getEmployeeDetails(user: any) {

        employeeModel.hasOne(departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
        employeeModel.hasOne(managerTeamMemberModel, { foreignKey: "team_member_id", sourceKey: "id", targetKey: "team_member_id" });
        managerTeamMemberModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
        let employee = await employeeModel.findOne({
            attributes: ['id', 'name', 'profile_pic_url'],
            where: {
                id: user.uid
            },
            include: [
                {
                    model: departmentModel,
                    required: false,
                    attributes: ['name']
                },
                {
                    model: managerTeamMemberModel,
                    required: false,
                    attributes: ['manager_id'],
                    include: [
                        {
                            model: employeeModel,
                            required: false,
                            attributes: ['name'],
                        }
                    ]
                }
            ],

        });

        return await helperFunction.convertPromiseToObject(employee);
    }

    /*
    * function to view energy of employee on dashbord as team member view
    */
    public async viewEmployeeEnergy(user: any) {

        employeeModel.hasOne(emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
        let employeeEnergy = await helperFunction.convertPromiseToObject(await employeeModel.findOne({
            attributes: ['id', 'name', 'energy_last_updated'],
            where: {
                id: user.uid
            },
            include: [
                {
                    model: emojiModel,
                    required: false,
                    attributes: ['id', 'image_url', 'caption']
                },
            ],

        })
        );

        employeeEnergy.isUpdateAvailable = false;

        const timeDiff = Math.floor(((new Date()).getTime() - (new Date(employeeEnergy.energy_last_updated)).getTime()) / 1000)

        if (timeDiff > 86400) employeeEnergy.isUpdateAvailable = true;


        return employeeEnergy;
    }

    /*
    * function to view thought of the day employee on dashbord as team member view
    */
    public async viewThoughtOfTheDay(user: any) {

        let employeeThoughtOfTheDay = await employeeModel.findOne({
            attributes: ['id', 'thought_of_the_day'],
            where: {
                id: user.uid
            },
        });

        return await helperFunction.convertPromiseToObject(employeeThoughtOfTheDay);
    }

    /*
    * function to view feel About Job Today on dashbord as team member view
    */
    public async viewFeelAboutJobToday(user: any) {

        let employeeFeelAboutJobToday = await employeeModel.findOne({
            attributes: ['id', 'job_emoji_id', 'job_comments'],
            where: {
                id: user.uid
            },
        });

        return await helperFunction.convertPromiseToObject(employeeFeelAboutJobToday);
    }

    /*
    * function to view thought of the day from admin on dashbord as team member view
    */
    public async viewThoughtOfTheDayFromAdmin(user: any) {

        employeeModel.hasOne(employersModel, { foreignKey: "id", sourceKey: "current_employer_id", targetKey: "id" });
        employersModel.hasOne(adminModel, { foreignKey: "id", sourceKey: "admin_id", targetKey: "id" });

        let employeeFeelAboutJobTodayFromAdmin = await employeeModel.findOne({
            attributes: ['id'],
            where: {
                id: user.uid
            },
            include: [
                {
                    model: employersModel,
                    required: false,
                    attributes: ['id', 'thought_of_the_day'],
                    include: [
                        {
                            model: adminModel,
                            required: false,
                            attributes: ['id', 'thought_of_the_day']
                        },
                    ],
                },
            ],
        });

        return await helperFunction.convertPromiseToObject(employeeFeelAboutJobTodayFromAdmin);
    }

    public async getCoachSpecializationCategoryList() {

        let query = <any>{
            order: [["createdAt", "DESC"]]
        }
        query.where = <any>{
            status: {
                [Op.in]: [constants.STATUS.active]
            }
        }

        let categories = await helperFunction.convertPromiseToObject(
            await coachSpecializationCategoriesModel.findAndCountAll(query)
        )

        if (categories.count == 0) {
            throw new Error(constants.MESSAGES.no_coach_specialization_category);
        }

        return categories;

    }

    /*
   * function to get coach list
   */
    public async getCoachList(user: any, params: any) {

        let employee = await helperFunction.convertPromiseToObject(
            await employeeModel.findByPk(parseInt(user.uid))
        )
        let where: any = {}

        if (params.searchKey) {
            let coachSpecializationCategories = await helperFunction.convertPromiseToObject(
                await coachSpecializationCategoriesModel.findAll({
                    where: {
                        name: {
                            [Op.iLike]: `%${params.searchKey}%`
                        }
                    }
                })
            )

            if (coachSpecializationCategories.length > 0) {
                let coachSpecializationCategoryIds = coachSpecializationCategories.map(coachSpecializationCategory => coachSpecializationCategory.id);
                if (coachSpecializationCategoryIds) {
                    where["coach_specialization_category_ids"] = {
                        [Op.contains]: coachSpecializationCategoryIds || [],
                    }
                } else {
                    throw new Error(constants.MESSAGES.no_coach_with_specialization_category)
                }
            } else {
                // where["coach_specialization_category_ids"] = { 
                //     [Op.contains]: null,
                // }
                throw new Error(constants.MESSAGES.no_coach_with_specialization_category)
            }

        }

        if (employee) {
            where["employee_rank_ids"] = {
                [Op.contains]: [employee.employee_rank_id]
            }
        }

        where["status"] = constants.STATUS.active

        let query = <any>{
            where: where,
            attributes: ["id", "name", 'description', "email", "phone_number", ['image', 'profile_pic_url'], "coach_specialization_category_ids", "employee_rank_ids", "coach_charge"],
            order: [["id", "DESC"]]
        }

        if (params.sortBy) {
            if (params.sortBy == 1) {
                query.order = [["createdAt", "DESC"]]
            } else if (params.sortBy == 2) {
                query.order = [["createdAt", "ASC"]]
            } else if (params.sortBy == 4) {
                query.order = [["coach_charge", "DESC"]]
            } else if (params.sortBy == 5) {
                query.order = [["coach_charge", "ASC"]]
            }
        }

        let coachList = await helperFunction.convertPromiseToObject(
            await coachManagementModel.findAndCountAll(query)
        )

        for (let coach of coachList.rows) {
            coach.coach_specialization_categories = await helperFunction.convertPromiseToObject(
                await coachSpecializationCategoriesModel.findAll({
                    where: {
                        id: {
                            [Op.in]: coach.coach_specialization_category_ids || [],
                        },
                        status: constants.STATUS.active,
                    }
                })
            )

            coach.employee_ranks = await helperFunction.convertPromiseToObject(
                await employeeRanksModel.findAll({
                    where: {
                        id: {
                            [Op.in]: coach.employee_rank_ids || [],
                        },
                        status: constants.STATUS.active,
                    }
                })
            )

            coach.total_completed_sessions = await employeeCoachSessionsModel.count({
                where: {
                    coach_id: coach.id,
                    status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                }
            })

            let totalRating = await employeeCoachSessionsModel.sum('coach_rating', {
                where: {
                    coach_id: coach.id,
                    status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    coach_rating: {
                        [Op.gte]: 1
                    }
                }
            })

            let slotsWhere = <any>{
                coach_id: coach.id,
                status: constants.COACH_SCHEDULE_STATUS.available,
            }

            if (params.filterBy) {
                if (params.filterBy == 1) {
                    slotsWhere = {
                        ...slotsWhere,
                        date: {
                            [Op.gte]: moment(new Date()).format("YYYY-MM-DD"),
                        }
                    }
                } else if (params.filterBy == 2) {
                    slotsWhere = {
                        ...slotsWhere,
                        date: moment(new Date()).format("YYYY-MM-DD"),
                    }
                } else if (params.filterBy == 3 && params.date) {
                    slotsWhere = {
                        ...slotsWhere,
                        date: params.date,
                    }
                } else {
                    slotsWhere = {
                        ...slotsWhere,
                        date: moment(new Date()).format("YYYY-MM-DD"),
                    }
                }
            } else {
                slotsWhere = {
                    ...slotsWhere,
                    date: moment(new Date()).format("YYYY-MM-DD"),
                }
            }

            coach.available_slots = await helperFunction.convertPromiseToObject(
                await coachScheduleModel.findAll({
                    attributes: ['id', 'date', 'start_time', 'end_time'],
                    where: slotsWhere,
                    order: [["date", "ASC"], ["start_time", "ASC"], ["end_time", "ASC"]]
                })
            )

            coach.rating_count = await employeeCoachSessionsModel.count({
                where: {
                    coach_id: coach.id,
                    status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    coach_rating: {
                        [Op.gte]: 1
                    }
                }
            })

            coach.average_rating = 0;
            if (coach.rating_count > 0) {
                coach.average_rating = parseFloat((parseInt(totalRating) / coach.rating_count).toFixed(0));
            }
            delete coach.coach_specialization_category_ids;
            delete coach.employee_rank_ids;
        }

        coachList.rows = coachList.rows.filter(coach => coach.available_slots?.length > 0);

        coachList.count = coachList.rows.length;

        if (!params.sortBy || params.sortBy == 3) {
            coachList.rows.sort((a, b) => b.average_rating - a.average_rating);
        }

        if (params.sortBy && params.sortBy == 6) {
            coachList.rows.forEach((row) => {
                row.available_slots?.forEach((slot) => {
                    Object.keys(slot).forEach((key) => {
                        if (key == "start_time") {
                            slot[key] = slot[key].replace(/:/g, "")
                        }
                    })
                })
            })

            // console.log("coachList",coachList.rows.forEach((row,index)=>{
            //     console.log(`available_slot${index}`,row.available_slots)
            // }))

            coachList.rows.sort((a, b) => a.available_slots[0]?.start_time - b.available_slots[0]?.start_time);

            coachList.rows.forEach((row) => {
                row.available_slots?.forEach((slot) => {
                    Object.keys(slot).forEach((key) => {
                        if (key == "start_time") {
                            slot[key] = moment(slot[key], "HHmmss").format("HH:mm:ss")
                        }
                    })
                })
            })

            // console.log("coachList",coachList.rows.forEach((row,index)=>{
            //     console.log(`available_slot${index}`,row.available_slots)
            // }))
        }

        if (params.is_pagination && params.is_pagination == constants.IS_PAGINATION.yes) {
            let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
            coachList.count = coachList.rows.length;
            coachList.rows = coachList.rows.slice(offset, offset + limit);
        }

        return coachList;
    }

    public async getSlots(params: any) {

        console.log("params", params)

        let where = <any>{
            coach_id: params.coach_id,
            status: constants.COACH_SCHEDULE_STATUS.available,
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

    public async createSessionRequest(params: any, user: any) {
        let employee = await helperFunction.convertPromiseToObject(
            await employeeModel.findByPk(parseInt(user.uid))
        )

        let slot = await coachScheduleModel.findByPk(parseInt(params.slot_id));

        if (!slot) {
            throw new Error(constants.MESSAGES.no_coach_schedule)
        } else {
            if (slot.status != constants.COACH_SCHEDULE_STATUS.available) {
                throw new Error(constants.MESSAGES.coach_schedule_not_available)
            } else {

                let employeeSessionCount = await employeeCoachSessionsModel.count({
                    where: {
                        employee_id: user.uid,
                        type: constants.EMPLOYEE_COACH_SESSION_TYPE.free,
                        status: {
                            [Op.in]: [
                                constants.EMPLOYEE_COACH_SESSION_STATUS.pending,
                                constants.EMPLOYEE_COACH_SESSION_STATUS.accepted,
                                constants.EMPLOYEE_COACH_SESSION_STATUS.completed
                            ]
                        }
                    }
                })

                let employeeCoachSessionObj = <any>{
                    coach_id: params.coach_id,
                    employee_id: user.uid,
                    employee_rank_id: employee.employee_rank_id,
                    coach_specialization_category_id: params.coach_specialization_category_id,
                    date: params.date,
                    start_time: params.start_time,
                    end_time: params.end_time || null,
                    slot_id: params.slot_id,
                    type: employeeSessionCount < 2 ? constants.EMPLOYEE_COACH_SESSION_TYPE.free : constants.EMPLOYEE_COACH_SESSION_TYPE.paid,
                    query: params.query,
                }

                let session = await helperFunction.convertPromiseToObject(
                    await employeeCoachSessionsModel.create(employeeCoachSessionObj)
                );

                if (session) {
                    slot.status = constants.COACH_SCHEDULE_STATUS.booked;
                    slot.save();
                    let coach = await helperFunction.convertPromiseToObject(
                        await coachManagementModel.findByPk(parseInt(params.coach_id))
                    )
                    //send push notification
                    let notificationData = <any>{
                        title: 'New coaching session request',
                        body: `${employee.name} has requested for a coaching session on ${params.date} at ${params.start_time}`,
                        data: {
                            type: constants.NOTIFICATION_TYPE.new_coaching_session_request,
                            title: 'New coaching session request',
                            message: `${employee.name} has requested for a coaching session on ${params.date} at ${params.start_time}`,
                        },
                    }
                    await helperFunction.sendFcmNotification([coach.device_token], notificationData);
                }

                return session;
            }
        }

    }

    public async getSessions(params: any, user: any) {
        console.log("getSessions", params, user)
        employeeCoachSessionsModel.hasOne(coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" })

        if (params.datetime) {
            let sessions = await helperFunction.convertPromiseToObject(
                await employeeCoachSessionsModel.findAll({
                    where: {
                        employee_id: user.uid,
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
                        employee_id: user.uid,
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
                        // call_duration:Math.ceil(duration.asMinutes()),
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
            employee_id: user.uid,
            status: {
                [Op.in]: [
                    constants.EMPLOYEE_COACH_SESSION_STATUS.pending,
                    constants.EMPLOYEE_COACH_SESSION_STATUS.accepted,
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
                model: coachManagementModel,
                attributes: ['id', 'name', 'email', 'phone_number', ['image', 'profile_pic_url']],
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
        employeeCoachSessionsModel.hasOne(coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" })
        let session = await queryService.selectOne(employeeCoachSessionsModel, {
            where: { id: params.session_id },
            include: [
                {
                    model: coachManagementModel,
                    required: true,
                    attributes: ["name", "device_token"],
                },
                {
                    model: employeeModel,
                    required: true,
                    attributes: ["name"],
                },
            ],
            raw: true,
        })
        if (!session) {
            throw new Error(constants.MESSAGES.no_session)
        }

        if (session.employee_id != user.uid) {
            throw new Error(constants.MESSAGES.session_not_belogs_to_employee)
        }

        params.session = await helperFunction.convertPromiseToObject(session);

        if (params.datetime) {
            let startTime = moment(`${params.datetime}`, "YYYY-MM-DD HH:mm:ss")
            let endTime = moment(`${params.session.date} ${params.session.start_time}`, "YYYY-MM-DD HH:mm:ss")

            let duration = moment.duration(endTime.diff(startTime));
            let secondDiff = Math.ceil(duration.asSeconds())

            if (secondDiff <= 0) {
                throw new Error(constants.MESSAGES.zoom_meeting_emp_cancel_error)
            }
        }

        if (params.session.status == constants.EMPLOYEE_COACH_SESSION_STATUS.accepted) {
            await helperFunction.cancelZoomMeeting(params);
        }

        session.status = constants.EMPLOYEE_COACH_SESSION_STATUS.cancelled;
        session.cancel_reason = params.cancel_reason;
        session.cancelled_by = constants.EMPLOYEE_COACH_SESSION_CANCELLED_BY.employee;
        session.save();

        let slot = await coachScheduleModel.findByPk(parseInt(session.slot_id));
        slot.status = constants.COACH_SCHEDULE_STATUS.available;
        slot.save();
        //send push notification
        let notificationData = <any>{
            title: 'Sesssion cancelled by employee',
            body: `${session["employee.name"]} has cancelled session on ${session.date} at ${session.start_time}`,
            data: {
                type: constants.NOTIFICATION_TYPE.cancel_session,
                title: 'Sesssion cancelled by employee',
                message: `${session["employee.name"]} has cancelled session on ${session.date} at ${session.start_time}`
            },
        }
        await helperFunction.sendFcmNotification([session["coach_management.device_token"]], notificationData);
        return await helperFunction.convertPromiseToObject(session);
    }

    public async getNotRatedSessions(params: any, user: any) {
        employeeCoachSessionsModel.hasOne(coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" })


        if (params.datetime) {
            let sessions = await helperFunction.convertPromiseToObject(
                await employeeCoachSessionsModel.findAll({
                    where: {
                        employee_id: user.uid,
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

        let sessions = await helperFunction.convertPromiseToObject(
            await employeeCoachSessionsModel.findAndCountAll({
                where: {
                    employee_id: user.uid,
                    status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    coach_rating: 0,
                    is_rating_skipped: 0,
                },
                include: [
                    {
                        model: coachManagementModel,
                        attributes: ['id', 'name', 'email', 'phone_number', ['image', 'profile_pic_url']],
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
            })
        )

        let sessionArray = [];
        for (let session of sessions.rows) {
            let startTime = moment(`${params.datetime}`, "YYYY-MM-DD HH:mm:ss")
            let endTime = moment(`${session.date} ${session.end_time}`, "YYYY-MM-DD HH:mm:ss")

            let duration = moment.duration(endTime.diff(startTime));
            let secondDiff = Math.ceil(duration.asSeconds())

            if (secondDiff <= 0) {
                sessionArray.push(session)
            }
        }

        sessions.rows = sessionArray;
        sessions.count = sessionArray.length;

        await employeeCoachSessionsModel.update({
            is_rating_skipped: 1,
        }, {
            where: {
                employee_id: user.uid,
                status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                coach_rating: 0,
                is_rating_skipped: 0,
            }
        })

        return sessions;
    }

    public async listSessionHistory(params: any, user: any) {
        employeeCoachSessionsModel.hasOne(coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" })

        if (params.datetime) {
            let sessions = await helperFunction.convertPromiseToObject(
                await employeeCoachSessionsModel.findAll({
                    where: {
                        employee_id: user.uid,
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
                        employee_id: user.uid,
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
            employee_id: user.uid,
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
                model: coachManagementModel,
                attributes: ['id', 'name', 'email', 'phone_number', ['image', 'profile_pic_url']],
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
        employeeCoachSessionsModel.hasOne(coachManagementModel, { foreignKey: "id", sourceKey: "coach_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(coachSpecializationCategoriesModel, { foreignKey: "id", sourceKey: "coach_specialization_category_id", targetKey: "id" })
        employeeCoachSessionsModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" })

        let query = <any>{}
        query.where = {
            id: params.session_id,
        }

        query.include = [
            {
                model: coachManagementModel,
                attributes: ['id', 'name', 'email', 'phone_number', ['image', 'profile_pic_url']],
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

    public async rateCoachSession(params: any) {
        let session = await employeeCoachSessionsModel.findByPk(parseInt(params.session_id))

        if (!session) {
            throw new Error(constants.MESSAGES.no_session);
        }

        session.coach_rating = params.rating;
        session.comment = params.comment;
        session.save();

        return await helperFunction.convertPromiseToObject(session);
    }

    public async skipRateSession(params: any) {
        let session = await employeeCoachSessionsModel.findByPk(parseInt(params.session_id))

        if (!session) {
            throw new Error(constants.MESSAGES.no_session);
        }

        session.is_rating_skipped = 1;
        session.save();

        return await helperFunction.convertPromiseToObject(session);
    }

    /*
  * function to contact admin
  */
    public async contactUs(params: any, user: any) {

        let employee = await helperFunction.convertPromiseToObject(await employeeModel.findOne({
            where: {
                id: user.uid,
            }
        }));

        let contactObj = <any>{
            employer_id: employee.current_employer_id,
            employee_id: user.uid,
            message: params.message,
            type: constants.CONTACT_TYPE.employee
        }

        return await contactUsModel.create(contactObj);
    }

    /*
* function to get notification
*/
    public async getNotifications(params: any, user: any) {

        let notifications = await helperFunction.convertPromiseToObject(await notificationModel.findAndCountAll({
            where: {
                reciever_id: user.uid,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                type: {
                    [Op.notIn]: [
                        constants.NOTIFICATION_TYPE.achievement_post,
                        constants.NOTIFICATION_TYPE.message,
                        constants.NOTIFICATION_TYPE.group_chat,
                        constants.NOTIFICATION_TYPE.goal_submit_reminder,
                    ]
                },
                status: [0, 1]
            },
            order: [["createdAt", "DESC"]]
        }));

        await notificationModel.update({
            status: 0,
        }, {
            where: {
                status: 1,
                type: {
                    [Op.notIn]: [
                        constants.NOTIFICATION_TYPE.achievement_post,
                        constants.NOTIFICATION_TYPE.message,
                        constants.NOTIFICATION_TYPE.group_chat,
                        constants.NOTIFICATION_TYPE.goal_submit_reminder,
                    ]
                },
                reciever_id: user.uid,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
            }
        })


        return notifications;
    }

    /*
* function to get unseen notification count
*/
    public async getUnseenNotificationCount(user: any) {

        return {
            all: await notificationModel.count({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: {
                        [Op.notIn]: [
                            constants.NOTIFICATION_TYPE.achievement_post,
                            constants.NOTIFICATION_TYPE.message,
                            constants.NOTIFICATION_TYPE.group_chat,
                            constants.NOTIFICATION_TYPE.goal_submit_reminder,
                        ]
                    },
                    status: 1,
                }
            }),

            achievement: await notificationModel.count({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: [
                        constants.NOTIFICATION_TYPE.achievement_post,
                        constants.NOTIFICATION_TYPE.achievement_like,
                        constants.NOTIFICATION_TYPE.achievement_highfive,
                        constants.NOTIFICATION_TYPE.achievement_comment,
                    ],
                    status: 1,
                }
            }),

            achievement_post_only: await notificationModel.count({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: [
                        constants.NOTIFICATION_TYPE.achievement_post,
                    ],
                    status: 1,
                }
            }),

            chat: await notificationModel.count({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
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

            chat_message_only: (await helperFunction.convertPromiseToObject(await notificationModel.count({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: [
                        constants.NOTIFICATION_TYPE.message,
                        constants.NOTIFICATION_TYPE.group_chat,
                    ],
                    status: 1,
                },
                group: ['type_id']
            }))).length,

            goal: await notificationModel.count({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: [
                        constants.NOTIFICATION_TYPE.assign_new_goal,
                        constants.NOTIFICATION_TYPE.goal_complete_request,
                        constants.NOTIFICATION_TYPE.goal_accept,
                        constants.NOTIFICATION_TYPE.goal_reject,
                    ],
                    status: 1,
                }
            }),

            rating: await notificationModel.count({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: [
                        constants.NOTIFICATION_TYPE.rating
                    ],
                    status: 1,
                }
            })

        }



    }

    /*
* function to mark as viewed notification
*/
    public async markNotificationsAsViewed(params: any, user: any) {

        let whereCondition = null;

        if (params && params.type) {
            if (params.type == "achievement") {
                whereCondition = {
                    ...whereCondition,
                    type: [
                        constants.NOTIFICATION_TYPE.achievement_post,
                        constants.NOTIFICATION_TYPE.achievement_like,
                        constants.NOTIFICATION_TYPE.achievement_highfive,
                        constants.NOTIFICATION_TYPE.achievement_comment,
                    ]
                }
            }
            else if (params.type == "achievement_post_only") {
                whereCondition = {
                    ...whereCondition,
                    type: [
                        constants.NOTIFICATION_TYPE.achievement_post,
                    ]
                }
            }
            else if (params.type == "chat") {
                whereCondition = {
                    ...whereCondition,
                    type: [
                        constants.NOTIFICATION_TYPE.message,
                        constants.NOTIFICATION_TYPE.audio_chat,
                        constants.NOTIFICATION_TYPE.video_chat,
                        constants.NOTIFICATION_TYPE.audio_chat_missed,
                        constants.NOTIFICATION_TYPE.video_chat_missed,
                        constants.NOTIFICATION_TYPE.chat_disconnect,
                    ]
                }
            }
            else if (params.type == "chat_message_only") {

                if (!params.chat_room_id) throw new Error(constants.MESSAGES.chat_room_required)

                whereCondition = {
                    ...whereCondition,
                    type: [
                        constants.NOTIFICATION_TYPE.message,
                        constants.NOTIFICATION_TYPE.group_chat,
                    ],
                    type_id: parseInt(params.chat_room_id),
                }
            }
            else if (params.type == "goal") {
                whereCondition = {
                    ...whereCondition,
                    type: [
                        constants.NOTIFICATION_TYPE.assign_new_goal,
                        constants.NOTIFICATION_TYPE.goal_complete_request,
                        constants.NOTIFICATION_TYPE.goal_accept,
                        constants.NOTIFICATION_TYPE.goal_reject,
                    ]
                }
            }
            else if (params.type == "rating") {
                whereCondition = {
                    ...whereCondition,
                    type: [
                        constants.NOTIFICATION_TYPE.rating
                    ]
                }
            }

        }
        else {
            whereCondition = {
                ...whereCondition,
                type: {
                    [Op.notIn]: [
                        constants.NOTIFICATION_TYPE.achievement_post,
                        constants.NOTIFICATION_TYPE.message,
                        constants.NOTIFICATION_TYPE.goal_submit_reminder,
                    ]
                },
            }
        }


        let notification = await helperFunction.convertPromiseToObject(await notificationModel.update({
            status: 0,
        }, {
            where: {
                //id: parseInt(params.notification_id),
                ...whereCondition,
                status: 1,
                reciever_id: user.uid,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
            }
        }));


        return notification;
    }

    /**
     * function to refer a friend
     * @param params 
     * @param user 
     */
    public async referFriend(params: any) {
        const mailParams = <any>{};
        mailParams.to = params.email;
        mailParams.html = `Hi  ${params.name}
                <br> Please download the app by clicking on link below and use your credentials for login into the app :
                <br><br><b> Android URL</b>: ${process.env.EMPLOYEE_ANDROID_URL}
                <br><b> IOS URL</b>: ${process.env.EMPLOYEE_IOS_URL}
                <br><b> Web URL</b>: ${process.env.EMPLOYEE_IOS_URL} <br>
                `;
        mailParams.subject = "BluXinga Friend Referral";
        await helperFunction.sendEmail(mailParams);

        return true;
    }

    /**
     * function to feedback
     * @param params 
     * @param user 
     */
    public async feedback(params: any, user: any) {
        let feedbackObj = <any>{
            user_id: parseInt(user.uid),
            rating: parseInt(params.rating),
            message: params.message || null,
            feedback_type: constants.FEEDBACK_TYPE.employee,
        }

        return await helperFunction.convertPromiseToObject(await feedbackModel.create(feedbackObj));
    }

    /**
* 
* @param {} params pass all parameters from request
*/
    public async listVideo(params: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)

        let videos = await helperFunction.convertPromiseToObject(await libraryManagementModel.findAndCountAll({
            where: { status: 1 },
            limit: limit,
            offset: offset,
            order: [["id", "DESC"]]
        })
        )


        let thumbnailList = [
            "https://bluexinga-dev.s3.amazonaws.com/other/1626778872396_%20employee-training-programs-that-work.jpg",
            "https://bluexinga-dev.s3.amazonaws.com/other/1626778915570_%20corporate-training.jpg",
            "https://bluexinga-dev.s3.amazonaws.com/other/1626778937655_%20images%20%283%29.jpg",
            "https://bluexinga-dev.s3.amazonaws.com/other/1626778960089_%20the-value-of-employee-training.jpg",
            "https://bluexinga-dev.s3.amazonaws.com/other/1626779024160_%205a0965f54a5b3.jpg",
        ]
        let index = 0;
        videos.rows = videos.rows.map((video) => {
            if (index > 4) index = 0;
            return { ...video, thumbnail_url: video.thumbnail_url || thumbnailList[index++] }
        })

        return videos

    }

    public async generateHTML(params: any) {

        let { employee, folderPath, fileNames } = params;

        if (employee.employee_rank) {
            employee.employee_rank = employee.employee_rank.name;
        }

        let htmlHeader = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset='utf-8'>
                <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                <title>${employee.name}</title>
                <meta name='viewport' content='width=device-width, initial-scale=1'>
                
            </head>`;

        let htmlBody = `<body>
                <h1 style="text-align: center;">${employee.name} CV</h1>
                <table style="padding:0px 10px 10px 10px;">`

        for (let key in employee) {

            htmlBody += `<tr style="text-align: left;">
                    <th style="opacity: 0.9;">${key.split("_").map((ele) => {
                if (ele == "of" || ele == "in") return ele
                else return ele.charAt(0).toUpperCase() + ele.slice(1)
            }).join(" ")}</th>
                    <td style="opacity: 0.8;">:</td>
                    <td style="opacity: 0.8;">${key == 'profile_pic_url' ? `<img src='${employee[key]}' />` : employee[key]}</td>
                </tr>`
        }

        let htmlFooter = `</table></body>
            </html>`;


        fs.writeFileSync(folderPath + fileNames[0], htmlHeader + htmlBody + htmlFooter);
    }


    public async shareEmployeeCV(params: any, user: any) {
        employeeModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });

        let employee = await helperFunction.convertPromiseToObject(
            await employeeModel.findOne({
                where: {
                    id: user.uid,
                },
                include: [
                    {
                        model: employeeRanksModel,
                        required: false,
                        attributes: ["id", "name"]
                    },
                ]
            })
        )

        let folderPath = `./src/upload`;
        let fileNames = [
            `/${employee.name.split(" ").join("_")}_${employee.id}.html`,
            `/${employee.name.split(" ").join("_")}_${employee.id}.pdf`,
        ];

        fileNames.forEach(async (fileName) => {
            if (fs.existsSync(folderPath + fileName)) {
                await deleteFile(fileName);
            }
        })

        await this.generateHTML({ employee, folderPath, fileNames })

        const puppeteer = require('puppeteer')
        const hb = require('handlebars')

        const invoicePath = path.resolve(folderPath + fileNames[0]);
        const res = fs.readFileSync(invoicePath, 'utf8');
        //console.log("res",res)

        let data = {};

        const template = hb.compile(res, { strict: true });

        const result = template(data);

        const html = result;

        let launchOptions = {};

        if (require("os").platform() == 'linux') {
            launchOptions = {
                executablePath: '/usr/bin/chromium-browser',
                args: ["--no-sandbox"]
            }
        }

        const browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage()

        await page.setContent(html)

        await page.pdf({ path: folderPath + fileNames[1], format: 'A4' })
        await browser.close();

        let attachment = fs.readFileSync(folderPath + fileNames[1]).toString('base64');

        let mailOptions = {
            to: params.to_email,
            subject: params.subject || `${employee.name} CV`,
            html: params.message && params.message || `PFA`,
            attachments: [
                {
                    content: attachment,
                    filename: fileNames[1].slice(1),
                    type: "application/pdf",
                    disposition: "attachment"
                }
            ]
        };

        await helperFunction.sendEmail(mailOptions);

        fileNames.forEach(async (fileName) => {
            if (fs.existsSync(folderPath + fileName)) {
                await deleteFile(fileName);
            }
        })

        return true;

    }

    public async getEmployeeCV(params: any, user: any) {
        employeeModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });

        let employee = await helperFunction.convertPromiseToObject(
            await employeeModel.findOne({
                where: {
                    id: user.uid,
                },
                include: [
                    {
                        model: employeeRanksModel,
                        required: false,
                        attributes: ["id", "name"]
                    },
                ]
            })
        )

        let folderPath = `./src/upload`;
        let fileNames = [
            `/${employee.name.split(" ").join("_")}_${employee.id}.html`,
            `/${employee.name.split(" ").join("_")}_${employee.id}.docx`,
        ];

        fileNames.forEach(async (fileName) => {
            if (fs.existsSync(folderPath + fileName)) {
                await deleteFile(fileName);
            }
        })

        await this.generateHTML({ employee, folderPath, fileNames })

        const util = require('util');
        const exec = util.promisify(require('child_process').exec);

        let panDocCMD = `pandoc -f html ${folderPath + fileNames[0]} -o ${folderPath + fileNames[1]}`;
        console.log("pandoc ", await exec(panDocCMD));

        let fileParams = {
            path: path.join(__dirname, `../../../${folderPath}${fileNames[1]}`),
            originalname: fileNames[1],
            mimetype: `application/pdfapplication/vnd.openxmlformats-officedocument.wordprocessingml.document`
        }

        let docURL = await helperFunction.uploadFile(fileParams, "thumbnails");

        console.log("fileParams", fileParams)

        fileNames.forEach(async (fileName) => {
            if (fs.existsSync(folderPath + fileName)) {
                await deleteFile(fileName);
            }
        })

        return docURL;

    }

    /*
* function to get notification
*/
    public async getGoalSubmitReminders(params: any, user: any) {

        let goalSubmitReminders = await helperFunction.convertPromiseToObject(await notificationModel.findAndCountAll({
            where: {
                reciever_id: user.uid,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                type: [
                    constants.NOTIFICATION_TYPE.goal_submit_reminder,
                ],
                status: 1,
            },
            order: [["createdAt", "DESC"]]
        }));

        await notificationModel.update({
            status: 0,
        }, {
            where: {
                status: 1,
                type: [
                    constants.NOTIFICATION_TYPE.goal_submit_reminder,
                ],
                reciever_id: user.uid,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
            }
        })

        for (let goalSubmitReminder of goalSubmitReminders.rows) {
            delete goalSubmitReminder.data.senderEmplyeeData;
        }


        return goalSubmitReminders;
    }

}

