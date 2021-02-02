import { employersModel } from "../../models/employers";
import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class EmployersService {
    constructor() { }

    /**
    * add edit employers function
    @param {} params pass all parameters from request
    */
    public async addEditEmployers(params: any, user: any) {
        var isEmail = await appUtils.CheckEmail(params);
        const qry = <any>{ where: {} };
        if (isEmail) {
            qry.where = { 
                email: params.username,
                status: {[Op.in]: [0,1]}
            };
        }
        var existingUser; 
        if (params.id) {
            existingUser = await employersModel.findOne({
                where: {
                    email: params.email,
                    status: {
                        [Op.in]: [0,1]
                    },
                    id: {
                        [Op.ne]: params.id
                    }
                }
            });
        } else {
            existingUser = await employersModel.findOne({
                where: {
                    email: params.email,
                    status: {
                        [Op.in]: [0,1]
                    }
                }
            });
        }       

        params.admin_id = user.uid;
        if (_.isEmpty(existingUser)) {
          if (params.id) {
              delete params.password;
            let updateData =  await employersModel.update( params, {
                where: { id: params.id}
            });
            if (updateData) {
                return await employersModel.findOne({
                    where: {id: params.id}
                })
            } else {
                return false;
            }
          } else {
            params.password = await appUtils.bcryptPassword(params.password);
            return await employersModel.create(params);
          }

        } else {
            throw new Error(constants.MESSAGES.email_already_registered);
        }
    }

    /**
    * get employers list function
    @param {} params pass all parameters from request
    */
    public async getEmployersList (params: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        var whereCond = {};
        if (params.industry_type) {
            whereCond = {
                industry_type: params.industry_type
            }
        } else if(params.searchKey) {
            whereCond = {
                name: { [Op.iLike] : `%${params.searchKey}%`}
            }
        }

        return await employersModel.findAndCountAll({
            where: whereCond,
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]]
        })

    }

    /**
    * change employers status: activate/deactivate/delete
    @param {} params pass all parameters from request
    */
    public async changeEmployerStatus (params: any) {
        let query = {where:{id: params.employerId}};
        let accountExists = await employersModel.findOne(query);
        if(accountExists) {
            let updates = <any>{};
            if(params.action == "activate") {
                if(accountExists && accountExists.status == 1)
                throw new Error(constants.MESSAGES.already_activated);

                updates.status = 1;
            } else if(params.action == "deactivate") {
                if(accountExists && accountExists.status == 0)
                throw new Error(constants.MESSAGES.already_deactivated);

                updates.status = 0;
            } else if(params.action == "delete") {
                if(accountExists && accountExists.status == 2)
                throw new Error(constants.MESSAGES.already_deleted);

                updates.status = 2;
            } else {
                throw new Error(constants.MESSAGES.invalid_action);
            }

            await employersModel.update(updates, query);

        } else {
            throw new Error(constants.MESSAGES.invalid_employer);
        }
    }

}