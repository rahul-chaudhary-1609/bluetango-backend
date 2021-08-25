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

        if (employer.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan && employer.free_trial_status == constants.EMPLOYER_FREE_TRIAL_STATUS.over) return false
        else return true
    }

    /**
    * add edit employee function
    @param {} params pass all parameters from request
    */
    public async addEditEmployee(params: any, user: any) {

        
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
            let isEmployeeCodeExist = null;
            if (params.id) {
                isEmployeeCodeExist = await employeeModel.findOne({
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
            } else {
                isEmployeeCodeExist = await employeeModel.findOne({
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
                    let password = params.password;
                    params.password = await appUtils.bcryptPassword(params.password);
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
                            icon_image_url: params.manager_team_icon_url
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
            } else {
                throw new Error(constants.MESSAGES.employee_code_already_registered);
            }

        } else {
            throw new Error(constants.MESSAGES.email_phone_already_registered);
        }
    }

    /**
     * get managers list 
     */

    public async getManagerList(params,user) {
        let where=<any> {
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

        

        employeeModel.hasOne(departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
        employeeModel.hasOne(emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });

        if(params.departmentId) {
            let departmentExists = await departmentModel.findOne({where:{id: parseInt(params.departmentId)}});
            if(!departmentExists)
                throw new Error(constants.MESSAGES.invalid_department);
        }
        
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

        let query =<any> {
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
            ],
            order: [["createdAt", "DESC"]]
        }

        if (params.offset && params.limit) {
            let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
            query = {
                ...query,
                limit:limit,
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
                    status:constants.STATUS.active
                }
            })
        )
    }
    /**
     * function to View employee details
     */

    public async viewEmployeeDetails(params: any, user: any) {
        
        

        employeeModel.hasOne(departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
        employeeModel.hasOne(managerTeamMemberModel, { foreignKey: "team_member_id", sourceKey: "id", targetKey: "team_member_id" });
        managerTeamMemberModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
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

            return { employeeDetails, goalStats, qualitativeMeasurements }
    }
    /**
     * function to delete an employee
     */

    public async deleteEmployee(params: any, user: any) {
        
        
        
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

    /**
     * function to updater an employee manager
     */

    public async updateManager(params: any, user: any) {

        

        let managerTeam = await helperFunction.convertPromiseToObject(
            await managerTeamMemberModel.update(
                {
                    manager_id: params.new_manager_id,
                },
                {
                    where: { manager_id: params.current_manager_id, },
                    returning: true
                }
            )
        )

        return true;
    }

    public async addEditAttributes(params:any, user:any){

        let duplicateAttribute=null;

        if(params.attribute_id){
            duplicateAttribute=await attributeModel.findOne({
                where:{
                    employer_id:user.uid,
                    [Op.or]:[
                        {
                            name:params.attribute_name,
                        },
                        {
                            label:params.attribute_label,
                        }
                    ],
                    status:[constants.STATUS.active,constants.STATUS.inactive],
                    id:{
                        [Op.notIn]:[params.attribute_id]
                    }
                }
            })
        }else{
            duplicateAttribute=await attributeModel.findOne({
                where:{
                    employer_id:user.uid,
                    [Op.or]:[
                        {
                            name:params.attribute_name,
                        },
                        {
                            label:params.attribute_label,
                        }
                    ],
                    status:[constants.STATUS.active,constants.STATUS.inactive],
                }
            })
        }

        if(!duplicateAttribute){

            if(params.attribute_id){
                let attribute=await attributeModel.findOne({
                    where:{
                        id:params.attribute_id,
                        employer_id:user.uid,
                    }
                })

                if(attribute){
                    attribute.name=params.attribute_name;
                    attribute.label=params.attribute_label;
                    attribute.comment=params.attribute_comment || null;

                    attribute.save();

                    return await helperFunction.convertPromiseToObject(attribute);
                }else{
                    throw new Error(constants.MESSAGES.attribute_not_found)
                }
            }else{ 
                
                let attributeObj=<any>{
                    employer_id:user.uid,
                    name:params.attribute_name,
                    label:params.attribute_label,
                    comment:params.attribute_comment || null,
                }

                return await helperFunction.convertPromiseToObject(await attributeModel.create(attributeObj)); 
        
            }
        }else{
            throw new Error(constants.MESSAGES.attribute_already_added)
        }
    }

    public async deleteAttribute(params:any,user:any){
        let attribute=await attributeModel.findOne({
            where:{
                id:params.attribute_id,
                employer_id:user.uid,
                status:[constants.STATUS.active,constants.STATUS.inactive],
            }
        })

        if(attribute){
            
            attribute.status=constants.STATUS.deleted;
            attribute.save();

            return true;
        }else{
            throw new Error(constants.MESSAGES.attribute_not_found)
        }
    }

    public async toggleAttributeStatus(params:any,user:any){
        let attribute=await attributeModel.findOne({
            where:{
                id:params.attribute_id,
                employer_id:user.uid,
                status:[constants.STATUS.active,constants.STATUS.inactive],
            }
        })

        if(attribute){
            
            if(attribute.status==constants.STATUS.active){
                attribute.status=constants.STATUS.inactive;
            }else{
                attribute.status=constants.STATUS.active;
            }

            attribute.save();

            return true;
        }else{
            throw new Error(constants.MESSAGES.attribute_not_found)
        }
    }
        

}