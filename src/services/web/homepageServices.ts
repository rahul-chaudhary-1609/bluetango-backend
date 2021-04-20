import _ from "lodash";
import * as helperFunction from "../../utils/helperFunction";
import { coachManagementModel } from "../../models/coachManagement";
import { advisorManagementModel } from "../../models/advisorManagement";
import { articleManagementModel } from "../../models/articleManagement";

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

    /*
* function to get all advisors
*/
    public async getAdvisors() {

        let advisorList = await advisorManagementModel.findAndCountAll({
            attributes: ['id', 'title','image', 'description']
        });

        return await helperFunction.convertPromiseToObject(advisorList);
    }


 
}