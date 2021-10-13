import _, { constant } from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import * as tokenResponse from "../../utils/tokenResponse";
import { employeeModel } from  "../../models/employee"
import { adminModel } from "../../models/admin";
import { employersModel } from  "../../models/employers"
import { departmentModel } from  "../../models/department"
import { managerTeamMemberModel } from  "../../models/managerTeamMember"
import { teamGoalAssignModel } from  "../../models/teamGoalAssign"
import { qualitativeMeasurementModel } from  "../../models/qualitativeMeasurement"
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
const moment =require("moment");
import * as path from 'path';
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
const PDFDocument = require('pdfkit');
const fs = require('fs');

const authService = new AuthService();

export class EmployeeServices {
    constructor() { }

    /*
    * function to get list of team members
    */
    public async getListOfTeamMemberByManagerId(params:any, user: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit);
        managerTeamMemberModel.hasOne(employeeModel,{ foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
        employeeModel.hasOne(emojiModel,{ foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });

        let teamMembersData = await helperFunction.convertPromiseToObject(  await managerTeamMemberModel.findAndCountAll({
                where: { manager_id: user.uid},
                include: [
                    {
                        model: employeeModel, 
                        required: true,
                        attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'energy_last_updated', 'profile_pic_url'],
                        where:{status:1},
                        include: [
                            {
                                model: emojiModel,
                                required: false,
                                attributes:['image_url', 'caption'],
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
        date.setMonth(date.getMonth()-3);
        //let dateCheck = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
        let dateCheck = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        for (let i=0; i< teamMembersData.rows.length; i++ ) {
            let rateCheck = await helperFunction.convertPromiseToObject( await attributeRatingModel.findOne({
                    where: {
                        manager_id: user.uid,
                        employee_id: teamMembersData.rows[i].team_member_id,
                        updatedAt:{[Op.gte]: dateCheck }
                    }
                })
            );
            if (_.isEmpty(rateCheck)) {
                teamMembersData.rows[i].rate_valid = 1;
            } else {
                teamMembersData.rows[i].rate_valid_after_date =  rateCheck.createdAt;
                teamMembersData.rows[i].rate_valid = 0;
            }
        }

        return teamMembersData;
           
    }

    /*
    * function to get details of employee
    */
    public async viewDetailsEmployee(params:any) {
        employeeModel.hasMany(teamGoalAssignModel,{ foreignKey: "employee_id", sourceKey: "id", targetKey: "employee_id" });
        teamGoalAssignModel.hasOne(teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
        employeeModel.hasOne(departmentModel, { foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
        let employeeDetails = await helperFunction.convertPromiseToObject( await employeeModel.findOne({
                where: { id: params.id},
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
            attributes: ['id', 'name', 'email', 'phone_number', 'country_code', 'profile_pic_url','current_department_id']
            }) );

        

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

        attributeRatingModel.hasOne(employeeModel,{foreignKey: "id", sourceKey: "employee_id", targetKey: "id"});
        employeeDetails.attributeRatings =await helperFunction.convertPromiseToObject( await attributeRatingModel.findOne({
            where: { employee_id: params.id },
            include: [
                {
                    model: employeeModel,
                    required: true,
                    attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                }
            ],
            order: [["updatedAt", "DESC"]],
            limit:1
        })) 

        
        return employeeDetails;
    }

    /*
    * function to get details of employee
    */
    public async searchTeamMember(params:any, user: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit);

        managerTeamMemberModel.hasOne(employeeModel,{ foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
        employeeModel.hasOne(emojiModel, { foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
        let teamMembersData= await helperFunction.convertPromiseToObject( await managerTeamMemberModel.findAndCountAll({
            where: { manager_id: user.uid},
            include: [
                {
                    model: employeeModel, 
                    required: true,
                    where: {
                        [Op.or]:[
                            {name: { [Op.iLike]: `%${params.search_string}%` }},
                            {phone_number: {[Op.iLike]: `%${params.search_string}%`}},
                            {email: { [Op.iLike]: `%${params.search_string}%`}}
                        ]
                    },
                    attributes: ['id', 'name', 'email', 'phone_number', 'country_code','energy_last_updated', 'profile_pic_url'],
                    include: [
                        {
                            model: emojiModel,
                            required: false,
                            attributes:['image_url', 'caption'],
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
    public async thoughtOfTheDay(params:any, user: any) {
        await employeeModel.update(
            {
                thought_of_the_day: params.thought_of_the_day
            },
            {
                where: { id: user.uid}
            }
        )

        return employeeModel.findOne({
            where: { id: user.uid}
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
    public async updateEnergyCheck(params:any, user: any) {
        await employeeModel.update(
            {
                energy_id: params.energy_id,
                energy_last_updated:new Date(),
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

       managerTeamMemberModel.hasOne(employeeModel,{ foreignKey: "id", sourceKey: "team_member_id", targetKey: "id" });
       employeeModel.hasOne(emojiModel,{ foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
       
        return await managerTeamMemberModel.findAll({
           where: { manager_id: user.uid },
           include:[
               {
                    model: employeeModel,
                    required: false,
                    attributes:['id', 'name', 'energy_id'],
                    include: [
                        {
                            model: emojiModel,
                            required: false,
                            attributes:['image_url', 'caption'],
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
            attributes: ['id', 'name','employee_code','profile_pic_url'],
            where: {
                id:user.uid
            },
            include: [
                {
                    model: departmentModel,
                    required: false,
                    attributes:['name']
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
        let employeeEnergy = await helperFunction.convertPromiseToObject( await employeeModel.findOne({
            attributes: ['id', 'name','energy_last_updated'],
            where: {
                id: user.uid
            },
            include: [
                {
                    model: emojiModel,
                    required: false,
                    attributes: ['id','image_url','caption']
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
            attributes: ['id', 'job_emoji_id','job_comments'],
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

    /*
   * function to get coach list
   */
    public async getCoachList(user: any,params:any) {

        let employee = await helperFunction.convertPromiseToObject(
            await employeeModel.findByPk(parseInt(user.uid))
        )
        let where: any = {}

        if (params.searchKey) {
            let  coachSpecializationCategories=await helperFunction.convertPromiseToObject(
                await coachSpecializationCategoriesModel.findAll({
                    where:{
                        name:{
                            [Op.iLike]:`%${params.searchKey}%`
                        }
                    }
                })
            ) 

            if(coachSpecializationCategories){
                let coachSpecializationCategoryIds=coachSpecializationCategories.map(coachSpecializationCategory=>coachSpecializationCategory.id);
                if(coachSpecializationCategoryIds){
                    where["coach_specialization_category_ids"] = { 
                            [Op.contains]: coachSpecializationCategoryIds || [],
                        }
                }
            }
                        
        }

        if(employee){
            where["employee_rank_ids"] = { 
                        [Op.contains]: [employee.employee_rank_id] 
                    }
        }

        where["status"] = constants.STATUS.active

        let query=<any>{
            where: where,
            attributes: ["id", "name",'description', "email", "phone_number", ['image', 'profile_pic_url'],"coach_specialization_category_ids","employee_rank_ids","coach_charge"],
            order: [["id", "DESC"]]
        }

        if(params.sortBy){
            if(params.sortBy==1){
                query.order=[["createdAt","DESC"]]
            }else if(params.sortBy==2){
                query.order=[["createdAt","ASC"]]
            }else if(params.sortBy==4){
                query.order=[["coach_charge","DESC"]]
            }else if(params.sortBy==5){
                query.order=[["coach_charge","ASC"]]
            }
        }

        let coachList= await helperFunction.convertPromiseToObject(
             await coachManagementModel.findAndCountAll(query)
        )
        
        for(let coach of coachList.rows){
            coach.coach_specialization_categories=await helperFunction.convertPromiseToObject(
                await coachSpecializationCategoriesModel.findAll({
                    where:{
                        id:{
                            [Op.in]:coach.coach_specialization_category_ids || [],
                        },
                        status:constants.STATUS.active,
                    }
                })
            )

            coach.employee_ranks=await helperFunction.convertPromiseToObject(
                await employeeRanksModel.findAll({
                    where:{
                        id:{
                            [Op.in]:coach.employee_rank_ids || [],
                        },
                        status:constants.STATUS.active,
                    }
                })
            )

            coach.total_completed_sessions=await employeeCoachSessionsModel.count({
                where:{
                    coach_id:coach.id,
                }
            })

            let totalRating=await employeeCoachSessionsModel.sum('coach_rating',{
                where:{
                    coach_id:coach.id,
                }
            })

            if(!params.date || !moment(params.date,"YYYY-MM-DD").isValid()){
                params.date=moment(new Date()).format("YYYY-MM-DD");
            }

            coach.available_slots=await helperFunction.convertPromiseToObject(
                await coachScheduleModel.findAll({
                    attributes:['id','date','start_time','end_time'],
                    where:{
                        date:params.date,
                        status:constants.COACH_SCHEDULE_STATUS.available,
                    },
                    order:[["date", "ASC"],["start_time", "ASC"],["end_time", "ASC"]]
                })
            )

            coach.average_rating=parseInt(totalRating)/coach.total_completed_sessions;
            coach.average_rating=coach.average_rating || 0;
            delete coach.coach_specialization_category_ids;
            delete coach.employee_rank_ids;
        }

        if(!params.sortBy || params.sortBy==3){
            coachList.rows.sort((a,b)=>b.average_rating-a.average_rating);
        }

        if(params.sortBy && params.sortBy==6){
            coachList.rows.forEach((row)=>{
                row.available_slots?.forEach((slot)=>{
                    Object.keys(slot).forEach((key)=>{
                        if(key=="start_time"){
                            slot[key]=slot[key].replace(/:/g,"")
                        }
                    })
                })
            })

            // console.log("coachList",coachList.rows.forEach((row,index)=>{
            //     console.log(`available_slot${index}`,row.available_slots)
            // }))

            coachList.rows.sort((a,b)=>a.available_slots[0]?.start_time-b.available_slots[0]?.start_time);

            coachList.rows.forEach((row)=>{
                row.available_slots?.forEach((slot)=>{
                    Object.keys(slot).forEach((key)=>{
                        if(key=="start_time"){
                            slot[key]=moment(slot[key],"HHmmss").format("HH:mm:ss")
                        }
                    })
                })
            })

            // console.log("coachList",coachList.rows.forEach((row,index)=>{
            //     console.log(`available_slot${index}`,row.available_slots)
            // }))
        }

        if(params.is_pagination && params.is_pagination==constants.IS_PAGINATION.yes){
            let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
            coachList.rows=coachList.rows.slice(offset,offset+limit);        
        }         

        return coachList;
    }

    /*
  * function to contact admin
  */
    public async contactUs(params:any,user: any) {

        let employee = await helperFunction.convertPromiseToObject(await employeeModel.findOne({
            where: {
                id: user.uid,
            }
        }));

        let contactObj = <any>{
            //employer_id: employee.current_employer_id,
            employee_id: user.uid,
            message: params.message,
            status:constants.STATUS.active,
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
                status:[0,1]
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
    public async getUnseenNotificationCount( user: any) {

        return {
            all : await notificationModel.count({
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

            achievement : await notificationModel.count({
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

            achievement_post_only : await notificationModel.count({
                where: {
                    reciever_id: user.uid,
                    reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                    type: [
                        constants.NOTIFICATION_TYPE.achievement_post,
                    ],
                    status: 1,
                }
            }),

            chat : await notificationModel.count({
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

            chat_message_only : (await helperFunction.convertPromiseToObject( await notificationModel.count({
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

            goal : await notificationModel.count({
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

            rating : await notificationModel.count({
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
                    type_id:parseInt(params.chat_room_id),
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
        },{
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
    public async feedback(params: any,user:any) {
        let feedbackObj = <any>{
            user_id: parseInt(user.uid),
            rating: parseInt(params.rating),
            message: params.message || null,
            feedback_type:constants.FEEDBACK_TYPE.employee,
        }

        return await helperFunction.convertPromiseToObject(await feedbackModel.create(feedbackObj));
    }

    /**
* 
* @param {} params pass all parameters from request
*/
    public async listVideo(params: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)

        let videos= await helperFunction.convertPromiseToObject( await libraryManagementModel.findAndCountAll({
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
            return { ...video, thumbnail_url: video.thumbnail_url || thumbnailList[index++]}
        })

        return videos

    }

    public async generateHTML(params:any){
       
        let{employee,folderPath,fileNames}=params;

        if(employee.employee_rank){
            employee.employee_rank=employee.employee_rank.name;
        }

        let htmlHeader=`<!DOCTYPE html>
            <html>
            <head>
                <meta charset='utf-8'>
                <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                <title>${employee.name}</title>
                <meta name='viewport' content='width=device-width, initial-scale=1'>
                
            </head>`;

        let htmlBody=`<body>
                <h1 style="text-align: center;">${employee.name} CV</h1>
                <table style="padding:0px 10px 10px 10px;">`

        for (let key in employee) {
        
            htmlBody+= `<tr style="text-align: left;">
                    <th style="opacity: 0.9;">${key.split("_").map((ele) => {
                        if (ele == "of" || ele == "in") return ele
                        else return ele.charAt(0).toUpperCase() + ele.slice(1)
                    }).join(" ")}</th>
                    <td style="opacity: 0.8;">:</td>
                    <td style="opacity: 0.8;">${key=='profile_pic_url'?`<img src='${employee[key]}' />`:employee[key]}</td>
                </tr>`
        }

        let htmlFooter=`</table></body>
            </html>`;
        

        fs.writeFileSync(folderPath+fileNames[0],htmlHeader+htmlBody+htmlFooter);
    }


    public async shareEmployeeCV(params:any,user:any){
        employeeModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });

        let employee = await helperFunction.convertPromiseToObject(
            await employeeModel.findOne({
                where:{
                    id:user.uid,
                },
                include:[
                    {
                        model: employeeRanksModel,
                        required: false,
                        attributes: ["id", "name"]
                    },
                ]
            })
        )

        let folderPath=`./src/upload`;
        let fileNames=[
            `/${employee.name.split(" ").join("_")}_${employee.id}.html`,
            `/${employee.name.split(" ").join("_")}_${employee.id}.pdf`,
        ];

        fileNames.forEach(async (fileName)=>{
            if (fs.existsSync(folderPath+fileName)) {
                await deleteFile(fileName);
            }
        })

       await this.generateHTML({employee,folderPath,fileNames})

        const puppeteer = require('puppeteer')
        const hb = require('handlebars')
       
        const invoicePath = path.resolve(folderPath+fileNames[0]);
        const res=fs.readFileSync(invoicePath, 'utf8');
        //console.log("res",res)

        let data = {};

        const template = hb.compile(res, { strict: true });
        
        const result = template(data);
        
        const html = result;
        
        let launchOptions={};

        if(require("os").platform()=='linux'){
            launchOptions={
                executablePath: '/usr/bin/chromium-browser',
                args: ["--no-sandbox"]
            }
        }

        const browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage()
        
        await page.setContent(html)
        
        await page.pdf({ path: folderPath+fileNames[1], format: 'A4' })
        await browser.close();

        let attachment = fs.readFileSync(folderPath+fileNames[1]).toString('base64');

        let mailOptions = {
            to:params.to_email,
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

        fileNames.forEach(async (fileName)=>{
            if (fs.existsSync(folderPath+fileName)) {
                await deleteFile(fileName);
            }
        })

        return true;
                
    }

    public async getEmployeeCV(params:any,user:any){
        employeeModel.hasOne(employeeRanksModel, { foreignKey: "id", sourceKey: "employee_rank_id", targetKey: "id" });
        
        let employee = await helperFunction.convertPromiseToObject(
            await employeeModel.findOne({
                where:{
                    id:user.uid,
                },
                include:[
                    {
                        model: employeeRanksModel,
                        required: false,
                        attributes: ["id", "name"]
                    },
                ]
            })
        )

        let folderPath=`./src/upload`;
        let fileNames=[
            `/${employee.name.split(" ").join("_")}_${employee.id}.html`,
            `/${employee.name.split(" ").join("_")}_${employee.id}.docx`,
        ];

        fileNames.forEach(async (fileName)=>{
            if (fs.existsSync(folderPath+fileName)) {
                await deleteFile(fileName);
            }
        })

       await this.generateHTML({employee,folderPath,fileNames})

       const util = require('util');
        const exec = util.promisify(require('child_process').exec);

        let panDocCMD=`pandoc -f html ${folderPath+fileNames[0]} -o ${folderPath+fileNames[1]}`;
        console.log("pandoc ",await exec(panDocCMD));

        let fileParams = {
            path: path.join(__dirname, `../../../${folderPath}${fileNames[1]}`),
            originalname: fileNames[1],
            mimetype: `application/pdfapplication/vnd.openxmlformats-officedocument.wordprocessingml.document`
        }

        let docURL=await helperFunction.uploadFile(fileParams, "thumbnails");

        console.log("fileParams", fileParams)

        fileNames.forEach(async (fileName)=>{
            if (fs.existsSync(folderPath+fileName)) {
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
                status:1,
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

        for(let goalSubmitReminder of goalSubmitReminders.rows){
            delete goalSubmitReminder.data.senderEmplyeeData;
        }

        
        return goalSubmitReminders;
    }

}

