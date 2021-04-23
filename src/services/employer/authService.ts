import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import * as tokenResponse from "../../utils/tokenResponse";
import { employersModel } from  "../../models";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class AuthService {
    constructor() { }

    /**
    * login function
    @param {} params pass all parameters from request
    */
   public async login(params: any) {

    let existingUser = await employersModel.findOne({
        where: {
            email: params.username.toLowerCase(),
            status: {[Op.in]: [0,1]}
        }
    });


       if (!_.isEmpty(existingUser) && existingUser.status == 0) {
           throw new Error(constants.MESSAGES.deactivate_account);
       } else if (!_.isEmpty(existingUser) && existingUser.status == 2) {
           throw new Error(constants.MESSAGES.delete_account);
       }else if (!_.isEmpty(existingUser)) {
        existingUser = await helperFunction.convertPromiseToObject(existingUser);
        let comparePassword = await appUtils.comparePassword(params.password, existingUser.password);
        if (comparePassword) {
            delete existingUser.password;
            delete existingUser.reset_pass_otp;
            let token = await tokenResponse.employerTokenResponse(existingUser);
            existingUser.token = token.token;
            return existingUser;
        } else {
            throw new Error(constants.MESSAGES.invalid_password);
        }
    } else {
        throw new Error(constants.MESSAGES.invalid_email);
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
        if (user.user_role == constants.USER_ROLE.employer) {
            update.first_time_reset_password = 0;
            update.first_time_login = 0;
            return await employersModel.update(update, qry);
        } else {
            throw new Error(constants.MESSAGES.user_not_found);
        }

    }

}