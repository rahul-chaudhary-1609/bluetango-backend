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
                type: constants.NOTIFICATION_TYPE.rating,
                data: {
                    type: constants.NOTIFICATION_TYPE.rating,
                    title: 'Rating',
                    message: `your manager has given rating to you`,
                    id: resData.id,
                    senderEmplyeeData: managerData,
                    //title: (params[i].title?params[i].title: ''),                            
                },
            }
            await notificationModel.create(notificationObj);
            // send push notification
            let notificationData = <any> {
                title: 'Rating',
                body: `your manager has given rating to you`,
                data: {
                    type: constants.NOTIFICATION_TYPE.rating,
                    title: 'Rating',
                    message: `your manager has given rating to you`,
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
           where: { employee_id: params.employee_id ? params.employee_id :user.uid},
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
       
       let result = {}
       result['id'] = qualitativeMeasurement[0].id;
       result['manager_id'] = qualitativeMeasurement[0].id;
       result['employee_id'] = qualitativeMeasurement[0].employee_id;

       for (let key in qualitativeMeasurement[0]) {
           if ([
               "initiative",
               "ability_to_delegate",
               "clear_Communication",
               "self_awareness_of_strengths_and_weaknesses",
               "agile_thinking",
               "influence",
               "empathy",
               "leadership_courage",
               "customer_client_patient_satisfaction",
               "team_contributions",
               "time_management",
               "work_product"
           ].includes(key)) {
               result[key] = {
                   rating: qualitativeMeasurement[0][key],
                   desc: qualitativeMeasurement[0][`${key}_desc`]
               }
           }
           
       }
       
       result['employee'] = qualitativeMeasurement[0].employee;

       return result;
   }

    
    /*
    * get to add qualitative measurement details
    */
    public async getQualitativeMeasurementDetails(params: any, user: any) {
        
        let where = {}
        if (params.name) {
            where = {
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
        return await qualitativeMeasurementCommentModel.findAll();
    }

}