import _ from "lodash";
import * as constants from "../../constants";
import * as helperFunction from "../../utils/helperFunction";
import { qualitativeMeasurementModel } from "../../models/qualitativeMeasurement"
import { qualitativeMeasurementCommentModel } from  "../../models/qualitativeMeasurementComment"
import { managerTeamMemberModel } from  "../../models/managerTeamMember"
import { employeeModel } from "../../models/employee";
import { notificationModel } from "../../models/notification";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class QualitativeMeasuremetServices {
    constructor() { }

    /*
    * function to add qualitative measurement
    */
    public async addQualitativeMeasurement(params: any, user: any) {
        let date = new Date();
        date.setMonth(date.getMonth()-3);
        //let dateCheck = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate(); 
        let dateCheck = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        let checkManagerEmployee = await managerTeamMemberModel.findOne({
            where: {
                manager_id: user.uid,
                team_member_id: params.employee_id
            }
        })
        if (_.isEmpty(checkManagerEmployee)){
            throw new Error(constants.MESSAGES.invalid_employee_id);
        }

        let qualitativeMeasurementData = await qualitativeMeasurementModel.findOne({
            where: {
                manager_id: user.uid,
                employee_id: params.employee_id,
                updatedAt:{[Op.gte]: dateCheck }
            }
        })
        params.manager_id = user.uid;

        let employeeData = await employeeModel.findOne({
            where: { id: params.employee_id}
        })

        let managerData = await employeeModel.findOne({
            where: { id: params.employee_id }
        })

        delete managerData.password

        if (_.isEmpty(qualitativeMeasurementData)) {
            let resData =  await  qualitativeMeasurementModel.create(params);

             // add notification for employee
             let notificationObj = <any> {
                type_id: resData.id,
                sender_id: user.uid,
                reciever_id: params.employee_id,
                reciever_type: constants.NOTIFICATION_RECIEVER_TYPE.employee,
                type: constants.NOTIFICATION_TYPE.rating,
                data: {
                    type: constants.NOTIFICATION_TYPE.rating,
                    title: 'New rating',
                    //message: `your manager has given rating to you`,
                    message: `Your rating has been updated`,
                    id: resData.id,
                    senderEmplyeeData: managerData,
                    //title: (params[i].title?params[i].title: ''),                            
                },
            }
            await notificationModel.create(notificationObj);
            // send push notification
            let notificationData = <any> {
                title: 'New rating',
                body: `Your rating has been updated`,
                data: {
                    type: constants.NOTIFICATION_TYPE.rating,
                    title: 'New rating',
                    message: `Your rating has been updated`,
                    id: resData.id,
                    senderEmplyeeData: managerData,
                    //title: (params[i].title?params[i].title: ''),                            
                },
            }
            await helperFunction.sendFcmNotification( [employeeData.device_token], notificationData);

            return resData;
        } else {
            throw new Error(constants.MESSAGES.add_qualitative_measure_check);
        }
        
    }
   
    /*
    * get to add qualitative measurement
    */
   public async getQualitativeMeasurement(params: any,user:any) {
    qualitativeMeasurementModel.hasOne(employeeModel,{foreignKey: "id", sourceKey: "employee_id", targetKey: "id"});
       let qualitativeMeasurement =await helperFunction.convertPromiseToObject( await qualitativeMeasurementModel.findAll({
           where: { employee_id: params.employee_id ? params.employee_id : user.uid },
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

       if (qualitativeMeasurement.length === 0) throw new Error(constants.MESSAGES.no_qualitative_measure);
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
                    label:key,
                    rating: qualitativeMeasurement[0][key],
                    desc: qualitativeMeasurement[0][`${key}_desc`]    
               })
               
           }
           
       }
       
       result['employee'] = qualitativeMeasurement[0].employee;

       return result;
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



    /*
    * get qualitative measurement comment list
    */
    public async getQuantitativeMeasurementCommentList() {
        return await qualitativeMeasurementCommentModel.findAll({
            where: { status: constants.STATUS.active }
        });
    }

}