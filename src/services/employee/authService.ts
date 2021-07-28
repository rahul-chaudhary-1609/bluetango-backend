import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import * as tokenResponse from "../../utils/tokenResponse";
import { employeeModel } from  "../../models/employee"
import { adminModel } from "../../models/admin";
import { employersModel } from  "../../models/employers"
import { departmentModel } from  "../../models/department"
import { managerTeamMemberModel } from "../../models/managerTeamMember";
import { coachManagementModel } from "../../models/coachManagement";
import { emojiModel } from "../../models/emoji";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class AuthService {
    constructor() { }

    /**
    * login function
    @param {} params pass all parameters from request
    */
    public async login(params: any) {

        employeeModel.hasOne(departmentModel,{ foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
        employeeModel.hasOne(employersModel,{ foreignKey: "id", sourceKey: "current_employer_id", targetKey: "id" });
        let existingUser = await employeeModel.findOne({
            where: {
                email: params.username.toLowerCase()
            },
            include: [
                {
                    model: departmentModel,
                    required: false,
                },
                {
                    model: employersModel,
                    required: false,
                    attributes: ['id', 'name', 'email', 'status']
                },
            ],
            order: [["createdAt","DESC"]]
        });
        if (!_.isEmpty(existingUser) && existingUser.status == 0) {
            throw new Error(constants.MESSAGES.deactivate_account);
        } else if (!_.isEmpty(existingUser) && existingUser.status == 2){
            throw new Error(constants.MESSAGES.delete_account);
        }
        if (!_.isEmpty(existingUser) && existingUser.employer.status == 0) {
            throw new Error(constants.MESSAGES.deactivate_employer_account);
        } else if (!_.isEmpty(existingUser) && existingUser.employer.status == 2) {
            throw new Error(constants.MESSAGES.delete_employer_account);
        } else if (!_.isEmpty(existingUser) && existingUser.employer.subscription_type == constants.EMPLOYER_SUBSCRIPTION_TYPE.no_plan && existingUser.employer.free_trial_status == constants.EMPLOYER_FREE_TRIAL_STATUS.over) {
            throw new Error(constants.MESSAGES.employee_employer_have_no_plan);
        }else if (!_.isEmpty(existingUser)) {
            existingUser = await helperFunction.convertPromiseToObject(existingUser);
            let comparePassword = await appUtils.comparePassword(params.password, existingUser.password);
            if (comparePassword) {
                delete existingUser.password;
                let token = await tokenResponse.employeeTokenResponse(existingUser);
                let reqdata = <any>{
                    uid: existingUser.id
                }
                let profileData = await this.getMyProfile(reqdata);
                profileData.token = token.token;
                if (params.device_token) {
                    await employeeModel.update({
                            device_token: params.device_token
                        },
                        { where: {id: existingUser.id}}
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
        const qry = <any>{ where: {
            email : params.email.toLowerCase(),
            status: {[Op.ne]: 2}
        } };

        if (params.user_role == constants.USER_ROLE.sub_admin || params.user_role == constants.USER_ROLE.super_admin) {
            existingUser = await adminModel.findOne(qry);
        } else if (params.user_role == constants.USER_ROLE.employee) {
            existingUser = await employeeModel.findOne(qry);
        } else if (params.user_role == constants.USER_ROLE.employer) {
            existingUser = await employersModel.findOne(qry);
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
        const update = <any> {
            password: await appUtils.bcryptPassword(params.password)
        };

        const qry = <any>{ 
            where: {
            id : user.uid
            } 
        };
        if (user.user_role == constants.USER_ROLE.sub_admin || user.user_role == constants.USER_ROLE.super_admin) {
            return await adminModel.update(update, qry);
        } else if (user.user_role == constants.USER_ROLE.employee) {
            update.first_time_login = 0;
            update.first_time_reset_password = 0;
            return await employeeModel.update(update, qry);
        } else if (user.user_role == constants.USER_ROLE.employer) {
            return await employersModel.update(update, qry);
        } else if (user.user_role == constants.USER_ROLE.coach) {
            return await coachManagementModel.update(update, qry);
        } else {
            throw new Error(constants.MESSAGES.user_not_found);
        }
       
    }

    /*
    * function to set new pass 
    */

    public async getMyProfile(params: any) {

        employeeModel.hasOne(departmentModel,{ foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
        employeeModel.hasOne(employersModel,{ foreignKey: "id", sourceKey: "current_employer_id", targetKey: "id" });
        employeeModel.hasOne(managerTeamMemberModel,{ foreignKey: "team_member_id", sourceKey: "id", targetKey: "team_member_id" });
        managerTeamMemberModel.hasOne(employeeModel,{ foreignKey: "id", sourceKey: "manager_id", targetKey: "id" });
        employersModel.hasOne(adminModel, { foreignKey: "id", sourceKey: "admin_id", targetKey: "id" } )
        
        let existingUser = await employeeModel.findOne({
            where: {
                id: params.uid
            },
            include: [
                {
                    model: departmentModel, 
                    required: false,
                    attributes: ['id', 'name']
                },
                {
                    model: emojiModel, 
                    required: false,
                    as: 'energy_emoji_data',
                    attributes: ['id', 'image_url', 'caption']
                },
                {
                    model: emojiModel, 
                    required: false,
                    as: 'job_emoji_data',
                    attributes: ['id', 'image_url', 'caption']
                },
                {
                    model: employersModel, 
                    required: false,
                    attributes: ['id', 'name', 'email'],
                    include: [{
                        model: adminModel,
                        required: false,
                        attributes: ['id', 'thought_of_the_day']
                    }]
                },
                {
                    model: managerTeamMemberModel,
                    required: false,
                    attributes: ['id', 'manager_id'] ,
                    include: [{
                        model: employeeModel,
                        required: false,
                        attributes: ['id', 'name', 'email', 'profile_pic_url']
                    }]
                }
            ],
            
        });

        existingUser = await helperFunction.convertPromiseToObject(existingUser);
        delete existingUser.password;

        return existingUser;

   
    }

     /*
    * function to update profile 
    */
    public async updateProfile(params: any, user: any) {
        //params.first_time_login = 0;
        return await employeeModel.update(params, {
            where: { id: user.uid}
        })
    }

     /*
    * function to upload file 
    */
    public async uploadFile(params: any, folderName) {
        return await helperFunction.uploadFile(params, folderName);
    }

    /*
    * function to change password 
    */
    public async changePassword(params: any, user: any) {
        let getEmployeeData = await helperFunction.convertPromiseToObject( 
            await employeeModel.findOne({
                where: { id: user.uid}
            })
        );
        console.log(params, getEmployeeData);
        let comparePassword = await appUtils.comparePassword(params.old_password, getEmployeeData.password);
        if (comparePassword) {
            let update = {
                'password': await appUtils.bcryptPassword(params.new_password)
            };
            
            return await employeeModel.update(update, {
                where: { id: user.uid }
            });
        } else {
            throw new Error(constants.MESSAGES.invalid_old_password);
        }

    }

}
