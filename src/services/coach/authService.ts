import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import * as tokenResponse from "../../utils/tokenResponse";
import { coachManagementModel } from "../../models/coachManagement";
import { employeeRanksModel } from "../../models/employeeRanks";
import { coachSpecializationCategoriesModel } from "../../models/coachSpecializationCategories";
import { employeeCoachSessionsModel } from "../../models/employeeCoachSession";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class AuthService {
    constructor() { }

    /**
    * login function
    @param {} params pass all parameters from request
    */
    public async login(params: any) {

        let existingUser = await coachManagementModel.findOne({
            where: {
                email: params.username.toLowerCase()
            },
            order: [["createdAt", "DESC"]]
        });
        if (!_.isEmpty(existingUser) && existingUser.status == 0) {
            throw new Error(constants.MESSAGES.deactivate_account);
        } else if (!_.isEmpty(existingUser) && existingUser.status == 2) {
            throw new Error(constants.MESSAGES.delete_account);
        }
        else if (!_.isEmpty(existingUser)) {
            existingUser = await helperFunction.convertPromiseToObject(existingUser);
            let comparePassword = await appUtils.comparePassword(params.password, existingUser.password);
            if (comparePassword) {
                delete existingUser.password;
                let token = await tokenResponse.coachTokenResponse(existingUser);
                let reqData = <any>{
                    uid:existingUser.id,
                }   

                let profileData= await this.getProfile(reqData);

                profileData.token = token.token;

                if (params.device_token) {
                    await coachManagementModel.update({
                        device_token: params.device_token
                    },
                        { where: { id: existingUser.id } }
                    );
                }           
                
                return profileData;
            } else {
                throw new Error(constants.MESSAGES.invalid_password);
            }
        } else {
            throw new Error(constants.MESSAGES.invalid_email);
        }
    }

    /**
    * reset password function to add the data
    * @param {*} params pass all parameters from request 
    */
    public async forgotPassword(params: any) {
        var existingUser;
        const qry = <any>{
            where: {
                email: params.email.toLowerCase(),
                status: { [Op.ne]: 2 }
            }
        };

        if (params.user_role == constants.USER_ROLE.coach) {
            existingUser = await coachManagementModel.findOne(qry);
        } else {
            throw new Error(constants.MESSAGES.user_not_found);
        }

        if (!_.isEmpty(existingUser)) {
            // params.country_code = existingUser.country_code;
            let token = await tokenResponse.forgotPasswordTokenResponse(existingUser, params.user_role);
            const mailParams = <any>{};
            mailParams.to = params.email;
            mailParams.html = `Hi ${existingUser.name}
                <br> Click on the link below to reset your password
                <br> ${process.env.WEB_HOST_URL}?token=${token.token}
                <br> Please Note: For security purposes, this link expires in ${process.env.FORGOT_PASSWORD_LINK_EXPIRE_IN_MINUTES} Hours.
                `;
            mailParams.subject = "Reset Password Request";
            await helperFunction.sendEmail(mailParams);
            return true;
        } else {
            throw new Error(constants.MESSAGES.user_not_found);
        }

    }

    /*
    * function to set new pass 
    */
    public async resetPassword(params: any, user: any) {
        const update = <any>{
            password: await appUtils.bcryptPassword(params.password)
        };

        const qry = <any>{
            where: {
                id: user.uid
            }
        };
        if (user.user_role == constants.USER_ROLE.coach) {
            update.first_time_reset_password = 0;
            update.first_time_login = 0;
            return await coachManagementModel.update(update, qry);
        } else {
            throw new Error(constants.MESSAGES.user_not_found);
        }
       
    }

    /*
    * function to get profile 
    */
    public async getProfile(user: any) {
        let coach= await helperFunction.convertPromiseToObject(
            await coachManagementModel.findOne({
                where: {
                    id: parseInt(user.uid),
                    status:{[Op.ne]:2}
                }
            })
        )

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
                status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
            }
        })

        let totalRating=await employeeCoachSessionsModel.sum('coach_rating',{
            where:{
                coach_id:coach.id,
                status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                coach_rating:{
                    [Op.gte]:1
                }
            }
        })

        coach.rating_count=await employeeCoachSessionsModel.count({
            where:{
                coach_id:coach.id,
                status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                coach_rating:{
                    [Op.gte]:1
                }
            }
        })

        coach.average_rating=0;
        if(coach.rating_count>0){
            coach.average_rating=parseFloat((parseInt(totalRating)/coach.rating_count).toFixed(2));
        }            

        delete coach.coach_specialization_category_ids;
        delete coach.employee_rank_ids;
        delete coach.password;

        return coach

    }


    /*
    * function to get profile 
    */
    public async editProfile(params: any,user: any) {
        let profile = await coachManagementModel.findOne({
                where: {
                    id: parseInt(user.uid),
                    status: { [Op.ne]: 2 }
                }
        })
        
        let currentProfile = await helperFunction.convertPromiseToObject(profile);        

        profile.name = params.name || currentProfile.name;
        profile.email = params.email || currentProfile.email;
        profile.password = params.password ? await appUtils.bcryptPassword(params.password): currentProfile.password;
        profile.country_code = params.country_code || currentProfile.country_code;
        profile.phone_number = params.phone_number || currentProfile.phone_number;
        profile.description = params.description || currentProfile.description;
        profile.image = params.image || currentProfile.image;
        profile.fileName = params.fileName || currentProfile.fileName;

        profile.save();

        return profile;

    }


    /*
* function to update device token
*/
    public async updateEmployerDeviceToken(params: any, user: any) {
        return await coachManagementModel.update(
            {
                device_token: params.device_token
            },
            {
                where: { id: user.uid },
                returning: true
            }
        )
    }


    /*
 * function to clear device token
 */
    public async clearEmployerDeviceToken(user: any) {
        return await coachManagementModel.update(
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
  * function to upload file 
  */
    public async uploadFile(params: any, folderName) {
        return await helperFunction.uploadFile(params, folderName);
    }


}


