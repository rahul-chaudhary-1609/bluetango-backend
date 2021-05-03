import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import * as tokenResponse from "../../utils/tokenResponse";
import { coachManagementModel } from "../../models/coachManagement";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class AuthService {
    constructor() { }

    /**
    * login function
    @param {} params pass all parameters from request
    */
    public async login(params: any) {

        let existingUser = await coachManagementModel.findOne({
            where: {
                email: params.username.toLowerCase()
            },
        });
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
                existingUser.token = token.token;
                if (params.device_token) {
                    await coachManagementModel.update({
                        device_token: params.device_token
                    },
                        { where: { id: existingUser.id } }
                    );
                }
               
                return existingUser;
            } else {
                throw new Error(constants.MESSAGES.invalid_password);
            }
        } else {
            throw new Error(constants.MESSAGES.invalid_email);
        }
    }

    


}
