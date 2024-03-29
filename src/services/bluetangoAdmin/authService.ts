import { adminModel } from "../../models/admin";
import { bluetangoAdminModel, bluetangoAdminRolesModel } from "../../models";
import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as tokenResponse from "../../utils/tokenResponse";
import * as helperFunction from "../../utils/helperFunction";
import * as queryService from '../../queryService/bluetangoAdmin/queryService';
const generator = require('generate-password');
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

bluetangoAdminModel.belongsTo(bluetangoAdminRolesModel, { foreignKey: 'id', sourceKey: "role_id", targetKey: 'id' });
bluetangoAdminRolesModel.hasMany(bluetangoAdminModel, { foreignKey: 'role_id', onDelete: 'cascade', hooks: true });
bluetangoAdminModel.hasOne(bluetangoAdminRolesModel, { foreignKey: 'id', sourceKey: "role_id", targetKey: 'id', as: 'role' });

export class AuthService {
    constructor() { }

    /**
    * login function
    @param {} params pass all parameters from request
    */
    public async login(params: any) {
        params.email = params.email.toLowerCase();
        // bluetangoAdminModel.hasOne(bluetangoAdminRolesModel, { foreignKey: 'id', sourceKey: "role_id", targetKey: 'id', as: 'role' });
        bluetangoAdminModel.hasOne(bluetangoAdminRolesModel, { foreignKey: 'id', sourceKey: "role_id", targetKey: 'id' });
        params.email = params.email.toLowerCase();
        let where: any = {
            email: params.email,
            status: {
                [Op.ne]: constants.STATUS.deleted
            }
        }
        let admin = await queryService.selectOne(bluetangoAdminModel, {
            where: where,
            include: [
                {
                    model: bluetangoAdminRolesModel,
                    required: true,
                    attributes: [],
                    // as: 'role'
                }
            ],
            // attributes: ['id', 'name', 'email', 'password', 'country_code', 'phone_number', 'admin_role', 'status', 'permissions', 'social_media_handles', 'profile_pic_url', "role_id", [Sequelize.col('role.module_wise_permissions'), 'module_wise_permissions']],
            attributes: ['id', 'name', 'email', 'password', 'country_code', 'phone_number', 'admin_role', 'status', 'permissions', 'social_media_handles', 'profile_pic_url', "role_id", [Sequelize.col('bluetango_admin_role.module_wise_permissions'), 'module_wise_permissions'],"tokens"],
        })
        if (admin) {
            let comparePassword = await appUtils.comparePassword(params.password, admin.password);
            if (comparePassword) {
                if (admin.status == constants.STATUS.active) {
                    delete admin.password;
                    let token = await tokenResponse.bluetangoAdminTokenResponse(admin);
                    let tokens=[];
                    if(admin.tokens){
                        admin.tokens.length=4;
                        tokens=admin.tokens
                    }
                    await queryService.updateData({ model: bluetangoAdminModel, token:token.token,tokens:[token.token,...tokens] }, { where: { id: admin.id } })
                    admin.token = token;
                    return admin;
                } else {
                    throw new Error(constants.MESSAGES.deactivate_account);
                }
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
    public async addAdmin(Params: any) {
        let role: any = await queryService.selectOne(bluetangoAdminRolesModel, { where: { role_name: Params.role_name } });
        if (role) {
            throw new Error(constants.MESSAGES.role_already_exist);
        }
        Params.last_activity = new Date();
        let newRole = await queryService.addData(bluetangoAdminRolesModel, Params);
        let AlreadyExistAdmins = [];
        let created = [];
        for (let params of Params.admins) {
            params.email = params.email.toLowerCase();
            let query: any = {
                where: {
                    email: params.email,
                    status: {
                        [Op.in]: [constants.STATUS.active, constants.STATUS.inactive]
                    }
                }
            }
            let admin: any = await queryService.selectOne(bluetangoAdminModel, query);
            if (!admin) {
                params.role_id = newRole.id
                let password = await helperFunction.generaePassword();
                params.admin_role = constants.USER_ROLE.sub_admin;
                params.password = await appUtils.bcryptPassword(password);
                let newAdmin = await queryService.addData(bluetangoAdminModel, params);
                newAdmin = newAdmin.get({ plain: true });
                let token = await tokenResponse.bluetangoAdminTokenResponse(newAdmin);
                await queryService.updateData({ model: bluetangoAdminModel, token:token.token }, { where: { id: newAdmin.id } })
                newAdmin.token = token;
                delete newAdmin.password;
                delete newAdmin.reset_pass_otp;
                delete newAdmin.reset_pass_expiry;
                const mailParams = <any>{};
                mailParams.to = params.email;
                mailParams.html = `Hi  ${params.name}
                <br>Use the given credentials for login into the admin pannel :
                
                <br><b> Web URL</b>: ${process.env.BLUETANGO_WEB_URL} <br>
                <br> email : ${params.email}
                <br> password : ${password}
                `;
                mailParams.subject = "Subadmin Login Credentials";
                mailParams.name = "BlueTango"
                await helperFunction.sendEmail(mailParams);
                created.push(newAdmin)
            } else {
                AlreadyExistAdmins.push(params)
            }
        }
        return { newly_created: created, Already_exist_admins: AlreadyExistAdmins }
    }

    public async getProfile(user: any) {
        bluetangoAdminModel.hasOne(bluetangoAdminRolesModel, { foreignKey: 'id', sourceKey: "role_id", targetKey: 'id' });
        let admin = await queryService.selectOne(bluetangoAdminModel, {
            where: {
                id: user.uid,
            },
            include: [
                {
                    model: bluetangoAdminRolesModel,
                    required: true,
                    attributes: []
                }
            ],
            attributes: ['id', 'name', 'email', 'country_code', 'phone_number', 'admin_role', 'status', 'permissions', 'social_media_handles', 'thought_of_the_day', 'profile_pic_url', 'createdAt', 'updatedAt', 'role_id', [Sequelize.col('bluetango_admin_role.module_wise_permissions'), 'module_wise_permissions'],[Sequelize.col('bluetango_admin_role.role_name'), 'role_name']],
        })
        return admin;
    }

    /**
    * add sub admin function
    @param {} params pass all parameters from request
    */
    public async updateProfile(params: any, user: any) {
        params.email = params.email.toLowerCase();

        let query: any = {
            where: {
                email: params.email,
                status: {
                    [Op.in]: [constants.STATUS.active, constants.STATUS.inactive]
                },
                id: {
                    [Op.ne]: user.uid,
                }
            }
        }

        let admin: any = await queryService.selectOne(bluetangoAdminModel, query);

        if (!admin) {
            params.model = bluetangoAdminModel;
            query = {
                where: {
                    id: user.uid,
                },
                returning: true,
                raw: true,
            }
            let updatedAdmin = await queryService.updateData(params, query);
            return updatedAdmin;
        } else {
            throw new Error(constants.MESSAGES.email_already_registered)
        }

    }

    /*
    * function to set new pass 
    */
    public async changePassword(params: any, user: any) {
        let query: any = {
            where: {
                id: user.uid,
            }
        }

        let admin: any = await queryService.selectOne(bluetangoAdminModel, query);
        let comparePassword = await appUtils.comparePassword(params.old_password, admin.password);
        if (comparePassword) {
            params.password = await appUtils.bcryptPassword(params.new_password)
            params.model = bluetangoAdminModel;

            await queryService.updateData(params, query);

            return true;
        } else {
            throw new Error(constants.MESSAGES.invalid_old_password);
        }

    }


    /**
    * reset password function to add the data
    * @param {*} params pass all parameters from request 
    */
    public async forgotPassword(params: any) {
        params.email = params.email.toLowerCase()

        let query: any = {
            where: {
                email: params.email,
                status: { [Op.ne]: constants.STATUS.deleted }
            }
        };

        query.raw = true;

        let admin: any = await queryService.selectOne(bluetangoAdminModel, query);

        if (admin) {
            let token = await tokenResponse.bluetangoForgotPasswordTokenResponse(admin);
            const mailParams = <any>{};
            mailParams.to = params.email;
            mailParams.html = `Hi ${admin.name}
                <br> Click on the link below to reset your password
                <br> ${process.env.BLUETANGO_RESET_PASS_URL}?token=${token.token}
                <br> Please Note: For security purposes, this link expires in ${process.env.FORGOT_PASSWORD_LINK_EXPIRE_IN_MINUTES} Hours.
                `;
            mailParams.subject = "Reset Password Request";
            mailParams.name = "BlueTango"
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

        params.password = await appUtils.bcryptPassword(params.password)
        params.model = bluetangoAdminModel;

        let query: any = {
            where: {
                id: user.uid
            }
        };

        await queryService.updateData(params, query);

        return true;

    }

    /*
   * function to upload file 
   */
    public async uploadFile(params: any, folderName) {
        return await helperFunction.uploadFile(params, folderName);
    }


    public async logout(params: any, user: any) {
        try {
            let update = {
                'token': null,
                'model': adminModel
            };
            let query: any = {
                where: {
                    id: user.uid
                }
            };
            return await queryService.updateData(update, query);
        } catch (error) {
            throw new Error(error);
        }
    }
    public async deleteAdmin(params: any, user: any) {
        if (user.uid == params.admin_id) {
            throw new Error(constants.MESSAGES.admin_him_self_delete);
        }
        let query: any = {
            where: {
                id: params.admin_id
            }
        }
        const admin = await queryService.deleteData(bluetangoAdminModel, query);
        return admin;
    }
    public async viewRoleDetails(params: any) {
        let where: any = {}
        where["id"] = params.role_id;
        let roleDetails = await queryService.selectOne(bluetangoAdminRolesModel, {
            where: where,
            include: [
                {
                    model: bluetangoAdminModel,
                    required: true,
                    attributes: ["id", "name", "email"],
                },
            ],
            attributes: ["id", "role_name", "status", "module_wise_permissions"]
        })
        return roleDetails;
    }
    public async deleteRole(params: any, user: any) {
        let Query: any = {
            where: {
                id: user.uid
            }
        };
        let admin: any = await queryService.selectOne(bluetangoAdminModel, Query);
        if (admin && admin.role_id == params.role_id) {
            throw new Error(constants.MESSAGES.admin_role_delete);
        }
        let query: any = {
            where: {
                id: params.role_id
            }
        }
        const deletedRole = await queryService.deleteData(bluetangoAdminRolesModel, query);
        return deletedRole;
    }
    /**
    * update Admin And Role function
    @param {} params pass all parameters from request
    */
    public async updateAdminAndRole(Params: any) {
        if (Params.role_name) {
            let role: any = await queryService.selectOne(bluetangoAdminRolesModel, { where: { role_name: Params.role_name } });
            if (role) {
                throw new Error(constants.MESSAGES.role_already_exist);
            }
            await queryService.updateData({ model: bluetangoAdminRolesModel, last_activity: new Date(), role_name: Params.role_name }, { where: { id: Params.id } })
        }
        if (Params.module_wise_permissions) {
            await queryService.updateData({ model: bluetangoAdminRolesModel, last_activity: new Date(), module_wise_permissions: Params.module_wise_permissions }, { where: { id: Params.id } })
            await queryService.updateData({ model: bluetangoAdminModel, token:null,tokens:null }, { where: { role_id: Params.id } })
        }
        let AlreadyExistAdmins = [];
        let updated = [];
        if (Params.admins) {
            await queryService.updateData({ model: bluetangoAdminRolesModel, last_activity: new Date() }, { where: { id: Params.id } })
            for (let params of Params.admins) {
                params.email = params.email.toLowerCase();
                let query: any = {
                    where: {
                        email: params.email,
                        status: {
                            [Op.in]: [constants.STATUS.active, constants.STATUS.inactive]
                        }
                    }
                }
                let admin: any = await queryService.selectOne(bluetangoAdminModel, query);
                if (admin) {
                    if (params.id && params.id == admin.id) {
                        await queryService.updateData({ model: bluetangoAdminModel, name: params.name, email: params.email }, { where: { id: params.id } })
                        updated.push(params)
                    } else {
                        AlreadyExistAdmins.push(params)
                        break;
                    }
                } else {
                    if (params.id) {
                        await queryService.updateData({ model: bluetangoAdminModel, name: params.name, email: params.email }, { where: { id: params.id } })
                        updated.push(params)
                    } else {
                        updated.push(params)
                        params.role_id = Params.id
                        let password = await helperFunction.generaePassword();
                        params.admin_role = constants.USER_ROLE.sub_admin;
                        params.password = await appUtils.bcryptPassword(password);
                        let newAdmin = await queryService.addData(bluetangoAdminModel, params);
                        newAdmin = newAdmin.get({ plain: true });
                        let token = await tokenResponse.bluetangoAdminTokenResponse(newAdmin);
                        await queryService.updateData({ model: bluetangoAdminModel, token:token.token }, { where: { id: newAdmin.id } })
                        newAdmin.token = token;
                        delete newAdmin.password;
                        delete newAdmin.reset_pass_otp;
                        delete newAdmin.reset_pass_expiry;
                        const mailParams = <any>{};
                        mailParams.to = params.email;
                        mailParams.html = `Hi  ${params.name}
                <br>Use the given credentials for login into the admin pannel :
                
                <br><b> Web URL</b>: ${process.env.BLUETANGO_WEB_URL} <br>
                <br> email : ${params.email}
                <br> password : ${password}
                `;
                        mailParams.subject = "Subadmin Login Credentials";
                        mailParams.name = "BlueTango"
                        await helperFunction.sendEmail(mailParams);
                    }
                }
                // if (!admin) {
                //     if (params.id) {
                //         await queryService.updateData({ model: bluetangoAdminModel, name: params.name, email: params.email }, { where: { id: params.id } })
                //     } else {
                //         params.role_id = Params.id
                //         let password = await helperFunction.generaePassword();
                //         params.admin_role = constants.USER_ROLE.sub_admin;
                //         params.password = await appUtils.bcryptPassword(password);
                //         let newAdmin = await queryService.addData(bluetangoAdminModel, params);
                //         newAdmin = newAdmin.get({ plain: true });
                //         let token = await tokenResponse.bluetangoAdminTokenResponse(newAdmin);
                //         newAdmin.token = token;
                //         delete newAdmin.password;
                //         delete newAdmin.reset_pass_otp;
                //         delete newAdmin.reset_pass_expiry;
                //         const mailParams = <any>{};
                //         mailParams.to = params.email;
                //         mailParams.html = `Hi  ${params.name}
                // <br>Use the given credentials for login into the admin pannel :

                // <br><b> Web URL</b>: ${process.env.BLUETANGO_WEB_URL} <br>
                // <br> email : ${params.email}
                // <br> password : ${password}
                // `;
                //         mailParams.subject = "Subadmin Login Credentials";
                //         mailParams.name = "BlueTango"
                //         await helperFunction.sendEmail(mailParams);
                //     }
                //     updated.push(params)
                // } else {
                //     AlreadyExistAdmins.push(params)
                // }
            }
        }
        return { updated_admins: updated, Already_exist_admins: AlreadyExistAdmins }
    }
    /**
   * update Admin And Role Status function
   @param {} params pass all parameters from request
   */
    public async updateAdminAndRoleStatus(params: any) {
        await queryService.updateData({ model: bluetangoAdminRolesModel, last_activity: new Date(), status: params.status }, { where: { id: params.id } })
        return await queryService.updateData({ model: bluetangoAdminModel, status: params.status }, { where: { id: params.id } })

    }
    /**
   * get roles And Admins
   @param {} params pass all parameters from request
   */
    public async getrolesAndAdmins(params: any, user: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let where: any = {}
        let Where: any = {}
        let role_ids;
        // let AdminData = await this.getProfile({ uid: user.uid })
        // Where["id"] = { [Op.ne]: AdminData.role_id }
        if (params.searchKey && params.searchKey.trim()) {
            where = {
                [Op.or]: [
                    {
                        role_name: {
                            [Op.iLike]: `%${params.searchKey}%`
                        }
                    }
                ]
            }
            role_ids = [...(await queryService.selectAll(bluetangoAdminRolesModel, {
                where: where,
                attributes: ["id"]
            }, {}))].map(role => role.id);
            let roleId2 = [...(await queryService.selectAll(bluetangoAdminModel, {
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${params.searchKey}%`
                            }
                        }
                    ]
                },
                attributes: ["role_id"]
            }, {}))].map(rolId => rolId.role_id);
            role_ids = [...new Set(role_ids.concat(roleId2))]
            // const index = role_ids.indexOf(AdminData.role_id);
            // if (index > -1) {
            //     role_ids.splice(index, 1);
            // }
            Where["id"] = role_ids
        }
        if (params.status) {
            Where["status"] = params.status
        }
        let roles = await queryService.selectAndCountAll(bluetangoAdminRolesModel, {
            where: Where,
            include: [
                {
                    model: bluetangoAdminModel,
                    required: true,
                    attributes: ["id", "name", "email", "admin_role"],
                    where: {
                        admin_role: {
                            [Op.ne]: constants.USER_ROLE.super_admin.toString()
                        }
                    }
                }
            ],
            distinct: true,
            attributes: ["id", "role_name", "status", "module_wise_permissions", "last_activity"],
            order: [
                ['role_name', 'ASC'],
            ],
            // limit: limit,
            // offset: offset
        }, {})
        if (params.module) {
            roles.rows = roles.rows.map((elem) => {
                if (elem.module_wise_permissions.some(e => e.module === params.module))
                    return elem;
            })
            roles.rows = roles.rows.filter(function (el) {
                return el != null;
            });
        }
        roles.count = roles.rows.length;
        roles.rows = roles.rows.slice(offset, offset + limit);
        return roles

    }
}