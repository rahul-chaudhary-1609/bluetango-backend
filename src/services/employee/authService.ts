import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as tokenResponse from "../../utils/tokenResponse";
import { employeeModel } from  "../../models/employee"
import { adminModel } from "../../models/admin";
import { employersModel } from  "../../models/employers"
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class AuthService {
    constructor() { }

    /**
    * login function
    @param {} params pass all parameters from request
    */
    public async login(params: any) {
        var isEmail = await appUtils.CheckEmail(params);
        const qry = <any>{ where: {} };
        if (isEmail) {
            qry.where = { 
                email: params.username,
                status: {[Op.in]: [0,1]}
            };
        }
        let existingUser = await employeeModel.findOne(qry);
        if (!_.isEmpty(existingUser)) {
            let comparePassword = await appUtils.comparePassword(params.password, existingUser.password);
            if (comparePassword) {
                delete existingUser.password;
                delete existingUser.reset_pass_otp;
                let token = await tokenResponse.employeeTokenResponse(existingUser);
                existingUser.token = token.token;
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
            email : params.email,
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
            mailParams.toName = existingUser.name;
            mailParams.templateName = "reset_password_request";
            mailParams.subject = "Reset Password Request";
            mailParams.templateData = {
                subject: "Reset Password Request",
                name: existingUser.name,
                resetLink: `${process.env.WEB_HOST_URL+'admin-panel/auth/reset-password'}?token=${token.token}`
            };
            return {mailParams};
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

}