import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import * as tokenResponse from "../../utils/tokenResponse";
import { employeeModel } from  "../../models/employee"
import { adminModel } from "../../models/admin";
import { employersModel } from  "../../models/employers"
import { departmentModel } from  "../../models/department"
import { managerTeamMemberModel } from  "../../models/managerTeamMember"
import { industryTypeModel } from  "../../models/industryType"
import { promises } from "fs";
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
                email: params.username.toLowerCase(),
                status: {[Op.in]: [0,1]}
            },
            include: [
                {
                    model: departmentModel, 
                    required: false,
                },
                {
                    model: employersModel, 
                    required: false,
                    attributes: ['id', 'name', 'email']
                }
            ],
            
        });

        employeeModel.hasOne(employersModel,{ foreignKey: "id", sourceKey: "prev_employer_id", targetKey: "id" });
        employeeModel.hasOne(departmentModel,{ foreignKey: "id", sourceKey: "prev_department_id", targetKey: "id" });
        let existingPrevUser = await employeeModel.findOne({
            where: {
                email: params.username.toLowerCase(),
                status: {[Op.in]: [0,1]}
            },
            include: [
                {
                    model: departmentModel, 
                    required: false,
                },
                {
                    model: employersModel, 
                    required: false,
                    attributes: ['id', 'name', 'email']
                }
            ],
            attributes: ['id']
            
        });
        if (!_.isEmpty(existingUser)) {
            existingUser = await helperFunction.convertPromiseToObject(existingUser);
            let comparePassword = await appUtils.comparePassword(params.password, existingUser.password);
            if (comparePassword) {
                delete existingUser.password;
                delete existingUser.reset_pass_otp;
                let token = await tokenResponse.employeeTokenResponse(existingUser);
                existingUser.token = token.token;

                existingPrevUser = await helperFunction.convertPromiseToObject(existingPrevUser);
                existingUser.prev_department = (existingPrevUser.department ? existingPrevUser.department : {})
                existingUser.prev_employer = (existingPrevUser.employer ? existingPrevUser.employer : {})
                existingUser.current_department = (existingUser.department ? existingUser.department : {})
                existingUser.current_employer = (existingUser.employer ? existingUser.employer : {})

                if (existingUser.employer)
                    delete existingUser.employer;

                if (existingUser.department)
                    delete existingUser.department;

               return existingUser;
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
            return await employeeModel.update(update, qry);
        } else if (user.user_role == constants.USER_ROLE.employer) {
            return await employersModel.update(update, qry);
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
        let existingUser = await employeeModel.findOne({
            where: {
                id: params.uid
            },
            include: [
                {
                    model: departmentModel, 
                    required: false,
                },
                {
                    model: employersModel, 
                    required: false,
                    attributes: ['id', 'name', 'email']
                }
            ],
            
        });

        employeeModel.hasOne(employersModel,{ foreignKey: "id", sourceKey: "prev_employer_id", targetKey: "id" });
        employeeModel.hasOne(departmentModel,{ foreignKey: "id", sourceKey: "prev_department_id", targetKey: "id" });
        let existingPrevUser = await employeeModel.findOne({
            where: {
                id: params.uid
            },
            include: [
                {
                    model: departmentModel, 
                    required: false,
                },
                {
                    model: employersModel, 
                    required: false,
                    attributes: ['id', 'name', 'email']
                }
            ],
            attributes: ['id']
            
        });

        existingUser = await helperFunction.convertPromiseToObject(existingUser);
        existingPrevUser = await helperFunction.convertPromiseToObject(existingPrevUser);

        existingUser.prev_department = (existingPrevUser.department ? existingPrevUser.department : {})
        existingUser.prev_employer = (existingPrevUser.employer ? existingPrevUser.employer : {})
        existingUser.current_department = (existingUser.department ? existingUser.department : {})
        existingUser.current_employer = (existingUser.employer ? existingUser.employer : {})

        delete existingUser.password;
        delete existingUser.reset_pass_otp;
        if (existingUser.employer)
            delete existingUser.employer;

        if (existingUser.department)
            delete existingUser.department;

        return existingUser;

        // employeeModel.hasOne(departmentModel,{as: "current_department", foreignKey: "id", sourceKey: "current_department_id", targetKey: "id" });
        // employeeModel.hasOne(departmentModel,{as: "prev_department", foreignKey: "id", sourceKey: "prev_department_id", targetKey: "id" });
        // employeeModel.hasOne(employersModel,{ as: "current_employer", foreignKey: "id", sourceKey: "current_employer_id", targetKey: "id" });
        // employeeModel.hasOne(employersModel,{ as: "prev_employer", foreignKey: "id", sourceKey: "prev_employer_id", targetKey: "id" });
        // return await employeeModel.findOne({
        //     where: {
        //         id: params.uid
        //     },
        //     include: [
        //         {
        //             as: "current_department",
        //             model: departmentModel, 
        //             required: false,
        //         },
        //         {
        //             as: "prev_department",
        //             model: departmentModel, 
        //             required: false,
        //         },
        //         {
        //             as: "current_employer",
        //             model: employersModel, 
        //             required: false,
        //             attributes: ['id', 'name', 'email']
        //         },
        //         {
        //             as: "prev_employer",
        //             model: employersModel, 
        //             required: false,
        //             attributes: ['id', 'name', 'email']
        //         }
        //     ],
            
        // });
    }

     /*
    * function to update profile 
    */
    public async updateProfile(params: any, user: any) {
        return await employeeModel.update(params, {
            where: { id: user.uid}
        })
    }

}