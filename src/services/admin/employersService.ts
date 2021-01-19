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
    public async addEditEmployers(params: any) {
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

        params.admin_id = params.uid;
        delete params.uid;
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
        }

        return await employersModel.findAndCountAll({
            where: whereCond,
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]]
        })

    }

}