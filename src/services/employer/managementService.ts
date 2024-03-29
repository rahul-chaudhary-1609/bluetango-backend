import { employeeModel, employersModel, departmentModel } from "../../models";
import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
const Sequelize = require('sequelize');
import { managerTeamMemberModel } from "../../models/managerTeamMember";
import { teamGoalModel } from "../../models/teamGoal"
import { qualitativeMeasurementModel } from "../../models/qualitativeMeasurement"
import { teamGoalAssignModel } from "../../models/teamGoalAssign"
import { emojiModel } from "../../models/emoji";
import { groupChatRoomModel } from "../../models/groupChatRoom";
import { attributeModel } from "../../models/attributes";
import { attributeRatingModel } from "../../models/attributeRatings"
import { employeeRanksModel } from "../../models/employeeRanks";
import { teamGoalAssignCompletionByEmployeeModel } from "../../models/teamGoalAssignCompletionByEmployee";
var Op = Sequelize.Op;
import { qualitativeMeasurementCommentModel } from  "../../models/qualitativeMeasurementComment"

export class EmployeeManagement {
    constructor() { }


    /**
     * to check whether user have any active plan or not
     */
    public async haveActivePlan(user: any) {
        let employer = await helperFunction.convertPromiseToObject(
            await employersModel.findByPk(parseInt(user.uid))
        );

        if (employer.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan && employer.free_trial_status == constants.EMPLOYER_FREE_TRIAL_STATUS.over) return false
        else return true
    }

    public async migrateGoalsToNewManager(manager_id, employee_id) {
        teamGoalAssignModel.hasOne(teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });

        let goalAssigns = await helperFunction.convertPromiseToObject(
            await teamGoalAssignModel.findAll({
                where: {
                    employee_id,
                },
                include: [
                    {
                        model: teamGoalModel,
                        required: true,
                    }
                ]
            })
        )

        for (let goalAssign of goalAssigns) {
            let newGoalObj = <any>{
                manager_id,
                title: goalAssign.team_goal.title,
                description: goalAssign.team_goal.description,
                start_date: goalAssign.team_goal.start_date,
                end_date: goalAssign.team_goal.end_date,
                select_measure: goalAssign.team_goal.select_measure,
                enter_measure: goalAssign.team_goal.enter_measure,
            }
            let [newGoal, created] = await helperFunction.convertPromiseToObject(
                await teamGoalModel.findOrCreate({
                    where: newGoalObj,
                    defaults: newGoalObj,
                })
            )

            await teamGoalAssignModel.update(
                {
                    goal_id: newGoal.id,
                },
                {
                    where: {
                        id: goalAssign.id,
                    }
                }
            )

            await teamGoalAssignCompletionByEmployeeModel.update(
                {
                    goal_id: newGoal.id,
                },
                {
                    where: {
                        team_goal_assign_id: goalAssign.id,
                    }
                }
            )
        }
    }

    /**
    * add edit employee function
    @param {} params pass all parameters from request
    */
    public async addEditEmployee(params: any, user: any) {


        params.email = (params.email).toLowerCase();
        params.name = params.first_name + " " + params.last_name;
        if (params.current_department_id) {
            let departmentExists = await departmentModel.findOne({ where: { id: params.current_department_id } });
            if (!departmentExists)
                throw new Error(constants.MESSAGES.invalid_department);
        }
        let existingUser = null;
        if (params.id) {
            existingUser = await employeeModel.findOne({
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
        } else {
            existingUser = await employeeModel.findOne({
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
                    throw new Error(constants.MESSAGES.manager_team_name_required)
                }
                if (!params.manager_team_icon_url) {
                    throw new Error(constants.MESSAGES.manager_team_icon_url_required)
                }
            }

            if (params.id) {
                delete params.password;
                let updateData = await employeeModel.update(params, {
                    where: { id: params.id }
                });
                if (updateData) {
                    let managerData = await helperFunction.convertPromiseToObject(await managerTeamMemberModel.findOne({
                        where: { team_member_id: params.id }
                    }));
                    if (managerData && params.manager_id) {
                        if (managerData.manager_id != parseInt(params.manager_id)) {
                            await managerTeamMemberModel.update(
                                {
                                    manager_id: params.manager_id
                                }
                                , {
                                    where: { team_member_id: params.id }
                                });

                            await this.migrateGoalsToNewManager(params.manager_id, params.id);

                        }
                    } else if (params.manager_id) {
                        let teamMemberObj = <any>{
                            team_member_id: params.id,
                            manager_id: params.manager_id
                        }
                        await managerTeamMemberModel.create(teamMemberObj);

                    } else if (managerData) {
                        let where = <any>{
                            team_member_id: params.id,
                            manager_id: managerData.manager_id
                        }

                        await managerTeamMemberModel.destroy({ where });
                    }

                    let employeeRes = await helperFunction.convertPromiseToObject(
                        await employeeModel.findOne({
                            where: { id: params.id }
                        })
                    )

                    if (params.is_manager == 1) {
                        let groupChatRoom = await groupChatRoomModel.findOne({
                            where: {
                                manager_id: parseInt(params.id),
                            }
                        });

                        if (groupChatRoom) {
                            groupChatRoom.name = params.manager_team_name;
                            groupChatRoom.icon_image_url = params.manager_team_icon_url;
                            groupChatRoom.save();
                        } else {
                            let groupChatRoomObj = <any>{
                                name: params.manager_team_name,
                                manager_id: parseInt(params.id),
                                member_ids: [],
                                live_member_ids: [],
                                room_id: await helperFunction.getUniqueChatRoomId(),
                                icon_image_url: params.manager_team_icon_url,
                                info: [{
                                    id: parseInt(params.id),
                                    chatLastDeletedOn: new Date(),
                                    isDeleted: false,
                                    type: constants.CHAT_USER_TYPE.employee,
                                }],
                            };

                            groupChatRoom = await helperFunction.convertPromiseToObject(
                                await groupChatRoomModel.create(groupChatRoomObj)
                            );
                        }
                        employeeRes.groupChatRoom = groupChatRoom;

                    }

                    return employeeRes;
                } else {
                    return false;
                }
            } else {
                // let password = params.password;
                let password = await helperFunction.generaePassword();
                params.password = await appUtils.bcryptPassword(password);
                let employeeRes = await employeeModel.create(params);

                if (params.manager_id) {
                    let teamMemberObj = <any>{
                        team_member_id: employeeRes.id,
                        manager_id: params.manager_id
                    }

                    await managerTeamMemberModel.create(teamMemberObj);
                }
                if (params.is_manager == 1) {
                    let groupChatRoomObj = <any>{
                        name: params.manager_team_name,
                        manager_id: parseInt(employeeRes.id),
                        member_ids: [],
                        live_member_ids: [],
                        room_id: await helperFunction.getUniqueChatRoomId(),
                        icon_image_url: params.manager_team_icon_url,
                        info: [{
                            id: parseInt(employeeRes.id),
                            chatLastDeletedOn: new Date(),
                            isDeleted: false,
                            type: constants.CHAT_USER_TYPE.employee,
                        }],
                    };
                    let groupChatRoom = await helperFunction.convertPromiseToObject(
                        await groupChatRoomModel.create(groupChatRoomObj)
                    );
                    employeeRes.groupChatRoom = groupChatRoom;
                }

                const mailParams = <any>{};
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
                await helperFunction.sendEmail(mailParams);


                return employeeRes;
            }
            // } else {
            //     throw new Error(constants.MESSAGES.employee_code_already_registered);
            // }

        } else {
            throw new Error(constants.MESSAGES.email_phone_already_registered);
        }
    }

    /**
     * get managers list 
     */

    public async getManagerList(params, user) {
        let where = <any>{
            is_manager: 1,
            status: constants.STATUS.active,
            current_employer_id: parseInt(user.uid),
        }

        if (params.department_id) {
            where = {
                ...where,
                current_department_id: parseInt(params.department_id),
            }
        }

        return await helperFunction.convertPromiseToObject(
            await employeeModel.findAll({
                attributes: ['id', 'name', 'is_manager'],
                where
            })
        )
    }


    /**
    * get employee list function
    @param {} params pass all parameters from request
    */
    public async getEmployeeList(params: any, user: any) {

        employeeModel.hasOne(departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
        employeeModel.hasOne(emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
        employeeModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });

        if (params.departmentId) {
            let departmentExists = await departmentModel.findOne({ where: { id: parseInt(params.departmentId) } });
            if (!departmentExists)
                throw new Error(constants.MESSAGES.invalid_department);
        }

        let whereCond = <any>{
            status: [constants.STATUS.active, constants.STATUS.inactive]
        };
        let employeeRank: any = {};
        whereCond.current_employer_id = user.uid;
        if (params.departmentId) {
            whereCond = {
                ...whereCond,
                current_department_id: parseInt(params.departmentId)
            }
        }
        if (params.searchKey) {
            let searchKey = params.searchKey;
            whereCond = {
                ...whereCond,
                [Op.or]: [
                    { name: { [Op.iLike]: `%${searchKey}%` } },
                    { email: { [Op.iLike]: `%${searchKey}%` } },
                    { phone_number: { [Op.iLike]: `%${searchKey}%` } }
                ]
            };
        }

        if (params.employeeRankId) {
            employeeRank = {
                id: params.employeeRankId,
            }
        }

        let query = <any>{
            attributes: ['id', 'name', 'email', 'country_code', 'phone_number', 'profile_pic_url', 'current_department_id', 'is_manager', 'energy_last_updated'],
            where: whereCond,
            include: [
                {
                    model: departmentModel,
                    attributes: ['id', 'name'],
                    required: true,
                },
                {
                    model: emojiModel,
                    required: false,
                    as: 'energy_emoji_data',
                    attributes: ['id', 'image_url', 'caption']
                },
                {
                    model: employeeRanksModel,
                    where: employeeRank,
                    required: true,
                    attributes: ["id", "name"]
                }
            ],
            order: [["createdAt", "DESC"]]
        }

        if (params.offset && params.limit) {
            let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
            query = {
                ...query,
                limit: limit,
                offset: offset,
            }
        }

        return await employeeModel.findAndCountAll(query);

    }

    /**
     * funtion to get department list
     */
    public async getDepartmentList() {
        return await helperFunction.convertPromiseToObject(
            await departmentModel.findAndCountAll({
                where: {
                    status: constants.STATUS.active
                }
            })
        )
    }

    public async getEmployeeRankList() {

        let ranks = await helperFunction.convertPromiseToObject(
            await employeeRanksModel.findAndCountAll({
                where: {
                    status: constants.STATUS.active,
                },
                order: [["name", "ASC"]]
            })
        )

        if (ranks.count == 0) {
            throw new Error(constants.MESSAGES.no_employee_rank);
        }

        return ranks;

    }

    /**
     * function to View employee details
     */

    public async viewEmployeeDetails(params: any, user: any) {



        employeeModel.hasOne(departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
        employeeModel.hasOne(managerTeamMemberModel, { foreignKey: "team_member_id", sourceKey: "id", targetKey: "team_member_id" });
        employeeModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });
        managerTeamMemberModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
        let employeeDetails = await helperFunction.convertPromiseToObject(
            await employeeModel.findOne({
                where: {
                    id: parseInt(params.employee_id),
                    status: [constants.STATUS.active, constants.STATUS.inactive]
                },
                include: [
                    {
                        model: managerTeamMemberModel,
                        attributes: ['id', 'manager_id', 'team_member_id'],
                        required: false,
                        include: [{
                            model: employeeModel,
                            required: false,
                            attributes: ['id', 'name', 'email', 'profile_pic_url']
                        }]
                    },
                    {
                        model: departmentModel,
                        attributes: ['id', 'name'],
                        required: false,
                    },
                    {
                        model: employeeRanksModel,
                        required: false,
                        attributes: ["id", "name"]
                    }
                ],

            })
        )

        delete employeeDetails.password

        employeeDetails.groupChatRoom = null;

        if (employeeDetails.is_manager) {
            let groupChatRoom = await helperFunction.convertPromiseToObject(
                await groupChatRoomModel.findOne({
                    where: {
                        manager_id: parseInt(employeeDetails.id),
                    }
                })
            );

            employeeDetails.groupChatRoom = groupChatRoom
        }

        teamGoalAssignModel.hasOne(teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
        let quantitativeStatsOfGoals = await helperFunction.convertPromiseToObject(await teamGoalAssignModel.findAll({
            where: { employee_id: parseInt(params.employee_id) },
            include: [
                {
                    model: teamGoalModel,
                    required: true,
                }
            ]
        }))

        let goalStats = [];

        for (let goal of quantitativeStatsOfGoals) {
            goalStats.push({
                ...goal,
                quantitative_stats: `${parseFloat(goal.complete_measure)}/${parseFloat(goal.team_goal.enter_measure)}`,
                quantitative_stats_percent: (parseFloat(goal.complete_measure) / parseFloat(goal.team_goal.enter_measure)) * 100,

            })
        }

        let qualitativeMeasurement = await helperFunction.convertPromiseToObject(await qualitativeMeasurementModel.findAll({
            where: { employee_id: parseInt(params.employee_id) },
            attributes: ["id", "manager_id", "employee_id", "createdAt", "updatedAt",
                ["initiative", "Initiative"], ["initiative_desc", "Initiative_desc"],
                ["ability_to_delegate", "Ability to Delegate"], ["ability_to_delegate_desc", "Ability to Delegate_desc"],
                ["clear_Communication", "Clear Communication"], ["clear_Communication_desc", "Clear Communication_desc"],
                // ["self_awareness_of_strengths_and_weaknesses", "Self-awareness of strengths and weaknesses"], ["self_awareness_of_strengths_and_weaknesses_desc", "Self-awareness of strengths and weaknesses_desc"],
                ["agile_thinking", "Agile Thinking"], ["agile_thinking_desc", "Agile Thinking_desc"],
                // ["influence", "Influence"], ["influence_desc", "Influence_desc"],
                ["empathy", "Empathy"], ["empathy_desc", "Empathy_desc"],
                // ["leadership_courage", "Leadership Courage"], ["leadership_courage_desc", "Leadership Courage_desc"],
                // ["customer_client_patient_satisfaction", "Customer/Client/Patient Satisfaction"], ["customer_client_patient_satisfaction_desc", "Customer/Client/Patient Satisfaction_desc"],
                // ["team_contributions", "Team contributions"], ["team_contributions_desc", "Team contributions_desc"],
                // ["time_management", "Time Management"], ["time_management_desc", "Time Management_desc"],
                // ["work_product", "Work Product"], ["work_product_desc", "Work Product_desc"],
            ],
            order: [["updatedAt", "DESC"]],
            limit: 1
        }))

        let qualitativeMeasurements = null;

        if (qualitativeMeasurement.length !== 0) {
            //throw new Error(constants.MESSAGES.no_qualitative_measure);
            let startDate = new Date(qualitativeMeasurement[0].createdAt);
            let endDate = new Date(qualitativeMeasurement[0].createdAt)
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
            }



            for (let key in qualitativeMeasurement[0]) {
                if ([
                    "Initiative",
                    "Ability to Delegate",
                    "Clear Communication",
                    // "Self-awareness of strengths and weaknesses",
                    "Agile Thinking",
                    // "Influence",
                    "Empathy",
                    // "Leadership Courage",
                    // "Customer/Client/Patient Satisfaction",
                    // "Team contributions",
                    // "Time Management",
                    // "Work Product",
                ].includes(key)) {
                    qualitativeMeasurements.qualitativeMeasures.push({
                        label: key,
                        rating: qualitativeMeasurement[0][key],
                        desc: qualitativeMeasurement[0][`${key}_desc`]
                    })

                }

            }
        }

        attributeRatingModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" });
        let attributeRatings = await helperFunction.convertPromiseToObject(await attributeRatingModel.findOne({
            where: { employee_id: params.employee_id || user.uid },
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

        return { employeeDetails, goalStats, qualitativeMeasurements, attributeRatings }
    }
    /**
     * function to delete an employee
     */

    public async deleteEmployee(params: any, user: any) {

        let employee = await employeeModel.findOne({
            where: {
                id: parseInt(params.employee_id),
                status: [constants.STATUS.active, constants.STATUS.inactive]
            }
        })

        if (employee) {
            employee.status = constants.STATUS.deleted;
            employee.save()
        }
        else {
            throw new Error(constants.MESSAGES.employee_notFound)
        }

        return true;
    }

    /**
     * function to updater an employee manager
     */

    public async updateManager(params: any, user: any) {

        await managerTeamMemberModel.update(
            {
                manager_id: params.new_manager_id,
            },
            {
                where: { manager_id: params.current_manager_id, },
                returning: true
            }
        )

        let goals = await helperFunction.convertPromiseToObject(
            await teamGoalModel.findAll({
                where: {
                    manager_id: params.current_manager_id,
                }
            })
        )

        for (let goal of goals) {

            let newGoal = await helperFunction.convertPromiseToObject(
                await teamGoalModel.findOne({
                    where: {
                        manager_id: params.new_manager_id,
                        title: goal.title,
                        description: goal.description,
                        start_date: goal.start_date,
                        end_date: goal.end_date,
                        select_measure: goal.select_measure,
                        enter_measure: goal.enter_measure,
                    },
                })
            )

            if (newGoal) {
                await teamGoalAssignModel.update(
                    {
                        goal_id: newGoal.id,
                    },
                    {
                        where: {
                            goal_id: goal.id,
                        }
                    }
                )

                await teamGoalAssignCompletionByEmployeeModel.update(
                    {
                        goal_id: newGoal.id,
                    },
                    {
                        where: {
                            goal_id: goal.id,
                        }
                    }
                )
            } else {
                await teamGoalModel.update(
                    {
                        manager_id: params.new_manager_id,
                    },
                    {
                        where: {
                            manager_id: params.current_manager_id,
                        },
                        returning: true
                    }
                )
            }
        }

        return true;
    }

    public async addAttributes(params: any, user: any) {

        console.log("params.attributes", params.attributes, params)
        // params.attributes=JSON.parse(params.attributes);
        // console.log("params.attributes",params.attributes,params)
        let duplicateAttribute = null;
        let attributes = [];

        for (let attribute of params.attributes) {
            duplicateAttribute = await attributeModel.findOne({
                where: {
                    employer_id: user.uid,
                    name: {
                        [Op.iLike]: attribute.name.toLowerCase(),
                    },
                    status: [constants.STATUS.active, constants.STATUS.inactive],
                }
            })

            if (duplicateAttribute) {
                break;
            }

            attributes.push({
                employer_id: user.uid,
                name: attribute.name,
                comment: attribute.desc || null,
                particulars: attribute.particulars || null,
                guidance: attribute.guidance || null,
            })
        }


        if (!duplicateAttribute) {
            return await helperFunction.convertPromiseToObject(await attributeModel.bulkCreate(attributes));
        } else {
            throw new Error(constants.MESSAGES.attribute_already_added)
        }
    }

    public async getAttributes(params: any, user: any) {

        let query: any = {
            where: {
                employer_id: user.uid,
                status: [constants.STATUS.active, constants.STATUS.inactive],
            },
            order: [["createdAt", "DESC"]]
        }

        if (!params.is_pagination || params.is_pagination == constants.IS_PAGINATION.yes) {
            let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
            query.offset = offset,
                query.limit = limit
        }
        let attribute = await attributeModel.findAndCountAll(query);

        if (attribute) {
            return await helperFunction.convertPromiseToObject(attribute);
        } else {
            throw new Error(constants.MESSAGES.attribute_not_found)
        }
    }

    public async getAttributeDetails(params: any, user: any) {
        let attribute = await attributeModel.findOne({
            where: {
                id: params.attribute_id,
                employer_id: user.uid,
                status: [constants.STATUS.active, constants.STATUS.inactive],
            }
        })

        if (attribute) {
            return await helperFunction.convertPromiseToObject(attribute);
        } else {
            throw new Error(constants.MESSAGES.attribute_not_found)
        }
    }

    public async deleteAttribute(params: any, user: any) {
        let attribute = await attributeModel.findOne({
            where: {
                id: params.attribute_id,
                employer_id: user.uid,
                status: [constants.STATUS.active, constants.STATUS.inactive],
            }
        })

        if (attribute) {

            attribute.status = constants.STATUS.deleted;
            attribute.save();

            return true;
        } else {
            throw new Error(constants.MESSAGES.attribute_not_found)
        }
    }

    public async toggleAttributeStatus(params: any, user: any) {
        let attribute = await attributeModel.findOne({
            where: {
                id: params.attribute_id,
                employer_id: user.uid,
                status: [constants.STATUS.active, constants.STATUS.inactive],
            }
        })

        if (attribute) {

            if (attribute.status == constants.STATUS.active) {
                attribute.status = constants.STATUS.inactive;
            } else {
                attribute.status = constants.STATUS.active;
            }

            attribute.save();

            return true;
        } else {
            throw new Error(constants.MESSAGES.attribute_not_found)
        }
    }
     /*
    * get to add qualitative measurement details
    */
     public async getQualitativeMeasurementDetails(params: any, user: any) {
        
        let where = <any>{ status: constants.STATUS.active}
        if (params.name) {
            where = {
                ...where,
                name: params.name
            }
        }
        return await qualitativeMeasurementCommentModel.findAll({
            where: where,
        })
    }


}