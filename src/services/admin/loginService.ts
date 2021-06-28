import { adminModel } from "../../models/admin";
import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as tokenResponse from "../../utils/tokenResponse";
import * as helperFunction from "../../utils/helperFunction";
import * as selectQueryService from '../../queryService/selectQueryService';
import * as updateQueryService from '../../queryService/updateQueryService';
import bcrypt from 'bcrypt';
import { AnyAaaaRecord } from "dns";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class LoginService {
    constructor() { }

    /**
    * login function
    @param {} params pass all parameters from request
    */
    public async login(params: any) {
        console.log("login",params)
        params.email=params.username
        var isEmail = await appUtils.CheckEmail(params);
        const qry = <any>{ where: {} };
        if (isEmail) {
            qry.where = { 
                email: params.username.toLowerCase(),
                status: {[Op.in]: [0,1]}
            };
        }
        qry.raw = true;
        qry.attributes = ['id', 'name', 'email', 'password', 'admin_role'];
        let existingUser = await adminModel.findOne(qry);
        if (!_.isEmpty(existingUser)) {
            let comparePassword = await appUtils.comparePassword(params.password, existingUser.password);
            if (comparePassword) {
                delete existingUser.password;
                let token = await tokenResponse.adminTokenResponse(existingUser);
                existingUser.token = token.token;
                let update = {
                    'token': token.token,
                    'model': adminModel
                };
                let condition = {
                    id: existingUser.id
                }
                await updateQueryService.updateData(update, condition);
                return existingUser;
            } else {
                throw new Error(constants.MESSAGES.invalid_password);
            }
        } else {
            throw new Error(constants.MESSAGES.invalid_credentials);
        }
    }

    /**
    * add sub admin function
    @param {} params pass all parameters from request
    */
    public async addNewAdmin(params: any) {
        //if(params.passkey === process.env.ADMIN_PASSKEY) {
            console.log('params - - -',params)
            const qry = <any>{ where: {} };
            qry.where = { 
                email: params.email,
                status: {[Op.in]: [0,1]}
            };
            qry.raw = true;
            let existingUser = await adminModel.findOne(qry);
            console.log('existingUser - - - ',existingUser)
            if (_.isEmpty(existingUser)) {
                let comparePassword = params.password === params.confirmPassword;
                if (comparePassword) {
                    delete params.confirmPassword;
                    params.email = params.email.toLowerCase();
                    params.password = await appUtils.bcryptPassword(params.password);
                    params.id = await this.getSerailId();
                    //params.admin_role = (params.id == 1)?1:2;
                    params.admin_role = constants.USER_ROLE.sub_admin
                    let newAdmin = await adminModel.create(params);
                    let adminData = newAdmin.get({plain:true});
                    console.log('adminData - - -', adminData)
                    delete adminData.password;
                    let token = await tokenResponse.adminTokenResponse(newAdmin);
                    adminData.token = token.token;
                    let update = {
                        'token': token.token,
                        'model': adminModel
                    };
                    let condition = {
                        id: adminData.id
                    }
                    await updateQueryService.updateData(update, condition);
                    delete adminData.reset_pass_otp;
                    delete adminData.reset_pass_expiry;
                    return adminData;
                } else {
                    throw new Error(constants.MESSAGES.password_miss_match);
                }
            } else {
                throw new Error(constants.MESSAGES.acc_already_exists);
            }
        // } else {
        //     throw new Error(constants.MESSAGES.invalid_passkey);
        // }
    }

    /**
     * edit sub admin function
     * @param {*} params pass all parameters from request 
     */
    public async editSubAdmin(params: any) {
        let where = {
            id: params.subAdminId
        }
        let update = {
            name: params.name,
            permissions: params.permissions,
            country_code: params.country_code,
            phone_number: params.phone_number,
            status: params.status
        }
        const subAdmin = await adminModel.update(update, {where: where, raw: true, returning: true})
        if(subAdmin && subAdmin[1][0]) {
            return subAdmin[1][0]
        }else {
            throw new Error(constants.MESSAGES.invalid_subAdmin)
        }
    }

    public async getSerailId() {
        let lastRecord = await adminModel.findAll({
            limit: 1,
            order: [ [ 'createdAt', 'DESC' ]]
          });
        if(lastRecord && lastRecord.length > 0) {
            return lastRecord[0].id + 1;
        } else {
            return 1;
        }
    }

    /**
     * reset password function to add the data
     * @param {*} params pass all parameters from request 
     */
    public async forgetPassword(params: any) {
        let userData, reset_pass_otp = <any>{}, reset_pass_expiry;
        const qry = <any>{ where: {} };
        if (!_.isEmpty(params)) {
            qry.where.email = params.email;
            qry.where.status = {[Op.ne]: 2};
            qry.raw = true;
            let existingUser = await adminModel.findOne(qry);
            if (!_.isEmpty(existingUser)) {
                // params.country_code = existingUser.country_code;
                let otp = await appUtils.gererateOtp();
                const mailParams = <any>{};
                mailParams.to = params.email;
                mailParams.toName = existingUser.name;
                mailParams.templateName = "reset_password_request";
                mailParams.subject = "Reset Password Request";
                mailParams.templateData = {
                    subject: "Reset Password Request",
                    name: existingUser.name,
                    resetLink: `${process.env.WEB_HOST_URL+'admin-panel/auth/reset-password'}?email=${params.email}&otp=${otp}`
                };
                if (!_.isEmpty(otp)) {
                    reset_pass_otp = otp;
                    reset_pass_expiry = Math.floor(Date.now());
                    userData = await adminModel.update({reset_pass_otp, reset_pass_expiry}, { where: { id: existingUser.id } });
                    // await helperFunction.sendEmail(mailParams);
                    return {otp};
                }
            } else {
                throw new Error(constants.MESSAGES.user_not_found);
            }
        }

    }

    /**
    * resend otp function to resend otp to the user
    * @param {*} params pass all parameters from request 
    */
    // public async resendOtp(params: any) {
    //     let userUpdate = <any>{};
    //     const query = <any>{ where: {} };
    //     if (!_.isEmpty(params)) {
    //         query.where.userID = params.uid;
    //     }
    //     let user = await adminModel.findOne(query);
    //     let userdata = JSON.parse(JSON.stringify(user))
    //     if (_.isEmpty(userdata)) {
    //         throw new Error(constants.MESSAGES.user_not_found);
    //     } else {
    //         let otp = await this.sendOtpViaMail(params);
    //         if (!_.isEmpty(otp)) {
    //             let update = <any>{};
    //             update.reset_pass_token['otp'] = otp;
    //             update.reset_pass_token['otp_expire'] = appUtils.currentUnixTimeStamp();
    //             userUpdate = adminModel.update(update, query);
    //             var token = await tokenResponse.tokenResponse(params.uid);
    //             return token;
    //         }
    //     }
    // }

    /*
    * function to set new pass by verifying otp 
    */

    public async resetPassword(params: any) {
        try {
            const query = <any>{ where: {} };
            if (!_.isEmpty(params)) {
                query.where.email = params.email;
                query.where.status = {[Op.ne]: 2};
            }
            let user = await selectQueryService.selectData(adminModel, query);
            let userdata = JSON.parse(JSON.stringify(user))
            if (_.isEmpty(userdata)) {
                throw new Error(constants.MESSAGES.user_not_found);
            } else {
                if (userdata && userdata.reset_pass_otp) {
                    let time = appUtils.calcluateOtpTime(userdata.reset_pass_expiry);
                    if (userdata.reset_pass_otp != params.otp) {
                        throw new Error(constants.MESSAGES.invalid_otp);
                    } else if (appUtils.currentUnixTimeStamp() - time > constants.otp_expiry_time) {
                        throw new Error(constants.MESSAGES.expire_otp);
                    } else if (params.password !== params.confirmPassword) {
                        throw new Error(constants.MESSAGES.password_miss_match);
                    } else {
                        params.password = await appUtils.bcryptPassword(params.password);
                        let update = {
                            'password': params.password,
                            'reset_pass_otp': null,
                            'reset_pass_expiry': null,
                            'model': adminModel
                        };
                        let condition = {
                            id: userdata.id
                        }
                        await updateQueryService.updateData(update, condition);
                        // return userdata;
                    }
                } else {
                    throw new Error(constants.MESSAGES.invalid_otp);
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    public async changePassword(params: any, users: any) {
            const query = <any>{ where: {} };
            if (!_.isEmpty(params)) {
                query.where.id = users.uid;
                query.where.status = {[Op.ne]: 2};
            }
            let user = await selectQueryService.selectData(adminModel, query);
            let userdata = JSON.parse(JSON.stringify(user))
            if (_.isEmpty(userdata)) {
                throw new Error(constants.MESSAGES.user_not_found);
            } else {
                const match = await bcrypt.compare(params.oldPassword, userdata.password);
                if (params.password !== params.confirmPassword) {
                    throw new Error(constants.MESSAGES.password_miss_match);
                }
                else if (!match) {
                    throw new Error(constants.MESSAGES.invalid_password);
                } else {
                    params.password = await appUtils.bcryptPassword(params.password);
                    let update = {
                        'password': params.password,
                        'model': adminModel
                    };
                    let condition = {
                        id: userdata.id
                    }
                    await updateQueryService.updateData(update, condition);
                }
            }
        
    }

    public async logout(params: any, user: any) {
        try {
            let update = {
                'token': null,
                'model': adminModel
            };
            let condition = {
                id: user.uid
            }
            return await updateQueryService.updateData(update, condition);
        } catch (error) {
            throw new Error(error);
        }
    }
}