import { adminModel } from "../../models/admin";
import { employersModel } from "../../models/employers";
import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as tokenResponse from "../../utils/tokenResponse";
import * as helperFunction from "../../utils/helperFunction";
import * as selectQueryService from '../../queryService/selectQueryService';
import * as updateQueryService from '../../queryService/updateQueryService';
import bcrypt from 'bcrypt';
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class EmployersService {
    constructor() { }

    /**
    * login function
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
       

        if (!_.isEmpty(existingUser)) {
          return true;
        } else {
            throw new Error(constants.MESSAGES.email_already_registered);
        }
    }

}