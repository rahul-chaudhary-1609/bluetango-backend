import _ from "lodash";
import * as helperFunction from "../../utils/helperFunction";
import { coachManagementModel } from "../../models/coachManagement";

const Sequelize = require('sequelize');


export class HomepageServices {
    constructor() { }

    /*
* function to get all coaches
*/
    public async getCoaches() {

        let coachList = await coachManagementModel.findAndCountAll({
            attributes: ['id', 'name', 'image', 'fileName', 'description']
        });

        return await helperFunction.convertPromiseToObject(coachList);
    }
}