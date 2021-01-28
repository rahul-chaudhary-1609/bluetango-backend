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

    if (!_.isEmpty(existingUser)) {
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
}