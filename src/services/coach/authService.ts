import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import * as tokenResponse from "../../utils/tokenResponse";
import { coachManagementModel } from "../../models/coachManagement";
import { employeeRanksModel } from "../../models/employeeRanks";
import { coachSpecializationCategoriesModel } from "../../models/coachSpecializationCategories";
import { employeeCoachSessionsModel } from "../../models/employeeCoachSession";
import { staticContentModel, coachBiosModel } from "../../models/index"
import * as queryService from '../../queryService/bluetangoAdmin/queryService';
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class AuthService {
    constructor() { }

    /**
    * login function
    @param {} params pass all parameters from request
    */
    public async login(params: any) {

        let existingUser = await coachManagementModel.findAll({
            where: {
                email: params.username.toLowerCase(),
                app_id: params.app_id || [constants.COACH_APP_ID.BX,constants.COACH_APP_ID.BT],
                status:[constants.STATUS.active,constants.STATUS.inactive],
            },
            order: [["createdAt", "DESC"]]
        });
        if (existingUser && existingUser.length > 1) {
            return {is_both:1};
        }
        existingUser = existingUser[0]
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
                    uid: existingUser.id,
                }

                let profileData = await this.getProfile(reqData);

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
                status: { [Op.ne]: 2 },
                app_id: params.app_id || [1, 2]
            }
        };

        if (params.user_role == constants.USER_ROLE.coach) {
            existingUser = await coachManagementModel.findAll(qry);
        } else {
            throw new Error(constants.MESSAGES.user_not_found);
        }
        if (existingUser && existingUser.length > 1) {
            return {is_both:1};
        }
        existingUser = existingUser[0]
        if (!_.isEmpty(existingUser)) {
            // params.country_code = existingUser.country_code;
            let token = await tokenResponse.forgotPasswordTokenResponse(existingUser, params.user_role);
            const mailParams = <any>{};
            mailParams.to = params.email;
            mailParams.html = `Hi ${existingUser.name}
                <br> Click on the link below to reset your password
                <br> ${(existingUser.app_id == constants.COACH_APP_ID.BX ? process.env.WEB_HOST_URL : process.env.WEB_HOST_URL)}?token=${token.token}
                <br> Please Note: For security purposes, this link expires in ${process.env.FORGOT_PASSWORD_LINK_EXPIRE_IN_MINUTES} Hours.
                `;
            mailParams.subject = "Reset Password Request";
            mailParams.name = existingUser.app_id == constants.COACH_APP_ID.BX ? "BluXinga" : "BlueTango"
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
        let coach = await helperFunction.convertPromiseToObject(
            await coachManagementModel.findOne({
                where: {
                    id: parseInt(user.uid),
                    status: { [Op.ne]: 2 }
                }
            })
        )

        coach.coach_specialization_categories = await helperFunction.convertPromiseToObject(
            await coachSpecializationCategoriesModel.findAll({
                where: {
                    id: {
                        [Op.in]: coach.coach_specialization_category_ids || [],
                    },
                    status: constants.STATUS.active,
                }
            })
        )

        coach.employee_ranks = await helperFunction.convertPromiseToObject(
            await employeeRanksModel.findAll({
                where: {
                    id: {
                        [Op.in]: coach.employee_rank_ids || [],
                    },
                    status: constants.STATUS.active,
                }
            })
        )

        coach.total_completed_sessions = await employeeCoachSessionsModel.count({
            where: {
                coach_id: coach.id,
                status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
            }
        })

        let totalRating = await employeeCoachSessionsModel.sum('coach_rating', {
            where: {
                coach_id: coach.id,
                status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                coach_rating: {
                    [Op.gte]: 1
                }
            }
        })

        coach.rating_count = await employeeCoachSessionsModel.count({
            where: {
                coach_id: coach.id,
                status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                coach_rating: {
                    [Op.gte]: 1
                }
            }
        })
        let totalSessions = await employeeCoachSessionsModel.findAndCountAll({
            where: {
                coach_id: coach.id,
                status: constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
            }
        })
        let freeSessionsCount = [...new Set(totalSessions.rows.filter(ele => ele.type == 1).map(obj => obj.employee_id))];
        let paidSessionsCount = [...new Set(totalSessions.rows.filter(ele => ele.type == 2).map(obj => obj.employee_id))];
        coach.conversionRate = (paidSessionsCount.length / freeSessionsCount.length);
        coach.average_rating = 0;
        if (coach.rating_count > 0) {
            coach.average_rating = parseFloat((parseInt(totalRating) / coach.rating_count).toFixed(0));
        }

        delete coach.coach_specialization_category_ids;
        delete coach.employee_rank_ids;
        delete coach.password;

        return coach

    }


    /*
    * function to get profile 
    */
    public async editProfile(params: any, user: any) {
        let profile = await coachManagementModel.findOne({
            where: {
                id: parseInt(user.uid),
                status: { [Op.ne]: 2 }
            }
        })

        let currentProfile = await helperFunction.convertPromiseToObject(profile);

        profile.name = params.name || currentProfile.name;
        profile.email = params.email || currentProfile.email;
        profile.password = params.password ? await appUtils.bcryptPassword(params.password) : currentProfile.password;
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

    /*
      *get static content
      */
    public async getStaticContent(params: any) {
        return await queryService.selectOne(staticContentModel, {
            where: { id: 1 },
            attributes: [`${params.contentType}`]
        })
    }
    /*
              * get all Bios
              * @param : token
              */
    public async getBios(params: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let bios = await queryService.selectAndCountAll(coachBiosModel, {}, {})
        bios.rows = bios.rows.slice(offset, offset + limit);
        return bios


    }
}


