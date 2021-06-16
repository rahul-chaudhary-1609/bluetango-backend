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
var Op = Sequelize.Op;

export class EmployeeManagement {
    constructor() { }


    /**
     * to check whether user have any active plan or not
     */
    public async haveActivePlan(user: any) {
        let employer = await helperFunction.convertPromiseToObject(
            await employersModel.findByPk(parseInt(user.uid))
        );

        if (employer.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.free || employer.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.paid) return false
        if (employer.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan) return true
    }

    /**
    * add edit employee function
    @param {} params pass all parameters from request
    */
    public async addEditEmployee(params: any, user: any) {

        if (!this.haveActivePlan(user) && !(process.env.DEV_MODE == "ON")) throw new Error(constants.MESSAGES.employer_no_plan);
        params.email = (params.email).toLowerCase();

        if(params.current_department_id) {
            let departmentExists = await departmentModel.findOne({where:{id: params.current_department_id}});
            if(!departmentExists)
                throw new Error(constants.MESSAGES.invalid_department);
        }
        var existingUser; 
        if (params.id) {
            existingUser = await employeeModel.findOne({
                where: {
                    [Op.or]:[
                        {email: params.email},
                        {phone_number: params.phone_number},
                    ],
                    status: {
                        [Op.in]: [0,1]
                    },
                    id: {
                        [Op.ne]: params.id
                    }
                }
            });
        } else {
            existingUser = await employeeModel.findOne({
                where: {
                    [Op.or]:[
                        {email: params.email},
                        {phone_number: params.phone_number},
                    ],
                    status: {
                        [Op.in]: [0,1]
                    }
                }
            });
        }      
        
        params.current_employer_id = user.uid;
        if (_.isEmpty(existingUser)) {

            if(params.is_manager==1){
                if (!params.manager_team_name) {
                    throw new Error(constants.MESSAGES.manager_team_name_required)
                }
                if (!params.manager_team_icon_url) {
                    throw new Error(constants.MESSAGES.manager_team_icon_url_required)
                }
            }

            if (params.id) {
                delete params.password;
                let updateData =  await employeeModel.update( params, {
                    where: { id: params.id}
                });
                if (updateData) {
                    let managerData = await helperFunction.convertPromiseToObject ( await managerTeamMemberModel.findOne({
                        where: { team_member_id: params.id}
                    }) );
                    if (managerData && params.manager_id) {
                        if(managerData.manager_id != parseInt(params.manager_id)) {
                            await managerTeamMemberModel.update( 
                                 { 
                                     manager_id: params.manager_id
                                 }
                                , {
                                    where: { team_member_id: params.id}
                            });
                            
                        }
                    } else if (params.manager_id) {
                        let teamMemberObj = <any> {
                            team_member_id: params.id,
                            manager_id: params.manager_id
                        }        
                        await managerTeamMemberModel.create(teamMemberObj);

                    } else if (managerData) {
                        let where = <any>{
                            team_member_id: params.id,
                            manager_id: managerData.manager_id
                        }

                        await managerTeamMemberModel.destroy({where});
                    }

                    let employeeRes = await helperFunction.convertPromiseToObject(
                        await employeeModel.findOne({
                            where: { id: params.id }
                        })
                    )

                    if (params.is_manager==1) {
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
                                icon_image_url: params.manager_team_icon_url
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

                params.password = await appUtils.bcryptPassword(params.password);
                let employeeRes = await employeeModel.create(params);

                if (params.manager_id) {
                    let teamMemberObj = <any>{
                        team_member_id: employeeRes.id,
                        manager_id: params.manager_id
                    }

                    await managerTeamMemberModel.create(teamMemberObj);
                }
                if (params.is_manager==1) {
                    let groupChatRoomObj = <any>{
                        name:params.manager_team_name,
                        manager_id: parseInt(employeeRes.id),
                        member_ids: [],
                        live_member_ids: [],
                        room_id: await helperFunction.getUniqueChatRoomId(),
                        icon_image_url: params.manager_team_icon_url
                    };
                    let groupChatRoom = await helperFunction.convertPromiseToObject(
                        await groupChatRoomModel.create(groupChatRoomObj)
                    );
                    employeeRes.groupChatRoom = groupChatRoom;
                }
                

                return employeeRes;
            }

        } else {
            throw new Error(constants.MESSAGES.email_phone_already_registered);
        }
    }

    /**
     * get managers list 
     */

    public async getManagerList(params) {
        let where=<any> {
            is_manager: 1,
            status: constants.STATUS.active
        }

        if (params.department_id) {
            where = {
                ...where,
                current_department_id: parseInt(params.department_id),
            }
        }
        
        return await helperFunction.convertPromiseToObject(
            await employeeModel.findAll({
                attributes:['id','name','is_manager'],
                where
            })
        )
    }


    /**
    * get employee list function
    @param {} params pass all parameters from request
    */
    public async getEmployeeList(params: any, user: any) {

        if (!this.haveActivePlan(user) && !(process.env.DEV_MODE == "ON")) throw new Error(constants.MESSAGES.employer_no_plan);

        employeeModel.hasOne(departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
        if(params.departmentId) {
            let departmentExists = await departmentModel.findOne({where:{id: parseInt(params.departmentId)}});
            if(!departmentExists)
                throw new Error(constants.MESSAGES.invalid_department);
        }
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let whereCond = <any>{
            status:[constants.STATUS.active,constants.STATUS.inactive]
        };
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

        return await employeeModel.findAndCountAll({
            attributes: ['id', 'name', 'email', 'phone_number','profile_pic_url','current_department_id','is_manager'],
            where: whereCond,
            include: [
                {
                    model: departmentModel,
                    attributes: ['id', 'name'],
                    required:true,
              }  
            ],
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]]
        })

    }

    /**
     * funtion to get department list
     */
    public async getDepartmentList() {
        return await helperFunction.convertPromiseToObject(
            await departmentModel.findAndCountAll({
                where: {
                    status:constants.STATUS.active
                }
            })
        )
    }
    /**
     * function to View employee details
     */

    public async viewEmployeeDetails(params: any, user: any) {
        
        if (!this.haveActivePlan(user) && !(process.env.DEV_MODE == "ON")) throw new Error(constants.MESSAGES.employer_no_plan);

        employeeModel.hasOne(departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
        employeeModel.hasOne(managerTeamMemberModel, { foreignKey: "team_member_id", sourceKey: "id", targetKey: "team_member_id" });

        let employeeDetails = await helperFunction.convertPromiseToObject(
            await employeeModel.findOne({
                //attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url', 'current_department_id', 'is_manager'],
                where: {
                    id: parseInt(params.employee_id),
                    status: [constants.STATUS.active, constants.STATUS.inactive]
                },
                include: [
                    {
                        model: managerTeamMemberModel,
                        attributes: ['id', 'manager_id','team_member_id'],
                        required: true,
                    },
                    {
                        model: departmentModel,
                        attributes: ['id', 'name'],
                        required: true,
                    }
                ],
                
            })
        )

        delete employeeDetails.password

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

            qualitativeMeasurements = {
                id: qualitativeMeasurement[0].id,
                manager_id: qualitativeMeasurement[0].manager_id,
                employee_id: qualitativeMeasurement[0].employee_id,
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

            return { employeeDetails, goalStats, qualitativeMeasurements }
    }
    /**
     * function to delete an employee
     */

    public async deleteEmployee(params: any, user: any) {
        
        if (!this.haveActivePlan(user) && !(process.env.DEV_MODE == "ON")) throw new Error(constants.MESSAGES.employer_no_plan);
        
        let employee = await employeeModel.findOne({
            where:{
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

}