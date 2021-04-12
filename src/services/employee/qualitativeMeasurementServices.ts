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

        if (_.isEmpty(qualitativeMeasurementData)) {
            let resData =  await  qualitativeMeasurementModel.create(params);

             // add notification for employee
             let notificationObj = <any> {
                type_id: resData.id,
                sender_id: user.uid,
                reciever_id: params.employee_id,
                type: constants.NOTIFICATION_TYPE.rating
            }
            await notificationModel.create(notificationObj);
            // send push notification
            let notificationData = <any> {
                title: 'Rating',
                body: `Your manager given rating you`,
                data: {
                    id: resData.id,
                    type: constants.NOTIFICATION_TYPE.rating
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
       let qualitativeMeasurement =await qualitativeMeasurementModel.findAll({
           where: { employee_id: params.employee_id ? params.employee_id :user.uid},
           include: [
                {
                    model: employeeModel,
                    required: true,
                    attributes: ['id', 'name', 'email', 'phone_number', 'profile_pic_url']
                }
           ]
       })

       if (qualitativeMeasurement.length===0) throw new Error(constants.MESSAGES.no_qualitative_measure);

       return qualitativeMeasurement;
   }

    
    /*
    * get to add qualitative measurement details
    */
    public async getQualitativeMeasurementDetails(params: any, user: any) {
        
        return await qualitativeMeasurementCommentModel.findAll({
            where: { name: params.name },
        })
    }



    /*
    * get qualitative measurement comment list
    */
    public async getQuantitativeMeasurementCommentList() {
        return await qualitativeMeasurementCommentModel.findAll();
    }

}